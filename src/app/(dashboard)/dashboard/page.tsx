//  src/app/(dashboard)/dashboard/page.tsx

import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase/server"
import Link from "next/link"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  // Hole User Daten
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single()

  // Hole Bestellstatistiken
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id)

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  // Hole Wunschliste Count
  const { count: wishlistCount } = await supabase
    .from("wishlist")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Willkommen zurück, {user?.name || session.user.email}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Hier siehst du deine Bestellungen und kannst dein Konto verwalten.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bestellungen</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {totalOrders || 0}
            </p>
            <Link href="/dashboard/orders" className="text-blue-600 text-sm mt-2 inline-block">
              Alle anzeigen →
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Wunschliste</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {wishlistCount || 0}
            </p>
            <Link href="/dashboard/wishlist" className="text-blue-600 text-sm mt-2 inline-block">
              Anzeigen →
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Konto Status</h3>
            <p className="text-sm text-gray-900 dark:text-white mt-2">
              Email: {user?.email}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Rolle: {user?.role === "admin" ? "Administrator" : "Kunde"}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        {recentOrders && recentOrders.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Letzte Bestellungen
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Bestellung #{order.order_number}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.created_at).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        €{order.total_amount}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}>
                        {order.status === "delivered" ? "Geliefert" : 
                         order.status === "processing" ? "In Bearbeitung" : "Ausstehend"}
                      </span>
                    </div>
                  </div>
                  <Link 
                    href={`/dashboard/orders/${order.id}`}
                    className="text-blue-600 text-sm mt-2 inline-block"
                  >
                    Details anzeigen →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/products"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🛍️ Weiter shoppen</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Entdecke unsere neuen Produkte</p>
          </Link>
          
          <Link 
            href="/dashboard/wishlist"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">❤️ Meine Wunschliste</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Produkte, die dir gefallen haben</p>
          </Link>
        </div>
      </div>
    </div>
  )
}