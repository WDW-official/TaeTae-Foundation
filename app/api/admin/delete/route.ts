import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getCollection } from "@/lib/mongodb"

export async function POST(req: NextRequest) {
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

  // 🔒 SuperAdmin ONLY
  if (decoded.role !== "superAdmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { userId } = await req.json()
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  const users = await getCollection("users")

  const user = await users.findOne({ id: userId })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // 🛑 SAFETY RULES
  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "Only admins can be deleted" },
      { status: 400 }
    )
  }

  await users.deleteOne({ id: userId })

  return NextResponse.json({ success: true })
}
