import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Label } from "./label"
import { cn } from "@/lib/utils"

const fieldVariants = cva("", {
  variants: {
    size: {
      sm: "space-y-1",
      md: "space-y-1.5",
      lg: "space-y-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

interface FieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fieldVariants> {
  label?: string
  helperText?: string
  errorText?: string
  optional?: boolean
  children: React.ReactNode
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    { className, size, label, helperText, errorText, optional, children, ...props },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(fieldVariants({ size }), className)} {...props}>
        {label && (
          <div className="flex items-center justify-between">
            <Label className={errorText ? "text-destructive" : ""}>
              {label}
              {optional && (
                <span className="ml-1 text-xs text-muted-foreground">(optionnel)</span>
              )}
            </Label>
          </div>
        )}
        {children}
        {errorText ? (
          <p className="text-xs text-destructive">{errorText}</p>
        ) : helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    )
  }
)
Field.displayName = "Field"

export { Field, fieldVariants }
