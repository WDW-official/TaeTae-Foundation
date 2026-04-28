"use client"

import { useEffect } from "react"
import { toast } from "react-toastify"

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"])

const HTTP_ERROR_LABELS: Record<number, string> = {
  400: "Validation error",
  401: "Authentication failed",
  403: "Permission denied",
  404: "Not found",
  408: "Request timed out",
  409: "Conflict",
  422: "Invalid request",
  429: "Too many requests",
}

function getRequestMethod(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.method) return init.method.toUpperCase()
  if (input instanceof Request) return input.method.toUpperCase()
  return "GET"
}

function getRequestUrl(input: RequestInfo | URL) {
  if (input instanceof Request) return input.url
  return input.toString()
}

function isApiRequest(input: RequestInfo | URL) {
  if (typeof window === "undefined") return false

  try {
    const url = new URL(getRequestUrl(input), window.location.origin)
    return url.origin === window.location.origin && url.pathname.startsWith("/api/")
  } catch {
    return false
  }
}

function getMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback

  const data = payload as Record<string, unknown>
  const message = data.message || data.error || data.details

  return typeof message === "string" && message.trim() ? message : fallback
}

function getPayloadMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") return null

  const data = payload as Record<string, unknown>
  const message = data.message || data.error || data.details

  if (typeof message === "string" && message.trim()) return message

  if (Array.isArray(data.errors)) {
    const messages = data.errors
      .map((error) => {
        if (typeof error === "string") return error
        if (error && typeof error === "object" && "message" in error) {
          const nestedMessage = (error as { message?: unknown }).message
          return typeof nestedMessage === "string" ? nestedMessage : null
        }
        return null
      })
      .filter(Boolean)

    if (messages.length > 0) return messages.join(", ")
  }

  return null
}

async function readResponsePayload(response: Response) {
  const contentType = response.headers.get("content-type") || ""

  if (!contentType.includes("application/json")) return null

  try {
    return await response.clone().json()
  } catch {
    return null
  }
}

function getErrorLabel(status: number) {
  if (HTTP_ERROR_LABELS[status]) return HTTP_ERROR_LABELS[status]
  if (status >= 500) return "Server error"
  if (status >= 400) return "Request failed"

  return "Unexpected response"
}

function getErrorMessage(response: Response, payload: unknown) {
  const label = getErrorLabel(response.status)
  const detail = getPayloadMessage(payload) || response.statusText || "The server could not complete this request."

  return `${label} (${response.status}): ${detail}`
}

function getNetworkErrorMessage(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Request cancelled: The operation was stopped before it finished."
  }

  if (error instanceof TypeError) {
    return "Network error: Could not reach the server. Check your internet connection and try again."
  }

  if (error instanceof Error && error.message.trim()) {
    return `Unexpected error: ${error.message}`
  }

  return "Unexpected error: The request could not be completed."
}

function getSuccessFallback(method: string) {
  switch (method) {
    case "POST":
      return "Saved successfully."
    case "PUT":
    case "PATCH":
      return "Updated successfully."
    case "DELETE":
      return "Deleted successfully."
    default:
      return "Request completed successfully."
  }
}

export default function ApiToastProvider() {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window)

    window.fetch = async (input, init) => {
      const shouldToast = isApiRequest(input)
      const method = getRequestMethod(input, init)

      try {
        const response = await originalFetch(input, init)

        if (!shouldToast) return response

        const payload = await readResponsePayload(response)
        const toastId = `${method}:${getRequestUrl(input)}:${response.status}`

        if (!response.ok) {
          toast.error(getErrorMessage(response, payload), { toastId: `error:${toastId}` })
        } else if (MUTATING_METHODS.has(method)) {
          toast.success(getMessage(payload, getSuccessFallback(method)), {
            toastId: `success:${toastId}`,
          })
        }

        return response
      } catch (error) {
        if (shouldToast) {
          toast.error(getNetworkErrorMessage(error))
        }

        throw error
      }
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  return null
}
