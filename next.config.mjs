/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Ensuring no legacy experimental flags are causing build issues
  },
}

export default nextConfig
