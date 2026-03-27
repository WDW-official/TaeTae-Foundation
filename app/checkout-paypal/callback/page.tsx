"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function PaypalCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const orderID = searchParams?.get("token") // PayPal sends ?token=ORDER_ID

    if (!orderID) {
      setError("Missing PayPal order ID.")
      setLoading(false)
      return
    }

    const handlePayment = async () => {
      try {
        // 🔥 STEP 1: Capture & verify payment on backend
        const verifyRes = await fetch("/api/paypal-capture", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderID }),
        })

        const verifyData = await verifyRes.json()

        if (!verifyRes.ok || !verifyData.success) {
          setError("Payment verification failed.")
          setLoading(false)
          return
        }

        // 🔐 STEP 2: Get stored form data
        const stored = localStorage.getItem("sponsorshipFormData")
        if (!stored) {
          setError("Missing saved form data.")
          setLoading(false)
          return
        }

        const formData = JSON.parse(stored)

        // 🎯 STEP 3: Choose endpoint
        const endpoint =
          formData.mode === "donation"
            ? "/api/donations"
            : "/api/sponsorships"

        // ✅ STEP 4: Save after verification
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            orderID: orderID,
            paymentMethod: "paypal",
            status: "completed",
            payerEmail: verifyData.payerEmail,
            amount: verifyData.amount,
          }),
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          setError("Saving donation failed.")
          setLoading(false)
          return
        }

        // 🧹 Cleanup
        localStorage.removeItem("sponsorshipFormData")
        localStorage.removeItem("paypalOrderID")

        // 🚀 Redirect
        const redirectUrl =
          formData.mode === "donation"
            ? "/support/donate"
            : "/support/sponsor"

        router.replace(redirectUrl)
      } catch (err) {
        console.error(err)
        setError("Something went wrong.")
        setLoading(false)
      }
    }

    handlePayment()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading ? (
        <p className="text-gray-600">Finalizing payment…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-green-600">Payment successful! Redirecting...</p>
      )}
    </div>
  )
}