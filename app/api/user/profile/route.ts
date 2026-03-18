import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createSupabaseServerClient()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: user, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

        if (error) {
            console.error('GET /api/user/profile error:', error)
            return NextResponse.json({ error: error.message || 'Failed to fetch profile' }, { status: 500 })
        }

        return NextResponse.json({ user })
    } catch (error: any) {
        console.error('GET /api/user/profile exception:', error)
        return NextResponse.json({ error: error?.message || 'Failed to process request' }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const supabase = await createSupabaseServerClient()
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { full_name, avatar_url, whatsapp_number } = body

        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: session.user.id,
                full_name,
                avatar_url,
                whatsapp_number,
                updated_at: new Date().toISOString(),
            })
            .select()

        if (error) {
            console.error('PATCH /api/user/profile error:', error)
            return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 })
        }

        return NextResponse.json({ user: data }, { status: 200 })
    } catch (error: any) {
        console.error('PATCH /api/user/profile exception:', error)
        return NextResponse.json({ error: error?.message || 'Failed to process request' }, { status: 500 })
    }
}
