// lib/kora.ts

const KORA_API_KEY = process.env.KORA_SECRET_KEY || ""
const KORA_BASE_URL = "https://api.korapay.com/merchant/api/v1"

export interface KoraTransactionData {
  amount: number // amount in kobo (₦100 = 10000)
  email: string
  reference: string
  metadata: {
    type: "donation" | "sponsorship"
    program?: string
    donorName?: string
    itemId?: string
  }
}

export async function initializeKoraTransaction(data: KoraTransactionData) {
  try {
    const response = await fetch(`${KORA_BASE_URL}/charges/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KORA_API_KEY}`,
      },
      body: JSON.stringify({
        amount: data.amount,
        currency: "NGN",
        reference: data.reference,
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/kora/callback`,
        customer: {
          email: data.email,
        },
        metadata: data.metadata,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Kora API error: ${errorText}`)
    }

    const result = await response.json()
    console.log("✅ Kora transaction initialized:", result)

    return result
  } catch (error) {
    console.error("❌ Error initializing Kora transaction:", error)
    throw error
  }
}

export async function verifyKoraTransaction(reference: string) {
  try {
    const response = await fetch(
      `${KORA_BASE_URL}/charges/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${KORA_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Kora verify error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log("✅ Kora transaction verified:", result)

    return result
  } catch (error) {
    console.error("❌ Error verifying Kora transaction:", error)
    throw error
  }
}
