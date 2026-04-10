import { NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"
import {
  ProcurementEvidence,
  ProcurementStage,
  canVolunteerManageBatch,
  getProcurementBatchById,
  updateProcurementBatch,
} from "@/lib/procurement"
import { getSessionFromRequest } from "@/lib/session"

const ADMIN_STATUSES: ProcurementStage[] = ["approved", "purchased", "in_transit", "delivered", "distributed", "completed"]
const VOLUNTEER_STATUSES: ProcurementStage[] = ["delivered", "distributed"]

function isAdminRole(role?: string) {
  return role === "admin" || role === "superAdmin"
}

function getFileKind(value: string): "image" | "video" | "document" {
  if (value.startsWith("data:video")) return "video"
  if (value.startsWith("data:image")) return "image"
  return "document"
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const session = getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { batchId } = await params
  const batch = await getProcurementBatchById(batchId)

  if (!batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 })
  }

  const canView =
    isAdminRole(session.role) ||
    (session.role === "volunteer" && canVolunteerManageBatch(batch, session.volunteerId))

  if (!canView) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ batch })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const session = getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { batchId } = await params
  const batch = await getProcurementBatchById(batchId)

  if (!batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 })
  }

  const body = await req.json()
  const requestedStatus = body.status as ProcurementStage | undefined
  const receiptConfirmed = Boolean(body.confirmReceipt)
  const assignedVolunteerId =
    typeof body.assignedVolunteerId === "string" ? body.assignedVolunteerId.trim() : undefined

  if (session.role === "volunteer") {
    if (!canVolunteerManageBatch(batch, session.volunteerId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (requestedStatus && !VOLUNTEER_STATUSES.includes(requestedStatus)) {
      return NextResponse.json({ error: "Volunteers can only update delivery stages" }, { status: 403 })
    }
  } else if (!isAdminRole(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  } else if (requestedStatus && !ADMIN_STATUSES.includes(requestedStatus)) {
    return NextResponse.json({ error: "Invalid status update" }, { status: 400 })
  }

  if (
    session.role !== "volunteer" &&
    requestedStatus === "purchased" &&
    !assignedVolunteerId &&
    !batch.assignedVolunteerId
  ) {
    return NextResponse.json(
      { error: "Assign a volunteer before marking this batch as purchased" },
      { status: 400 }
    )
  }

  const evidence: ProcurementEvidence[] = []
  const filesBase64 = Array.isArray(body.filesBase64) ? body.filesBase64 : []
  const links = Array.isArray(body.links) ? body.links : []

  if ((filesBase64.length > 0 || links.length > 0) && !requestedStatus) {
    return NextResponse.json({ error: "Evidence requires a stage" }, { status: 400 })
  }

  if (filesBase64.length > 0 || links.length > 0) {
    const uploadedFiles = await Promise.all(
      filesBase64.map(async (file: string, index: number) => {
        const kind = getFileKind(file)
        const result = await uploadToCloudinary(file, {
          folder: `taetae/procurement/${batch.id}/${requestedStatus}`,
          resource_type: kind === "video" ? "video" : "auto",
          tags: ["procurement", batch.id, requestedStatus || "evidence"],
        })

        return {
          url: result.secure_url,
          kind,
          label: `${requestedStatus} evidence ${index + 1}`,
        }
      })
    )

    evidence.push({
      id: `${batch.id}-${Date.now()}`,
      stage: requestedStatus!,
      note: body.note,
      files: [
        ...uploadedFiles,
        ...links
          .filter((value: string) => typeof value === "string" && value.trim())
          .map((value: string) => ({
            url: value.trim(),
            kind: "link" as const,
            label: "External proof",
          })),
      ],
      uploadedByUserId: session.id,
      uploadedByRole: session.role,
      createdAt: new Date().toISOString(),
    })
  }

  try {
    const updatedBatch = await updateProcurementBatch(batchId, {
      status: requestedStatus,
      note: body.note,
      evidence,
      receiptConfirmedBy: receiptConfirmed ? session.id : undefined,
      actorId: session.id,
      actorRole: session.role,
      assignedVolunteerId,
    })

    return NextResponse.json({ success: true, batch: updatedBatch })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update batch"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
