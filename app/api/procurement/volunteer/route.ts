import { NextRequest, NextResponse } from "next/server"
import { getProcurementBatches } from "@/lib/procurement"
import { getSessionFromRequest } from "@/lib/session"

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)

  if (!session || session.role !== "volunteer" || !session.volunteerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const status = req.nextUrl.searchParams.get("status")
  const filter: Record<string, unknown> = {
    assignedVolunteerId: session.volunteerId,
  }

  if (status) {
    filter.status = status
  }

  const batches = await getProcurementBatches(filter)
  return NextResponse.json({ batches })
}
