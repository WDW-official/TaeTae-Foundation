"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function KoraCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const reference = searchParams.get("reference")
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

        const endpoint =
          formData.mode === "donation"
            ? "/api/donations"
            : "/api/sponsorships"

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            reference,
            currency: "USD",
            status: "completed",
            gateway: "kora",
          }),
        })

        const data = await res.json()

        if (!data.success) {
          setError("Payment verification failed.")
          return
        }

        localStorage.removeItem("sponsorshipFormData")
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
      {error ? <p className="text-red-600">{error}</p> : <p>Finalizing payment…</p>}
    </div>
  )
}
