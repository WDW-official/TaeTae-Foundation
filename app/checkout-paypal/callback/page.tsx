"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function PaystackCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const reference = searchParams?.get("reference")
    if (!reference) {
      setError("Missing payment reference.")
      return
    }

    const stored = localStorage.getItem("sponsorshipFormData")
    if (!stored) {
      setError("Missing payment data.")
      return
    }

    const submit = async () => {
  try {
    const formData = JSON.parse(stored)

    // STEP 1: verify PayPal
    // const verifyRes = await fetch("/api/paypal-capture", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     orderID,
    //   }),
    // })

    // const verifyData = await verifyRes.json()

    // if (!verifyRes.ok || !verifyData.success) {
    //   setError("Payment verification failed.")
    //   return
    // }

    // STEP 2: call your EXISTING donation API 🔥
    const endpoint =
      formData.mode === "donation"
        ? "/api/donations"
        : "/api/sponsorships"

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        reference: verifyData.reference,
        paymentMethod: "paypal",
        status: "completed",
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      setError("Saving donation failed.")
      return
    }

    // cleanup
    localStorage.removeItem("sponsorshipFormData")
    localStorage.removeItem("paypalOrderID")

    const redirect_url =
      formData.mode === "donation"
        ? "/support/donate"
        : "/support/sponsor"

    router.replace(redirect_url)
  } catch (err) {
    console.error(err)
    setError("Something went wrong.")
  }
}

    submit()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p>Finalizing payment…</p>
      )}
    </div>
  )
}
