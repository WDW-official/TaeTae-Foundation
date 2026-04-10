import { addRecord, getRecordById, updateRecord } from "@/lib/db"

export type CheckoutProvider = "paystack" | "kora" | "paypal"
export type CheckoutMode = "donation" | "sponsorship"
export type CheckoutDraftStatus = "pending" | "completed" | "failed"

export type DonationCheckoutPayload = {
  program: string
  name?: string
  email: string | null
  amount: string | number
  mode: "donation"
  paymentMethod: CheckoutProvider
  donationMode?: string
  currency?: string
  message?: string
  duration?: string
  reminderToken?: string
  reminderTokenExpiresAt?: string | Date
  nextDonationDate?: string | Date
  reminder3Sent?: boolean
  reminder1Sent?: boolean
}

export type SponsorshipCheckoutPayload = {
  name: string
  email: string
  items: Array<{
    id: string
    quantity: number
  }>
  multiplier?: number
  totalAmount: string | number
  paymentMethod: CheckoutProvider
  currency?: string
  rateUsed?: number
  mode: "sponsorship"
}

export type CheckoutDraftPayload = DonationCheckoutPayload | SponsorshipCheckoutPayload

export type CheckoutDraft = {
  id: string
  mode: CheckoutMode
  provider: CheckoutProvider
  status: CheckoutDraftStatus
  payload: CheckoutDraftPayload
  providerReference?: string
  completedAt?: string
  failureReason?: string
  createdAt: string
  updatedAt?: string
}

export async function createCheckoutDraft(input: {
  mode: CheckoutMode
  provider: CheckoutProvider
  payload: CheckoutDraftPayload
}) {
  return addRecord("checkoutDrafts", {
    mode: input.mode,
    provider: input.provider,
    payload: input.payload,
    status: "pending",
  }) as Promise<CheckoutDraft>
}

export async function getCheckoutDraft(id: string) {
  return (await getRecordById("checkoutDrafts", id)) as CheckoutDraft | null
}

export async function markCheckoutDraftCompleted(id: string, providerReference?: string) {
  return updateRecord("checkoutDrafts", id, {
    status: "completed",
    providerReference,
    completedAt: new Date().toISOString(),
  }) as Promise<CheckoutDraft | null>
}

export async function markCheckoutDraftFailed(id: string, failureReason: string) {
  return updateRecord("checkoutDrafts", id, {
    status: "failed",
    failureReason,
  }) as Promise<CheckoutDraft | null>
}
