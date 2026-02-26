/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false, // Changed to false to enable Next.js image optimization
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
