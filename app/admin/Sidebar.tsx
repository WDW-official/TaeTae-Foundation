"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  BarChart3,
  Users,
  Heart,
  Handshake,
  UserPlus,
  MessageSquare,
  PackagePlus,
  ShieldCheck,
} from "lucide-react"
import ChangePasswordModal from "@/components/ChangePasswordModal"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import LogoutButton from "@/components/LogoutButton"
import { useAuthStore } from "../store/auth.store"
import { useState } from "react"
import MessageNotificationIndicator from "@/components/chat/message-notification-indicator"

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const pathname = usePathname() ?? ""
  const role = useAuthStore((s) => s.role)
  const [showChangePassword, setShowChangePassword] = useState(false)

  const links = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: BarChart3,
      roles: ["superAdmin"],
    },
    {
      href: "/admin/dashboard/volunteers",
      label: "Volunteers",
      icon: Users,
      roles: ["admin", "superAdmin"],
    },
    {
      href: "/admin/dashboard/boys",
      label: "Boys",
      icon: UserPlus,
      roles: ["admin", "superAdmin"],
    },
    {
      href: "/admin/dashboard/donations",
      label: "Donors",
      icon: Heart,
      roles: ["admin", "superAdmin"],
    },
    {
      href: "/admin/dashboard/sponsors",
      label: "Sponsorships",
      icon: Handshake,
      roles: ["admin", "superAdmin"],
    },
    // {
    //   href: "/admin/dashboard/sponsors/procurement",
    //   label: "Procurement",
    //   icon: PackagePlus,
    //   roles: ["admin", "superAdmin"],
    // },
    // {
    //   href: "/admin/dashboard/sponsors/procurement/approvals",
    //   label: "Approvals",
    //   icon: ShieldCheck,
    //   roles: ["superAdmin"],
    // },
    {
      href: "/admin/dashboard/users",
      label: "Users",
      icon: Users,
      roles: ["superAdmin"],
    },
    {
      href: "/admin/dashboard/messages",
      label: "Messages",
      icon: MessageSquare,
      roles: ["admin", "superAdmin"],
    }
  ]


  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
    
      {/* Floating mobile toggle */}
      <button
        onClick={() => setIsSidebarOpen((v) => !v)}
        aria-label="Toggle sidebar"
        className={cn(
          "fixed left-4 top-4 z-50 lg:hidden",
          "flex h-10 w-10 items-center justify-center",
          "rounded-full dark:bg-gray-800  ",
          "transition hover:bg-[#0A1A1A]/90"
        )}
      >
        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64",
          "bg-[#0A1A1A] text-white shadow-xl",
          "flex flex-col p-6",
          "transition-transform duration-300",
          "lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <Link href="/" className="mb-10 flex items-center gap-2">
          <img
            src="/Tae-Tae-logo.png"
            alt="TaeTae Foundation Logo"
            className="h-8 w-auto"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {links
            .filter((link) => link.roles.includes(role as string))
            .map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            const isMessagesLink = href === "/admin/dashboard/messages"

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary text-black"
                    : "text-gray-300 hover:bg-white/10"
                )}
              >
                <Icon size={18} />
                <span className="flex flex-1 items-center justify-between gap-3">
                  <span>{label}</span>
                  {isMessagesLink ? <MessageNotificationIndicator /> : null}
                </span>
              </Link>
              
            )
          })}
        </nav>
        <div className="flex fixed bottom-0 ml-6 mb-20 left-0 gap-3">
          <ThemeToggle />
  
          <LogoutButton />
        </div>
        
      </aside>
    </>
  )
}
