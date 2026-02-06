import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ProductCardSkeletonProps = {
  count?: number;
  className?: string;
};

export function ProductCardSkeleton({ count = 10, className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`product-skeleton-${index}`}
          className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-4"
        >
          <Skeleton className="mb-4 h-32 w-full rounded-xl bg-muted/50" />
          <Skeleton className="mb-2 h-4 w-3/4 bg-muted/50" />
          <Skeleton className="mb-4 h-4 w-1/2 bg-muted/40" />
          <Skeleton className="mt-auto h-9 w-full rounded-full bg-muted/50" />
        </div>
      ))}
    </div>
  );
}
