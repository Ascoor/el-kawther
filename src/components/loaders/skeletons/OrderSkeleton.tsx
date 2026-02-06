import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type OrderSkeletonProps = {
  count?: number;
  className?: string;
};

export function OrderSkeleton({ count = 4, className }: OrderSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`order-skeleton-${index}`}
          className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-5 w-1/3 bg-muted/50" />
            <Skeleton className="h-5 w-20 bg-muted/40" />
          </div>
          <Skeleton className="h-4 w-2/3 bg-muted/40" />
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-24 bg-muted/40" />
            <Skeleton className="h-9 w-28 rounded-full bg-muted/50" />
          </div>
        </div>
      ))}
    </div>
  );
}
