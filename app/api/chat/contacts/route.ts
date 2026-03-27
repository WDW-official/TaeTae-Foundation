import { NextRequest, NextResponse } from "next/server"
import { listChatUsers } from "@/lib/chat"
import { getSessionFromRequest } from "@/lib/session"

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const contacts = await listChatUsers(session.id)
  return NextResponse.json({ contacts })
}
