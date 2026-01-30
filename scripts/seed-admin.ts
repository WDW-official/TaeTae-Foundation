// scripts/seed-admin.ts
import "dotenv/config"
import { createUser } from "../lib/auth"

async function main() {
  try {
    await createUser("admin@taetae.org", "TaeTae2025", "superAdmin", undefined, true)
    console.log("✅ Super Admin created: admin@taetae.org / TaeTae2025")
  } catch (err: any) {
    console.error("❌ Seed error:", err.message)
  }
}

main().then(() => process.exit(0))
