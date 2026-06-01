//  src/app/admin/page.tsx

import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase/server"

export default async function AdminDashboardPage() {
  const session = await auth()
  
  // Prüfen ob User Admin ist
  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  // Statistiken aus der Datenbank holen
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })

  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })

  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      total_amount,
      status,
      created_at,
      users (name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Produkte</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {totalProducts || 0}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bestellungen</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {totalOrders || 0}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Benutzer</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {totalUsers || 0}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Letzte Bestellungen
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bestellnummer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Betrag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Datum
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders?.map((order: any) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      #{order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.users?.name || order.users?.email || "Unbekannt"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      €{order.total_amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "completed" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("de-DE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Schnellzugriff
            </h3>
            <div className="space-y-2">
              <a href="/admin/products" className="block text-blue-600 hover:text-blue-500">
                → Produkte verwalten
              </a>
              <a href="/admin/orders" className="block text-blue-600 hover:text-blue-500">
                → Alle Bestellungen
              </a>
              <a href="/admin/users" className="block text-blue-600 hover:text-blue-500">
                → Benutzer verwalten
              </a>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Admin Info
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Eingeloggt als: <strong>{session.user?.email}</strong>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Rolle: <span className="text-blue-600 font-semibold">Administrator</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}