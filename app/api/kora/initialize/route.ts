import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Log the request body for verification
    console.log("Received request body:", JSON.stringify(body, null, 2))

    const amountInSmallestUnit = body.amount // Ensure the amount is in the smallest unit (kobo for NGN)
    
    const res = await fetch(
      "https://api.korapay.com/merchant/api/v1/charges/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInSmallestUnit, // Amount in smallest unit
          currency: "NGN", // Currency
          reference: body.reference,
          redirect_url: body.redirect_url,
          notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/kora/webhook`, // Webhook URL
          customer: {
            email: body.customer.email,
            name: body.customer.name,
          },
          metadata: body.metadata, // Additional metadata
        }),
      }
    )

    // Log the full response from KoraPay
    const data = await res.json()
    console.log("Kora API response:", JSON.stringify(data, null, 2))

    // Handle if the response status is false
    if (!data.status) {
      console.error("Korapay rejected request:", data)
      return NextResponse.json(
        { error: "Korapay rejected request", data },
        { status: 400 }
      )
    }

    // If successful, return the checkout URL
    return NextResponse.json({
      checkout_url: data.data.checkout_url,
      reference: data.data.reference,
    })
  } catch (err) {
    console.error("Korapay init error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
