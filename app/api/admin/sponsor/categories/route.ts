import { NextRequest, NextResponse } from "next/server"
import { addRecord, getRecords } from "@/lib/db"

export async function POST(req: NextRequest) {
  const data = await req.json()

  if (!data.label) {
    return NextResponse.json({ error: "Label required" }, { status: 400 })
  }

  const category = await addRecord("sponsorCategories", {
    id: `CAT-${Date.now()}`,
    key: data.label.toLowerCase().replace(/\s+/g, "_"),
    label: data.label,
    createdAt: new Date().toISOString(),
  })

  return NextResponse.json({ success: true, category })
}

export async function GET() {
  const categories = await getRecords("sponsorCategories")
  return NextResponse.json({ categories })
}
