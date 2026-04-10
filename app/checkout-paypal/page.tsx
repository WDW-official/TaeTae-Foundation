"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import BackButton from "@/components/backButton"

type SponsorshipFormData = {
  program: string
  name?: string
  totalAmount: string
  amount: string
  email: string
  mode: "donation" | "sponsorship"
}

function CheckoutPaypalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkoutId = searchParams?.get("checkoutId") || ""
  const [formData, setFormData] = useState<SponsorshipFormData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!checkoutId) {
      setError("Missing checkout reference.")
      return
    }

    const loadDraft = async () => {
      try {
        const res = await fetch(`/api/checkout-drafts/${checkoutId}`, { cache: "no-store" })
        const data = await res.json()

        if (!res.ok || !data.draft?.payload) {
          setError("No payment data found. Please start again.")
          return
        }

        if (data.draft.status === "completed") {
          router.replace(data.draft.mode === "donation" ? "/support/donate" : "/support/sponsor")
          return
        }

        setFormData(data.draft.payload)
      } catch {
        setError("Invalid payment data.")
      }
    }

    void loadDraft()
  }, [checkoutId, router])

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

  const payableAmount = Number(
    mode === "donation" ? amount : totalAmount
  ).toFixed(2)

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  if (!clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">PayPal client ID missing.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-card dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <BackButton label="Back" />

        <h1 className="text-2xl font-bold mb-2">
          Complete Your {mode === "donation" ? "Donation" : "Sponsorship"}
        </h1>

        <p className="text-muted-foreground mb-6">
          Secure payment powered by PayPal
        </p>

        <div className="border rounded-lg p-6 space-y-4">

          <div className="flex justify-between text-sm">
            <span>Program</span>
            <span className="font-medium capitalize">{program}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Amount</span>
            <span className="font-medium">${payableAmount}</span>
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

          <PayPalScriptProvider
            options={{
              clientId: clientId,
              currency: "USD",
            }}
          >
            <div className="mt-6">

              <PayPalButtons

                style={{ layout: "vertical" }}

                createOrder={async () => {
                  try {
                    const res = await fetch("/api/paypal/create-order", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        amount: payableAmount,
                        checkoutId,
                      }),
                    })

                    const data = await res.json()

                    if (!data.id) {
                      throw new Error("Failed to create PayPal order")
                    }

                    return data.id
                  } catch (err) {
                    console.error(err)
                    setError("Failed to initialize PayPal payment.")
                    throw err
                  }
                }}

                onApprove={async (data) => {

                  try {

                    const res = await fetch(`/api/checkout-drafts/${checkoutId}/finalize`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        orderID: data.orderID,
                      }),
                    })

                    const result = await res.json()

                    if (result.success && result.redirectUrl) {
                      window.location.href = result.redirectUrl
                    } else {
                      setError("Payment verification failed.")
                    }

                  } catch (err) {
                    console.error("PayPal capture failed:", err)
                    setError("Payment verification failed.")
                  }

                }}

                onError={(err) => {
                  console.error("PayPal error:", err)
                  setError("PayPal payment failed.")
                }}

              />

            </div>
          </PayPalScriptProvider>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded">
              {error}
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground">
            You will be redirected to PayPal to complete your payment securely
          </p>

        </div>
      </div>
    </div>
  )
}

export default function CheckoutPaypalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading payment data...</p>
        </div>
      }
    >
      <CheckoutPaypalContent />
    </Suspense>
  )
}
