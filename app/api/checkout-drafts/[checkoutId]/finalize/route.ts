import { NextRequest, NextResponse } from "next/server"
import { verifyPaystackTransaction } from "@/lib/paystack"
import {
  getCheckoutDraft,
  markCheckoutDraftCompleted,
  markCheckoutDraftFailed,
} from "@/lib/checkout-drafts"
import { addRecord, getRecords, updateRecord } from "@/lib/db"
import { sendEmail, sendSponsorshipEmail } from "@/lib/email"
import { generateDonationToken } from "@/lib/token"

async function verifyKoraTransaction(reference: string) {
  const res = await fetch(
    `https://api.korapay.com/merchant/api/v1/charges/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`,
      },
    }
  )

  const data = await res.json()
  const ok = data?.status === "success" && data?.data?.transaction_status === "success"
  return { ok, data }
}

async function getPaypalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
  const secret = process.env.NEXT_PUBLIC_PAYPAL_SECRET!
  const api = process.env.NEXT_PUBLIC_PAYPAL_API!
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64")

  const res = await fetch(`${api}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const data = await res.json()
  if (!res.ok || !data.access_token) {
    throw new Error("Failed to get PayPal access token")
  }

  return data.access_token as string
}

async function capturePaypalOrder(orderID: string) {
  const api = process.env.NEXT_PUBLIC_PAYPAL_API!
  const accessToken = await getPaypalAccessToken()

  const res = await fetch(`${api}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  const data = await res.json()
  const ok = res.ok && (data?.status === "COMPLETED" || data?.status === "APPROVED")
  return { ok, data }
}

async function finalizeDonation(payload: any, providerReference: string, gateway: string) {
  const isRecurringDonation =
    payload.duration === "monthly" ||
    payload.duration === "quarterly" ||
    payload.duration === "annually"

  const donation = {
    name: payload.name,
    email: payload.email || null,
    program: payload.program,
    amount: Number(payload.amount),
    currency: payload.currency || "USD",
    paymentMethod: payload.paymentMethod,
    reference: providerReference,
    message: payload.message,
    donationMode: payload.donationMode,
    duration: payload.duration || "one-time",
    status: "completed",
    gateway,
    reminderToken: payload.reminderToken || generateDonationToken(),
    reminderTokenExpiresAt:
      payload.reminderTokenExpiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    nextDonationDate: isRecurringDonation && payload.nextDonationDate
      ? new Date(payload.nextDonationDate)
      : undefined,
    reminder3Sent: Boolean(payload.reminder3Sent),
    reminder1Sent: Boolean(payload.reminder1Sent),
  }

  const savedDonation = await addRecord("donations", donation)

  const emailTasks: Promise<unknown>[] = []

  if (payload.email) {
    emailTasks.push(
      sendEmail(
        payload.email,
        "Thank You for Your Donation ❤️",
        `
          <h2>Hello ${payload.name || "Valued Supporter"},</h2>
          <p>Thank you for your generous donation to the <b>${payload.program}</b> program.</p>
          <ul>
            <li><b>Amount:</b> ${payload.currency || "USD"} ${payload.amount}</li>
            <li><b>Duration:</b> ${payload.duration || "one-time"}</li>
            <li><b>Payment Method:</b> ${payload.paymentMethod}</li>
            <li><b>Status:</b> Completed</li>
          </ul>
        `
      )
    )
  }

  if (process.env.ADMIN_EMAIL) {
    emailTasks.push(
      sendEmail(
        process.env.ADMIN_EMAIL,
        "🎉 New Donation Received",
        `
          <h2>New Donation Alert</h2>
          <p><b>${payload.name || "Anonymous"}</b> donated <b>${payload.currency || "USD"} ${payload.amount}</b>.</p>
          <p>Program: ${payload.program}</p>
          <p>Gateway: ${gateway}</p>
        `
      )
    )
  }

  await Promise.allSettled(emailTasks)

  return savedDonation
}

