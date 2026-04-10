"use server"

export async function startPaystackTransaction(
  amount: number,
  email: string,
  mode: string,
  metadata: Record<string, any>,
  checkoutId: string
) {

  if (!amount || amount <= 0) {
    throw new Error("Invalid payment amount")
  }

  const callbackUrl =
    `${process.env.FRONTEND_UR || "http://localhost:3000"}/checkout-paystack/callback?checkoutId=${encodeURIComponent(checkoutId)}`

  console.log("Paystack callback:", callbackUrl)

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amount * 100,
      callback_url: callbackUrl,
      metadata,
    }),
  })

  const data = await res.json()

  if (!data.status) {
    console.error("Paystack initialization error:", data)
    throw new Error(data.message || "Paystack initialization failed")
  }

  return data.data.authorization_url
}
