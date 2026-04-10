import { NextResponse } from "next/server"
import { getCheckoutDraft } from "@/lib/checkout-drafts"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ checkoutId: string }> }
) {
  try {
    const { checkoutId } = await params
    const draft = await getCheckoutDraft(checkoutId)

    if (!draft) {
      return NextResponse.json({ error: "Checkout draft not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, draft })
  } catch (error) {
    console.error("Fetch checkout draft error:", error)
    return NextResponse.json({ error: "Failed to fetch checkout draft" }, { status: 500 })
  }
}
