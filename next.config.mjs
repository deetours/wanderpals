/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ralkdbmoaypdjwtkvbhz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Force CSS to be included in a way that doesn't depend on JS hydration
  experimental: {
    optimizeCss: false,
  },
  // Ensure output is compatible with Netlify
  output: 'standalone',
}

export default nextConfig
