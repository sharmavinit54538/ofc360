/**
 * @file Skeleton.tsx
 * @description Reusable skeleton loader components for dashboard content.
 */

import React from 'react';

export interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  style,
}) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-zinc-800 rounded-xl ${className}`}
    style={style}
    aria-hidden="true"
  />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-3 ${className}`}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-4 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-3 w-40" />
  </div>
);

export const SkeletonStatCard: React.FC = () => (
  <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-3 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
      <div className="h-4 w-4 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
    </div>
    <div className="h-8 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
    <div className="h-3 w-40 bg-gray-200 dark:bg-zinc-800 rounded" />
  </div>
);

export const SkeletonActionCard: React.FC = () => (
  <div className="p-4 rounded-xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 animate-pulse space-y-2">
    <div className="h-3 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
    <div className="h-3 w-full bg-gray-200 dark:bg-zinc-800 rounded" />
  </div>
);

export const SkeletonTimelineItem: React.FC = () => (
  <div className="flex gap-4 animate-pulse">
    <div className="flex-shrink-0">
      <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-zinc-800 mt-2" />
      <div className="w-0.5 h-full bg-gray-200 dark:bg-zinc-800 ml-1" />
    </div>
    <div className="flex-1 space-y-2">
      <div className="h-4 w-48 bg-gray-200 dark:bg-zinc-800 rounded" />
      <div className="h-3 w-64 bg-gray-200 dark:bg-zinc-800 rounded" />
      <div className="h-3 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
    </div>
  </div>
);

export const SkeletonListItem: React.FC = () => (
  <div className="p-4 rounded-xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 animate-pulse space-y-2">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800" />
      <div className="flex-1 space-y-1">
        <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
        <div className="h-3 w-40 bg-gray-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  </div>
);

export const SkeletonTableRow: React.FC<{ columns?: number; className?: string }> = ({
  columns = 4,
  className = '',
}) => (
  <tr className={`animate-pulse border-b border-gray-100 dark:border-zinc-800/80 ${className}`}>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded" />
      </td>
    ))}
  </tr>
);