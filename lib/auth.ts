import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"

export type UserRole = "superAdmin" | "admin" | "volunteer" | "boy"

export interface User {
  _id?: ObjectId
  id: string
  email: string
  password: string // hashed
  role: UserRole
  name?: string
  boyId?: string
  phone?: string
  resetOTP?: string
  volunteerId?: string
  resetExpiry?: number
  createdAt: string
}

export async function findUserByEmail(email: string) {
  const users = await getCollection("users")
  return users.findOne({ email })
}

export async function createUser(
  email: string,
  password: string,
  role: UserRole,
  name?: string,
  phone?: string,
  volunteerId?: string,
  boyId?: string,
  allowSuperAdmin = false
) {
  console.log("DEBUG createUser:", { email, password, role, boyId })
  if (role === "superAdmin" && !allowSuperAdmin) {
    throw new Error("Unauthorized to create superAdmin")
  }

  const users = await getCollection("users")

  // Only enforce unique email for non-boy roles
  if (role !== "boy") {
    const exists = await users.findOne({ email })
    if (exists) throw new Error("User already exists")
  }

  const hashed = bcrypt.hashSync(password, 10)
  const newId = new ObjectId()

  const user: User = {
    _id: newId,
    id: newId.toString(),
    email,
    password: hashed,
    role,
    name,
    phone,
    volunteerId,
    boyId,
    createdAt: new Date().toISOString(),
  }

  await users.insertOne(user)
  return user
}

export async function setResetOTP(email: string, otp: string) {
  const users = await getCollection("users")
  return users.updateOne(
    { email },
    {
      $set: {
        resetOTP: otp,
        resetExpiry: Date.now() + 5 * 60 * 1000,
      },
    }
  )
}

export async function verifyOTP(email: string, otp: string) {
  const users = await getCollection("users")
  return users.findOne({
    email,
    resetOTP: otp,
    resetExpiry: { $gt: Date.now() },
  })
}

export async function updatePassword(email: string, newHashedPassword: string) {
  const users = await getCollection("users")
  return users.updateOne(
    { email },
    {
      $set: { password: newHashedPassword },
      $unset: { resetOTP: "", resetExpiry: "" },
    }
  )
}
