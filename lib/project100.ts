export const PROJECT_100_TARGET = 7_500_000

type Project100DonationLike = {
  amount?: number | string
  currency?: "USD" | "NGN" | string
  rateUsed?: number | string | null
  program?: string | null
}

export function normalizeProgramName(program: unknown) {
  return String(program ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
}

export function isProject100Program(program: unknown) {
  return normalizeProgramName(program) === "project100"
}

export function toNaira(amount: number | string, currency?: string, rateUsed?: number | string | null) {
  const numericAmount = Number(amount)
  if (Number.isNaN(numericAmount)) return 0

  if ((currency || "").toUpperCase() === "USD") {
    const numericRate = Number(rateUsed)
    if (!Number.isNaN(numericRate) && numericRate > 0) {
      return numericAmount * numericRate
    }

    return numericAmount * 1500
  }

  return numericAmount
}

export function formatNaira(amount: number) {
  return `₦${Math.round(amount).toLocaleString()}`
}

export function getConversionLabel(currency?: string) {
  return (currency || "").toUpperCase() === "USD" ? "Converted from USD" : ""
}

export function calculateProject100Funding(donations: Project100DonationLike[]) {
  const raised = donations
    .filter((donation) => isProject100Program(donation.program))
    .reduce(
      (sum, donation) => sum + toNaira(donation.amount ?? 0, donation.currency, donation.rateUsed),
      0
    )

  const progress = PROJECT_100_TARGET > 0 ? Math.min((raised / PROJECT_100_TARGET) * 100, 100) : 0
  const remaining = Math.max(PROJECT_100_TARGET - raised, 0)

  return {
    target: PROJECT_100_TARGET,
    raised,
    progress,
    remaining,
  }
}
