import { type NextRequest, NextResponse } from "next/server"
import { getRecords, deleteRecord } from "@/lib/db"

export async function GET() {
  try {
    const volunteers = await getRecords("volunteers")
    return NextResponse.json({ volunteers })
  } catch (error) {
    console.error(" Error fetching volunteers:", error)
    return NextResponse.json({ error: "Failed to fetch volunteers" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const volunteerId = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing volunteer ID" }, { status: 400 })
    }

    await deleteRecord("volunteers", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(" Error deleting volunteer:", error)
    return NextResponse.json({ error: "Failed to delete volunteer" }, { status: 500 })
  }
}
