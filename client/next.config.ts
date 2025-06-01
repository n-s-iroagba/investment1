// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from both development and production servers
    domains: [
      'localhost', 
      '127.0.0.1',
      'investment1.fly.dev'
    ],
    // More specific pattern matching for both environments
    remotePatterns: [
      // Development server
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      // Production server
      {
        protocol: 'https',
        hostname: 'investment1.fly.dev',
        pathname: '/uploads/**',
      },
    ],
    // Keep unoptimized if your server handles image optimization
    unoptimized: true,
  },
  // Environment-aware rewrites
  async rewrites() {
    const isDevelopment = process.env.NODE_ENV === 'development'
    const baseUrl = isDevelopment 
      ? 'http://localhost:3000' 
      : 'https://investment1.fly.dev'
    
    return [
      {
        source: '/uploads/:path*',
        destination: `${baseUrl}/uploads/:path*`,
      },
    ]
  },
}

module.exports = nextConfig