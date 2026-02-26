import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { trip_id, total_amount } = body

    if (!trip_id) {
        return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 })
    }

    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
            user_id: session.user.id,
            trip_id,
            status: 'pending',
            payment_status: 'unpaid',
            total_amount: total_amount || 0,
        })
        .select()
        .single()

    if (bookingError) {
        return NextResponse.json({ error: bookingError.message }, { status: 500 })
    }

    // Send notification (non-blocking)
    try {
        const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

        const { data: tripData } = await supabase
            .from('trips')
            .select('*')
            .eq('id', trip_id)
            .single()

        const bookingWithDetails = { ...booking, trips: tripData }
        const userWithDetails = { ...session.user, full_name: (userProfile as any)?.full_name }

        const { sendBookingConfirmationEmail } = await import('@/lib/notifications')
        await sendBookingConfirmationEmail(bookingWithDetails, userWithDetails)
    } catch (notifyError) {
        console.error('Notification failed (non-critical):', notifyError)
    }

    return NextResponse.json({ message: 'Booking request received', booking }, { status: 201 })
}

export async function GET() {
    const supabase = await createSupabaseServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*, trips (name, duration, region)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ bookings })
}
