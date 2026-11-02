import React, { useState, useMemo } from 'react';
import {
  Bot,
  Plus,
  Terminal,
  Search,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';
import {
  INITIAL_KPIS,
  INITIAL_WORKFLOWS,
  INITIAL_LOGS,
} from '../data/initialWorkflows';
import type {
  AutonomousWorkflow,
  WorkflowCategory,
  WorkflowLog,
  WorkflowStatus,
} from '../types/workflow.types';
import { WorkflowKpiCards } from '../components/WorkflowKpiCards';
import { WorkflowCard } from '../components/WorkflowCard';
import { WorkflowLogsModal } from '../components/WorkflowLogsModal';
import { CreateWorkflowModal } from '../components/CreateWorkflowModal';

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'All Workflows' },
  { id: 'offboarding', label: 'Offboarding & Exit' },
  { id: 'onboarding', label: 'Onboarding & Hire' },
  { id: 'attendance', label: 'Attendance & Shifts' },
  { id: 'payroll', label: 'Payroll & Expenses' },
  { id: 'compliance', label: 'Compliance & EPFO' },
  { id: 'security', label: 'Identity & SecOps' },
];

export const AutonomousWorkflowsPage: React.FC = () => {
  const toast = useToast();

  // State
  const [workflows, setWorkflows] = useState<AutonomousWorkflow[]>(INITIAL_WORKFLOWS);
  const [logs, setLogs] = useState<WorkflowLog[]>(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [selectedWorkflowForLogs, setSelectedWorkflowForLogs] = useState<AutonomousWorkflow | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<AutonomousWorkflow | null>(null);

  // Running State per workflow
  const [runningWorkflowIds, setRunningWorkflowIds] = useState<Record<string, boolean>>({});

  // Filtered Workflows
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((wf) => {
      if (selectedCategory !== 'all' && wf.category !== selectedCategory) {
        return false;
      }
      if (statusFilter !== 'all' && wf.status !== statusFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        wf.name.toLowerCase().includes(q) ||
        wf.description.toLowerCase().includes(q) ||
        wf.triggerDetail.toLowerCase().includes(q) ||
        wf.steps.some((s) => s.name.toLowerCase().includes(q))
      );
    });
  }, [workflows, selectedCategory, statusFilter, searchQuery]);

  // Dynamic KPIs
  const currentKpis = useMemo(() => {
    const active = workflows.filter((w) => w.status === 'active').length;
    return {
      ...INITIAL_KPIS,
      totalWorkflows: workflows.length,
      activeAutomations: active,
    };
  }, [workflows]);

  // Actions
  const handleToggleStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id === id) {
          const nextStatus: WorkflowStatus = wf.status === 'active' ? 'paused' : 'active';
          toast.info(
            `Workflow "${wf.name}" is now ${nextStatus.toUpperCase()}.`,
            nextStatus === 'active' ? 'Automation Resumed' : 'Automation Paused'
          );
          return { ...wf, status: nextStatus };
        }
        return wf;
      })
    );
  };

  const handleRunNow = (workflow: AutonomousWorkflow) => {
    setRunningWorkflowIds((prev) => ({ ...prev, [workflow.id]: true }));

    setTimeout(() => {
      setRunningWorkflowIds((prev) => ({ ...prev, [workflow.id]: false }));

      const newLog: WorkflowLog = {
        id: `log-${Date.now()}`,
        workflowId: workflow.id,
        workflowName: workflow.name,
        trigger: 'Manual Immediate Trigger via OFC360 Console',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        durationMs: Math.floor(Math.random() * 600) + 400,
        status: 'success',
        stepsCompleted: workflow.steps.length,
        totalSteps: workflow.steps.length,
        message: `Autonomous pipeline completed with ${workflow.steps.length}/${workflow.steps.length} verified steps.`,
        outputPayload: {
          executionEngine: workflow.aiModel,
          stepsCompleted: workflow.steps.map((s) => s.name),
          status: 'SUCCESS',
        },
      };

      setLogs((prev) => [newLog, ...prev]);

      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === workflow.id
            ? {
                ...w,
                executionsCount: w.executionsCount + 1,
                lastRun: 'Just now',
                lastStatus: 'success',
              }
            : w
        )
      );

      toast.success(
        `Autonomous execution for "${workflow.name}" completed successfully.`,
        'Pipeline Complete'
      );
    }, 1200);
  };

  const handleOpenLogsForWorkflow = (workflow: AutonomousWorkflow) => {
    setSelectedWorkflowForLogs(workflow);
    setIsLogsModalOpen(true);
  };

  const handleOpenAllLogs = () => {
    setSelectedWorkflowForLogs(null);
    setIsLogsModalOpen(true);
  };

  const handleEditWorkflow = (workflow: AutonomousWorkflow) => {
    setEditingWorkflow(workflow);
    setIsCreateModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingWorkflow(null);
    setIsCreateModalOpen(true);
  };

  const handleSaveWorkflow = (data: Partial<AutonomousWorkflow>) => {
    if (editingWorkflow) {
      setWorkflows((prev) =>
        prev.map((w) => (w.id === editingWorkflow.id ? ({ ...w, ...data } as AutonomousWorkflow) : w))
      );
      toast.success(`Workflow "${data.name}" settings updated.`, 'Changes Saved');
    } else {
      const created: AutonomousWorkflow = {
        id: data.id || `wf-${Date.now()}`,
        name: data.name || 'Untitled Workflow',
        category: data.category || 'onboarding',
        status: 'active',
        description: data.description || 'Custom autonomous AI pipeline.',
        triggerType: data.triggerType || 'event',
        triggerDetail: data.triggerDetail || 'Event: Custom Trigger',
        aiModel: data.aiModel || 'gemini-1.5-flash',
        humanInTheLoop: data.humanInTheLoop ?? false,
        steps: data.steps || [],
        executionsCount: 0,
        successRate: 100,
        lastRun: 'Never',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setWorkflows((prev) => [created, ...prev]);
      toast.success(`Autonomous Workflow "${created.name}" is now live and monitoring.`, 'Workflow Activated');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Autonomous Workflows
            </h1>
            <Badge variant="brand" size="sm" className="font-semibold text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Gemini Orchestrated</span>
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-xl">
            Event-driven multi-agent pipelines for automated onboarding, exit deactivation, payroll anomaly audits, and leave routing.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenAllLogs}
            className="text-xs flex items-center gap-1.5 border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-2xs"
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-500" />
            <span>Execution Logs</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateNew}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Workflow</span>
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <WorkflowKpiCards kpis={currentKpis} />

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full lg:w-80 shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workflows by trigger, title, or action..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills & Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-1 justify-start lg:justify-end">
          <div className="flex items-center gap-1.5 shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all duration-150 cursor-pointer',
                  selectedCategory === cat.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm font-semibold'
                    : 'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 focus:outline-none cursor-pointer shrink-0"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="paused">Paused Only</option>
          </select>
        </div>
      </div>

      {/* Grid of Workflow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredWorkflows.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            isRunning={Boolean(runningWorkflowIds[workflow.id])}
            onToggleStatus={handleToggleStatus}
            onRunNow={handleRunNow}
            onViewLogs={handleOpenLogsForWorkflow}
            onEdit={handleEditWorkflow}
          />
        ))}
      </div>

      {/* Empty Search / Filter State */}
      {filteredWorkflows.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800">
          <Search className="w-10 h-10 text-slate-400 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No workflows match &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Try adjusting your search terms or selecting another category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Execution Logs Modal */}
      <WorkflowLogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
        logs={logs}
        selectedWorkflow={selectedWorkflowForLogs}
        onRerun={(id) => {
          const target = workflows.find((w) => w.id === id);
          if (target) {
            handleRunNow(target);
          }
        }}
      />

      {/* Create / Edit Workflow Modal */}
      <CreateWorkflowModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingWorkflow(null);
        }}
        onSave={handleSaveWorkflow}
        initialWorkflow={editingWorkflow}
      />
    </div>
  );
};

export default AutonomousWorkflowsPage;

