import { NextRequest, NextResponse } from "next/server"
import { aggregateSponsorshipItems, getApprovalQueue, getProcurementBatches } from "@/lib/procurement"
import { getSessionFromRequest } from "@/lib/session"

function isAdminRole(role?: string) {
  return role === "admin" || role === "superAdmin"
}

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)

  if (!session || !isAdminRole(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [items, approvalQueue, batches] = await Promise.all([
    aggregateSponsorshipItems(),
    getApprovalQueue(),
    getProcurementBatches(),
  ])

  const queue = items.filter((item) => item.availableForProcurement > 0)
  const counters = {
    totalItems: items.length,
    dueForProcurement: items.filter((item) => item.status === "due_for_procurement").length,
    awaitingAuthorization: approvalQueue.length,
    activeBatches: batches.filter((batch) =>
      ["approved", "purchased", "in_transit", "delivered"].includes(batch.status)
    ).length,
    distributedBatches: batches.filter((batch) => batch.status === "distributed").length,
  }

  return NextResponse.json({
    items,
    queue,
    approvalQueue,
    counters,
  })
}
