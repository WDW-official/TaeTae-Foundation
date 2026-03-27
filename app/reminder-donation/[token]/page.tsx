import { getRecords, updateRecord } from "@/lib/db"
import DonationReminderClient from "./DonationReminderClient"
import { Donation } from "@/lib/schemas"
import { generateDonationToken } from "@/lib/token"

export default async function ReminderDonationPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {

  const { token } = await params

  const donations = await getRecords("donations", {
    reminderToken: token,
  })

  if (!donations || donations.length === 0) {
    return <div>Invalid donation link</div>
  }

  const donation = donations[0] as unknown as Donation

  // refresh token if expired
  if (
    donation.reminderTokenExpiresAt &&
    new Date(donation.reminderTokenExpiresAt) < new Date()
  ) {

    const newToken = generateDonationToken()

    if (!donation._id) {
      return <div>Donation ID missing</div>
    }

    await updateRecord("donations", donation._id.toString(), {
      reminderToken: newToken,
      reminderTokenExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    })

    donation.reminderToken = newToken
  }

  const safeDonation = JSON.parse(JSON.stringify(donation))

  return <DonationReminderClient donation={safeDonation} />
}
