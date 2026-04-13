import { NextResponse } from "next/server"
import { getRecords, updateRecord } from "@/lib/db"
import { sendReminderEmail } from "@/lib/email"

export async function GET() {
  const today = new Date()
  const donations = await getRecords("donations")
  let checked = 0
  let sent3Day = 0
  let sent1Day = 0

  for (const donation of donations) {
    checked += 1

    if (!donation.email || !donation.nextDonationDate) continue

    const nextDate = new Date(donation.nextDonationDate)
    if (Number.isNaN(nextDate.getTime())) continue

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
      sent3Day += 1
    }

    // 1 day reminder
    if (diffDays === 1 && !donation.reminder1Sent) {
      await sendReminderEmail(donation)
      await updateRecord("donations", donation._id.toString(), {
        reminder1Sent: true
      })
      sent1Day += 1
    }
  }

  return NextResponse.json({
    success: true,
    checked,
    sent3Day,
    sent1Day,
  })
}
