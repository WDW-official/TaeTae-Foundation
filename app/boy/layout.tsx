import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import LogoutButton from "@/components/LogoutButton";
import { MessageSquare } from "lucide-react"
import MessageNotificationIndicator from "@/components/chat/message-notification-indicator"

export default async function VolunteerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /* ----------------------------------
   * AUTH GUARD (SERVER-SIDE)
   * ---------------------------------- */
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    redirect("/login")
  }

  let payload: any
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    redirect("/login")
  }

  // Only volunteers allowed
  if (payload.role !== "boy") {
    redirect("/login")
  }

  /* ----------------------------------
   * UI LAYOUT
   * ---------------------------------- */
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LOGO / HOME */}
          <Link
            href={`/`}
            className="flex items-center gap-2 font-bold md:text-lg text-sm text-foreground"
          >
            <img
                src="/Tae-Tae-logo.png"
                alt="TaeTae Foundation Logo"
                className="md:h-10 h-8 pr-1 w-auto"
            />

          </Link>
            <div className="font-semibold text-2xl">
            My Portal
            </div>

          <div className="flex items-center gap-3">
            <Link
              href="/boy/messages"
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <MessageSquare className="h-4 w-4" />
              Messages
              <MessageNotificationIndicator />
            </Link>

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 py-4">
        {children}
      </main>

      {/* FOOTER (OPTIONAL) */}
      <footer className="border-t dark:bg-gray-900 border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()}  TaeTae Foundation — Volunteer Portal
        </div>
      </footer>
    </div>
  )
}
