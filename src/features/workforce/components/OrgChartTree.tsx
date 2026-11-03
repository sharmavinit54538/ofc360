/**
 * @file OrgChartTree.tsx
 * @description Enterprise Interactive Organizational Chart for OFC360 Workforce Management.
 * Redesigned into a modern, interactive top-down hierarchical tree featuring:
 * 1. Top-down tree layout: CEO/Executive -> Directors/Heads -> Managers/Leads -> Individual Employees
 * 2. Enterprise employee cards with avatars, status, role stripes, and direct report counters
 * 3. Interactive branch expansion/collapsing, Expand All, and Collapse All
 * 4. Canvas panning (mouse drag) and zoom controls (Zoom In, Zoom Out, Reset, Fit-to-screen)
 * 5. Real-time employee search with ancestor auto-expansion & highlight
 * 6. Department and location filtering
 * 7. Fullscreen canvas mode
 * 8. High-resolution PNG and printable PDF export
 * 9. One-click employee profile navigation
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, RefreshCw, AlertCircle } from 'lucide-react';
import { useGetOrgChartQuery } from '../api/workforceApi';
import type { OrgChartNode } from '../types/workforce.types';
import { OrgChartEmployeeCard } from './OrgChartEmployeeCard';
import { OrgChartToolbar } from './OrgChartToolbar';
import { useToast } from '@/shared/ui/Toast';
import { cn } from '@/shared/lib/utils';

export interface OrgChartTreeProps {
  onSelectEmployee?: (employee: OrgChartNode) => void;
  className?: string;
}

/**
 * Recursive TreeNode component rendering an employee card, orthogonal connector lines,
 * and its subordinate children branches.
 */
