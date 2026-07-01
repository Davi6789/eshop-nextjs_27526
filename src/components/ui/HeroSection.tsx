// src/components/ui/HeroSection.tsx

import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Willkommen bei E-Shop
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Entdecke unsere hochwertigen Produkte zu besten Preisen
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Jetzt einkaufen →
          </Link>
        </div>
      </div>
    </div>
  );
}
