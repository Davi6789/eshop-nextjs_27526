import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
  images: {
    // Erlaubte Domains für Bilder (veraltet, aber noch funktionierend)
    domains: ['localhost', 'ymnzxbapwbaetecxutbi.supabase.co'],
    
    // Moderne Alternative: remotePatterns (empfohlen)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',  // Erlaubt alle Supabase Subdomains
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Avatars
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub Avatars
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  typescript: {
    ignoreBuildErrors: false,  // TypeScript Fehler zeigen, aber Build nicht abbrechen
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig)
