"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

function KoraCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
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

    let timer: ReturnType<typeof setTimeout> | undefined

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
          setStatus("error")
          return
        }

        setStatus("success")
        timer = setTimeout(() => {
          router.replace(data.redirectUrl)
        }, 1500)
      } catch (err) {
        console.error(err)
        setError("Something went wrong.")
        setStatus("error")
      }
    }

    void submit()

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
        <p>Finalizing payment…</p>
      )}
    </div>
  )
}

export default function KoraCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Finalizing payment...</div>}>
      <KoraCallbackContent />
    </Suspense>
  )
}
