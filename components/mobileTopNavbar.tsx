import { Menu, X, Sun, Moon } from "lucide-react"
import LogoutButton from "@/components/LogoutButton"
import { ThemeToggle } from "./theme-toggle"

export default function MobileTopNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-40 lg:hidden
        h-16 border-b border-border
        dark:bg-gray-900 backdrop-blur
        flex items-center justify-between px-4
      "
    >
      {/* Left: menu toggle */}
      {/* <button
        onClick={() => setIsSidebarOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button> */}
      <div></div>

      {/* Right: actions */}
      <div className="flex gap-3">
        <ThemeToggle />

        <LogoutButton />
      </div>
    </header>
  )
}
