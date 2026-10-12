import * as React from "react"
import { cn } from "@/lib/utils"

function Item({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item"
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
        className
      )}
      {...props}
    />
  )
}

function ItemMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-media"
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-md",
        className
      )}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn("font-medium leading-tight", className)}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function ItemAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-action"
      className={cn("flex shrink-0 items-center", className)}
      {...props}
    />
  )
}

export { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemAction }
