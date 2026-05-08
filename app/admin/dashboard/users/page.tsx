"use client"

import { useEffect, useState } from "react"
import { Users, Shield, UserCog, KeyRound, Trash2, UserPlus, X } from "lucide-react"
import ChangePasswordModal from "@/components/ChangePasswordModal"
import { useAuthStore } from "@/app/store/auth.store"
import { AdminDataTable } from "@/components/admin/admin-data-table"
import LoadingLogo from "@/components/loading-logo"

type User = {
  id: string
  email: string
  name: string
  phone: string
  role: "superAdmin" | "admin" | "volunteer"
  createdAt: string
}

export default function UserManagementPage() {
  const role = useAuthStore((s) => s.role)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPhone, setAdminPhone] = useState("")
  const [adminName, setAdminName] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [creatingAdmin, setCreatingAdmin] = useState(false)
  const [adminMessage, setAdminMessage] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 10

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
          name: adminName,
          phone: adminPhone,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAdminMessage(data.error || "Failed to create admin")
      } else {
        setAdminMessage("Admin created successfully")
        setAdminEmail("")
        setAdminPassword("")
        setAdminName("")
        setAdminPhone("")
        setShowAddAdmin(false)
        fetchUsers()
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
        <LoadingLogo label="Loading users..." />
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
        <div className="grid grid-cols-2 gap-6">
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

          <AdminDataTable
            data={users}
            page={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            totalLabel="administrators"
            getRowKey={(user) => user.id}
            emptyTitle="No users found"
            emptyDescription="Administrators will appear here after they are created."
            rowClassName={(_, index) =>
              index % 2 === 0 ? "bg-card dark:bg-gray-900" : "bg-secondary/10"
            }
            columns={[
              {
                id: "name",
                header: "Name",
                render: (user) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n?.[0])
                            .join("")
                            .toUpperCase()
                        : "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                    </div>
                  </div>
                ),
              },
              {
                id: "email",
                header: "Email",
                render: (user) => <p className="text-sm">{user.email}</p>,
              },
              {
                id: "phone",
                header: "Phone Number",
                render: (user) => <p className="text-sm">{user.phone}</p>,
              },
              {
                id: "role",
                header: "Role",
                render: (user) => (
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "superAdmin"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                ),
              },
              {
                id: "created",
                header: "Created",
                render: (user) => (
                  <span className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                ),
              },
              {
                id: "actions",
                header: "Actions",
                headerClassName: "text-right",
                cellClassName: "text-right",
                render: (user) => (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openResetPassword(user)}
                      className="p-2 rounded-lg hover:bg-primary/10 transition"
                      title="Reset password"
                    >
                      <KeyRound className="w-4 h-4 text-primary" />
                    </button>
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
                ),
              },
            ]}
          />
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
                    type="text"
                    placeholder="Admin name"
                    className="w-full rounded border px-4 py-2"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                  />

                  <input
                    type="email"
                    placeholder="Admin email"
                    className="w-full rounded border px-4 py-2"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />

                  <input
                    type="number"
                    placeholder="Phone number"
                    className="w-full rounded border px-4 py-2"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
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
