import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface Props {
  id: string
  label: string
  error?: string
  hint?: string
  className?: string
  children: ReactNode
}

/** Label + control + inline error. The control must use `id` and `aria-describedby={`${id}-msg`}`. */
export default function FormField({ id, label, error, hint, className, children }: Props) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-msg`} className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