interface TreeNodeProps {
  node: OrgChartNode;
  level: number;
  collapsedIds: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  onSelect: (node: OrgChartNode) => void;
  searchQuery: string;
  selectedDepartment: string;
  selectedLocation: string;
  isParentCollapsed?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  collapsedIds,
  onToggleExpand,
  onSelect,
  searchQuery,
  selectedDepartment,
  selectedLocation,
  isParentCollapsed = false,
}) => {
  if (isParentCollapsed) return null;

  const subordinates = Array.isArray(node.subordinates)
    ? node.subordinates
    : Array.isArray(node.children)
    ? node.children
    : [];

  const hasChildren = subordinates.length > 0;
  const isCollapsed = collapsedIds.has(node.id);

  // Match calculations
  const q = searchQuery.trim().toLowerCase();
  const isSearchMatch = Boolean(
    q &&
      ((node.name || '').toLowerCase().includes(q) ||
        (node.employeeCode || '').toLowerCase().includes(q) ||
        (node.id || '').toLowerCase().includes(q) ||
        (node.designation || '').toLowerCase().includes(q))
  );

  const deptMatch =
    selectedDepartment === 'ALL' ||
    (node.department || '').toLowerCase() === selectedDepartment.toLowerCase();

  const locMatch =
    selectedLocation === 'ALL' ||
    (node.location || '').toLowerCase() === selectedLocation.toLowerCase();

  const isDimmed =
    Boolean(searchQuery.trim() && !isSearchMatch) || !deptMatch || !locMatch;

  return (
    <div className="flex flex-col items-center">
      {/* Employee Card Node */}
      <div id={`org-node-${node.id}`} className="relative z-10">
        <OrgChartEmployeeCard
          node={node}
          isCollapsed={isCollapsed}
          onToggleExpand={onToggleExpand}
          onSelect={onSelect}
          isSearchMatch={isSearchMatch}
          isDimmed={isDimmed}
        />
      </div>

      {/* Connector lines and children branches */}
      {hasChildren && !isCollapsed && (
        <div className="flex flex-col items-center w-full">
          {/* Vertical stem descending from parent bottom */}
          <div className="w-0.5 h-7 bg-slate-300 dark:bg-zinc-700 transition-colors" />

          {/* Children container with horizontal connecting bar */}
          <div className="relative pt-7">
            {/* Horizontal span connecting first child to last child */}
            {subordinates.length > 1 && (
              <div
                className="absolute top-0 h-0.5 bg-slate-300 dark:bg-zinc-700 transition-colors"
                style={{
                  left: `calc(100% / ${subordinates.length * 2})`,
                  right: `calc(100% / ${subordinates.length * 2})`,
                }}
              />
            )}

            {/* Sibling children flex container */}
            <div className="flex items-start justify-center gap-8 sm:gap-12">
              {subordinates.map((child) => (
                <div
                  key={child.id}
                  className="relative flex flex-col items-center"
                >
                  {/* Vertical stem dropping from horizontal bar into child top */}
                  <div className="absolute -top-7 w-0.5 h-7 bg-slate-300 dark:bg-zinc-700 transition-colors" />

                  <TreeNode
                    node={child}
                    level={level + 1}
                    collapsedIds={collapsedIds}
                    onToggleExpand={onToggleExpand}
                    onSelect={onSelect}
                    searchQuery={searchQuery}
                    selectedDepartment={selectedDepartment}
                    selectedLocation={selectedLocation}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const OrgChartTree: React.FC<OrgChartTreeProps> = ({
  onSelectEmployee,
  className,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: orgChartData, isLoading, isError, refetch } = useGetOrgChartQuery();

  // Roots data
  const roots = useMemo<OrgChartNode[]>(() => {
    if (!orgChartData) return [];
    return Array.isArray(orgChartData) ? orgChartData : [orgChartData];
  }, [orgChartData]);

  // Flattened all nodes for analytics & quick lookups
  const allNodes = useMemo<OrgChartNode[]>(() => {
    const list: OrgChartNode[] = [];
    const traverse = (node: OrgChartNode) => {
      list.push(node);
      const subs = Array.isArray(node.subordinates)
        ? node.subordinates
        : Array.isArray(node.children)
        ? node.children
        : [];
      subs.forEach(traverse);
    };
    roots.forEach(traverse);
    return list;
  }, [roots]);

  // Unique departments and locations for filters
  const { departments, locations, totalManagers } = useMemo(() => {
    const deptSet = new Set<string>();
    const locSet = new Set<string>();
    let managers = 0;

    for (const node of allNodes) {
      if (node.department && node.department !== 'General') {
        deptSet.add(node.department);
      }
      if (node.location) {
        locSet.add(node.location);
      }
      const subs = node.subordinates || node.children || [];
      const roleUpper = (node.role || '').toUpperCase();
      const desgUpper = (node.designation || '').toUpperCase();
      if (
        subs.length > 0 ||
        roleUpper === 'MANAGER' ||
        desgUpper.includes('MANAGER') ||
        desgUpper.includes('LEAD') ||
        desgUpper.includes('HEAD')
      ) {
        managers++;
      }
    }

    return {
      departments: Array.from(deptSet).sort(),
      locations: Array.from(locSet).sort(),
      totalManagers: managers,
    };
  }, [allNodes]);

  // Interaction State
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  // Canvas Pan & Zoom State
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Search matches count
  const searchMatchCount = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return 0;
    return allNodes.filter(
      (n) =>
        (n.name || '').toLowerCase().includes(q) ||
        (n.employeeCode || '').toLowerCase().includes(q) ||
        (n.id || '').toLowerCase().includes(q) ||
        (n.designation || '').toLowerCase().includes(q)
    ).length;
  }, [allNodes, searchQuery]);

  // Auto-expand ancestors when searching so matched nodes are visible
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    // Build parent lookup map
    const parentMap = new Map<string, string>();
    const registerParents = (node: OrgChartNode) => {
      const subs = node.subordinates || node.children || [];
      for (const child of subs) {
        parentMap.set(child.id, node.id);
        registerParents(child);
      }
    };
    roots.forEach(registerParents);

    // Collect all ancestor IDs of matching nodes
    const ancestorsToExpand = new Set<string>();
    for (const node of allNodes) {
      const isMatch =
        (node.name || '').toLowerCase().includes(q) ||
        (node.employeeCode || '').toLowerCase().includes(q) ||
        (node.id || '').toLowerCase().includes(q) ||
        (node.designation || '').toLowerCase().includes(q);

      if (isMatch) {
        let currId = parentMap.get(node.id);
        while (currId) {
          ancestorsToExpand.add(currId);
          currId = parentMap.get(currId);
        }
      }
    }

    // Un-collapse those ancestors
    if (ancestorsToExpand.size > 0) {
      setCollapsedIds((prev) => {
        const next = new Set(prev);
        ancestorsToExpand.forEach((id) => next.delete(id));
        return next;
      });
    }
  }, [searchQuery, allNodes, roots]);

  // Toggle node expand/collapse
  const handleToggleExpand = useCallback((nodeId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // Expand all branches
  const handleExpandAll = useCallback(() => {
    setCollapsedIds(new Set());
    toast.info('All reporting branches expanded', 'Chart Updated');
  }, [toast]);

  // Collapse branches (leaves only root & Level 1)
  const handleCollapseAll = useCallback(() => {
    const ids = new Set<string>();
    roots.forEach((root) => {
      const subs = root.subordinates || root.children || [];
      subs.forEach((child) => {
        const childSubs = child.subordinates || child.children || [];
        if (childSubs.length > 0) {
          ids.add(child.id);
        }
      });
    });
    setCollapsedIds(ids);
    toast.info('Collapsed lower reporting branches', 'Chart Updated');
  }, [roots, toast]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(2.0, Number((z + 0.15).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(0.3, Number((z - 0.15).toFixed(2))));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  }, []);

  // Fit to screen auto-scaling
  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    const padding = 80;
    const availableWidth = containerRect.width - padding;
    const availableHeight = containerRect.height - padding;

    // Actual unscaled content dimensions
    const currentScale = zoom;
    const rawContentWidth = contentRect.width / currentScale;
    const rawContentHeight = contentRect.height / currentScale;

    if (rawContentWidth <= 0 || rawContentHeight <= 0) return;

    const scaleX = availableWidth / rawContentWidth;
    const scaleY = availableHeight / rawContentHeight;
    const optimalScale = Math.min(scaleX, scaleY, 1.2);
    const clampedScale = Math.max(0.35, Math.min(1.5, Number(optimalScale.toFixed(2))));

    setZoom(clampedScale);
    setPan({ x: 0, y: 0 });
    toast.success('Organizational chart fitted to screen', 'Fit to Screen');
  }, [zoom, toast]);

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setZoom((z) => Math.max(0.3, Math.min(2.0, Number((z + delta).toFixed(2)))));
    }
  };

  // Canvas Drag & Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag when clicking background or canvas surface (not interactive buttons or inputs)
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('[role="button"]')
    ) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Fullscreen Toggle
  const handleToggleFullscreen = useCallback(() => {
    const el = chartWrapperRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Listen to standard fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Handle Card Click / Profile View
  const handleSelect = (node: OrgChartNode) => {
    if (onSelectEmployee) {
      onSelectEmployee(node);
      return;
    }
    // Default: navigate to Employee Profile Page
    navigate(`/dashboard/workforce/employees/${node.id}`);
  };

  // Export as PNG Image
  const handleExportPng = useCallback(() => {
    toast.info('Generating high-resolution PNG snapshot of the organizational tree...', 'Exporting PNG');

    try {
      const el = contentRef.current;
      if (!el) return;

      // Temporarily reset transform for clean canvas capture
      const originalTransform = el.style.transform;
      el.style.transform = 'none';

      const rect = el.getBoundingClientRect();
      const width = Math.max(rect.width, 1200);
      const height = Math.max(rect.height, 800);

      const canvas = document.createElement('canvas');
      const pixelRatio = 2; // High-res 2x
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(pixelRatio, pixelRatio);
        ctx.fillStyle = '#f8fafc'; // Clean light slate surface
        ctx.fillRect(0, 0, width, height);

        // Serialize HTML tree to SVG ForeignObject
        const html = new XMLSerializer().serializeToString(el);
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <foreignObject width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml">
                ${html}
              </div>
            </foreignObject>
          </svg>
        `;

        const img = new Image();
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          el.style.transform = originalTransform;

          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.download = `OFC360_Organizational_Chart_${Date.now()}.png`;
          a.href = pngUrl;
          a.click();
          toast.success('Organizational chart exported successfully as PNG', 'Export Complete');
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          el.style.transform = originalTransform;
          // Fallback to simple direct window print
          window.print();
        };

        img.src = url;
      }
    } catch (err) {
      toast.error('Failed to export PNG. Use Export as PDF or browser print.', 'Export Notice');
    }
  }, [toast]);

  // Export as PDF Document (Native Landscape Print View)
  const handleExportPdf = useCallback(() => {
    toast.info('Preparing printable PDF layout for Organizational Chart...', 'Exporting PDF');
    // Opens print view with dedicated print media query styles
    window.print();
  }, [toast]);

  return (
    <div
      ref={chartWrapperRef}
      className={cn(
        'rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#141414] shadow-sm flex flex-col overflow-hidden',
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen' : 'min-h-[720px]',
        className
      )}
    >
      {/* Professional Chart Toolbar */}
      <OrgChartToolbar
        totalEmployees={allNodes.length || roots.length}
        totalDepartments={departments.length}
        totalManagers={totalManagers}
        departments={departments}
        locations={locations}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onFitToScreen={handleFitToScreen}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onExportPng={handleExportPng}
        onExportPdf={handleExportPdf}
        matchCount={searchMatchCount}
      />

      {/* Infinite Canvas Viewport */}
      <div
        ref={containerRef}
        className={cn(
          'relative flex-1 w-full overflow-hidden select-none bg-slate-50/70 dark:bg-[#0f0f0f]',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Subtle Canvas Dot Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            transform: `translate(${pan.x % 24}px, ${pan.y % 24}px)`,
          }}
        />

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 bg-white/70 dark:bg-zinc-900/70 z-20 backdrop-blur-xs">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
                Building interactive organizational tree...
              </p>
            </div>
            {/* Top Root Skeleton */}
            <div className="w-64 h-32 rounded-2xl bg-slate-200 dark:bg-zinc-800 animate-pulse" />
            {/* Children Skeletons */}
            <div className="flex gap-8">
              <div className="w-60 h-28 rounded-2xl bg-slate-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-60 h-28 rounded-2xl bg-slate-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-60 h-28 rounded-2xl bg-slate-200 dark:bg-zinc-800 animate-pulse" />
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Failed to load organization hierarchy
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mt-1 mb-4">
              An error occurred while fetching reporting managers and employee trees.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-xs"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && roots.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Network className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No organization hierarchy published
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mt-1 mb-4">
              The organizational chart builds dynamically once reporting managers are assigned to employees in the directory.
            </p>
            <button
              type="button"
              onClick={() => navigate('/dashboard/workforce')}
              className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-xs"
            >
              Go to Employee Directory
            </button>
          </div>
        )}

        {/* Scalable & Pannable Tree Content Surface */}
        {!isLoading && roots.length > 0 && (
          <div
            ref={contentRef}
            className="absolute top-0 left-0 w-full min-h-full flex flex-col items-center justify-start p-16 origin-top transition-transform duration-75"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '50% 100px',
            }}
          >
            {/* Roots Flex Container */}
            <div className="flex items-start justify-center gap-16 sm:gap-24">
              {roots.map((rootNode) => (
                <TreeNode
                  key={rootNode.id}
                  node={rootNode}
                  level={0}
                  collapsedIds={collapsedIds}
                  onToggleExpand={handleToggleExpand}
                  onSelect={handleSelect}
                  searchQuery={searchQuery}
                  selectedDepartment={selectedDepartment}
                  selectedLocation={selectedLocation}
                />
              ))}
            </div>
          </div>
        )}

        {/* Floating Canvas Navigation Hints */}
        <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-zinc-800/90 border border-slate-200/80 dark:border-zinc-700/80 shadow-xs backdrop-blur-xs text-[11px] text-slate-500 dark:text-zinc-400 pointer-events-none">
          <span>Click &amp; drag canvas to pan</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-600" />
          <span>Ctrl + scroll to zoom</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-600" />
          <span>Click card to view profile</span>
        </div>
      </div>
    </div>
  );
};
export default OrgChartTree;
