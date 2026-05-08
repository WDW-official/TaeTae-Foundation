import { type NextRequest, NextResponse } from "next/server"
import { getRecordById, updateRecord, deleteRecord } from "@/lib/db"

/**
 * GET /api/donations/[id]
 * Get a specific donation by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const donation = await getRecordById("donations", id)

    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 })
    }

    return NextResponse.json(donation)
  } catch (error) {
    console.error(" Error fetching donation:", error)
    return NextResponse.json({ error: "Failed to fetch donation" }, { status: 500 })
  }
}

/**
 * PUT /api/donations/[id]
 * Update a donation record (admin only)
 *
 * Body: donation fields to update
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updates = await request.json()
    const updated = await updateRecord("donations", id, updates)

    if (!updated) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error(" Error updating donation:", error)
    return NextResponse.json({ error: "Failed to update donation" }, { status: 500 })
  }
}

/**
 * DELETE /api/donations/[id]
 * Delete a donation record (admin only)
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteRecord("donations", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(" Error deleting donation:", error)
    return NextResponse.json({ error: "Failed to delete donation" }, { status: 500 })
  }
}
