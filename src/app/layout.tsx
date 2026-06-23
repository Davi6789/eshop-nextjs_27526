// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/ui/Navbar";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Footer from "@/components/ui/Footer";

const inter = Inter({ subsets: ["latin"] });

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
  category: "e-commerce",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
