'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    console.log('--- LOGIN ACTION START ---')
    try {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            return { error: 'Email and password are required' }
        }

        console.log(`Attempting login for: ${email}`)
        const supabase = await createSupabaseServerClient()

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('Supabase Auth Error:', error.message)
            return { error: error.message }
        }

        console.log('Login successful, checking role...')

        const userId = data.user?.id
        console.log('User ID:', userId)

        // Check role and determine redirect (checking both profiles and users for safety)
        let role = 'user'

        const { data: profileData } = await (supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single() as any)

        if (profileData?.role) {
            role = profileData.role
            console.log('Role found in profiles:', role)
        } else {
            console.log('Checking fallback users table...')
            const { data: userData } = await (supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .single() as any)
            if (userData?.role) {
                role = userData.role
                console.log('Role found in users:', role)
            }
        }

        const redirectUrl = role === 'admin' ? '/admin' : '/return'
        console.log(`Redirecting to: ${redirectUrl}`)
        return { success: true, redirectUrl }

    } catch (err: any) {
        console.error('UNEXPECTED LOGIN ACTION ERROR:', err)
        return { error: 'An unexpected server error occurred during login.' }
    } finally {
        console.log('--- LOGIN ACTION END ---')
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
