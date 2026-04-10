// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow login page
  if (pathname === "/login") {
    return NextResponse.next()
  }

  // Protect admin & volunteer routes
  const needsAuth =
    pathname.startsWith("/admin") || pathname.startsWith("/volunteer")

  if (!needsAuth) {
    return NextResponse.next()
  }

  const role = req.cookies.get("role")?.value

  if (pathname === ("/admin/dashboard")) {
    if (role !== "superAdmin") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  if (pathname.startsWith("/admin/dashboard/users")) {
  if (role !== "superAdmin") {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

  if (pathname.startsWith("/admin/dashboard/sponsors/procurement/approvals")) {
    if (role !== "superAdmin") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  const token = req.cookies.get("auth_token")?.value

  // 🔐 Only check presence of cookie here
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // ✅ DO NOT decode or verify JWT in middleware
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/volunteer/:path*"],
}
