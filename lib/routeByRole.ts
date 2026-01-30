import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

type RolePayload = {
  role: "admin" | "superAdmin" | "volunteer" | string
  volunteerId?: string
}

export function routeByRole(
  router: AppRouterInstance,
  data: RolePayload
) {
  switch (data.role) {
    case "admin":
    case "superAdmin":
      router.replace("/admin/dashboard")
      break

    case "volunteer":
      if (!data.volunteerId) {
        throw new Error("Missing volunteerId")
      }
      router.replace(`/volunteer/dashboard/${data.volunteerId}`)
      break

    default:
      throw new Error("Unauthorized account")
  }
}