async function finalizeSponsorship(payload: any, providerReference: string, gateway: string) {
  if ( !payload.email || !Array.isArray(payload.items) || payload.items.length === 0) {
    throw new Error("Missing required sponsorship fields")
  }

  const dbItems = await getRecords("sponsorItems")
  let computedTotalUSD = 0
  const processedItems = []

  for (const selected of payload.items) {
    const item = dbItems.find((entry: any) => entry.id === selected.id)

    if (!item) {
      throw new Error(`Selected item not found: ${selected.id}`)
    }

    const quantity = Number(selected.quantity || 0)
    if (quantity <= 0) {
      throw new Error(`Invalid quantity for item ${item.name}`)
    }

    const remaining = Math.max((item.totalNeeded || 0) - (item.funded || 0), 0)
    if (quantity > remaining) {
      throw new Error(`${item.name} only has ${remaining} remaining`)
    }

    const itemTotal = Number(item.priceUSD) * quantity
    computedTotalUSD += itemTotal
    processedItems.push({
      itemId: item.id,
      itemName: item.name,
      quantity,
      priceUSD: Number(item.priceUSD),
      totalUSD: itemTotal,
    })
  }

  const sponsorshipId = `SPO-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const sponsorship = await addRecord("sponsorships", {
    id: sponsorshipId,
    sponsorName: payload.name,
    sponsorEmail: payload.email,
    sponsorPhone: payload.sponsorPhone || "",
    company: payload.company || "",
    amount: payload.totalAmount || computedTotalUSD,
    computedTotalUSD,
    currency: payload.currency || "USD",
    paymentMethod: payload.paymentMethod || gateway,
    rateUsed: payload.rateUsed || null,
    items: processedItems,
    status: "completed",
    reference: providerReference,
    gateway,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  for (const sponsoredItem of sponsorship.items || []) {
    const item = dbItems.find((entry: any) => entry.id === sponsoredItem.itemId)
    if (!item) continue

    await updateRecord("sponsorItems", item.id, {
      funded: Number(item.funded || 0) + Number(sponsoredItem.quantity || 0),
    })
  }

  await Promise.allSettled([sendSponsorshipEmail(sponsorship, payload.email)])

  return sponsorship
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ checkoutId: string }> }
) {
  try {
    const { checkoutId } = await params
    const draft = await getCheckoutDraft(checkoutId)

    if (!draft) {
      return NextResponse.json({ error: "Checkout draft not found" }, { status: 404 })
    }

    if (draft.status === "completed") {
      return NextResponse.json({
        success: true,
        redirectUrl: draft.mode === "donation" ? "/support/donate" : "/support/sponsor",
      })
    }

    const body = await request.json()
    const providerReference = String(body.reference || body.orderID || "").trim()

    if (!providerReference) {
      return NextResponse.json({ error: "Missing provider reference" }, { status: 400 })
    }

    let verificationOk = false
    let gateway = draft.provider

    if (draft.provider === "paystack") {
      const verification = await verifyPaystackTransaction(providerReference)
      verificationOk = Boolean(verification.status && verification.data?.status === "success")
      gateway = "paystack"
    } else if (draft.provider === "kora") {
      const verification = await verifyKoraTransaction(providerReference)
      verificationOk = verification.ok
      gateway = "kora"
    } else if (draft.provider === "paypal") {
      const capture = await capturePaypalOrder(providerReference)
      verificationOk = capture.ok
      gateway = "paypal"
    }

    if (!verificationOk) {
      await markCheckoutDraftFailed(checkoutId, "Payment verification failed")
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    if (draft.mode === "donation") {
      await finalizeDonation(draft.payload, providerReference, gateway)
    } else {
      await finalizeSponsorship(draft.payload, providerReference, gateway)
    }

    await markCheckoutDraftCompleted(checkoutId, providerReference)

    return NextResponse.json({
      success: true,
      redirectUrl: draft.mode === "donation" ? "/support/donate" : "/support/sponsor",
    })
  } catch (error) {
    console.error("Finalize checkout draft error:", error)
    return NextResponse.json({ error: "Failed to finalize checkout" }, { status: 500 })
  }
}
