import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/session"
import { getSponsorshipItemDetail } from "@/lib/procurement"

function isAdminRole(role?: string) {
  return role === "admin" || role === "superAdmin"
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = getSessionFromRequest(req)

  if (!session || !isAdminRole(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { itemId } = await params
  const page = Number(req.nextUrl.searchParams.get("page") || "1")
  const pageSize = Number(req.nextUrl.searchParams.get("pageSize") || "20")

  const detail = await getSponsorshipItemDetail(itemId, page, pageSize)

  if (!detail) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }

  return NextResponse.json(detail)
}
