
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // remotePatterns ist die moderne Alternative (domains ist deprecated)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ymnzxbapwbaetecxutbi.supabase.co", // Erlaubt alle Supabase Subdomains
      },
      {
        protocol: "https",
        hostname: "*.supabase.co", // Fallback für andere Supabase-Instanzen
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", // ← HINZUFÜGEN!
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Avatars
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub Avatars
      },
      {
        protocol: "https",
        hostname: "picsum.photos", // Platzhalter Bilder
      },
    ],
    formats: ["image/avif", "image/webp"], // ← Moderne Formate
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  typescript: {
    ignoreBuildErrors: false, // TypeScript Fehler zeigen
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // swcMinify: true, // ❌ ENTFERNT - ist jetzt Standard in Next.js 16
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

// Bundle Analyzer nur wenn ANALYZE=true
export default process.env.ANALYZE === "true"
  ? (async () => {
      const withBundleAnalyzer = (await import("@next/bundle-analyzer"))
        .default;
      return withBundleAnalyzer({ enabled: true })(nextConfig);
    })()
  : nextConfig;
