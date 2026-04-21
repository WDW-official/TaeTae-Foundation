import { PROJECT_100_TARGET } from "@/lib/project100"

type Project100ProgressProps = {
  raised: number
  className?: string
  compact?: boolean
}

export default function Project100Progress({
  raised,
  className = "",
  compact = false,
}: Project100ProgressProps) {
  const safeRaised = Number.isFinite(raised) ? Math.max(raised, 0) : 0
  const progress = PROJECT_100_TARGET > 0 ? Math.min((safeRaised / PROJECT_100_TARGET) * 100, 100) : 0
  const remaining = Math.max(PROJECT_100_TARGET - safeRaised, 0)
  const paddingClass = compact ? "p-3" : "p-5"

  return (
    <div className={`rounded-2xl border border-border bg-white dark:bg-gray-900 ${paddingClass} shadow-sm ${className}`}>
      <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <p className={`${compact ? " text-xl" : " text-2xl"} font-bold text-primary `}>
            Project 100
          </p>
          <h3 className={`${compact ? "md:mt-2 text-xl" : "md:mt-2 text-xl"} font-bold italic text-foreground`}>
            Donation Progress
          </h3>
          <p className="md:mt-2 md:text-sm text-[12px] md:leading-6 text-muted-foreground">
            We are raising funds for Project 100 toward a target of ₦7,500,000.
            USD donations are counted at their naira equivalent for this total.
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className={`${compact ? "text-xl" : "text-xl"} font-black text-foreground`}>
            ₦{safeRaised.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            raised of ₦{PROJECT_100_TARGET.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="md:mt-5 mt-3">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>₦0</span>
          <span>₦7.5M</span>
        </div>

        <div className="md:h-3 h-2 overflow-hidden rounded-full bg-foreground/10 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-linear-to-r from-primary via-[#8bc97f] to-emerald-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{Math.round(progress)}% funded</span>
          <span>₦{remaining.toLocaleString()} remaining</span>
        </div>
      </div>
    </div>
  )
}
