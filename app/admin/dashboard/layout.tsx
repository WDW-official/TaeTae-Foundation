"use client";

import { ReactNode, useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import MobileTopNavbar from "@/components/mobileTopNavbar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state
  const [isMobile, setIsMobile] = useState(false); // Detect mobile screen size
  const pathname = usePathname();

  // Detect screen size change

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Adjust breakpoint as necessary (e.g., 1024px)
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Listen for resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up listener
    };
  }, []);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  

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
      ${isMobile ? "pt-16 ml-0" : "ml-64"}
    `}
  >
    {/* Mobile Top Navbar */}
    {isMobile && (
      <MobileTopNavbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    )}

    <div className="mx-auto max-w-7xl ">{children}</div>
  </div>
</div>

  );
}
