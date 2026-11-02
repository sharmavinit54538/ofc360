/**
 * @file workflow.types.ts
 * @description Types and interfaces for the OFC360 Autonomous Workflows engine.
 */

export type WorkflowCategory =
  | 'onboarding'
  | 'offboarding'
  | 'payroll'
  | 'attendance'
  | 'compliance'
  | 'security';

export type WorkflowStatus = 'active' | 'paused' | 'draft';

export type TriggerType = 'event' | 'schedule' | 'webhook' | 'anomaly';

export type AIModelType = 'gemini-1.5-pro' | 'gemini-1.5-flash' | 'autonomous-rule';

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'trigger' | 'condition' | 'action' | 'ai_eval';
  description: string;
  integration?: 'slack' | 'email' | 'google-workspace' | 'payroll' | 'epfo' | 'doc-gen' | 'audit';
}

export interface AutonomousWorkflow {
  id: string;
  name: string;
  category: WorkflowCategory;
  status: WorkflowStatus;
  description: string;
  triggerType: TriggerType;
  triggerDetail: string;
  aiModel: AIModelType;
  humanInTheLoop: boolean;
  steps: WorkflowStep[];
  executionsCount: number;
  successRate: number;
  lastRun?: string;
  lastStatus?: 'success' | 'failed' | 'running';
  createdAt: string;
}

export interface WorkflowLog {
  id: string;
  workflowId: string;
  workflowName: string;
  trigger: string;
  timestamp: string;
  durationMs: number;
  status: 'success' | 'failed' | 'running';
  stepsCompleted: number;
  totalSteps: number;
  message: string;
  outputPayload?: Record<string, any>;
}

export interface WorkflowKpis {
  totalWorkflows: number;
  activeAutomations: number;
  executionsToday: number;
  successRate: number;
  hoursSavedMonthly: number;
}

