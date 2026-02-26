import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    // Public endpoint — no auth required for lead capture
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    try {
        const body = await req.json()
        const { phone_number, full_name, email, source, notes } = body

        if (!phone_number && !email) {
            return NextResponse.json({ error: 'Phone or Email is required' }, { status: 400 })
        }

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
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

    if ((profileData as any)?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ leads })
}
