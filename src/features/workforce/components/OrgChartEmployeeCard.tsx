/**
 * @file OrgChartEmployeeCard.tsx
 * @description Enterprise Employee Card for the OFC360 Organizational Hierarchy Chart.
 * Displays:
 * 1. Profile photo or initials avatar with live status indicator dot
 * 2. Employee name & employee code (EMP-XXXX)
 * 3. Designation & Department tag with icon
 * 4. Employment status badge (Active, Probation, etc.)
 * 5. Role accent stripe (Executive, Manager, IT Admin, Employee)
 * 6. Direct reports count with Users icon
 * 7. Reporting manager name indicator
 * 8. Interactive expand/collapse toggle pill button
 * 9. Quick Action profile view trigger
 */

import React from 'react';
import {
  Users,
  ChevronDown,
  ChevronUp,
  Building2,
  MapPin,
  ExternalLink,
  Shield,
  Briefcase,
  Crown,
  Laptop,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { cn } from '@/shared/lib/utils';
import type { OrgChartNode } from '../types/workforce.types';

export interface OrgChartEmployeeCardProps {
  node: OrgChartNode;
  isCollapsed?: boolean;
  onToggleExpand?: (nodeId: string) => void;
  onSelect?: (node: OrgChartNode) => void;
  isSearchMatch?: boolean;
  isDimmed?: boolean;
}

export const OrgChartEmployeeCard: React.FC<OrgChartEmployeeCardProps> = ({
  node,
  isCollapsed = false,
  onToggleExpand,
  onSelect,
  isSearchMatch = false,
  isDimmed = false,
}) => {
  const subordinates = Array.isArray(node.subordinates)
    ? node.subordinates
    : Array.isArray(node.children)
    ? node.children
    : [];
  const reportsCount = subordinates.length;
  const hasReports = reportsCount > 0;

  // Resolve role styling
  const roleUpper = (node.role || '').toUpperCase();
  const desgUpper = (node.designation || '').toUpperCase();

  const isExecutive =
    roleUpper === 'EXECUTIVE' ||
    desgUpper.includes('CEO') ||
    desgUpper.includes('CTO') ||
    desgUpper.includes('CFO') ||
    desgUpper.includes('CHIEF') ||
    desgUpper.includes('DIRECTOR') ||
    desgUpper.includes('PRESIDENT') ||
    desgUpper.includes('FOUNDER');

  const isManager =
    !isExecutive &&
    (roleUpper === 'MANAGER' ||
      desgUpper.includes('MANAGER') ||
      desgUpper.includes('LEAD') ||
      desgUpper.includes('HEAD') ||
      hasReports);

  const isItAdmin =
    !isExecutive &&
    !isManager &&
    (roleUpper === 'IT_ADMIN' ||
      desgUpper.includes('IT') ||
      desgUpper.includes('DEVOPS') ||
      desgUpper.includes('INFRA') ||
      desgUpper.includes('SYSADMIN'));

  // Header gradient accent
  const headerGradient = isExecutive
    ? 'from-purple-600 via-indigo-600 to-blue-600'
    : isManager
    ? 'from-amber-500 via-orange-500 to-amber-600'
    : isItAdmin
    ? 'from-cyan-500 via-blue-500 to-indigo-500'
    : 'from-teal-500 via-emerald-500 to-teal-600';

  const roleLabel = isExecutive
    ? 'Executive'
    : isManager
    ? 'Manager'
    : isItAdmin
    ? 'IT Admin'
    : 'Employee';

  const RoleIcon = isExecutive
    ? Crown
    : isManager
    ? Briefcase
    : isItAdmin
    ? Laptop
    : Shield;

  // Initials generator
  const initials = (node.name || 'Unknown')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase() || 'EMP';

  // Status badge variant
  const statusUpper = (node.status || 'ACTIVE').toUpperCase();
  const isStatusActive = statusUpper === 'ACTIVE';

  return (
    <div
      className={cn(
        'group relative w-[270px] select-none rounded-2xl bg-white dark:bg-[#1a1a1a]',
        'border border-slate-200/90 dark:border-zinc-800',
        'shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200',
        'flex flex-col cursor-pointer',
        isSearchMatch &&
          'ring-3 ring-teal-500 ring-offset-2 dark:ring-offset-zinc-900 shadow-teal-500/25',
        isDimmed && 'opacity-35 hover:opacity-100 transition-opacity'
      )}
      onClick={() => onSelect?.(node)}
      role="article"
      aria-label={`Employee card for ${node.name}, ${node.designation}`}
    >
      {/* Top Role Colored Accent Bar */}
      <div
        className={cn(
          'h-2 w-full rounded-t-2xl bg-gradient-to-r',
          headerGradient
        )}
      />

      {/* Card Content Body */}
      <div className="p-4 space-y-3">
        {/* Header Row: Avatar + Identity + Code */}
        <div className="flex items-start gap-3">
          {/* Avatar with Status Dot */}
          <div className="relative shrink-0">
            <div
              className={cn(
                'w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm shadow-xs',
                'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-2 border-white dark:border-zinc-900'
              )}
            >
              {node.avatarUrl ? (
                <img
                  src={node.avatarUrl}
                  alt={node.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            {/* Live Status Indicator Dot */}
            <span
              className={cn(
                'absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900',
                isStatusActive ? 'bg-emerald-500' : 'bg-amber-500'
              )}
              title={node.status || 'Active'}
            />
          </div>

          {/* Name & Title */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {node.name}
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(node);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-opacity"
                title="View Full Profile"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300 truncate">
              {node.designation}
            </p>

            <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">
              {node.employeeCode || `EMP-${node.id.slice(-4).toUpperCase()}`}
            </span>
          </div>
        </div>

        {/* Department & Location Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800/90 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60 truncate max-w-[140px]">
            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{node.department || 'General'}</span>
          </span>

          {node.location && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-slate-500 dark:text-zinc-400 truncate max-w-[100px]">
              <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              <span className="truncate">{node.location}</span>
            </span>
          )}
        </div>

        {/* Status & Role Row */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-zinc-800/80 text-[11px]">
          {/* Status Badge */}
          <Badge
            variant={isStatusActive ? 'success' : 'warning'}
            size="sm"
            className="text-[10px] font-semibold uppercase tracking-wider py-0"
          >
            {node.status || 'Active'}
          </Badge>

          {/* Role Pill */}
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border',
              isExecutive
                ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                : isManager
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                : isItAdmin
                ? 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800'
                : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
            )}
          >
            <RoleIcon className="w-2.5 h-2.5" />
            <span>{roleLabel}</span>
          </span>
        </div>

        {/* Reporting Manager Indicator (if reports to someone) */}
        {node.managerName && (
          <div className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
            <span className="font-medium text-slate-400">Reports to:</span>{' '}
            <span className="font-semibold text-slate-700 dark:text-zinc-300">
              {node.managerName}
            </span>
          </div>
        )}
      </div>

      {/* Expand / Collapse Pill Trigger (Only if node has reports) */}
      {hasReports && (
        <div className="relative -mb-3 flex justify-center z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand?.(node.id);
            }}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer',
              isCollapsed
                ? 'bg-teal-600 text-white hover:bg-teal-700 hover:scale-105 ring-2 ring-white dark:ring-zinc-900'
                : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700'
            )}
            title={isCollapsed ? `Expand ${reportsCount} reports` : 'Collapse branch'}
            aria-expanded={!isCollapsed}
          >
            <Users className="w-3 h-3" />
            <span>
              {reportsCount} {reportsCount === 1 ? 'Report' : 'Reports'}
            </span>
            {isCollapsed ? (
              <ChevronDown className="w-3 h-3 text-white" />
            ) : (
              <ChevronUp className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
export default OrgChartEmployeeCard;

