// app/api/kora/webhook/route.ts

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  // Log the body to understand what we received
  console.log("Received webhook:", JSON.stringify(body, null, 2))

  // Only handle charge success events
  if (body.event === "charge.success") {
    const { reference, amount, status, transaction_status } = body.data

    // Perform any actions here (e.g., updating database with payment status)
    if (status === "success" && transaction_status === "success") {
      // Payment successful, update database or notify the user
      console.log("Payment successful for reference:", reference)
      return NextResponse.json({ success: true })
    } else {
      // Payment failed or underpaid, handle accordingly
      console.log("Payment failed or underpaid for reference:", reference)
      return NextResponse.json({ success: false })
    }
  }

  return NextResponse.json({ error: "Invalid event type" }, { status: 400 })
}
