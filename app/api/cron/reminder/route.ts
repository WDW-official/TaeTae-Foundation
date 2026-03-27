import { NextResponse } from "next/server"
import { getRecords, updateRecord } from "@/lib/db"
import { sendEmail, sendReminderEmail } from "@/lib/email"

export async function GET() {

  const today = new Date()

  const donations = await getRecords("donations")

  for (const donation of donations) {

    if (!donation.nextDonationDate) continue

    const nextDate = new Date(donation.nextDonationDate)

    const diffDays = Math.ceil(
      (nextDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
    )

    // 3 day reminder
    if (diffDays === 3 && !donation.reminder3Sent) {

      await sendReminderEmail(donation)

      await updateRecord("donations", donation._id.toString(), {
        reminder3Sent: true
      })

    }

    // 1 day reminder
    if (diffDays === 1 && !donation.reminder1Sent) {

      await sendReminderEmail(donation)

      await updateRecord("donations", donation._id.toString(), {
        reminder3Sent: true
      })

    }

  }

  return NextResponse.json({ success: true })
}
