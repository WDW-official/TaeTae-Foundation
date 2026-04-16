
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const [isOpenProgram, setIsOpenProgram] = useState(false)
  const [isOpenAbout, setIsOpenAbout] = useState(false)
  const [programOpen, setProgramOpen] = useState(false)
  const pathname = usePathname() ?? ""

  const programLinks = [
    { href: "/programs/project-100", label: "Project 100" },
    { href: "/programs/skills", label: "Skills" },
    { href: "/programs/education", label: "Education" },
    { href: "/programs/sports", label: "Sports" },
  ]

  const aboutLinks = [
    { href: "/about/operation", label: "How We Operate" },
    { href: "/about/the-plan", label: "The Plan" },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  useEffect(() => {
    setIsOpenProgram(false)
    setIsOpenAbout(false)
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
            <img
              src="https://res.cloudinary.com/dzn1k1z8r/image/upload/v1764783363/Tae_Tae_2_a52zrp.svg"
              alt="TaeTae Foundation Logo"
              className="md:h-10 pr-1 h-8 w-auto dark:hidden"
            />

            <img
              src="/Tae-Tae-logo.png"
              alt="TaeTae Foundation Logo"
              className="md:h-10 h-8 pr-1 w-auto hidden dark:block"
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">

            <Link
              href="/"
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-[#8bc97f] transition-colors font-medium relative py-2",
                isActive("/") &&
                  "text-primary dark:text-[#8bc97f] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary dark:after:bg-[#8bc97f]"
              )}
            >
              Home
            </Link>

            {/* ABOUT US */}
            <div className="relative flex items-center gap-1">

              <Link
                href="/about"
                className={cn(
                  "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-[#8bc97f] transition-colors font-medium py-2",
                  pathname.startsWith("/about") &&
                    "text-primary dark:text-[#8bc97f]"
                )}
              >
                About Us
              </Link>

              <button
                onClick={() => setIsOpenAbout(!isOpenAbout)}
                className="p-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-[#8bc97f]"
              >
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform duration-300",
                    isOpenAbout && "rotate-180"
                  )}
                />
              </button>

              {isOpenAbout && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 w-48 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {aboutLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={cn(
                        "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors",
                        pathname === sub.href &&
                          "text-primary dark:text-[#8bc97f]"
                      )}
                      onClick={() => setIsOpenAbout(false)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/support"
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-[#8bc97f] transition-colors font-medium relative py-2",
                isActive("/support") &&
                  "text-primary dark:text-[#8bc97f]"
              )}
            >
              Support
            </Link>

            {/* PROGRAMS */}
            <div className="relative flex items-center gap-1">

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

              <button
                onClick={() => setProgramOpen(!programOpen)}
                className="p-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-[#8bc97f]"
              >
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform duration-300",
                    programOpen && "rotate-180"
                  )}
                />
              </button>

              {programOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 w-44 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {programLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={cn(
                        "block px-4 py-2 text-sm rounded-md transition-colors",
                        pathname === sub.href
                          ? "text-primary dark:text-[#8bc97f] bg-gray-100 dark:bg-gray-700 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                      onClick={() => setProgramOpen(false)}
                    >
                      {sub.label}
                    </Link>
                  ))}

                </div>
              )}
            </div>

            <Link
              href="/contact"
              className={cn(
                "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-[#8bc97f] transition-colors font-medium relative py-2",
                isActive("/contact") &&
                  "text-primary dark:text-[#8bc97f]"
              )}
            >
              Contact Us
            </Link>

            <ThemeToggle />
          </div>

          {/* MOBILE BUTTON */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpenProgram(!isOpenProgram)}
              className="p-2 text-gray-700 dark:text-gray-300"
            >
              {isOpenProgram ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {isOpenProgram && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-3 duration-300">
            <div className="flex flex-col gap-4">

              <Link
                href="/"
                onClick={() => setIsOpenProgram(false)}
                className={cn(
                  "font-medium transition-colors",
                  isActive("/")
                    ? "text-primary dark:text-[#8bc97f]"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                Home
              </Link>

              {/* MOBILE ABOUT */}
              <div className="flex items-center justify-between">
                <Link
                  href="/about"
                  className={cn(
                    "font-medium transition-colors",
                    pathname.startsWith("/about")
                      ? "text-primary dark:text-[#8bc97f]"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  About Us
                </Link>

                <button
                  onClick={() => setIsOpenAbout(!isOpenAbout)}
                >
                  <ChevronDown
                    size={20}
                    className={cn(
                      "transition-transform duration-300",
                      isOpenAbout && "rotate-180"
                    )}
                  />
                </button>
              </div>

              {isOpenAbout && (
                <div className="flex flex-col pl-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {aboutLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsOpenProgram(false)}
                      className="text-gray-600 dark:text-gray-400 text-sm"
                    >
                      • {sub.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* MOBILE PROGRAMS */}
              <div className="flex items-center justify-between">
                <Link
                  href="/programs"
                  className={cn(
                    "font-medium transition-colors",
                    pathname.startsWith("/programs")
                      ? "text-primary dark:text-[#8bc97f]"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  Our Programs
                </Link>

                <button
                  onClick={() => setProgramOpen(!programOpen)}
                >
                  <ChevronDown
                    size={20}
                    className={cn(
                      "transition-transform duration-300",
                      programOpen && "rotate-180"
                    )}
                  />
                </button>
              </div>

              {programOpen && (
                <div className="flex flex-col pl-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {programLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsOpenProgram(false)}
                      className={cn(
                        "text-sm transition-colors",
                        pathname === sub.href
                          ? "text-primary dark:text-[#8bc97f] font-medium"
                          : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-[#8bc97f]"
                      )}
                    >
                      • {sub.label}
                    </Link>
                  ))}

                </div>
              )}

              <Link
                href="/support"
                onClick={() => setIsOpenProgram(false)}
                className={cn(
                  "font-medium transition-colors",
                  isActive("/support")
                    ? "text-primary dark:text-[#8bc97f]"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                Support
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsOpenProgram(false)}
                className={cn(
                  "font-medium transition-colors",
                  isActive("/contact")
                    ? "text-primary dark:text-[#8bc97f]"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                Contact Us
              </Link>

            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
