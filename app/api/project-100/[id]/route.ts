import { NextRequest, NextResponse } from "next/server"
import { getRecords, updateRecord } from "@/lib/db"

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const applications = await getRecords("project100Applications", { id })

    if (!applications.length) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ application: applications[0] })
  } catch (error) {
    console.error("Error fetching Project 100 application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const applications = await getRecords("project100Applications", { id })

    if (!applications.length) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const currentApplication = applications[0]
    const body = await request.json()
    const nextStatus = normalizeString(body.status) || currentApplication.status

    const updated = await updateRecord(
      "project100Applications",
      currentApplication._id.toString(),
      {
        childName: normalizeString(body.childName),
        dateOfBirth: normalizeString(body.dateOfBirth),
        schoolAttended: normalizeString(body.schoolAttended),
        guardianName: normalizeString(body.guardianName),
        guardianPhone: normalizeString(body.guardianPhone),
        guardianEmail: normalizeString(body.guardianEmail).toLowerCase(),
        notes: typeof body.notes === "string" ? body.notes : "",
        status: nextStatus,
        reviewedAt:
          nextStatus === "reviewed"
            ? new Date().toISOString()
            : currentApplication.reviewedAt,
      }
    )

    return NextResponse.json({ success: true, application: updated })
  } catch (error) {
    console.error("Error updating Project 100 application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}
