// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google"; 
import "./globals.css";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/ui/Navbar";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Footer from "@/components/ui/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Script from "next/script";

// Optimierte Fonts mit subset und display swap
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial", "sans-serif"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
  preload: false, // Nur bei Bedarf laden
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "E-Shop | Moderner Online Shop",
    template: "%s | E-Shop",
  },
  description:
    "Entdecke hochwertige Produkte zu besten Preisen. Kostenloser Versand ab 50€. 30 Tage Rückgaberecht.",
  keywords: [
    "e-commerce",
    "shop",
    "produkte",
    "online shop",
    "kaufen",
    "elektronik",
    "mode",
    "computer",
    "gaming",
  ],
  authors: [{ name: "E-Shop Team" }],
  creator: "E-Shop",
  publisher: "E-Shop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "E-Shop - Moderner Online Shop",
    description:
      "Entdecke hochwertige Produkte zu besten Preisen. Kostenloser Versand ab 50€.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "E-Shop",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "E-Shop - Moderner Online Shop",
      },
    ],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Shop - Moderner Online Shop",
    description: "Entdecke hochwertige Produkte zu besten Preisen",
    images: ["/og-image.jpg"],
    creator: "@eshop",
    site: "@eshop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },

  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  category: "e-commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    
    <html
      lang="de"
      className={`${inter.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth" 
    >
      <head>
        {/* Preconnect zu wichtigen Domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
      </head>
      <body className={inter.className}>

        {/* ✅ Google Analytics - nur in Production */}
        {isProduction && (
          <>
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script id="google-analytics-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        <ThemeProvider>
          <NextAuthSessionProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
                  {children}
                </main>
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
