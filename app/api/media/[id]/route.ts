import { type NextRequest, NextResponse } from "next/server"
import { getRecords, deleteRecord } from "@/lib/db"
import { deleteFromCloudinary } from "@/lib/cloudinary"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // unwrap the promise
    const media = await getRecords("media", { id })

    if (!media || media.length === 0) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, media: media[0] })
  } catch (error) {
    console.error("Error fetching media:", error)
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // unwrap the promise
    const media = await getRecords("media", { id })

    if (!media || media.length === 0) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    const mediaItem = media[0]

    await deleteFromCloudinary(mediaItem.publicId)
    await deleteRecord("media", mediaItem._id.toString())

    console.log("🗑️ Media deleted:", id)

    return NextResponse.json({ success: true, message: "Media deleted" })
  } catch (error) {
    console.error("Error deleting media:", error)
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 })
  }
}
