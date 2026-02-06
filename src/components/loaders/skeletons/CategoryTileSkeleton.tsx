import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CategoryTileSkeletonProps = {
  count?: number;
  className?: string;
};

export function CategoryTileSkeleton({ count = 6, className }: CategoryTileSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`category-skeleton-${index}`}
          className="rounded-2xl border border-border/60 bg-card p-5"
        >
          <Skeleton className="mb-4 h-20 w-20 rounded-2xl bg-muted/50" />
          <Skeleton className="mb-2 h-5 w-2/3 bg-muted/50" />
          <Skeleton className="h-4 w-full bg-muted/40" />
          <Skeleton className="mt-2 h-4 w-5/6 bg-muted/40" />
        </div>
      ))}
    </div>
  );
}
