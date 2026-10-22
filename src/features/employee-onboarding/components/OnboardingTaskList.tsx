import React from 'react';
import {
  CheckCircle2,
  Clock,
  Laptop,
  Users,
  ShieldCheck,
  Calendar,
  FileCheck,
  Check,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { useUpdateTaskStatusMutation } from '../api/onboardingApi';
import { DocumentUploadCard } from './DocumentUploadCard';
import type { OnboardingTask } from '../types/onboarding.types';

interface OnboardingTaskListProps {
  tasks: OnboardingTask[];
  employeeId?: string;
  isAdmin?: boolean;
  onAdminVerify?: (task: OnboardingTask) => void;
}

export const OnboardingTaskList: React.FC<OnboardingTaskListProps> = ({
  tasks,
  employeeId,
  isAdmin = false,
  onAdminVerify,
}) => {
  const toast = useToast();
  const [updateTaskStatus, { isLoading: isUpdating }] = useUpdateTaskStatusMutation();

  const handleCompleteTask = async (task: OnboardingTask) => {
    try {
      await updateTaskStatus({
        taskId: task.id,
        employeeId,
        status: 'SUBMITTED',
      }).unwrap();

      toast.success(
        `"${task.title}" marked as completed and submitted!`,
        'Milestone Completed'
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message || 'Failed to update milestone status',
        'Action Error'
      );
    }
  };

  const getTaskIcon = (task: OnboardingTask) => {
    switch (task.taskType) {
      case 'IT_ASSET':
        return <Laptop className="w-5 h-5" />;
      case 'MEETING':
        return <Users className="w-5 h-5" />;
      case 'ACKNOWLEDGEMENT':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <FileCheck className="w-5 h-5" />;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717]">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
          No Milestones in this Category
        </h4>
        <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-xs mx-auto mt-1">
          All tasks in this section have been completed or no milestones are required.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {tasks.map((task) => {
        // If task requires document upload, render DocumentUploadCard
        if (task.taskType === 'DOCUMENT_UPLOAD') {
          return (
            <DocumentUploadCard
              key={task.id}
              task={task}
              employeeId={employeeId}
              isAdmin={isAdmin}
              onAdminVerify={onAdminVerify}
            />
          );
        }

        const isVerified = task.status === 'VERIFIED';
        const isSubmitted = task.status === 'SUBMITTED';

        return (
          <div
            key={task.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
                    isVerified
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                      : 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                  }`}
                >
                  {getTaskIcon(task)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {task.title}
                    </h3>
                    {task.isRequired && (
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                        *Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    {task.description}
                  </p>
                  {task.dueDate && (
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>Due by {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
                {isVerified ? (
                  <Badge variant="success" size="sm" className="flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </Badge>
                ) : isSubmitted ? (
                  <Badge variant="warning" size="sm" className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3" /> Submitted
                  </Badge>
                ) : (
                  <Badge variant="slate" size="sm">
                    Pending
                  </Badge>
                )}

                {/* Self-Service Completion Button for Employee */}
                {!isVerified && !isSubmitted && !isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCompleteTask(task)}
                    disabled={isUpdating}
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    Mark Done
                  </Button>
                )}

                {/* Admin Verify Button */}
                {isAdmin && isSubmitted && onAdminVerify && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onAdminVerify(task)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Verify
                  </Button>
                )}
              </div>
            </div>

            {/* Admin verification badge details if verified */}
            {task.verifiedBy && (
              <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 text-[11px] text-gray-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  Approved by {task.verifiedBy} on {new Date(task.verifiedAt || '').toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
