import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-4">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <div className="mt-3 flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border bg-white p-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="mt-1 h-3 w-1/4" />
          </div>
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
