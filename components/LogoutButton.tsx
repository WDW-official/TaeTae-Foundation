"use client";

import { useAuthStore } from "@/app/store/auth.store";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        useAuthStore.getState().clearAuth()
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex text-red-600  items-center shadow-lg gap-2 px-2 py-1 rounded-lg text-[14px] transition
        ${loading
          ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
        }
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          Logout
        </>
      )}
    </button>
  );
}
