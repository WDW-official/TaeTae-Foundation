"use client";

import { ReactNode, useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import MobileTopNavbar from "@/components/mobileTopNavbar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state
  const pathname = usePathname();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isMessagesPage = pathname.startsWith("/admin/dashboard/messages");
  

  return (
    <div className="flex min-h-screen dark:bg-gray-800">
  {/* Sidebar (drawer on mobile, fixed on desktop) */}
  <Sidebar
    isSidebarOpen={isSidebarOpen}
    setIsSidebarOpen={setIsSidebarOpen}
  />

  {/* Main content area */}
  <div
    className={`
      flex-1 overflow-y-auto transition-all duration-300
      pt-16 ml-0 lg:ml-64 lg:pt-0
      ${isMessagesPage ? "overflow-hidden" : ""}
    `}
  >
    {/* Mobile Top Navbar */}
    <MobileTopNavbar
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    />

    <div className={isMessagesPage ? "mx-auto h-full w-full max-w-none overflow-hidden" : "mx-auto w-full max-w-7xl"}>
      {children}
    </div>
  </div>
</div>

  );
}
