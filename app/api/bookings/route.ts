import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
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

    const body = await req.json()
    const { trip_id, total_amount } = body

    if (!trip_id) {
        return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 })
    }

    // 1. Create the booking in the database
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

    // 2. TRIGGER NOTIFICATIONS (Phase 3)
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
        const userWithDetails = { ...session.user, full_name: userProfile?.full_name }

        // Import dynamically to avoid issues if needed
        const { sendBookingConfirmationEmail } = await import('@/lib/notifications')
        await sendBookingConfirmationEmail(bookingWithDetails, userWithDetails)
    } catch (notifyError) {
        console.error('Notification failed:', notifyError)
        // We don't fail the request if notification fails
    }

    return NextResponse.json({
        message: 'Booking request received',
        booking
    }, { status: 201 })
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

    // Users can only see their own bookings
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
      *,
      trips (title, duration, region)
    `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ bookings })
}
