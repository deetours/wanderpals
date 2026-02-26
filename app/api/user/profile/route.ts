import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ user })
}

export async function PATCH(req: Request) {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
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
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: (data as any)[0] })
}
