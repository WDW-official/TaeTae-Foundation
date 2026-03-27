import { NextRequest, NextResponse } from "next/server"
import { getRecords, updateRecord } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.sponsorshipId) {
      return NextResponse.json(
        { error: "sponsorshipId is required" },
        { status: 400 }
      )
    }

    const sponsorships = await getRecords("sponsorships", { id: data.sponsorshipId })
    const sponsorship = sponsorships[0]

    if (!sponsorship) {
      return NextResponse.json({ error: "Sponsorship not found" }, { status: 404 })
    }

    if (sponsorship.status === "paid") {
      return NextResponse.json({ success: true, message: "Already processed" })
    }

    const dbItems = await getRecords("sponsorItems")

    for (const sponsoredItem of sponsorship.items || []) {
      const item = dbItems.find((i: any) => i.id === sponsoredItem.itemId)

      if (!item) {
        return NextResponse.json(
          { error: `Item not found: ${sponsoredItem.itemId}` },
          { status: 400 }
        )
      }

      const currentFunded = Number(item.funded || 0)
      const totalNeeded = Number(item.totalNeeded || 0)
      const quantity = Number(sponsoredItem.quantity || 0)

      if (currentFunded + quantity > totalNeeded) {
        return NextResponse.json(
          {
            error: `Overfunding prevented for ${item.name}. Remaining: ${Math.max(totalNeeded - currentFunded, 0)}`,
          },
          { status: 400 }
        )
      }

      await updateRecord("sponsorItems", item.id, {
        funded: currentFunded + quantity,
      })
    }

    const updatedSponsorship = await updateRecord("sponsorships", sponsorship.id, {
      status: "paid",
      reference: data.reference || sponsorship.reference || "",
    })

    return NextResponse.json({
      success: true,
      sponsorship: updatedSponsorship,
    })
  } catch (error) {
    console.error("Sponsorship success route error:", error)
    return NextResponse.json(
      { error: "Failed to finalize sponsorship" },
      { status: 500 }
    )
  }
}
