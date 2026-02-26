'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // Check role and determine redirect (checking both profiles and users for safety)
    let role = 'user'

    const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single()

    if (profileData?.role) {
        role = profileData.role
    } else {
        // Fallback to 'users' table if profile doesn't have it
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.user?.id)
            .single()
        if (userData?.role) role = userData.role
    }

    if (role === 'admin') {
        return { success: true, redirectUrl: '/admin' }
    } else {
        return { success: true, redirectUrl: '/return' }
    }
}

export async function signInWithGoogle(origin: string) {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (data.url) {
        return { url: data.url }
    }
}
