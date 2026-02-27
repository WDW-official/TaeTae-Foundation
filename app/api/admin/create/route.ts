import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { createUser } from "@/lib/auth"
import { findUserByEmail } from "@/lib/auth"

export async function POST(req: NextRequest) {
  // 🔐 Auth cookie
  const token = req.cookies.get("auth_token")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 🔐 Verify JWT
  let decoded: any
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  // 🛑 SuperAdmin only
  if (decoded.role !== "superAdmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // 📥 Input
  const { email, password, name, phone } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    )
  }

  // 🔁 Prevent duplicates (optional but safe)
  const exists = await findUserByEmail(email)
  if (exists) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 409 }
    )
  }

  // ✅ CREATE ADMIN — DO NOT HASH HERE
  const admin = await createUser(
    email,
    password,     // ⚠️ plain password
    "admin" ,      // role
    name,          // name
    phone,         // phone
  )

  return NextResponse.json({
    success: true,
    admin: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
  })
}
