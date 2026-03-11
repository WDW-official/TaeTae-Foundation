// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { findUserByEmail } from "@/lib/auth"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const user = await findUserByEmail(email)
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const valid = bcrypt.compareSync(password, user.password)
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      volunteerId: user.volunteerId,
      boyId: user.boyId,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" }
  )

  const res = NextResponse.json({
    success: true,
    role: user.role,
    id: user.id,
    volunteerId: user.volunteerId,
    boyId: user.boyId,
  })

  // 🔐 Auth token (already correct)
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  })

  // 🔥 ADD THIS — ROLE COOKIE (THIS IS WHAT YOU WERE MISSING)
  res.cookies.set("role", user.role, {
    httpOnly: true,
    maxAge: 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  })

  // (Optional but recommended for volunteer routes)
  if (user.volunteerId) {
    res.cookies.set("volunteerId", user.volunteerId, {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })
  }
  if (user.boyId) {
    res.cookies.set("boyId", user.boyId, {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })
  }

  return res
}
