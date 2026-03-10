// scripts/seed-admin.ts
import { createUser } from "@/lib/auth"
import "dotenv/config"


async function main() {
  try {
    await createUser("webdeveloper@wdwltd.com", "16Opebi", "superAdmin", "Victor", "08130665302" ,undefined, true)
    console.log("✅ Super Admin created: webdeveloper@wdwltd.com / 16Opebi")
  } catch (err: any) {
    console.error("❌ Seed error:", err.message)
  }
}

main().then(() => process.exit(0))
