import { NextRequest, NextResponse } from "next/server"
import {
  archiveConversationForUser,
  canUsersChat,
  createConversation,
  findConversationByParticipants,
  getChatUserById,
  getConversationById,
  listConversationsForUser,
  toParticipant,
  unarchiveConversationForUser,
} from "@/lib/chat"
import { getSessionFromRequest } from "@/lib/session"

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const archived = req.nextUrl.searchParams.get("archived") === "1"
  const conversations = await listConversationsForUser(session.id, archived)
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

export async function PATCH(req: NextRequest) {
  const session = getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { conversationId, archived } = await req.json()

  if (!conversationId || typeof archived !== "boolean") {
    return NextResponse.json({ error: "Conversation and archive state are required" }, { status: 400 })
  }

  const conversation = await getConversationById(conversationId)
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
  }

  if (session.role !== "superAdmin" && !conversation.participantIds.includes(session.id)) {
    return NextResponse.json({ error: "You are not allowed to update this conversation" }, { status: 403 })
  }

  const updatedConversation = archived
    ? await archiveConversationForUser(conversationId, session.id)
    : await unarchiveConversationForUser(conversationId, session.id)

  return NextResponse.json({ conversation: updatedConversation })
}
