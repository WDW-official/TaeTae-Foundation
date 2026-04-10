import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ApprovalQueue from "@/components/procurement/approval-queue"
import { verifyAuthToken } from "@/lib/session"

export default async function ProcurementApprovalsPage() {
  const cookieStore = await cookies()
  const session = verifyAuthToken(cookieStore.get("auth_token")?.value)

  if (!session || session.role !== "superAdmin") {
    redirect("/login")
  }

  return <ApprovalQueue />
}
