// src/app/admin/users/page.tsx

"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string | null
  role: "admin" | "customer"
  email_verified: boolean
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")

  useEffect(() => {
    loadUsers()
  }, [searchTerm, roleFilter])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (roleFilter) params.append("role", roleFilter)

      const res = await fetch(`/api/admin/users?${params.toString()}`)
      const data = await res.json()
      setUsers(data.users)
    } catch (error) {
      console.error("Fehler:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (id: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole })
      })

      if (res.ok) {
        loadUsers()
      }
    } catch (error) {
      console.error("Update Error:", error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Benutzer verwalten
      </h1>

      {/* Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Suchen (Email/Name)..."
            className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-700"
          >
            <option value="">Alle Rollen</option>
            <option value="admin">Admin</option>
            <option value="customer">Kunde</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm("")
              setRoleFilter("")
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Zurücksetzen
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Benutzer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Rolle</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Verifiziert</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Registriert</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Keine Benutzer gefunden
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-medium">{user.name || "—"}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="px-2 py-1 border rounded text-sm dark:bg-gray-700"
                      >
                        <option value="customer">Kunde</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {user.email_verified ? (
                        <span className="text-green-600">✓ Verifiziert</span>
                      ) : (
                        <span className="text-yellow-600">○ Ausstehend</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {/* Implement User Details */}}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}