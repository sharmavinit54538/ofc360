import { useState } from "react";
import { ChevronDown, ChevronRight, Users, UserCheck, Building2, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { OrgChartNode } from "../employeesTypes";

interface OrgChartViewProps {
  nodes: OrgChartNode[];
  onSelectEmployee?: (id: string) => void;
}

export function OrgChartView({ nodes, onSelectEmployee }: OrgChartViewProps) {
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  function toggleExpand(id: string) {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function expandAll() {
    const all: Record<string, boolean> = {};
    function walk(n: OrgChartNode) {
      all[n.id] = true;
      n.directReports?.forEach(walk);
    }
    nodes.forEach(walk);
    setExpandedIds(all);
  }

  function collapseAll() {
    setExpandedIds({});
  }

  const filteredNodes = search.trim()
    ? filterOrgTree(nodes, search.trim().toLowerCase())
    : nodes;

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hierarchy by name, role or department…"
            className="h-9.5 pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={expandAll} className="text-xs">
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs">
            Collapse All
          </Button>
        </div>
      </div>

      {/* Tree Container */}
      {filteredNodes.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
          <h3 className="font-display text-base font-semibold">No org chart nodes found</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {search ? "No matching employees found in org tree." : "Add employees and assign reporting managers to populate the chart."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNodes.map((rootNode) => (
            <OrgTreeNodeCard
              key={rootNode.id}
              node={rootNode}
              level={0}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              onSelectEmployee={onSelectEmployee}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrgTreeNodeCard({
  node,
  level,
  expandedIds,
  onToggleExpand,
  onSelectEmployee,
}: {
  node: OrgChartNode;
  level: number;
  expandedIds: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  onSelectEmployee?: (id: string) => void;
}) {
  const hasReports = Boolean(node.directReports && node.directReports.length > 0);
  const isExpanded = expandedIds[node.id] ?? (level < 2); // Default expand top 2 levels
  const initials = node.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="relative space-y-3">
      <Card
        className={`group relative transition-all duration-200 hover:border-primary/40 hover:shadow-md ${
          level === 0 ? "border-primary/20 bg-primary/5" : "bg-card/70"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Expand Toggle */}
            {hasReports ? (
              <button
                onClick={() => onToggleExpand(node.id)}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={isExpanded ? "Collapse branch" : "Expand branch"}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-7 shrink-0" />
            )}

            {/* Avatar */}
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold ${
                level === 0
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-foreground text-background"
              }`}
            >
              {initials}
            </div>

            {/* Employee Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  onClick={() => onSelectEmployee?.(node.id)}
                  className="font-display font-semibold text-sm hover:text-primary transition-colors cursor-pointer truncate"
                >
                  {node.fullName}
                </span>
                {level === 0 && (
                  <Badge variant="default" className="text-[10px] uppercase tracking-wider">
                    Executive / Top Level
                  </Badge>
                )}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{node.designation || "Employee"}</span>
                {node.department && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {node.department}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Direct Reports Count Badge */}
          {hasReports ? (
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>{node.directReports.length} direct report{node.directReports.length === 1 ? "" : "s"}</span>
              </Badge>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground shrink-0">Individual Contributor</span>
          )}
        </div>
      </Card>

      {/* Direct Reports Branch */}
      {hasReports && isExpanded && (
        <div className="ml-6 sm:ml-8 border-l-2 border-primary/20 pl-4 space-y-3 pt-1">
          {node.directReports.map((child) => (
            <OrgTreeNodeCard
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onSelectEmployee={onSelectEmployee}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function filterOrgTree(nodes: OrgChartNode[], query: string): OrgChartNode[] {
  const result: OrgChartNode[] = [];

  for (const node of nodes) {
    const matches =
      node.fullName.toLowerCase().includes(query) ||
      node.designation.toLowerCase().includes(query) ||
      (node.department && node.department.toLowerCase().includes(query));

    const filteredChildren = filterOrgTree(node.directReports || [], query);

    if (matches || filteredChildren.length > 0) {
      result.push({
        ...node,
        directReports: filteredChildren,
      });
    }
  }

  return result;
}
