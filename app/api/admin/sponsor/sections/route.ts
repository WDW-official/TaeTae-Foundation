import { NextRequest, NextResponse } from "next/server"
import { addRecord, getRecords } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.title || !data.categoryKey) {
      return NextResponse.json(
        { error: "title and categoryKey are required" },
        { status: 400 }
      )
    }

    const section = await addRecord("sponsorSections", {
      id: `SEC-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: data.title,
      categoryKey: data.categoryKey,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, section })
  } catch (error) {
    console.error("Create section error:", error)
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryKey = searchParams.get("categoryKey")

    let sections = await getRecords("sponsorSections")
    if (categoryKey) {
      sections = sections.filter((s: any) => s.categoryKey === categoryKey)
    }

    return NextResponse.json({ success: true, sections })
  } catch (error) {
    console.error("Get sections error:", error)
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 }
    )
  }
}
