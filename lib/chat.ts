import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import type { SessionRole, SessionUser } from "./session"

export type ChatParticipant = {
  userId: string
  role: SessionRole
  email: string
  name: string
}

export type ChatConversation = {
  _id?: ObjectId
  id: string
  participantIds: string[]
  participants: ChatParticipant[]
  createdAt: string
  updatedAt: string
  lastMessageAt?: string
  lastMessageText?: string
  lastMessageSenderId?: string
  readStates?: ChatReadState[]
  archivedBy?: string[]
}

export type ChatMessage = {
  _id?: ObjectId
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: SessionRole
  content: string
  createdAt: string
}

export type ChatReadState = {
  userId: string
  lastReadAt?: string
}

export type ChatConversationSummary = ChatConversation & {
  unreadCount: number
  isRead: boolean
}

type UserRecord = {
  id: string
  role: SessionRole
  email: string
  name?: string
  volunteerId?: string
  boyId?: string
  canChatWithEveryone?: boolean
  permissions?: {
    chatAll?: boolean
    canChatWithEveryone?: boolean
  }
  chatScope?: string
}

type VolunteerRecord = {
  id: string
  name?: string
  assignedBoys?: string[] | number
  assignedBoyIds?: string[]
  boyIds?: string[]
}

type BoyRecord = {
  id: string
  first_name?: string
  last_name?: string
  volunteerId?: string
  assignedVolunteerId?: string
  mentorVolunteerId?: string
}

function fallbackName(user: UserRecord) {
  return user.name?.trim() || user.email
}

function sortParticipantIds(ids: string[]) {
  return [...ids].sort((a, b) => a.localeCompare(b))
}

function arrayFromUnknown(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
}

function fullNameFromBoy(boy: BoyRecord | null) {
  if (!boy) {
    return ""
  }

  return [boy.first_name, boy.last_name].filter(Boolean).join(" ").trim()
}

function canAdminChatWithEveryone(user: UserRecord | null) {
  if (!user || user.role !== "admin") {
    return false
  }

  return Boolean(
    user.canChatWithEveryone ||
      user.permissions?.chatAll ||
      user.permissions?.canChatWithEveryone ||
      user.chatScope === "all"
  )
}

async function getUserById(userId: string) {
  const users = await getCollection("users")
  return (await users.findOne(
    { id: userId, role: { $in: ["superAdmin", "admin", "volunteer", "boy"] } },
    {
      projection: {
        _id: 0,
        id: 1,
        role: 1,
        email: 1,
        name: 1,
        volunteerId: 1,
        boyId: 1,
        canChatWithEveryone: 1,
        permissions: 1,
        chatScope: 1,
      },
    }
  )) as UserRecord | null
}

async function getSessionUserRecord(userId: string) {
  return getUserById(userId)
}

async function getAllUsers() {
  const users = await getCollection("users")
  return (await users
    .find(
      { role: { $in: ["superAdmin", "admin", "volunteer", "boy"] } },
      {
        projection: {
          _id: 0,
          id: 1,
          role: 1,
          email: 1,
          name: 1,
          volunteerId: 1,
          boyId: 1,
          canChatWithEveryone: 1,
          permissions: 1,
          chatScope: 1,
        },
      }
    )
    .toArray()) as unknown as UserRecord[]
}

async function getVolunteerById(volunteerId?: string) {
  if (!volunteerId) {
    return null
  }

  const volunteers = await getCollection("volunteers")
  return (await volunteers.findOne(
    { id: volunteerId },
    { projection: { _id: 0, id: 1, name: 1, assignedBoys: 1, assignedBoyIds: 1, boyIds: 1 } }
  )) as VolunteerRecord | null
}

async function getBoyById(boyId?: string) {
  if (!boyId) {
    return null
  }

  const boys = await getCollection("boys")
  return (await boys.findOne(
    { id: boyId },
    {
      projection: {
        _id: 0,
        id: 1,
        first_name: 1,
        last_name: 1,
        volunteerId: 1,
        assignedVolunteerId: 1,
        mentorVolunteerId: 1,
      },
    }
  )) as BoyRecord | null
}

