"use server"

export async function startPaystackTransaction(
  amount: number,
  email: string,
  mode: string,
  metadata: Record<string, any>
) {

  const callbackUrl = `${process.env.FRONTEND_URL}/checkout-paystack/callback`

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
    throw new Error("Paystack initialization failed")
  }

  return data.data.authorization_url
}
