"use client"

import Link from "next/link"
import { HandCoins } from "lucide-react"
import { usePathname } from "next/navigation"

export default function FloatingDonateButton() {
  const pathname = usePathname() ?? ""
  const hiddenOnRoute =
    pathname === "/login" ||
    pathname.startsWith("/admin") ||
    pathname === "/support/donate" ||
    pathname.startsWith("/checkout-")

  if (hiddenOnRoute) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-60 flex justify-center px-4 md:inset-x-auto md:right-6 md:bottom-6 md:px-0">
      <div className="donate-rainbow-border pointer-events-auto max-w-52 rounded-full p-0.5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] md:w-auto md:max-w-none">
        <Link
          href="/support/donate"
          className="inline-flex w-full items-center uppercase justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 transition-transform duration-200 hover:scale-[1.02] md:w-auto md:px-6 md:py-3 md:text-sm"
        >
          <HandCoins className="h-4 w-4 transform scale-y-[-1] text-primary md:h-4.5 md:w-4.5" />
          <span>Donate Now</span>
        </Link>
      </div>
    </div>
  )
}
