import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type {
  AutonomousWorkflow,
  WorkflowCategory,
  TriggerType,
  AIModelType,
  WorkflowStep,
} from '../types/workflow.types';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workflow: Partial<AutonomousWorkflow>) => void;
  initialWorkflow?: AutonomousWorkflow | null;
}

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialWorkflow,
}) => {
  const [name, setName] = useState(initialWorkflow?.name || '');
  const [category, setCategory] = useState<WorkflowCategory>(
    initialWorkflow?.category || 'onboarding'
  );
  const [description, setDescription] = useState(initialWorkflow?.description || '');
  const [triggerType, setTriggerType] = useState<TriggerType>(
    initialWorkflow?.triggerType || 'event'
  );
  const [triggerDetail, setTriggerDetail] = useState(
    initialWorkflow?.triggerDetail || 'Event: New Employee Joined'
  );
  const [aiModel, setAiModel] = useState<AIModelType>(
    initialWorkflow?.aiModel || 'gemini-1.5-flash'
  );
  const [humanInTheLoop, setHumanInTheLoop] = useState(
    initialWorkflow?.humanInTheLoop ?? false
  );

  const [steps, setSteps] = useState<WorkflowStep[]>(
    initialWorkflow?.steps || [
      { id: '1', name: 'Trigger Ingestion', type: 'trigger', description: 'Detects event payload from OFC360 event bus' },
      { id: '2', name: 'AI Policy Assessment', type: 'ai_eval', description: 'Evaluates parameters against enterprise handbook rules' },
      { id: '3', name: 'Automated Action Dispatch', type: 'action', description: 'Dispatches Slack alerts and updates records' },
    ]
  );

  const [newStepName, setNewStepName] = useState('');

  if (!isOpen) return null;

  const handleAddStep = () => {
    if (!newStepName.trim()) return;
    setSteps([
      ...steps,
      {
        id: String(Date.now()),
        name: newStepName.trim(),
        type: 'action',
        description: 'Custom automated execution task step',
      },
    ]);
    setNewStepName('');
  };

  const handleRemoveStep = (id: string) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialWorkflow?.id || `wf-${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim() || 'Custom autonomous AI enterprise pipeline.',
      triggerType,
      triggerDetail: triggerDetail.trim(),
      aiModel,
      humanInTheLoop,
      steps,
      status: initialWorkflow?.status || 'active',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {initialWorkflow ? 'Configure Autonomous Workflow' : 'Build New Autonomous Workflow'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Setup trigger conditions, Gemini reasoning, and execution pipelines
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Workflow Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-zinc-300 block">
              Workflow Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Smart Leave Escalation & Manager Pings"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category & AI Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-zinc-300 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WorkflowCategory)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="onboarding">Onboarding &amp; Hire</option>
                <option value="offboarding">Offboarding &amp; Exit</option>
                <option value="attendance">Attendance &amp; Shifts</option>
                <option value="payroll">Payroll &amp; Expenses</option>
                <option value="compliance">Statutory Compliance</option>
                <option value="security">Identity &amp; SecOps</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-zinc-300 block">AI Reasoning Engine</label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value as AIModelType)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-fast &lt;500ms)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Multimodal &amp; Logic)</option>
                <option value="autonomous-rule">Deterministic Rule Engine</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-zinc-300 block">Description &amp; Objective</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what event triggers this workflow and what tasks are performed..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Trigger Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-zinc-300 block">Trigger Mechanism</label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value as TriggerType)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="event">Real-time Event Hook</option>
                <option value="schedule">Scheduled Cron Job</option>
                <option value="anomaly">Threshold / Anomaly Trigger</option>
                <option value="webhook">External Webhook</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-zinc-300 block">Trigger Specification</label>
              <input
                type="text"
                required
                value={triggerDetail}
                onChange={(e) => setTriggerDetail(e.target.value)}
                placeholder="e.g. Cron: Daily at 10:00 IST or Event: Resignation Approved"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Human-in-the-loop checkbox */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
            <input
              type="checkbox"
              id="hitl"
              checked={humanInTheLoop}
              onChange={(e) => setHumanInTheLoop(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <label htmlFor="hitl" className="text-xs text-slate-700 dark:text-zinc-300 cursor-pointer">
              <strong className="text-slate-900 dark:text-white">Require Human Approval (HITL)</strong>
              <span className="block text-[11px] text-slate-500 dark:text-zinc-400">
                AI prepares decisions and alerts manager/HR before executing final write operations.
              </span>
            </label>
          </div>

          {/* Steps Pipeline */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <span className="font-semibold text-slate-700 dark:text-zinc-300 block">
              Sequential Execution Steps ({steps.length})
            </span>
            <div className="space-y-2">
              {steps.map((st, i) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{st.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(st.id)}
                    disabled={steps.length <= 1}
                    className="text-slate-400 hover:text-rose-500 disabled:opacity-30 disabled:pointer-events-none p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Step Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
                placeholder="Add next pipeline step..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStep();
                  }
                }}
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddStep} className="text-xs gap-1">
                <Plus className="w-3 h-3" />
                <span>Add Step</span>
              </Button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-2.5">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {initialWorkflow ? 'Save Changes' : 'Activate Workflow'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

