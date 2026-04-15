// scripts/seed-admin.ts
import "dotenv/config"
import { createUser } from "@/lib/auth"


async function main() {
  try {
    await createUser("info@taetaefoundation.org", "16Opebi", "superAdmin", "TaeTae", "09040000551" ,undefined, undefined, true)
    console.log("✅ Super Admin created: info@taetaefoundation.org / 16Opebi")
  } catch (err: any) {
    console.error("❌ Seed error:", err.message)
  }
}

main().then(() => process.exit(0))
