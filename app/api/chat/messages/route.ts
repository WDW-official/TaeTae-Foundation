import { NextRequest, NextResponse } from "next/server"
import {
  addMessage,
  canUsersChat,
  canViewConversation,
  getConversationById,
  listMessages,
  markConversationAsRead,
} from "@/lib/chat"
import { getSessionFromRequest } from "@/lib/session"

function canAccessConversation(userId: string, participantIds: string[]) {
  return participantIds.includes(userId)
}

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const conversationId = req.nextUrl.searchParams.get("conversationId")
  if (!conversationId) {
    return NextResponse.json({ error: "Conversation is required" }, { status: 400 })
  }

  const conversation = await getConversationById(conversationId)
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
  }

  if (!(await canViewConversation(session.id, conversation))) {
    return NextResponse.json({ error: "You are not allowed to access this conversation" }, { status: 403 })
  }

  await markConversationAsRead(conversationId, session.id)
  const messages = await listMessages(conversationId)
  return NextResponse.json({ messages })
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { conversationId, content } = await req.json()
  const trimmedContent = typeof content === "string" ? content.trim() : ""

  if (!conversationId || !trimmedContent) {
    return NextResponse.json({ error: "Conversation and message are required" }, { status: 400 })
  }

  const conversation = await getConversationById(conversationId)
  if (!conversation || !canAccessConversation(session.id, conversation.participantIds)) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
  }

  const otherId = conversation.participantIds.find((id) => id !== session.id)
  if (!otherId || !(await canUsersChat(session.id, otherId))) {
    return NextResponse.json({ error: "You are not allowed to send messages here" }, { status: 403 })
  }

  const sender = conversation.participants.find((participant) => participant.userId === session.id)
  const message = await addMessage({
    conversationId,
    sender: session,
    senderName: sender?.name || session.email,
    content: trimmedContent,
  })

  return NextResponse.json({ message }, { status: 201 })
}
