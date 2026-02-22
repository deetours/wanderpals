import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    // We allow public POST for lead capture, or authenticated one
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Use a simple client for public lead submission
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    try {
        const body = await req.json()
        const { phone_number, full_name, email, source, notes } = body

        if (!phone_number && !email) {
            return NextResponse.json({ error: 'Phone or Email is required' }, { status: 400 })
        }

        // Check for "WANDERPALS_SECRET" to identify trusted external tools like PhantomBuster
        const authHeader = req.headers.get('Authorization')
        const actualSource = authHeader === `Bearer ${process.env.INTERNAL_API_SECRET}`
            ? (source || 'external_tool')
            : (source || 'webapp_form')

        const { data, error } = await supabase
            .from('leads')
            .insert({
                phone_number,
                full_name,
                email,
                source: actualSource,
                notes,
                status: 'new'
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ message: 'Lead captured', lead: data }, { status: 201 })
    } catch (err) {
        console.error('Lead capture error:', err)
        return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 })
    }
}

export async function GET() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get: (name) => cookieStore.get(name)?.value } }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

    if ((userData as any)?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ leads })
}
