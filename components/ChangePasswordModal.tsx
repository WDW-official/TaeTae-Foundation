"use client"

import { useState } from "react"
import { X } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
}

export default function ChangePasswordModal({ open, onClose }: Props) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to change password")
      } else {
        setMessage("Password changed successfully")
        setCurrentPassword("")
        setNewPassword("")

        // Optional: auto-close after success
        setTimeout(onClose, 1200)
      }
    } catch {
      setMessage("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl animate-in fade-in zoom-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          {message && (
            <div className="rounded bg-gray-100 dark:bg-gray-800 p-3 text-sm">
              {message}
            </div>
          )}

          <input
            type="password"
            placeholder="Current password"
            className="w-full rounded border px-4 py-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="New password"
            className="w-full rounded border px-4 py-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded bg-primary px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
