import React, { useMemo, useState } from 'react';
import { Network, ChevronDown, ChevronRight } from 'lucide-react';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { cn } from '@/shared/lib/utils';
import { useGetOrgChartQuery } from '../api/workforceApi';
import type { OrgChartNode } from '../types/workforce.types';

const TreeNode: React.FC<{ node: OrgChartNode; depth: number }> = ({ node, depth }) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const children = Array.isArray(node.subordinates)
    ? node.subordinates
    : Array.isArray(node.children)
    ? node.children
    : [];
  const hasChildren = children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-2.5 py-2 px-3 rounded-xl transition-colors',
          'hover:bg-gray-50 dark:hover:bg-zinc-800/50',
          hasChildren && 'cursor-pointer'
        )}
        style={{ marginLeft: `${depth * 22}px` }}
        onClick={hasChildren ? () => setExpanded((prev) => !prev) : undefined}
        role={hasChildren ? 'button' : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
      >
        <span className="w-4 h-4 flex items-center justify-center text-gray-400 shrink-0">
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-600" />
          )}
        </span>

        <div className="w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
          {node.avatarUrl ? (
            <img src={node.avatarUrl} alt={node.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            (node.name || 'Unknown')
              .split(' ')
              .slice(0, 2)
              .map((part) => part.charAt(0))
              .join('')
              .toUpperCase()
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-900 dark:text-[#ececec] truncate">
            {node.name}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
            {node.designation} • {node.department}
          </div>
        </div>

        {hasChildren && (
          <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 shrink-0">
            {children.length} report{children.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="border-l border-gray-200 dark:border-zinc-800 ml-[27px]">
          {children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const OrgChartTree: React.FC = () => {
  const { data: orgChart, isLoading } = useGetOrgChartQuery();

  const roots = useMemo(() => {
    if (!orgChart) return [];
    return Array.isArray(orgChart) ? orgChart : [orgChart];
  }, [orgChart]);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-zinc-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
          <Network className="w-5 h-5 text-amber-600" />
          Organization Hierarchy
        </h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
          Live reporting tree — click a node to expand or collapse its reports
        </p>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonListItem key={i} />
          ))}
        </div>
      ) : roots.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
            <Network className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
            No hierarchy published yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
            The org chart builds automatically as reporting managers are assigned to employees.
          </p>
        </div>
      ) : (
        <div className="p-3">{roots.map((root) => <TreeNode key={root.id} node={root} depth={0} />)}</div>
      )}
    </div>
  );
};

export default OrgChartTree;
