import { NextRequest, NextResponse } from "next/server"
import {
  CheckoutDraftPayload,
  CheckoutMode,
  CheckoutProvider,
  createCheckoutDraft,
} from "@/lib/checkout-drafts"

function isValidProvider(value: string): value is CheckoutProvider {
  return value === "paystack" || value === "kora" || value === "paypal"
}

function isValidMode(value: string): value is CheckoutMode {
  return value === "donation" || value === "sponsorship"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mode = body.mode as string
    const provider = body.provider as string
    const payload = body.payload as CheckoutDraftPayload | undefined

    if (!isValidMode(mode) || !isValidProvider(provider) || !payload) {
      return NextResponse.json({ error: "Invalid checkout draft payload" }, { status: 400 })
    }

    const draft = await createCheckoutDraft({
      mode,
      provider,
      payload,
    })

    return NextResponse.json({
      success: true,
      checkoutId: draft.id,
      draft,
    })
  } catch (error) {
    console.error("Create checkout draft error:", error)
    return NextResponse.json({ error: "Failed to create checkout draft" }, { status: 500 })
  }
}
