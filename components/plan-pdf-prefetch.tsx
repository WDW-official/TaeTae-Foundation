"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const PLAN_PDF_URL = "/TaeTae%20Foundation%20-%20Comprehensive%20Plan%202026.pdf"

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => number
    cancelIdleCallback?: (handle: number) => void
  }

export default function PlanPdfPrefetch() {
  const pathname = usePathname() ?? ""

  useEffect(() => {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/checkout-") ||
      pathname === "/login" ||
      pathname === "/about/the-plan"
    ) {
      return
    }

    const browserWindow = window as IdleWindow
    const connection = navigator.connection as
      | {
          saveData?: boolean
          effectiveType?: string
        }
      | undefined

    if (connection?.saveData || connection?.effectiveType === "2g") {
      return
    }

    const controller = new AbortController()

    const warmPlanPdf = () => {
      fetch(PLAN_PDF_URL, {
        method: "GET",
        cache: "force-cache",
        signal: controller.signal,
      }).catch(() => undefined)
    }

    const idleHandle =
      browserWindow.requestIdleCallback?.(() => warmPlanPdf(), { timeout: 2500 }) ??
      window.setTimeout(warmPlanPdf, 1800)

    return () => {
      controller.abort()

      if (browserWindow.cancelIdleCallback && typeof idleHandle === "number") {
        browserWindow.cancelIdleCallback(idleHandle)
      } else {
        window.clearTimeout(idleHandle as number)
      }
    }
  }, [pathname])

  return null
}
