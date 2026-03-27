import { NextRequest, NextResponse } from "next/server"
import { addRecord, getRecords, updateRecord } from "@/lib/db"
import { sendSponsorMatchEmail, sendSponsorshipEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.name || !data.email || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const dbItems = await getRecords("sponsorItems")

    let computedTotalUSD = 0
    const processedItems = []

    for (const selected of data.items) {
      const item = dbItems.find((i: any) => i.id === selected.id)

      if (!item) {
        return NextResponse.json(
          { error: `Selected item not found: ${selected.id}` },
          { status: 400 }
        )
      }

      const quantity = Number(selected.quantity || 0)
      if (quantity <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for item ${item.name}` },
          { status: 400 }
        )
      }

      const remaining = Math.max((item.totalNeeded || 0) - (item.funded || 0), 0)

      if (quantity > remaining) {
        return NextResponse.json(
          { error: `${item.name} only has ${remaining} remaining` },
          { status: 400 }
        )
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
      sponsorName: data.name,
      sponsorEmail: data.email,
      sponsorPhone: data.sponsorPhone || "",
      company: data.company || "",
      amount: data.totalAmount || computedTotalUSD,
      computedTotalUSD,
      currency: data.currency || "USD",
      paymentMethod: data.paymentMethod || "paystack",
      rateUsed: data.rateUsed || null,
      items: processedItems,
      status: data.status || "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    
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

     if (data.boyId && data.status === "active") {
      const boys = await getRecords("boys", { id: data.boyId })
      if (boys && boys.length > 0) {
        await sendSponsorMatchEmail(sponsorship, boys[0])
      }
    } else {
      // Send thank you email
      await sendSponsorshipEmail( sponsorship, data.email)
    }

    

    return NextResponse.json({
      success: true,
      sponsorship,
      sponsorshipId,
      computedTotalUSD,
    })
  } catch (error) {
    console.error("Create sponsorship error:", error)
    return NextResponse.json(
      { error: "Failed to process sponsorship" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const paymentMethod = searchParams.get("paymentMethod")

    let sponsorships = await getRecords("sponsorships")

    if (status) sponsorships = sponsorships.filter((s: any) => s.status === status)
    if (paymentMethod) sponsorships = sponsorships.filter((s: any) => s.paymentMethod === paymentMethod)

    return NextResponse.json({ success: true, sponsorships, count: sponsorships.length })
  } catch (error) {
    console.error("Get sponsorships error:", error)
    return NextResponse.json(
      { error: "Failed to fetch sponsorships" },
      { status: 500 }
    )
  }
}
