"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function MessageNotificationIndicator({
  className,
}: {
  className?: string
}) {
  const [unreadTotal, setUnreadTotal] = useState(0)

  useEffect(() => {
    let mounted = true

    async function loadUnread() {
      try {
        const res = await fetch("/api/chat/conversations", { cache: "no-store" })
        const data = await res.json()
        if (mounted) {
          setUnreadTotal(Number(data.unreadTotal || 0))
        }
      } catch {
        if (mounted) {
          setUnreadTotal(0)
        }
      }
    }

    loadUnread()
    const timer = window.setInterval(loadUnread, 8000)

    return () => {
      mounted = false
      window.clearInterval(timer)
    }
  }, [])

  if (!unreadTotal) {
    return null
  }

  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white",
        className
      )}
    >
      {unreadTotal > 99 ? "99+" : unreadTotal}
    </span>
  )
}
