"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  Check,
  ChevronDown,
  Loader2,
  MessageSquare,
  Search,
  Send,
  Shield,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type SessionUser = {
  id: string
  role: string
  email: string
}

type ChatParticipant = {
  userId: string
  role: string
  email: string
  name: string
}

type ChatConversation = {
  id: string
  participantIds: string[]
  participants: ChatParticipant[]
  updatedAt: string
  lastMessageAt?: string
  lastMessageText?: string
  unreadCount?: number
  isRead?: boolean
  readStates?: {
    userId: string
    lastReadAt?: string
  }[]
}

type ChatMessage = {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  content: string
  createdAt: string
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function prettyTime(value?: string) {
  if (!value) {
    return ""
  }

  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true })
  } catch {
    return ""
  }
}

export default function ChatShell({
  basePath,
  title,
}: {
  basePath: string
  title: string
}) {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null)
  const [contacts, setContacts] = useState<ChatParticipant[]>([])
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [contactPickerOpen, setContactPickerOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const previousMessageSignatureRef = useRef("")
  const shouldAutoScrollRef = useRef(true)

  const selectedConversation = useMemo(
    () => conversations.find((item) => item.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  )

  const isTrackingConversation =
    Boolean(currentUser && selectedConversation) &&
    !selectedConversation?.participantIds.includes(currentUser!.id)

  const selectedContact = useMemo(() => {
    if (!selectedConversation || !currentUser) {
      return null
    }

    if (isTrackingConversation) {
      return null
    }

    return (
      selectedConversation.participants.find(
        (participant) => participant.userId !== currentUser.id
      ) ?? null
    )
  }, [currentUser, isTrackingConversation, selectedConversation])

  const conversationLabel = useMemo(() => {
    if (!selectedConversation) {
      return ""
    }

    if (isTrackingConversation) {
      return selectedConversation.participants.map((participant) => participant.name).join(" and ")
    }

    return selectedContact?.name || ""
  }, [isTrackingConversation, selectedContact, selectedConversation])

  const conversationRoleLabel = useMemo(() => {
    if (!selectedConversation) {
      return ""
    }

    if (isTrackingConversation) {
      return selectedConversation.participants.map((participant) => participant.role).join(" to ")
    }

    return selectedContact?.role || ""
  }, [isTrackingConversation, selectedContact, selectedConversation])

  const recipientLastReadAt = useMemo(() => {
    if (!selectedConversation || !currentUser || isTrackingConversation) {
      return null
    }

    const otherParticipant = selectedConversation.participants.find(
      (participant) => participant.userId !== currentUser.id
    )

    if (!otherParticipant) {
      return null
    }

    return (
      selectedConversation.readStates?.find(
        (state) => state.userId === otherParticipant.userId
      )?.lastReadAt || null
    )
  }, [currentUser, isTrackingConversation, selectedConversation])

  async function loadCurrentUser() {
    const res = await fetch("/api/auth/me", { cache: "no-store" })
    const data = await res.json()
    if (data.user) {
      setCurrentUser(data.user)
    }
  }

  async function loadContacts() {
    const res = await fetch("/api/chat/contacts", { cache: "no-store" })
    const data = await res.json()
    setContacts(data.contacts ?? [])
  }

  async function loadConversations(preferredConversationId?: string) {
    const res = await fetch("/api/chat/conversations", { cache: "no-store" })
    const data = await res.json()
    const nextConversations: ChatConversation[] = data.conversations ?? []
    setConversations(nextConversations)

    setSelectedConversationId((current) => {
      if (
        preferredConversationId &&
        nextConversations.some((item) => item.id === preferredConversationId)
      ) {
        return preferredConversationId
      }

      if (current && nextConversations.some((item) => item.id === current)) {
        return current
      }

      return nextConversations[0]?.id ?? ""
    })
  }

  async function loadMessages(conversationId: string) {
    const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`, {
      cache: "no-store",
    })
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Unable to load messages")
    }

    const nextMessages: ChatMessage[] = data.messages ?? []
    const nextSignature = JSON.stringify(
      nextMessages.map((message) => [message.id, message.createdAt, message.content])
    )

    shouldAutoScrollRef.current =
      previousMessageSignatureRef.current !== "" &&
      previousMessageSignatureRef.current !== nextSignature

    previousMessageSignatureRef.current = nextSignature
    setMessages(nextMessages)
  }

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        setLoading(true)
        await Promise.all([loadCurrentUser(), loadContacts(), loadConversations()])
      } catch {
        if (!cancelled) {
          setError("We couldn't load your messages right now.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([])
      return
    }

    loadMessages(selectedConversationId).catch((err) => {
      setError(err instanceof Error ? err.message : "We couldn't refresh this conversation.")
    })
  }, [selectedConversationId])

  useEffect(() => {
    const conversationTimer = window.setInterval(() => {
      loadConversations().catch(() => undefined)
      loadContacts().catch(() => undefined)
    }, 8000)

    return () => window.clearInterval(conversationTimer)
  }, [])

  useEffect(() => {
    if (!selectedConversationId) {
      return
    }

    const messageTimer = window.setInterval(() => {
      loadMessages(selectedConversationId).catch(() => undefined)
    }, 4000)

    return () => window.clearInterval(messageTimer)
  }, [selectedConversationId])

  useEffect(() => {
    if (!messages.length) {
      return
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: shouldAutoScrollRef.current ? "smooth" : "auto",
    })
  }, [messages, selectedConversationId])

  async function startConversation(contact: ChatParticipant) {
    setError("")

    try {
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: contact.userId }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Unable to open conversation")
      }

      const nextId = data.conversation.id as string
      setContactPickerOpen(false)
      shouldAutoScrollRef.current = true
      setSelectedConversationId(nextId)
      await loadConversations(nextId)
      await loadMessages(nextId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to open conversation")
    }
  }

  async function sendMessage() {
    if (!selectedConversationId || !draft.trim() || sending) {
      return
    }

    setSending(true)
    setError("")

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          content: draft,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Unable to send message")
      }

      setDraft("")
      shouldAutoScrollRef.current = true
      await loadMessages(selectedConversationId)
      await loadConversations(selectedConversationId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send message")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading chat...
        </div>
      </div>
    )
  }

  return (
    <section className="h-[calc(100vh-7rem)] min-h-[720px]">
      <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(circle_at_top,_rgba(139,201,127,0.18),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.95),_rgba(248,250,252,0.98))] shadow-xl dark:bg-[radial-gradient(circle_at_top,_rgba(139,201,127,0.12),_transparent_30%),linear-gradient(180deg,_rgba(17,24,39,0.98),_rgba(3,7,18,0.98))]">
        <div className="border-b border-border/70 px-5 py-5 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/15 p-3 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Secure, permission-based messaging across the foundation.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{currentUser?.email}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 capitalize">
                  <Shield className="h-3.5 w-3.5" />
                  {currentUser?.role}
                </span>
                <Link href={basePath} className="text-primary hover:underline">
                  Refresh
                </Link>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-3 lg:max-w-xl lg:items-end">
              <Popover open={contactPickerOpen} onOpenChange={setContactPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-2xl px-4 lg:w-[320px]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Start a conversation
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[320px] p-0">
                  <Command>
                    <CommandInput placeholder="Search people..." />
                    <CommandList>
                      <CommandEmpty>No available users found.</CommandEmpty>
                      {contacts.map((contact) => (
                        <CommandItem
                          key={contact.userId}
                          value={`${contact.name} ${contact.role} ${contact.email}`}
                          onSelect={() => startConversation(contact)}
                          className="px-3 py-3"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{initials(contact.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">{contact.name}</div>
                            <div className="truncate text-xs uppercase tracking-wide text-muted-foreground">
                              {contact.role}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex w-full gap-2 overflow-x-auto pb-1 lg:justify-end">
                {conversations.length === 0 ? (
                  <div className="rounded-full border border-dashed border-border px-4 py-2 text-sm text-muted-foreground">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conversation) => {
                    const displayName = conversation.participantIds.includes(currentUser?.id || "")
                      ? (
                          conversation.participants.find(
                            (participant) => participant.userId !== currentUser?.id
                          ) ?? conversation.participants[0]
                        ).name
                      : conversation.participants.map((participant) => participant.name).join(" and ")

                    const active = conversation.id === selectedConversationId

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversationId(conversation.id)}
                        className={cn(
                          "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm transition",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background/80 hover:border-primary/40 hover:bg-muted"
                        )}
                        >
                        <Avatar className="h-7 w-7">
                          <AvatarFallback>{initials(displayName)}</AvatarFallback>
                        </Avatar>
                        <span className="max-w-40 truncate">{displayName}</span>
                        {conversation.unreadCount ? (
                          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
                            {conversation.unreadCount}
                          </span>
                        ) : null}
                        {active ? <Check className="h-3.5 w-3.5" /> : null}
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mx-5 mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:mx-8">
            {error}
          </div>
        ) : null}

        {selectedConversation ? (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4 md:px-8">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback>{initials(conversationLabel)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground">{conversationLabel}</div>
                  <div className="text-sm capitalize text-muted-foreground">
                    {conversationRoleLabel}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>
                  {isTrackingConversation
                    ? "Super admin oversight"
                    : selectedContact?.email}
                </div>
                <div>
                  {selectedConversation.lastMessageAt
                    ? `Last active ${prettyTime(selectedConversation.lastMessageAt)}`
                    : "Conversation ready"}
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 px-5 py-5 md:px-8">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="flex min-h-[320px] items-center justify-center rounded-[2rem] border border-dashed border-border bg-background/50 px-6 text-center text-sm text-muted-foreground">
                    Start the conversation. Only allowed users appear in your search list.
                  </div>
                ) : (
                  messages.map((message) => {
                    const ownMessage = message.senderId === currentUser?.id

                    return (
                      <div
                        key={message.id}
                        className={cn("flex", ownMessage ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-[1.75rem] px-4 py-3 shadow-sm md:max-w-[70%]",
                            ownMessage
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-background/90 text-foreground"
                          )}
                        >
                          <div className="mb-1 text-xs font-medium opacity-80">
                            {ownMessage ? "You" : message.senderName}
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                          <div className="mt-2 text-[11px] opacity-70">
                            {prettyTime(message.createdAt)}
                            {ownMessage && !isTrackingConversation ? (
                              <span className="ml-2">
                                {recipientLastReadAt &&
                                new Date(recipientLastReadAt).getTime() >=
                                  new Date(message.createdAt).getTime()
                                  ? "Read"
                                  : "Delivered"}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-border/70 bg-background/70 px-5 py-4 md:px-8">
              {isTrackingConversation ? (
                <div className="mb-3 rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                  You are viewing this thread as super admin. To reply, start a direct chat with either participant.
                </div>
              ) : null}
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder={
                    isTrackingConversation
                      ? "Super admin tracking mode is read-only for this thread"
                      : `Message ${selectedContact?.name}...`
                  }
                  className="min-h-24 resize-none rounded-3xl border-border bg-background/95 px-4 py-3"
                  disabled={isTrackingConversation}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!draft.trim() || sending || isTrackingConversation}
                  className="h-12 rounded-2xl px-5"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <div className="max-w-lg space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Pick someone to chat with</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Use the search dropdown above to find an allowed contact. This page is your full
                chat workspace, and the conversation will open right here.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
