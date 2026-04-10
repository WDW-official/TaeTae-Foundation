"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function PaypalCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const orderID = searchParams?.get("token") // PayPal sends ?token=ORDER_ID
    const checkoutId = searchParams?.get("checkoutId")

    if (!orderID) {
      setError("Missing PayPal order ID.")
      setLoading(false)
      return
    }

    if (!checkoutId) {
      setError("Missing checkout reference.")
      setLoading(false)
      return
    }

    const handlePayment = async () => {
      try {
        const verifyRes = await fetch(`/api/checkout-drafts/${checkoutId}/finalize`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderID }),
        })

        const verifyData = await verifyRes.json()

        if (!verifyRes.ok || !verifyData.success || !verifyData.redirectUrl) {
          setError(verifyData.error || "Payment verification failed.")
          setLoading(false)
          return
        }
        router.replace(verifyData.redirectUrl)
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

export default function PaypalCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Finalizing payment...</div>}>
      <PaypalCallbackContent />
    </Suspense>
  )
}
