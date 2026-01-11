
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10", className)}
      style={{
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        backgroundSize: '200% 100%'
      }}
      {...props}
    />
  )
}

export { Skeleton }
