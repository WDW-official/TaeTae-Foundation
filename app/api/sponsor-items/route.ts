import { NextResponse } from "next/server"
import { getRecords } from "@/lib/db"

export async function GET() {
  try {
    const sections = await getRecords("sponsorSections")
    const items = await getRecords("sponsorItems")

    const activeItems = items.filter((item: any) => item.isActive !== false)

    const grouped: Record<string, any[]> = {
      equipment: [],
      materials: [],
      support: [],
    }

    sections.forEach((section: any) => {
      const sectionItems = activeItems.filter(
        (item: any) => item.sectionId === section.id
      )

      if (!grouped[section.categoryKey]) {
        grouped[section.categoryKey] = []
      }

      grouped[section.categoryKey].push({
        id: section.id,
        title: section.title,
        items: sectionItems,
      })
    })

    return NextResponse.json({ success: true, data: grouped })
  } catch (error) {
    console.error("Get sponsor items error:", error)
    return NextResponse.json(
      { error: "Failed to fetch sponsor items" },
      { status: 500 }
    )
  }
}
