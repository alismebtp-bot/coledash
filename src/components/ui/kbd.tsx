import * as React from "react"
import { cn } from "@/lib/utils"

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, children, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border bg-muted px-1.5 py-0.5 text-xs font-mono font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
)
Kbd.displayName = "Kbd"

export { Kbd }
