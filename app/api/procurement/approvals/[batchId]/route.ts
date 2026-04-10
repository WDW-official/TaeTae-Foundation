import { NextRequest, NextResponse } from "next/server"
import { decidePurchaseRequest, getProcurementBatchById } from "@/lib/procurement"
import { getSessionFromRequest } from "@/lib/session"
import { sendEmail } from "@/lib/email"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const session = getSessionFromRequest(req)

  if (!session || session.role !== "superAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { batchId } = await params
  const current = await getProcurementBatchById(batchId)

  if (!current) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 })
  }

  const body = await req.json()
  const decision = body.decision === "reject" ? "reject" : "approve"

  try {
    const batch = await decidePurchaseRequest({
      batchId,
      decision,
      actorId: session.id,
      rejectionReason: body.rejectionReason,
    })

    const recipients = [current.assignedVolunteerEmail, process.env.ADMIN_EMAIL].filter(Boolean)
    await Promise.allSettled(
      recipients.map((email) =>
        sendEmail(
          email as string,
          `Procurement request ${batch.id} ${decision === "approve" ? "approved" : "rejected"}`,
          `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Procurement Request Update</h2>
              <p><strong>Batch:</strong> ${batch.id}</p>
              <p><strong>Item:</strong> ${batch.sponsorItemName}</p>
              <p><strong>Quantity:</strong> ${batch.quantity}</p>
              <p><strong>Status:</strong> ${decision === "approve" ? "Approved / Ready for Purchase" : "Rejected"}</p>
              ${decision === "reject" ? `<p><strong>Reason:</strong> ${body.rejectionReason || "Rejected by management"}</p>` : ""}
            </div>
          `
        )
      )
    )

    return NextResponse.json({ success: true, batch })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update approval"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
