import { NextResponse } from "next/server"

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
  const secret = process.env.NEXT_PUBLIC_PAYPAL_SECRET!
  const api = process.env.NEXT_PUBLIC_PAYPAL_API!

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64")

  const res = await fetch(`${api}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const data = await res.json()
  return data.access_token
}

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

    const accessToken = await getAccessToken()
    const api = process.env.NEXT_PUBLIC_PAYPAL_API!

    const res = await fetch(`${api}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount || "10.00",
            },
          },
        ],
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error(data)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    return NextResponse.json({ id: data.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}