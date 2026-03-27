import { NextRequest, NextResponse } from "next/server"
import { addRecord, getRecords, updateRecord } from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (
      !data.name ||
      !data.categoryKey ||
      !data.sectionId ||
      data.priceUSD == null ||
      data.totalNeeded == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const itemId = `ITEM-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    let imageUrls: string[] = []

    if (Array.isArray(data.images_base64)) {
      for (const base64 of data.images_base64) {
          if (!String(base64).startsWith("data:image")) {
          return NextResponse.json(
              { error: "Invalid image format" },
              { status: 400 }
          )
          }

          const result = await uploadToCloudinary(base64, {
          folder: `taetae/sponsor-items/${itemId}`,
          tags: ["sponsor-item", itemId],
          })

          imageUrls.push(result.secure_url)
      }
      }

    const item = await addRecord("sponsorItems", {
      id: itemId,
      name: data.name,
      description: data.description || "",
      images: imageUrls, // ✅ NEW
      icon: imageUrls[0] || "",
      categoryKey: data.categoryKey,
      sectionId: data.sectionId,
      priceUSD: Number(data.priceUSD),
      totalNeeded: Number(data.totalNeeded),
      funded: Number(data.funded || 0),
      unit: data.unit || "",
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error("Create item error:", error)
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryKey = searchParams.get("categoryKey")
    const sectionId = searchParams.get("sectionId")

    let items = await getRecords("sponsorItems")

    if (categoryKey) items = items.filter((i: any) => i.categoryKey === categoryKey)
    if (sectionId) items = items.filter((i: any) => i.sectionId === sectionId)

    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error("Get items error:", error)
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: "Item id is required" }, { status: 400 })
    }

    let updates: Record<string, any> = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.categoryKey !== undefined && { categoryKey: data.categoryKey }),
      ...(data.sectionId !== undefined && { sectionId: data.sectionId }),
      ...(data.priceUSD !== undefined && { priceUSD: Number(data.priceUSD) }),
      ...(data.totalNeeded !== undefined && { totalNeeded: Number(data.totalNeeded) }),
      ...(data.funded !== undefined && { funded: Number(data.funded) }),
      ...(data.unit !== undefined && { unit: data.unit }),
      ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
    }

    if (Array.isArray(data.images_base64)) {
      const imageUrls: string[] = []

      for (const base64 of data.images_base64) {
        if (!String(base64).startsWith("data:image")) {
          return NextResponse.json(
            { error: "Invalid image format" },
            { status: 400 }
          )
        }

        const result = await uploadToCloudinary(base64, {
          folder: `taetae/sponsor-items/${data.id}`,
          tags: ["sponsor-item", data.id],
        })

        imageUrls.push(result.secure_url)
      }

      updates.images = imageUrls
      updates.icon = imageUrls[0] || updates.icon
    }


    const item = await updateRecord("sponsorItems", data.id, updates)

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error("Update item error:", error)
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    )
  }
}
