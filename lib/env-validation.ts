/**
 * Environment Variable Validation
 * Use this to verify all required env vars are present at startup
 */

export function validateEnvironmentVariables() {
  const required = {
    'NEXT_PUBLIC_SUPABASE_URL': 'Supabase project URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase anonymous key',
    'SUPABASE_SERVICE_ROLE_KEY': 'Supabase service role key (admin operations)',
    'RESEND_API_KEY': 'Resend API key (email notifications)',
    'INTERNAL_API_SECRET': 'Internal API secret (external integrations)',
  }

  const missing: string[] = []
  const present: string[] = []

  Object.entries(required).forEach(([key, description]) => {
    if (process.env[key]) {
      present.push(key)
    } else {
      missing.push(key)
    }
  })

  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'

  // Log environment status
  console.log(`\n📊 Environment Variables Status (${process.env.NODE_ENV})`)
  console.log(`✅ Present: ${present.length}/${Object.keys(required).length}`)
  
  present.forEach(key => {
    console.log(`   ✓ ${key}`)
  })

  if (missing.length > 0) {
    console.error(`\n❌ Missing: ${missing.length} variable(s)`)
    missing.forEach(key => {
      console.error(`   ✗ ${key}`)
      console.error(`      Description: ${required[key as keyof typeof required]}`)
    })

    if (isDevelopment) {
      console.warn('\n📝 Local Development Tips:')
      console.warn('   1. Create or update .env.local in project root')
      console.warn('   2. Copy values from your Supabase project')
      console.warn('   3. Never commit .env.local to git')
      console.warn('   4. Restart "npm run dev" after changing .env.local\n')
    }

    if (isProduction) {
      console.error('\n🚀 Production Deployment Instructions:')
      console.error('   1. Go to Netlify Dashboard')
      console.error('   2. Site settings → Build & deploy → Environment')
      console.error('   3. Add environment variables for: ' + missing.join(', '))
      console.error('   4. Trigger new deploy after adding variables\n')
      
      throw new Error(
        `Missing critical environment variables: ${missing.join(', ')}. ` +
        `See console output above for setup instructions.`
      )
    }
  } else {
    console.log('\n✨ All required environment variables are configured!\n')
  }

  return {
    isValid: missing.length === 0,
    missing,
    present,
  }
}
