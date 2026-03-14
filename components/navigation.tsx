"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [programOpen, setProgramOpen] = useState(false)
  const pathname = usePathname() ?? ""

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/support", label: "Support" },
  ]

  const programLinks = [
    { href: "/programs/skills", label: "SKILLS ACQUISITION" },
    { href: "/programs/education", label: "Education" },
    { href: "/programs/sports", label: "Sports" },
  ]

  // Fixes "home always active" bug
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // Close menu when page changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">

        <div className="flex items-center justify-between h-16 md:h-20">

          {/* LOGO */}
          <Link
            href="/"
            className="flex p-1 rounded-full bg-white border dark:border-white dark:bg-gray-900 items-center"
          >
            {/* Logo for light mode */}
            <img
              src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764783363/Tae_Tae_2_a52zrp.svg"
              alt="TaeTae Foundation Logo"
              className="md:h-10 pr-1 h-8 w-auto dark:hidden"  // This will hide in dark mode
            />
            
            {/* Logo for dark mode */}
            <img
              src="/Tae-Tae-logo.png"
              alt="TaeTae Foundation Logo"
              className="md:h-10 h-8 pr-1 w-auto hidden dark:block"  // This will show only in dark mode
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center gap-8">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-[#8bc97f] transition-colors font-medium relative py-2",
                  isActive(link.href) &&
                    "text-primary dark:text-[#8bc97f] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary dark:after:bg-[#8bc97f]"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* OUR PROGRAMS (desktop) */}
            <div className="relative flex items-center gap-1">

              {/* Clicking TEXT goes to /programs */}
              <Link
                href="/programs"
                className={cn(
                  "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-[#8bc97f] transition-colors font-medium py-2",
                  pathname.startsWith("/programs") &&
                    "text-primary dark:text-[#8bc97f]"
                )}
              >
                Our Programs
              </Link>

              {/* Arrow toggles dropdown ONLY */}
              <button
                onClick={() => setProgramOpen(!programOpen)}
                className="p-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-[#8bc97f]"
              >
                <ChevronDown
                  size={16}
                  className={cn("transition-transform", programOpen && "rotate-180")}
                />
              </button>

              {/* DROPDOWN MENU */}
              {programOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 w-44 py-2 z-50">
                  {programLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={cn(
                        "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors",
                        pathname === sub.href && "text-primary dark:text-[#8bc97f]"
                      )}
                      onClick={() => setProgramOpen(false)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <ThemeToggle />
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 dark:text-gray-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-fade-in-up">
            <div className="flex flex-col gap-4">

              {/* Normal nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-[#8bc97f] transition-colors font-medium",
                    isActive(link.href) && "text-primary dark:text-[#8bc97f]"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* MOBILE OUR PROGRAMS */}
              <div className="flex items-center justify-between">
                <Link
                  href="/programs"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-[#8bc97f] transition-colors font-medium",
                    pathname.startsWith("/programs") && "text-primary dark:text-[#8bc97f]"
                  )}
                >
                  Our Programs
                </Link>

                {/* Arrow toggles submenu */}
                <button
                  onClick={() => setProgramOpen(!programOpen)}
                  className="text-gray-500 dark:text-gray-400"
                >
                  <ChevronDown
                    size={20}
                    className={cn("transition-transform", programOpen && "rotate-180")}
                  />
                </button>
              </div>

              {/* MOBILE SUBLINKS */}
              {programOpen && (
                <div className="flex flex-col pl-4 gap-2 mt-2">
                  {programLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-[#8bc97f] text-sm transition-colors",
                        pathname === sub.href && "text-primary dark:text-[#8bc97f]"
                      )}
                    >
                      • {sub.label}
                    </Link>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
