import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

export type SessionRole = "superAdmin" | "admin" | "volunteer" | "boy"

export type SessionUser = {
  id: string
  role: SessionRole
  email: string
  volunteerId?: string
  boyId?: string
}

export function verifyAuthToken(token?: string | null): SessionUser | null {
  if (!token) {
    return null
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as SessionUser
  } catch {
    return null
  }
}

export function getSessionFromRequest(req: NextRequest): SessionUser | null {
  return verifyAuthToken(req.cookies.get("auth_token")?.value)
}
