import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "admin" | "superAdmin" | "volunteer" | null

type AuthState = {
  role: UserRole
  volunteerId?: string
  setAuth: (data: { role: UserRole; volunteerId?: string }) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      volunteerId: undefined,

      setAuth: (data) =>
        set({
          role: data.role,
          volunteerId: data.volunteerId,
        }),

      clearAuth: () =>
        set({
          role: null,
          volunteerId: undefined,
        }),
    }),
    {
      name: "auth-store",
    }
  )
)
