"use server"

export async function startKoraTransaction(amount: number, email: string, metadata: Record<string, any>) {
  try {
    const res = await fetch("https://api.korapay.com/merchant/api/v1/charges/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // KoraPay expects amount in the smallest unit (e.g., cents for NGN)
        currency: "NGN", // Example currency (replace with actual if necessary)
        customer: { email },
        reference: `KORA_${Date.now()}`,
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout-kora/callback`,
        metadata,
      }),
    })

    // Log the response status for debugging
    console.log('Response Status:', res.status)

    // Check for non-2xx status codes
    if (!res.ok) {
      const errorText = await res.text() // Log the response text for error investigation
      console.error('Error Response Body:', errorText)
      throw new Error(`Failed to initialize payment. Status: ${res.status} Response: ${errorText}`)
    }

    // Try to parse the response JSON
    const data = await res.json()

    if (!data.status) {
      throw new Error("Kora initialization failed")
    }

    return data.data.checkout_url
  } catch (err) {
    console.error("Error initializing Kora payment:", err)
    throw new Error("Failed to initialize Kora payment")
  }
}