'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

    // Check role and redirect
    const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user?.id)
        .single()

    if (roleError) {
        // If user record doesn't exist in 'users' table or role is not found,
        // fallback to normal user redirect
        redirect('/return')
    }

    if ((userData as any)?.role === 'admin') {
        redirect('/admin')
    } else {
        redirect('/return')
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
        redirect(data.url)
    }
}
