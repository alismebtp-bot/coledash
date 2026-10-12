import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md border bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup }
