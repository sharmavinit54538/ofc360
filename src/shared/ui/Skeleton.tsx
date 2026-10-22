/**
 * @file Skeleton.tsx
 * @description Reusable skeleton loader components for dashboard content.
 */

import React from 'react';

export const Skeleton: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = '',
  style,
}) => (
  <div
    className={`animate-pulse bg-slate-800/50 rounded-xl ${className}`}
    style={style}
    aria-hidden="true"
  />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 ${className}`}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-4 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-3 w-40" />
  </div>
);

export const SkeletonStatCard: React.FC = () => (
  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-3 w-24 bg-slate-800/50 rounded" />
      <div className="h-4 w-4 bg-slate-800/50 rounded-lg" />
    </div>
    <div className="h-8 w-32 bg-slate-800/50 rounded" />
    <div className="h-3 w-40 bg-slate-800/50 rounded" />
  </div>
);

export const SkeletonActionCard: React.FC = () => (
  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 animate-pulse space-y-2">
    <div className="h-3 w-32 bg-slate-800/50 rounded" />
    <div className="h-3 w-full bg-slate-800/50 rounded" />
  </div>
);

export const SkeletonTimelineItem: React.FC = () => (
  <div className="flex gap-4 animate-pulse">
    <div className="flex-shrink-0">
      <div className="w-2 h-2 rounded-full bg-slate-700 mt-2" />
      <div className="w-0.5 h-full bg-slate-800 ml-1" />
    </div>
    <div className="flex-1 space-y-2">
      <div className="h-4 w-48 bg-slate-800/50 rounded" />
      <div className="h-3 w-64 bg-slate-800/50 rounded" />
      <div className="h-3 w-32 bg-slate-800/50 rounded" />
    </div>
  </div>
);

export const SkeletonListItem: React.FC = () => (
  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse space-y-2">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-slate-800/50" />
      <div className="flex-1 space-y-1">
        <div className="h-4 w-32 bg-slate-800/50 rounded" />
        <div className="h-3 w-40 bg-slate-800/50 rounded" />
      </div>
    </div>
  </div>
);

export const SkeletonTableRow: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <div className="grid grid-cols-12 gap-4 py-3 animate-pulse">
    {Array.from({ length: columns }).map((_, i) => (
      <div key={i} className={`col-span-${Math.max(1, Math.floor(12 / columns))} h-4 bg-slate-800/50 rounded`} />
    ))}
  </div>
);