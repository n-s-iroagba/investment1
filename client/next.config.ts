// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from localhost (your Express server)
    domains: ['localhost', '127.0.0.1'],
    // More specific pattern matching for your Express server
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
    // Disable optimization to serve images directly from your Express server
    unoptimized: true,
  },
  // Optional: Add rewrites to proxy image requests to your Express server
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
    ]
  },
}

module.exports = nextConfig