import cron from "node-cron"
import { getRecords, updateRecord } from "@/lib/db"
import { sendReminderEmail } from "@/lib/email"

cron.schedule("0 9 * * *", async () => {
  const today = new Date()
  const donations = await getRecords("donations")

  const recurring = donations.filter(
    (d) =>
      (d.duration === "monthly" || d.duration === "quarterly") &&
      d.email &&
      d.nextDonationDate
  )

  for (const donation of recurring) {
    const nextDate = new Date(donation.nextDonationDate)
    if (Number.isNaN(nextDate.getTime())) continue

    const diffDays = Math.ceil(
      (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 3 && !donation.reminder3Sent) {
      await sendReminderEmail(donation)
      await updateRecord("donations", donation._id.toString(), {
        reminder3Sent: true,
      })
    }

    if (diffDays === 1 && !donation.reminder1Sent) {
      await sendReminderEmail(donation)
      await updateRecord("donations", donation._id.toString(), {
        reminder1Sent: true,
      })
    }
  }
})
