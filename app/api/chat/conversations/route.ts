import { NextRequest, NextResponse } from "next/server"
import {
  canUsersChat,
  createConversation,
  findConversationByParticipants,
  getChatUserById,
  listConversationsForUser,
  toParticipant,
} from "@/lib/chat"
import { getSessionFromRequest } from "@/lib/session"

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const conversations = await listConversationsForUser(session.id)
  const unreadTotal = conversations.reduce(
    (sum, conversation) => sum + (conversation.unreadCount || 0),
    0
  )
  return NextResponse.json({ conversations, unreadTotal })
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { recipientId } = await req.json()

  if (!recipientId || recipientId === session.id) {
    return NextResponse.json({ error: "Invalid recipient" }, { status: 400 })
  }

  const recipient = await getChatUserById(recipientId)
  const currentUser = await getChatUserById(session.id)

  if (!recipient) {
    return NextResponse.json({ error: "Recipient not found" }, { status: 404 })
  }

  const allowed = await canUsersChat(session.id, recipientId)
  if (!allowed) {
    return NextResponse.json({ error: "You are not allowed to chat with this user" }, { status: 403 })
  }

  const existing = await findConversationByParticipants([session.id, recipientId])
  if (existing) {
    return NextResponse.json({ conversation: existing })
  }

  const conversation = await createConversation([
    currentUser || toParticipant(session),
    recipient,
  ])

  return NextResponse.json({ conversation }, { status: 201 })
}