function extractAssignedBoyIds(volunteer: VolunteerRecord | null) {
  if (!volunteer) {
    return []
  }

  return Array.from(
    new Set([
      ...arrayFromUnknown(volunteer.assignedBoys),
      ...arrayFromUnknown(volunteer.assignedBoyIds),
      ...arrayFromUnknown(volunteer.boyIds),
    ])
  )
}

function extractAssignedVolunteerId(boy: BoyRecord | null) {
  if (!boy) {
    return null
  }

  return boy.assignedVolunteerId || boy.volunteerId || boy.mentorVolunteerId || null
}

function toPublicParticipant(user: UserRecord, overrideName?: string): ChatParticipant {
  return {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: overrideName?.trim() || fallbackName(user),
  }
}

async function resolveAllowedUserIds(session: SessionUser, userRecord: UserRecord) {
  const allUsers = await getAllUsers()
  const allowed = new Set<string>()

  if (session.role === "superAdmin") {
    for (const user of allUsers) {
      if (user.id !== session.id) {
        allowed.add(user.id)
      }
    }

    return allowed
  }

  if (session.role === "admin") {
    for (const user of allUsers) {
      if (user.id === session.id) {
        continue
      }

      if (user.role === "superAdmin") {
        allowed.add(user.id)
      }
    }

    if (canAdminChatWithEveryone(userRecord)) {
      for (const user of allUsers) {
        if (user.id !== session.id) {
          allowed.add(user.id)
        }
      }
    }

    return allowed
  }

  if (session.role === "volunteer") {
    const volunteer = await getVolunteerById(userRecord.volunteerId || session.volunteerId)
    const assignedBoyIds = new Set(extractAssignedBoyIds(volunteer))

    for (const user of allUsers) {
      if (user.id === session.id) {
        continue
      }

      if (user.role === "superAdmin" || user.role === "admin") {
        allowed.add(user.id)
      }

      if (user.role === "boy" && user.boyId && assignedBoyIds.has(user.boyId)) {
        allowed.add(user.id)
      }
    }

    return allowed
  }

  if (session.role === "boy") {
    const boy = await getBoyById(userRecord.boyId || session.boyId)
    const assignedVolunteerId = extractAssignedVolunteerId(boy)

    for (const user of allUsers) {
      if (user.id === session.id) {
        continue
      }

      if (user.role === "superAdmin") {
        allowed.add(user.id)
      }

      if (user.role === "volunteer" && user.volunteerId && user.volunteerId === assignedVolunteerId) {
        allowed.add(user.id)
      }
    }
  }

  return allowed
}

