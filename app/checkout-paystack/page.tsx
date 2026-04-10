"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import BackButton from "@/components/backButton"
import { startPaystackTransaction } from "@/app/actions/paystack"

type SponsorshipFormData = {
  program: string
  name?: string
  totalAmount: string
  amount:string
  email: string
  mode: "donation" | "sponsorship"
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkoutId = searchParams?.get("checkoutId") || ""

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  const [sponsorshipFormData, setSponsorshipFormData] =
    useState<SponsorshipFormData | null>(null)

  /* ----------------------------------
     Load data from checkout draft
  ----------------------------------- */
  useEffect(() => {
    if (!checkoutId) {
      setError("Missing checkout reference.")
      setIsReady(true)
      return
    }

    try {
      const loadDraft = async () => {
        const res = await fetch(`/api/checkout-drafts/${checkoutId}`, { cache: "no-store" })
        const data = await res.json()

        if (!res.ok || !data.draft?.payload) {
          setError("No checkout data found.")
          setIsReady(true)
          return
        }

        if (data.draft.status === "completed") {
          router.replace(data.draft.mode === "donation" ? "/support/donate" : "/support/sponsor")
          return
        }

        setSponsorshipFormData(data.draft.payload)
        setIsReady(true)
      }

      void loadDraft()
    } catch (err) {
      console.error(err)
      setError("Failed to load sponsorship data.")
      setIsReady(true)
    }
  }, [checkoutId, router])

  const handlePaystackPayment = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!sponsorshipFormData) {
        setError("Missing sponsorship data.")
        setIsLoading(false)
        return
      }

      const {
        program = "General",
        name,
        totalAmount,
        amount,
        email,
        mode,
      } = sponsorshipFormData

      if (!program || !email || !mode) {
        setError("Missing required information.")
        setIsLoading(false)
        return
      }
      
      
      const authorizationUrl = await startPaystackTransaction(
        Number.parseFloat(mode === "donation" ? amount : totalAmount),
        email,
        mode,
        { program, donorName: name ?? undefined },
        checkoutId
      )

      if (!authorizationUrl) {
      throw new Error("Paystack did not return redirect URL")
    }

      window.location.assign(authorizationUrl)
    } catch (err) {
      console.error("Error initializing Paystack payment:", err)
      setError("Failed to initialize payment. Please try again.")
      setIsLoading(false)
    }
  }

  

  /* ----------------------------------
     UI STATES
  ----------------------------------- */
  if (!isReady) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!sponsorshipFormData) {
    return (
      <div className="p-8 text-center">
        <h2>No sponsorship data found!</h2>
      </div>
    )
  }

  const { name, totalAmount, amount, email, mode } = sponsorshipFormData

  /* ----------------------------------
     RENDER
  ----------------------------------- */
  return (
    <div className="min-h-screen bg-card dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <BackButton label="Back" />

        <h1 className="text-2xl font-bold text-primary mb-2">
          Complete Your {mode === "donation" ? "Donation" : "Sponsorship"} Payment
        </h1>

        <p className="text-foreground mb-8">
          Secure payment powered by Paystack
        </p>

        <div className="bg-card dark:bg-gray-900 border border-border rounded-lg p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">
              {mode === "donation" ? "Donation" : "Sponsorship"} Summary
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Program:</span>
                <span className="font-semibold">General</span>
              </div>

              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">
                  ₦{mode === "donation" ? amount : totalAmount}
                </span>
              </div>

              <div className="flex justify-between">
                <span>{mode === "donation" ? "Donor" : "Sponsor"}:</span>
                <span className="font-semibold">{name || "Anonymous"}</span>
              </div>

              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-semibold">{email}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handlePaystackPayment}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {isLoading ? "Initializing Payment..." : "Pay with Paystack"}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            You will be redirected to Paystack to complete your payment securely
          </p>
        </div>
      </div>
    </div>
  )
}
