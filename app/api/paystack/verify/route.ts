import { NextRequest, NextResponse } from "next/server"
import { verifyPaystackTransaction } from "@/lib/paystack"
import { updateRecord } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { reference, donationId, sponsorshipId } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 })
    }

    // Verify with Paystack
    const result = await verifyPaystackTransaction(reference)

    if (!result.status || result.data.status !== "success") {
      return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 })
    }

    // Handle donation status update
    if (donationId) {
      await updateRecord("donations", donationId, { status: "active" })
    }

    // Handle sponsorship status update
    if (sponsorshipId) {
      await updateRecord("sponsorships", sponsorshipId, { status: "active" })
    }

    return NextResponse.json({
      success: true,
      transaction: result.data,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
