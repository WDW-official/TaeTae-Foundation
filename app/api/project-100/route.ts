import { NextRequest, NextResponse } from "next/server"
import { addRecord, getRecords } from "@/lib/db"
import { uploadToCloudinary } from "@/lib/cloudinary"

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeEmail(value: unknown) {
  return normalizeString(value).toLowerCase()
}

function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const childName = normalizeString(data.childName)
    const dateOfBirth = normalizeString(data.dateOfBirth)
    const schoolAttended = normalizeString(data.schoolAttended)
    const guardianName = normalizeString(data.guardianName)
    const guardianPhone = normalizeString(data.guardianPhone)
    const guardianEmail = normalizeEmail(data.guardianEmail)
    const profilePhotoBase64 = normalizeString(data.profilePhotoBase64)

    if (!childName || !dateOfBirth || !guardianName || !guardianPhone || !guardianEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!isLikelyEmail(guardianEmail)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 })
    }

    const existingApplications = await getRecords("project100Applications")
    const duplicate = existingApplications.find((application: any) => {
      return (
        String(application.childName || "").trim().toLowerCase() === childName.toLowerCase() &&
        String(application.guardianEmail || "").trim().toLowerCase() === guardianEmail &&
        String(application.guardianPhone || "").trim() === guardianPhone &&
        ["new", "reviewed", "converted"].includes(String(application.status || ""))
      )
    })

    if (duplicate) {
      return NextResponse.json(
        { error: "This child has already been submitted for Project 100." },
        { status: 409 }
      )
    }

    let profilePhotoUrl = ""

    if (profilePhotoBase64) {
      if (!profilePhotoBase64.startsWith("data:image/")) {
        return NextResponse.json({ error: "Profile photo must be a valid image." }, { status: 400 })
      }

      const upload = await uploadToCloudinary(profilePhotoBase64, {
        folder: "taetae/project-100/photos",
        resource_type: "image",
        tags: ["project-100", "intake", "profile-photo"],
      })

      profilePhotoUrl = upload.secure_url
    }

    const application = await addRecord("project100Applications", {
      childName,
      dateOfBirth,
      schoolAttended,
      guardianName,
      guardianPhone,
      guardianEmail,
      source: "project-100",
      profilePhotoUrl,
      status: "new",
      notes: "",
    })

    return NextResponse.json({ success: true, application }, { status: 201 })
  } catch (error) {
    console.error("Error creating Project 100 application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = normalizeString(searchParams.get("status"))
    const search = normalizeString(searchParams.get("search")).toLowerCase()

    let applications = await getRecords("project100Applications")

    if (status && status !== "all") {
      applications = applications.filter((application: any) => application.status === status)
    }

    if (search) {
      applications = applications.filter((application: any) => {
        const values = [
          application.childName,
          application.guardianName,
          application.guardianEmail,
          application.guardianPhone,
        ]

        return values.some((value) => String(value || "").toLowerCase().includes(search))
      })
    }

    applications.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ applications, count: applications.length })
  } catch (error) {
    console.error("Error fetching Project 100 applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
