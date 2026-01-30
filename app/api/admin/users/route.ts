import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getCollection } from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let decoded: any
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  // 🔒 SUPER ADMIN ONLY
  if (decoded.role !== "superAdmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const users = await getCollection("users")

  // ✅ ONLY ADMIN & SUPERADMIN
  const list = await users
    .find(
      { role: { $in: ["admin", "superAdmin"] } }, // 🔥 FILTER HERE
      { projection: { password: 0 } }
    )
    .sort({ createdAt: -1 })
    .toArray()

  return NextResponse.json(list)
}
