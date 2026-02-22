import { createServerClient, type CookieOptions } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        return res
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            get(name: string) {
                return req.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
                req.cookies.set({
                    name,
                    value,
                    ...options,
                })
                res = NextResponse.next({
                    request: {
                        headers: req.headers,
                    },
                })
                res.cookies.set({
                    name,
                    value,
                    ...options,
                })
            },
            remove(name: string, options: CookieOptions) {
                req.cookies.set({
                    name,
                    value: '',
                    ...options,
                })
                res = NextResponse.next({
                    request: {
                        headers: req.headers,
                    },
                })
                res.cookies.set({
                    name,
                    value: '',
                    ...options,
                })
            },
        },
    })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Protect /admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        // Check for admin role
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()

        if ((userData as any)?.role !== 'admin') {
            return NextResponse.redirect(new URL('/return', req.url))
        }
    }

    // Protect /memories and /return routes
    if (req.nextUrl.pathname.startsWith('/memories') || req.nextUrl.pathname.startsWith('/return')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }

    return res
}

export const config = {
    matcher: ['/admin/:path*', '/memories/:path*', '/return/:path*'],
}
