import { createSupabaseServerClient } from './supabase/server'

export async function getTrips() {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('status', 'published')
        .not('name', 'is', null)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching trips:', error)
        return []
    }
    return data || []
}

export async function getStays() {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
        .from('stays')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching stays:', error)
        return []
    }
    return data || []
}
