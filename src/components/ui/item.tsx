import * as React from "react"
import { cn } from "@/lib/utils"

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  active?: boolean
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, title, description, icon, action, active, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 rounded-lg border p-3 transition-colors",
          active
            ? "border-emerald-200 bg-emerald-50"
            : "border-slate-200 bg-white hover:border-slate-300",
          className
        )}
        {...props}
      >
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{title}</p>
          {description && (
            <p className="text-xs text-slate-500 truncate">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    )
  }
)
Item.displayName = "Item"

export { Item }
