import cron from "node-cron"
import { getRecords } from "@/lib/db"
import { sendEmail } from "@/lib/email"

cron.schedule("0 9 * * *", async () => {
  const donations = await getRecords("donations")

  const recurring = donations.filter(
    d => d.duration === "monthly" || d.duration === "quarterly"
  )

  for (const donation of recurring) {
    const donateLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reminder-donation/${donation.reminderToken}`
    await sendEmail(
      donation.email,
      "Donation Reminder",
      `
        <h2>Hello ${donation.name}</h2>
        <p>This is a reminder for your ${donation.duration} donation.</p>
        <p>Amount: ${donation.currency} ${donation.amount}</p>
        <p>Program: ${donation.program}</p>
        <a href="${donateLink}"style="padding:12px 20px;background:#22c55e;color:white;border-radius:6px;text-decoration:none;">
        Donate Now
        </a>
      `
    )
  }
})
