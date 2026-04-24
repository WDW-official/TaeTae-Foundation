"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

function PaypalCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const orderID = searchParams?.get("token") // PayPal sends ?token=ORDER_ID
    const checkoutId = searchParams?.get("checkoutId")

    if (!orderID) {
      setError("Missing PayPal order ID.")
      setStatus("error")
      return
    }

    if (!checkoutId) {
      setError("Missing checkout reference.")
      setStatus("error")
      return
    }

    let timer: ReturnType<typeof setTimeout> | undefined

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
          setStatus("error")
          return
        }

        setStatus("success")
        timer = setTimeout(() => {
          router.replace(verifyData.redirectUrl)
        }, 1500)
      } catch (err) {
        console.error(err)
        setError("Something went wrong.")
        setStatus("error")
      }
    }

    void handlePayment()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {status === "success" ? (
        <div className="text-center space-y-4">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <p className="text-lg font-semibold text-green-700">Payment successful!</p>
          <p className="text-sm text-gray-600">Redirecting you now...</p>
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-gray-600">Finalizing payment…</p>
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
