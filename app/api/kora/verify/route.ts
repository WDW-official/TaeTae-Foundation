// app/api/kora/verify/route.ts

import { NextResponse } from "next/server"

export async function GET(req: Request) {
  // extract last segment of the URL path as the reference
  const reference = req.url.split("/").pop() ?? ""

  if (!reference) {
    return NextResponse.json({ status: "failed", message: "Missing reference" }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.korapay.com/merchant/api/v1/charges/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`, // Use your secret key here
      },
    })

    const data = await res.json()

    if (data.status === "success" && data.data.transaction_status === "success") {
      return NextResponse.json({ status: "success", data: data.data })
    } else {
      return NextResponse.json({ status: "failed", message: "Payment verification failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ status: "failed", message: "Error verifying payment" }, { status: 500 })
  }
}
