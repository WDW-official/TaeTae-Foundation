"use client"

import { useEffect, useState } from "react"
import BackButton from "@/components/backButton"

type SponsorshipFormData = {
  program: string
  name?: string
  totalAmount: string
  amount: string
  email: string
  mode: "donation" | "sponsorship"
}

export default function CheckoutKoraPage() {
  const [formData, setFormData] = useState<SponsorshipFormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ----------------------------------------
   * Load saved form data
   * ------------------------------------- */
  useEffect(() => {
    const stored = localStorage.getItem("sponsorshipFormData")
    if (!stored) {
      setError("No payment data found. Please start again.")
      return
    }

    try {
      setFormData(JSON.parse(stored))
    } catch {
      setError("Invalid payment data.")
    }
  }, [])

  /* ----------------------------------------
   * Load Korapay script
   * ------------------------------------- */
  useEffect(() => {
    const script = document.createElement("script")
    script.src =
      "https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  /* ----------------------------------------
   * Start Korapay Checkout
   * ------------------------------------- */
  const payKorapay = () => {
    if (!formData) return

    const { program, amount, totalAmount, name, email, mode } = formData

    const payableAmount = Number(
      mode === "donation" ? amount : totalAmount
    )

    setIsLoading(true)

    // @ts-ignore
    window.Korapay.initialize({
      key: "pk_test_vdXJjBHc2PHp7WHyScurdH7mJqdkx5JuLzMT5Upp", // pk_test_...
      reference: `KORA_${Date.now()}`,
      amount: payableAmount, // NGN amount (NO *100)
      currency: "USD",
      customer: {
        name: name || "Anonymous",
        email,
      },

      notification_url:
        "https://tae-tae-topaz.vercel.app/api/kora/webhook",

      onSuccess(data: any) {
        console.log("Payment success:", data)

        localStorage.setItem(
          "sponsorshipFormData",
          JSON.stringify(formData)
        )

        const reference = data?.reference
        window.location.href =
          `/checkout-kora/callback?reference=${reference}`
      },

      onFailed(data: any) {
        console.error("Payment failed:", data)
        setIsLoading(false)
        setError("Payment failed. Please try again.")
      },

      onClose() {
        setIsLoading(false)
      },
    })
  }

  /* ----------------------------------------
   * Empty / error state
   * ------------------------------------- */
  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          {error || "Loading payment data..."}
        </p>
      </div>
    )
  }

  const { program, name, amount, totalAmount, email, mode } = formData

  return (
    <div className="min-h-screen bg-card dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <BackButton label="Back" />

        <h1 className="text-2xl font-bold mb-2">
          Complete Your {mode === "donation" ? "Donation" : "Sponsorship"}
        </h1>

        <p className="text-muted-foreground mb-6">
          Secure payment powered by Korapay
        </p>

        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span>Program</span>
            <span className="font-medium capitalize">{program}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Amount</span>
            <span className="font-medium">
              ${mode === "donation" ? amount : totalAmount}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>{mode === "donation" ? "Donor" : "Sponsor"}</span>
            <span className="font-medium">
              {name || "Anonymous"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Email</span>
            <span className="font-medium">{email}</span>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded">
              {error}
            </div>
          )}

          <button
            onClick={payKorapay}
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-3 rounded font-semibold disabled:opacity-50"
          >
            {isLoading ? "Opening checkout..." : "Pay with Korapay"}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            You will be redirected to Korapay to complete your payment securely
          </p>
        </div>
      </div>
    </div>
  )
}
