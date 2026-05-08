import { type NextRequest, NextResponse } from "next/server"
import { getRecords, updateRecord, deleteRecord } from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // unwrap the promise

    const boys = await getRecords("boys", { id });

    if (!boys || boys.length === 0) {
      return NextResponse.json({ error: "Boy not found" }, { status: 404 });
    }

    const boy = boys[0];

    // Use the destructured `id` here, not params.id
    const physicalAssessments = await getRecords("physical_assessments", { boy_id: id });
    const cognitiveAssessments = await getRecords("cognitive_assessments", { boy_id: id });
    const skills = await getRecords("boy_skills", { boy_id: id });
    const sessions = await getRecords("skill_sessions", { boy_id: id });
    const media = await getRecords("media", { boyId: id });

    return NextResponse.json({
      success: true,
      boy: {
        ...boy,
        physicalAssessments,
        cognitiveAssessments,
        skills,
        sessions,
        media,
      },
    });
  } catch (error) {
    console.error("Error fetching boy:", error);
    return NextResponse.json({ error: "Failed to fetch boy" }, { status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // unwrap the promise
    const data = await request.json()
    const boys = await getRecords("boys", { id })

    if (!boys || boys.length === 0) {
      return NextResponse.json({ error: "Boy not found" }, { status: 404 })
    }

    if (data.profile_photo_base64) {
      const result = await uploadToCloudinary(data.profile_photo_base64, {
        folder: `taetae/profiles/${id}`,
        tags: ['profile', id, 'admin'],
      })
      data.profile_photo_url = result.secure_url
      delete data.profile_photo_base64
    }

    const updatedBoy = await updateRecord("boys", boys[0]._id.toString(), {
      ...data,
      updatedAt: new Date().toISOString(),
    })

    console.log("✏️ Boy updated:", id)

    return NextResponse.json({ success: true, boy: updatedBoy })
  } catch (error) {
    console.error("Error updating boy:", error)
    return NextResponse.json({ error: "Failed to update boy" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // unwrap the promise
    const boys = await getRecords("boys", { id })

    if (!boys || boys.length === 0) {
      return NextResponse.json({ error: "Boy not found" }, { status: 404 })
    }

    await deleteRecord("boys", boys[0]._id.toString())

    console.log("🗑️ Boy deleted:", id)

    return NextResponse.json({ success: true, message: "Boy deleted" })
  } catch (error) {
    console.error("Error deleting boy:", error)
    return NextResponse.json({ error: "Failed to delete boy" }, { status: 500 })
  }
}
