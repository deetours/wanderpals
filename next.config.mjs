/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  // Force webpack bundler instead of Turbopack for production builds
  // Turbopack output format can cause 404s on some hosting platforms
  bundlePagesRouterDependencies: true,
}

export default nextConfig
