import { type NextRequest, NextResponse } from "next/server"
import { addRecord, getRecords } from "@/lib/db"
import type { Donation } from "@/lib/schemas"
import { sendEmail } from "@/lib/email"

/**
 * POST /api/donations
 * Create a new donation record
 *
 * Body:
 * - name: string (donor name or "Anonymous")
 * - email: string | null
 * - program: "skills" | "education" | "sports"
 * - amount: number
 * - currency: "USD" | "NGN"
 * - paymentMethod: "stripe" | "paystack"
 * - message: string (optional)
 * - donationMode: "anonymous" | "known"
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // ✅ Validate required fields
    if (!data.amount || !data.program || !data.paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // ✅ Prepare donation data
    const donation: Partial<Donation> = {
      name: data.name,
      email: data.email || null,
      program: data.program,
      amount: data.amount,
      currency: data.currency || "USD",
      paymentMethod: data.paymentMethod,
      reference: data.reference,
      message: data.message,
      donationMode: data.donationMode,
      status: data.status || "pending",
    }

    // ✅ Save donation to DB
    const savedDonation = await addRecord("donations", donation)
    console.log("💾 Donation recorded:", savedDonation)

    // ✅ Send confirmation email to donor
    if (data.email) {
      await sendEmail(
        data.email,
        "Thank You for Your Donation ❤️",
        `
          <h2>Hello ${data.name || "Valued Supporter"},</h2>
          <p>Thank you for your generous donation to the <b>${data.program}</b> program.</p>
          <p>Here are your donation details:</p>
          <ul>
            <li><b>Amount:</b> ${data.currency || "USD"} ${data.amount}</li>
            <li><b>Payment Method:</b> ${data.paymentMethod}</li>
            <li><b>Status:</b> Pending</li>
          </ul>
          <p>We truly appreciate your support and commitment to changing lives.</p>
          <br/>
          <p>Warm regards,</p>
          <p><b>The TaeTae Foundation Team</b></p>
        `
      )
    }

    // ✅ Optional: Send admin notification
    if (process.env.ADMIN_EMAIL) {
      await sendEmail(
        process.env.ADMIN_EMAIL,
        "🎉 New Donation Received",
        `
          <h2>New Donation Alert</h2>
          <p><b>${data.name}</b> just donated <b>${data.currency || "USD"} ${data.amount}</b> to the <b>${data.program}</b> program.</p>
          <p>Payment Method: ${data.paymentMethod}</p>
          <p>Message: ${data.message || "—"}</p>
          <br/>
          <p>Check the admin dashboard for details.</p>
        `
      )
    }

    return NextResponse.json({ success: true, donation: savedDonation })
  } catch (error) {
    console.error("❌ Donation error:", error)
    return NextResponse.json({ error: "Failed to process donation" }, { status: 500 })
  }
}

/**
 * GET /api/donations
 * Retrieve all donations
 *
 * Query parameters:
 * - program: filter by program (optional)
 * - paymentMethod: filter by payment method (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const program = searchParams.get("program")
    const paymentMethod = searchParams.get("paymentMethod")

    const filter: any = {}
    if (program) filter.program = program
    if (paymentMethod) filter.paymentMethod = paymentMethod

    const donations = await getRecords("donations", filter)

    return NextResponse.json({
      donations,
      count: donations.length,
      meta: {
        total: (await getRecords("donations")).length,
        filtered: donations.length,
      },
    })
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 })
  }
}
