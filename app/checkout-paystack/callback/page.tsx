"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function PaystackCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const reference = searchParams?.get("reference")
    const checkoutId = searchParams?.get("checkoutId")
    if (!reference) {
      setError("Missing payment reference.")
      return
    }
    if (!checkoutId) {
      setError("Missing checkout reference.")
      return
    }

    const submit = async () => {
      try {
        const res = await fetch(`/api/checkout-drafts/${checkoutId}/finalize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
          }),
        })

        const data = await res.json()

        if (!res.ok || !data.success || !data.redirectUrl) {
          setError(data.error || "Payment verification failed.")
          return
        }

        router.replace(data.redirectUrl)
      } catch (err) {
        console.error("Callback error:", err)
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

export default function PaystackCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Finalizing payment...</div>}>
      <PaystackCallbackContent />
    </Suspense>
  )
}
