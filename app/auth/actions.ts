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

    // Check role and determine redirect
    const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user?.id)
        .single()

    if (roleError || !userData) {
        return { success: true, redirectUrl: '/return' }
    }

    if ((userData as any).role === 'admin') {
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
