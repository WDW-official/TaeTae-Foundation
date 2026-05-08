type LoadingLogoProps = {
  label?: string
  className?: string
}

export default function LoadingLogo({ label = "Loading...", className = "" }: LoadingLogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="rounded-full border border-primary/20 bg-white p-3 shadow-sm dark:border-[#8bc97f]/25 dark:bg-gray-900">
        <img
          src="/icon-192.png"
          alt="TaeTae Foundation"
          className="loading-icon-pulse h-14 w-14 object-contain"
        />
      </div>
      {label ? <p className="mt-4 text-sm text-muted-foreground">{label}</p> : null}
    </div>
  )
}
