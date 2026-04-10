import { NextRequest, NextResponse } from "next/server"
import { createPurchaseRequest, getProcurementBatches } from "@/lib/procurement"
import { getSessionFromRequest } from "@/lib/session"
import { sendEmail } from "@/lib/email"

function isAdminRole(role?: string) {
  return role === "admin" || role === "superAdmin"
}

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const status = req.nextUrl.searchParams.get("status")
  const assignedVolunteerId = req.nextUrl.searchParams.get("assignedVolunteerId")

  const filter: Record<string, unknown> = {}
  if (status) filter.status = status

  if (session.role === "volunteer") {
    if (!session.volunteerId) {
      return NextResponse.json({ error: "Volunteer profile missing" }, { status: 403 })
    }
    filter.assignedVolunteerId = session.volunteerId
  } else if (assignedVolunteerId) {
    filter.assignedVolunteerId = assignedVolunteerId
  } else if (!isAdminRole(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const batches = await getProcurementBatches(filter)
  return NextResponse.json({ batches })
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)

  if (!session || !isAdminRole(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const batch = await createPurchaseRequest({
      sponsorItemId: body.sponsorItemId,
      quantity: Number(body.quantity),
      note: body.note,
      requester: {
        id: session.id,
        role: session.role,
      },
    })

    const recipients = [
      process.env.MANAGEMENT_EMAIL,
      process.env.ADMIN_EMAIL,
    ].filter(Boolean)

    await Promise.allSettled(
      recipients.map((email) =>
        sendEmail(
          email as string,
          `Procurement authorization requested for ${batch.id}`,
          `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Procurement Request Awaiting Authorization</h2>
              <p><strong>Batch:</strong> ${batch.id}</p>
              <p><strong>Item:</strong> ${batch.sponsorItemName}</p>
              <p><strong>Quantity:</strong> ${batch.quantity}</p>
              <p><strong>Assigned Volunteer:</strong> ${batch.assignedVolunteerName || "Pending assignment"}</p>
              <p><strong>Requested By:</strong> ${session.role}</p>
              <p><strong>Requested At:</strong> ${new Date(batch.requestedAt).toLocaleString()}</p>
            </div>
          `
        )
      )
    )

    return NextResponse.json({ success: true, batch }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create purchase request"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