export async function listChatUsers(currentUserId: string) {
  const currentUser = await getUserById(currentUserId)
  if (!currentUser) {
    return []
  }

  const allowedUserIds = await resolveAllowedUserIds(
    {
      id: currentUser.id,
      role: currentUser.role,
      email: currentUser.email,
      volunteerId: currentUser.volunteerId,
      boyId: currentUser.boyId,
    },
    currentUser
  )

  const users = await getAllUsers()
  const allowedUsers = users.filter((user) => allowedUserIds.has(user.id))
  const contacts: ChatParticipant[] = []

  for (const user of allowedUsers) {
    if (user.role === "volunteer" && user.volunteerId) {
      const volunteer = await getVolunteerById(user.volunteerId)
      contacts.push(toPublicParticipant(user, volunteer?.name))
      continue
    }

    if (user.role === "boy" && user.boyId) {
      const boy = await getBoyById(user.boyId)
      contacts.push(toPublicParticipant(user, fullNameFromBoy(boy)))
      continue
    }

    contacts.push(toPublicParticipant(user))
  }

  return contacts.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getChatUserById(userId: string) {
  const user = await getUserById(userId)
  if (!user) {
    return null
  }

  if (user.role === "volunteer" && user.volunteerId) {
    const volunteer = await getVolunteerById(user.volunteerId)
    return toPublicParticipant(user, volunteer?.name)
  }

  if (user.role === "boy" && user.boyId) {
    const boy = await getBoyById(user.boyId)
    return toPublicParticipant(user, fullNameFromBoy(boy))
  }

  return toPublicParticipant(user)
}

export async function canUsersChat(senderId: string, recipientId: string) {
  const sender = await getUserById(senderId)
  const recipient = await getUserById(recipientId)

  if (!sender || !recipient || sender.id === recipient.id) {
    return false
  }

  const allowedIds = await resolveAllowedUserIds(
    {
      id: sender.id,
      role: sender.role,
      email: sender.email,
      volunteerId: sender.volunteerId,
      boyId: sender.boyId,
    },
    sender
  )

  return allowedIds.has(recipient.id)
}

export function toParticipant(user: SessionUser, name?: string): ChatParticipant {
  return {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: name?.trim() || user.email,
  }
}

export async function findConversationByParticipants(participantIds: string[]) {
  const conversations = await getCollection("chat_conversations")
  const ids = sortParticipantIds(participantIds)

  return (await conversations.findOne({
    participantIds: ids,
  })) as ChatConversation | null
}

export async function createConversation(participants: ChatParticipant[]) {
  const conversations = await getCollection("chat_conversations")
  const now = new Date().toISOString()
  const _id = new ObjectId()
  const participantIds = sortParticipantIds(participants.map((item) => item.userId))

  const conversation: ChatConversation = {
    _id,
    id: _id.toString(),
    participantIds,
    participants,
    createdAt: now,
    updatedAt: now,
    readStates: participants.map((participant) => ({
      userId: participant.userId,
      lastReadAt: now,
    })),
  }

  await conversations.insertOne(conversation)
  return conversation
}

export function isConversationArchivedForUser(conversation: ChatConversation, userId: string) {
  return Array.isArray(conversation.archivedBy) && conversation.archivedBy.includes(userId)
}

function isOversightConversationForUser(
  conversation: ChatConversation,
  userId: string,
  sessionUser: UserRecord | null
) {
  return sessionUser?.role === "superAdmin" && !conversation.participantIds.includes(userId)
}

export async function listConversationsForUser(userId: string, archived = false) {
  const sessionUser = await getSessionUserRecord(userId)
  const conversations = await getCollection("chat_conversations")

  const query =
    sessionUser?.role === "superAdmin"
      ? {}
      : { participantIds: userId }

  const records = (await conversations
    .find(query)
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .toArray()) as ChatConversation[]

  const filtered: ChatConversationSummary[] = []

  for (const conversation of records) {
    const isArchived =
      isOversightConversationForUser(conversation, userId, sessionUser) ||
      isConversationArchivedForUser(conversation, userId)
    if (archived !== isArchived) {
      continue
    }

    const unreadCount = getConversationUnreadCount(conversation, userId)

    if (sessionUser?.role === "superAdmin") {
      filtered.push({
        ...conversation,
        unreadCount,
        isRead: unreadCount === 0,
      })
      continue
    }

    const otherId = conversation.participantIds.find((id) => id !== userId)
    if (!otherId) {
      continue
    }

    if (await canUsersChat(userId, otherId)) {
      filtered.push({
        ...conversation,
        unreadCount,
        isRead: unreadCount === 0,
      })
    }
  }

  return filtered
}

export async function archiveConversationForUser(conversationId: string, userId: string) {
  const conversations = await getCollection("chat_conversations")
  const conversation = await getConversationById(conversationId)

  if (!conversation) {
    return null
  }

  const archivedBy = Array.isArray(conversation.archivedBy) ? conversation.archivedBy : []
  if (archivedBy.includes(userId)) {
    return conversation
  }

  await conversations.updateOne(
    { id: conversationId },
    {
      $set: {
        archivedBy: [...archivedBy, userId],
      },
    }
  )

  return getConversationById(conversationId)
}

export async function unarchiveConversationForUser(conversationId: string, userId: string) {
  const conversations = await getCollection("chat_conversations")
  const conversation = await getConversationById(conversationId)

  if (!conversation) {
    return null
  }

  const archivedBy = Array.isArray(conversation.archivedBy) ? conversation.archivedBy : []
  if (!archivedBy.includes(userId)) {
    return conversation
  }

  await conversations.updateOne(
    { id: conversationId },
    {
      $set: {
        archivedBy: archivedBy.filter((entry) => entry !== userId),
      },
    }
  )

  return getConversationById(conversationId)
}

export async function getConversationById(conversationId: string) {
  const conversations = await getCollection("chat_conversations")
  return (await conversations.findOne({
    id: conversationId,
  })) as ChatConversation | null
}

function getLastReadAt(conversation: ChatConversation, userId: string) {
  return (
    conversation.readStates?.find((state) => state.userId === userId)?.lastReadAt || null
  )
}

export function getConversationUnreadCount(conversation: ChatConversation, userId: string) {
  if (!conversation.lastMessageAt) {
    return 0
  }

  if (conversation.lastMessageSenderId === userId) {
    return 0
  }

  const lastReadAt = getLastReadAt(conversation, userId)
  if (!lastReadAt) {
    return 1
  }

  return new Date(conversation.lastMessageAt).getTime() > new Date(lastReadAt).getTime() ? 1 : 0
}

export async function markConversationAsRead(conversationId: string, userId: string) {
  const conversations = await getCollection("chat_conversations")
  const now = new Date().toISOString()
  const conversation = await getConversationById(conversationId)

  if (!conversation) {
    return null
  }

  const readStates = conversation.readStates ?? []
  const hasState = readStates.some((state) => state.userId === userId)
  const nextReadStates = hasState
    ? readStates.map((state) =>
        state.userId === userId ? { ...state, lastReadAt: now } : state
      )
    : [...readStates, { userId, lastReadAt: now }]

  await conversations.updateOne(
    { id: conversationId },
    {
      $set: {
        readStates: nextReadStates,
      },
    }
  )

  return nextReadStates
}

export async function canViewConversation(userId: string, conversation: ChatConversation) {
  const sessionUser = await getSessionUserRecord(userId)
  if (!sessionUser) {
    return false
  }

  if (sessionUser.role === "superAdmin") {
    return true
  }

  if (!conversation.participantIds.includes(userId)) {
    return false
  }

  const otherId = conversation.participantIds.find((id) => id !== userId)
  if (!otherId) {
    return false
  }

  return canUsersChat(userId, otherId)
}

export async function addMessage(input: {
  conversationId: string
  sender: SessionUser
  senderName: string
  content: string
}) {
  const messages = await getCollection("chat_messages")
  const conversations = await getCollection("chat_conversations")
  const now = new Date().toISOString()
  const _id = new ObjectId()

  const message: ChatMessage = {
    _id,
    id: _id.toString(),
    conversationId: input.conversationId,
    senderId: input.sender.id,
    senderName: input.senderName,
    senderRole: input.sender.role,
    content: input.content,
    createdAt: now,
  }

  const conversation = await getConversationById(input.conversationId)
  const readStates = conversation?.readStates ?? []
  const hasSenderState = readStates.some((state) => state.userId === input.sender.id)
  const nextReadStates = hasSenderState
    ? readStates.map((state) =>
        state.userId === input.sender.id ? { ...state, lastReadAt: now } : state
      )
    : [...readStates, { userId: input.sender.id, lastReadAt: now }]

  await messages.insertOne(message)
  await conversations.updateOne(
    { id: input.conversationId },
    {
      $set: {
        updatedAt: now,
        lastMessageAt: now,
        lastMessageText: input.content,
        lastMessageSenderId: input.sender.id,
        readStates: nextReadStates,
      },
    }
  )

  return message
}

export async function listMessages(conversationId: string) {
  const messages = await getCollection("chat_messages")
  return (await messages
    .find({ conversationId })
    .sort({ createdAt: 1 })
    .toArray()) as ChatMessage[]
}
