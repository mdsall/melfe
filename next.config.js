/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Désactiver React Compiler temporairement
    // reactCompiler: true,
    
    // Garder les autres optimisations
    optimizePackageImports: ['lucide-react'],
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig