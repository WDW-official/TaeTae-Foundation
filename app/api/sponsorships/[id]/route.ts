import { NextRequest, NextResponse } from "next/server"
import { deleteRecord, getRecordById, updateRecord } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sponsorship = await getRecordById("sponsorships", id)

    if (!sponsorship) {
      return NextResponse.json({ error: "Sponsorship not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, sponsorship })
  } catch (error) {
    console.error("Get sponsorship by id error:", error)
    return NextResponse.json({ error: "Failed to fetch sponsorship" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const sponsorship = await updateRecord("sponsorships", id, body)

    if (!sponsorship) {
      return NextResponse.json({ error: "Sponsorship not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, sponsorship })
  } catch (error) {
    console.error("Update sponsorship error:", error)
    return NextResponse.json({ error: "Failed to update sponsorship" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = await deleteRecord("sponsorships", id)

    if (!deleted) {
      return NextResponse.json({ error: "Sponsorship not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete sponsorship error:", error)
    return NextResponse.json({ error: "Failed to delete sponsorship" }, { status: 500 })
  }
}
