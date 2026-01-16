import { NextRequest, NextResponse } from "next/server"
import { getRecords, updateRecord } from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { sendApprovalEmail, sendEmail } from "@/lib/email"
import { createUser, findUserByEmail } from "@/lib/auth"

function generateRandomPassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&"
  let pwd = ""
  for (let i = 0; i < length; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)]
  }
  return pwd
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Volunteer ID is required" },
        { status: 400 }
      )
    }

    const body = await request.json()

    /* ---------- FETCH EXISTING ---------- */
    const existingRecords = await getRecords("volunteers", { id })
    const existingVolunteer = existingRecords?.[0]

    if (!existingVolunteer) {
      return NextResponse.json(
        { error: "Volunteer not found" },
        { status: 404 }
      )
    }

    /* ---------- PROFILE IMAGE ---------- */
    let newProfileUrl = existingVolunteer.profile_photo_url

    if (body.profile_photo_base64) {
      const uploaded = await uploadToCloudinary(body.profile_photo_base64, {
        folder: `taetae/volunteers/${existingVolunteer.email}`,
        tags: ["profile", "volunteer"],
      })

      newProfileUrl = uploaded.secure_url
    }

    /* ---------- UPDATE PAYLOAD ---------- */
    const updatePayload: any = {
      ...body,
      profile_photo_url: newProfileUrl,
      updatedAt: new Date().toISOString(),
    }

    delete updatePayload.profile_photo_base64

    /* ---------- UPDATE DB ---------- */
    const updatedVolunteer = await updateRecord(
      "volunteers",
      id,
      updatePayload
    )

    /* ---------- HANDLE APPROVAL (NON-BLOCKING) ---------- */
    const statusBecameApproved =
      body.status === "approved" &&
      existingVolunteer.status !== "approved"

    if (statusBecameApproved) {
      // 🔥 DO NOT BLOCK API RESPONSE
      handleVolunteerApproval(updatedVolunteer).catch(err => {
        console.error("❌ Approval email failed:", err)
      })
    }

    /* ---------- SUCCESS ---------- */
    return NextResponse.json({
      success: true,
      volunteer: updatedVolunteer,
    })
  } catch (error) {
    console.error("❌ PATCH error:", error)
    return NextResponse.json(
      { error: "Failed to update volunteer" },
      { status: 500 }
    )
  }
}

async function handleVolunteerApproval(volunteer: any) {
  try {
    const existingUser = await findUserByEmail(volunteer.email)

    let password: string | undefined = generateRandomPassword()

    if (!existingUser) {
      await createUser(volunteer.email, password, "volunteer", volunteer.id)
    }

    try {
      await sendApprovalEmail(volunteer, password)
    } catch (emailError) {
      console.error("❌ Failed to send approval email:", emailError)
      // DO NOT throw — email is optional
    }

  } catch (error) {
    console.error("❌ Volunteer approval failed:", error)
    // DO NOT throw — approval should never break the request
  }
}



export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

  try {
    const { id } = await params; 
    // Fetch the volunteer record by ID
    const volunteer = await getRecords("volunteers", { id });
    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
    }

    // Return the volunteer record
    return NextResponse.json({ volunteer });
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    return NextResponse.json({ error: "Failed to fetch volunteer" }, { status: 500 });
  }
}
