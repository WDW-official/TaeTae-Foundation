import { NextRequest, NextResponse } from "next/server"
import { updateRecord } from "@/lib/db" // Your existing updateRecord function

export async function POST(request: NextRequest) {
  try {
    const { donationId, sponsorshipId, status } = await request.json()

    // Validate inputs
    if (!status || (!donationId && !sponsorshipId)) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Update donation status if donationId is provided
    if (donationId) {
      await updateRecord("donations", donationId, { status })
    }

    // Update sponsorship status if sponsorshipId is provided
    if (sponsorshipId) {
      await updateRecord("sponsorships", sponsorshipId, { status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating status:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
