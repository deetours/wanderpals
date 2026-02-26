import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({
            status: 'error',
            message: 'Environment variables missing on server'
        }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false }
    })

    try {
        const { data, error } = await supabase.from('trips').select('count', { count: 'exact', head: true })

        if (error) {
            return NextResponse.json({
                status: 'error',
                message: 'Supabase responded with error',
                error: error
            }, { status: 500 })
        }

        return NextResponse.json({
            status: 'success',
            message: 'Server-side connectivity to Supabase is healthy',
            count: data
        })
    } catch (err: any) {
        return NextResponse.json({
            status: 'error',
            message: 'Server-side fetch failed (Timeout or Network)',
            error: err.message
        }, { status: 500 })
    }
}
