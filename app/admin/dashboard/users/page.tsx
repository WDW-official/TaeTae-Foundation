"use client"

import { useEffect, useState } from "react"
import { Users, Shield, UserCog, KeyRound, Trash2, UserPlus, X } from "lucide-react"
import ChangePasswordModal from "@/components/ChangePasswordModal"
import { useAuthStore } from "@/app/store/auth.store"

type User = {
  id: string
  email: string
  role: "superAdmin" | "admin" | "volunteer"
  createdAt: string
}

export default function UserManagementPage() {
  const role = useAuthStore((s) => s.role)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [creatingAdmin, setCreatingAdmin] = useState(false)
  const [adminMessage, setAdminMessage] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      if (!res.ok) throw new Error()
      const data: User[] = await res.json()

      // 🔒 ONLY admins & superAdmins
      const filtered = data.filter(
        (u) => u.role === "admin" || u.role === "superAdmin"
      )

      setUsers(filtered)
    } catch {
      setError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const openResetPassword = (user: User) => {
    setSelectedUser(user)
    setShowPasswordModal(true)
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingAdmin(true)
    setAdminMessage(null)

    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAdminMessage(data.error || "Failed to create admin")
      } else {
        setAdminMessage("Admin created successfully")
        setAdminEmail("")
        setAdminPassword("")
        setShowAddAdmin(false)
      }
    } catch {
      setAdminMessage("Something went wrong")
    } finally {
      setCreatingAdmin(false)
    }
  }

  const handleDeleteAdmin = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return

    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Failed to delete admin")
        return
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch {
      alert("Something went wrong")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  const adminCount = users.filter((u) => u.role === "admin").length
  const superAdminCount = users.filter((u) => u.role === "superAdmin").length

  return (
    <div className="min-h-screen dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-primary" />
              User Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage platform administrators
            </p>
          </div>
          {role === "superAdmin" && (
            <button
              onClick={() => setShowAddAdmin(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black hover:bg-primary/90 transition"
            >
              <UserPlus size={16} />
              Add Admin
            </button>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <UserCog className="w-6 h-6" />
              </div>
            </div>
            <p className="text-white/80 text-sm">Admins</p>
            <p className="text-2xl font-bold">{adminCount}</p>
          </div>

          <div className="bg-linear-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <p className="text-white/80 text-sm">Super Admins</p>
            <p className="text-2xl font-bold">{superAdminCount}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Administrators
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
    {users.map((user, idx) => (
      <tr
        key={user.id}
        className={`border-b border-border hover:bg-secondary/20 transition ${
          idx % 2 === 0
            ? "bg-card dark:bg-gray-900"
            : "bg-secondary/10"
        }`}
      >
        {/* User */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {user.email}
              </p>
              <p className="text-xs text-muted-foreground">
                ID: {user.id}
              </p>
            </div>
          </div>
        </td>

        {/* Email */}
        <td className="px-6 py-4">
          <p className="text-sm">{user.email}</p>
        </td>

        {/* Role */}
        <td className="px-6 py-4">
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.role === "superAdmin"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {user.role}
          </span>
        </td>

        {/* Created */}
        <td className="px-6 py-4 text-sm text-muted-foreground">
          {new Date(user.createdAt).toLocaleDateString()}
        </td>

        {/* Actions */}
        <td className="px-6 py-4">
          <div className="flex justify-end gap-2">
            {/* Reset password */}
            <button
              onClick={() => openResetPassword(user)}
              className="p-2 rounded-lg hover:bg-primary/10 transition"
              title="Reset password"
            >
              <KeyRound className="w-4 h-4 text-primary" />
            </button>

            {/* Delete admin only */}
            {user.role === "admin" && (
              <button
                onClick={() => handleDeleteAdmin(user.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 transition"
                title="Delete admin"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            )}
          </div>
        </td>
      </tr>
    ))}

    {users.length === 0 && (
      <tr>
        <td
          colSpan={5}
          className="text-center py-10 text-muted-foreground"
        >
          No users found
        </td>
      </tr>
    )}
              </tbody>
            </table>

          </div>
          {showAddAdmin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl animate-in fade-in zoom-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h2 className="text-lg font-semibold">Create Admin</h2>
                  <button onClick={() => setShowAddAdmin(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <form onSubmit={handleCreateAdmin} className="space-y-4 px-6 py-6">
                  {adminMessage && (
                    <div className="rounded bg-gray-100 dark:bg-gray-800 p-3 text-sm">
                      {adminMessage}
                    </div>
                  )}

                  <input
                    type="email"
                    placeholder="Admin email"
                    className="w-full rounded border px-4 py-2"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />

                  <input
                    type="password"
                    placeholder="Temporary password"
                    className="w-full rounded border px-4 py-2"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAdmin(false)}
                      className="rounded border px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>

                    <button
                      disabled={creatingAdmin}
                      className="rounded bg-primary px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
                    >
                      {creatingAdmin ? "Creating..." : "Create Admin"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Modal */}
        <ChangePasswordModal
          open={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false)
            setSelectedUser(null)
          }}
        />
      </div>
    </div>
  )
}
