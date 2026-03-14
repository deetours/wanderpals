import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// Service role client — bypasses ALL RLS policies
function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
    if (!url || !key) throw new Error('Missing Supabase service role config')
    return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET() {
    try {
        // Verify the requester is an authenticated admin
        const supabase = await createSupabaseServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Use service client to bypass RLS
        const serviceClient = getServiceClient()
        const { data, error } = await serviceClient
            .from('profiles')
            .select('*')
            .order('updated_at', { ascending: false })

        if (error) {
            console.error(`[API/admin/profiles] ${error.message}`)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ data })
    } catch (err: any) {
        console.error('[API/admin/profiles] exception:', err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const supabase = await createSupabaseServerClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { id, role } = await request.json()
        if (!id || !role) return NextResponse.json({ error: 'Missing id or role' }, { status: 400 })

        const serviceClient = getServiceClient()
        const { error } = await serviceClient
            .from('profiles')
            .update({ role, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
