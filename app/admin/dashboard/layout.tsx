"use client";

import { ReactNode, useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import MobileTopNavbar from "@/components/mobileTopNavbar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state
  const [messagesViewportHeight, setMessagesViewportHeight] = useState<number | null>(null)
  const pathname = usePathname() ?? "";
  const MOBILE_TOPBAR_HEIGHT = 64
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isMessagesPage = pathname.startsWith("/admin/dashboard/messages");

  useEffect(() => {
    if (!isMessagesPage) {
      setMessagesViewportHeight(null)
      return
    }

    const updateMessagesViewport = () => {
      const nextHeight =
        window.innerWidth >= 1024
          ? window.innerHeight
          : Math.max((window.visualViewport?.height ?? window.innerHeight) - MOBILE_TOPBAR_HEIGHT, 0)

      setMessagesViewportHeight(nextHeight)
    }

    updateMessagesViewport()
    window.visualViewport?.addEventListener("resize", updateMessagesViewport)
    window.visualViewport?.addEventListener("scroll", updateMessagesViewport)
    window.addEventListener("resize", updateMessagesViewport)

    return () => {
      window.visualViewport?.removeEventListener("resize", updateMessagesViewport)
      window.visualViewport?.removeEventListener("scroll", updateMessagesViewport)
      window.removeEventListener("resize", updateMessagesViewport)
    }
  }, [isMessagesPage])

  return (
    <div className="flex min-h-svh dark:bg-gray-800">
  {/* Sidebar (drawer on mobile, fixed on desktop) */}
  <Sidebar
    isSidebarOpen={isSidebarOpen}
    setIsSidebarOpen={setIsSidebarOpen}
  />

  {/* Main content area */}
  <div
    className={`
      flex min-h-svh flex-1 flex-col overflow-y-auto transition-all duration-300
      pt-16 ml-0 lg:ml-64 lg:pt-0
      ${isMessagesPage ? "overflow-hidden" : ""}
    `}
  >
    {/* Mobile Top Navbar */}
    <MobileTopNavbar
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    />

    <div
      className={
        isMessagesPage
          ? "mx-auto flex min-h-0 w-full max-w-none flex-1 overflow-hidden"
          : "mx-auto w-full max-w-7xl"
      }
      style={
        isMessagesPage && messagesViewportHeight
          ? { height: `${messagesViewportHeight}px` }
          : undefined
      }
    >
      {children}
    </div>
  </div>
</div>

  );
}
