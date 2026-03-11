"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, Lock, X } from "lucide-react"
import Navigation from "@/components/navigation"
import { useAuthStore } from "../store/auth.store"
import { routeByRole } from "@/lib/routeByRole"
import { motion } from "framer-motion"


export default function AdminLogin() {
  const router = useRouter()

  // Login state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Forgot password modal state
  const [showModal, setShowModal] = useState(false)
  const [fpStep, setFpStep] = useState<"email" | "otp" | "reset">("email")
  const [fpEmail, setFpEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [fpMessage, setFpMessage] = useState<string | null>(null)

  // Resend OTP cooldown
  const [cooldown, setCooldown] = useState(0)
  const setAuth = useAuthStore((s:any) => s.setAuth)

  /* ----------------------------------
   * Password strength checker
   * ---------------------------------- */
  const getPasswordStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score
  }

  const strength = getPasswordStrength(newPassword)

  /* ----------------------------------
   * Cooldown timer
   * ---------------------------------- */
  useEffect(() => {
    if (cooldown === 0) return
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  /* ----------------------------------
   * Login
   * ---------------------------------- */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Invalid credentials")
        return
      }

      setAuth({
        role: data.role,
        volunteerId: data.volunteerId,
      })

      routeByRole(router, data)


      if (data.role === "superAdmin") {
          router.replace("/admin/dashboard")
        } else if (data.role === "admin") {
          router.replace("/admin/dashboard/volunteers")
        } else if (data.role === "volunteer") {
          router.replace(`/volunteer/dashboard/${data.volunteerId}`)
        } else {
          setError("Unauthorized account")
      }
    } catch {
      setError("Login failed")
    } finally {
      setLoading(false)
    }
  }

  /* ----------------------------------
   * Forgot Password Logic
   * ---------------------------------- */
  const sendOtp = async () => {
    setFpMessage(null)
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: fpEmail }),
    })
    setFpStep("otp")
    setCooldown(60)
    setFpMessage("OTP sent to your email")
  }

  const resendOtp = async () => {
    if (cooldown > 0) return
    await sendOtp()
  }

  const verifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email: fpEmail, otp }),
    })
    const data = await res.json()
    if (data.valid) {
      setFpStep("reset")
    } else {
      setFpMessage("Invalid or expired OTP")
    }
  }

  const resetPassword = async () => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email: fpEmail, otp, newPassword }),
    })

    if (res.ok) {
      setFpMessage("Password reset successful. You can log in.")
      setShowModal(false)
    }
  }

  return (
    <main className=" flex dark:bg-gray-800 items-center justify-center py-40">
      <div className="w-full max-w-md">
        <Navigation/>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
          >
          <div className=" overflow-hidden flex justify-center items-center ">
              <img
              src="/Tae-Tae-logo.png"
              alt="Boys in leadership training"
              className="md:h-10 h-8 object-center object-cover"
              />
          </div>

          <div className="text-center -bottom-6 text-sm lg:text-base left-6 b  px-6 py-3 mb-3 rounded-xl ">
              <p className="font-semibold"> Excellence • Growth • Integrity</p>
          </div>
        </motion.div>
        <div className="bg-card dark:bg-gray-900  rounded-4xl p-8 shadow-2xl">
          <h1 className="text-xl font-semibold flex  items-center gap-3 mb-2">
            <Lock className="w-4 h-4 text-primary" />
            Sign in
          </h1>

          {error && (
            <div className="bg-red-100 p-3 rounded mb-4 flex gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-black">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-primary"
                onClick={() => {
                  setShowModal(true)
                  setFpEmail(email)
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-primary">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* ---------------- MODAL ---------------- */}
      {/* ---------------- IMPROVED MODAL ---------------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900  shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Reset your password
                </h2>
                <p className="text-sm text-gray-500">
                  Secure access to your account
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-5">
              {fpMessage && (
                <div className="rounded-lg bg-blue-50 dark:bg-gray-900  border border-blue-200 px-4 py-3 text-sm text-blue-700">
                  {fpMessage}
                </div>
              )}

              {/* EMAIL STEP */}
              {fpStep === "email" && (
                <>
                  <div>
                    <label className="block text-sm font-medium  mb-1">
                      Email address
                    </label>
                    <input
                      className="w-full rounded-lg border px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="admin@taetae.org"
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={sendOtp}
                    className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition"
                  >
                    Send verification code
                  </button>
                </>
              )}

              {/* OTP STEP */}
              {fpStep === "otp" && (
                <>
                  <div>
                    <label className="block text-sm font-medium  mb-1">
                      Verification code
                    </label>
                    <input
                      className="w-full rounded-lg border px-4 py-2.5 text-center tracking-widest font-mono text-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      We sent a 6-digit code to your email
                    </p>
                  </div>

                  <button
                    onClick={verifyOtp}
                    className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Verify code
                  </button>

                  <button
                    onClick={resendOtp}
                    disabled={cooldown > 0}
                    className="w-full text-sm text-primary disabled:text-gray-400"
                  >
                    {cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : "Resend verification code"}
                  </button>
                </>
              )}

              {/* RESET STEP */}
              {fpStep === "reset" && (
                <>
                  <div>
                    <label className="block text-sm font-medium  mb-1">
                      New password
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="Create a strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  {/* Strength meter */}
                  <div>
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-900  overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength <= 2
                            ? "bg-red-500 w-1/3"
                            : strength === 3
                            ? "bg-yellow-500 w-2/3"
                            : "bg-green-500 w-full"
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      {strength <= 2 && "Weak password"}
                      {strength === 3 && "Moderate strength"}
                      {strength >= 4 && "Strong password"}
                    </p>
                  </div>

                  <button
                    onClick={resetPassword}
                    disabled={strength < 3}
                    className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    Reset password
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
