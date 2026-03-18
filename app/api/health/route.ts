import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check ALL required environment variables
    const requiredEnvVars = {
      'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'RESEND_API_KEY': process.env.RESEND_API_KEY,
      'INTERNAL_API_SECRET': process.env.INTERNAL_API_SECRET,
    }

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      console.error('❌ Missing environment variables:', missingVars.join(', '))
      return NextResponse.json(
        {
          status: 'error',
          message: `Missing required environment variables: ${missingVars.join(', ')}`,
          environment: process.env.NODE_ENV,
          missingVars,
          setupInstructions: 'Set these in Netlify Dashboard → Site settings → Build & deploy → Environment'
        },
        { status: 500 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Simple query to keep database active - just fetch one record count
    const { count, error } = await supabase
      .from('trips')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Supabase health check failed:', error)
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Database connection failed: ' + error.message,
          error: error
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'All systems operational',
        environment: process.env.NODE_ENV,
        supabase: {
          url: supabaseUrl.split('/')[2], // Just the domain, hide the full URL
          connected: true,
          tripsCount: count
        },
        envVarsLoaded: Object.keys(requiredEnvVars).length,
      },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('❌ Health check exception:', err)
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Internal server error: ' + (err?.message || 'Unknown error'),
        environment: process.env.NODE_ENV
      },
      { status: 500 }
    )
  }
}
