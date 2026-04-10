import { NextRequest, NextResponse } from "next/server"
import { getApprovalQueue } from "@/lib/procurement"
import { getSessionFromRequest } from "@/lib/session"

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)

  if (!session || session.role !== "superAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const queue = await getApprovalQueue()
  return NextResponse.json({ queue })
}
