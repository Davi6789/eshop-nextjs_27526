// src/components/ui/Navbar.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ThemeToggle from "./ThemeToggle";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toggleCart, getTotalItems } = useCart();
  const { getWishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Scroll-Erkennung für Schatten-Effekt
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menü schließen bei Route Change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
    setIsMenuOpen(false);
  };

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg"
            : "bg-white dark:bg-gray-800 shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-gray-800 dark:text-white"
              >
                🛍️ E-Shop
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/products"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                Produkte
              </Link>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Wishlist Button */}
              <Link
                href="/dashboard/wishlist"
                className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                <span className="text-2xl">❤️</span>
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <button
                onClick={handleCartToggle}
                className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                <span className="text-2xl">🛒</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {status === "loading" ? (
                <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      {session.user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="hidden lg:inline">
                      {session.user?.name || session.user?.email}
                    </span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/orders"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Meine Bestellungen
                      </Link>
                      <Link
                        href="/dashboard/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Wunschliste
                      </Link>
                      {session.user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Abmelden
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Anmelden
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
              <ThemeToggle />

              <button
                onClick={handleCartToggle}
                className="relative text-gray-700 dark:text-gray-300"
              >
                <span className="text-2xl">🛒</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <span className="text-2xl">{isMenuOpen ? "✕" : "☰"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/products"
                className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                🛍️ Produkte
              </Link>

              <Link
                href="/dashboard/wishlist"
                className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                ❤️ Wunschliste ({getWishlistCount()})
              </Link>

              {session ? (
                <>
                  <hr className="my-2" />
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👤 Dashboard
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📦 Meine Bestellungen
                  </Link>
                  {session.user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 rounded-lg text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      👑 Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    🚪 Abmelden
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-lg bg-blue-600 text-white text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Anmelden
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
      {isCartOpen && <CartDrawer onClose={() => setIsCartOpen(false)} />}
      {/* <CartDrawer onClose={() => setIsCartOpen(false)} /> */}
    </>
  );
}
