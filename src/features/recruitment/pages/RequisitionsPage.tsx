/**
 * @file RequisitionsPage.tsx
 * @description Enterprise Job Requisitions (Manpower Request) Page.
 * Features role-guarded requisition creation, full status-filtered data table,
 * drawer inspector, and integration with DashboardShell.
 */

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, ChevronRight, FileText } from 'lucide-react';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RequisitionsTable } from '../components/RequisitionsTable';
import { CreateRequisitionModal } from '../components/CreateRequisitionModal';

export const RequisitionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { role, activeRole } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const effectiveRole = (activeRole || role || 'HR_ADMIN').toUpperCase();

  // Roles allowed to raise manpower requisitions: SUPER_ADMIN, HR_ADMIN, IT_ADMIN, MANAGER
  const canCreateRequisition =
    effectiveRole === 'SUPER_ADMIN' ||
    effectiveRole === 'HR_ADMIN' ||
    effectiveRole === 'IT_ADMIN' ||
    effectiveRole === 'MANAGER';

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (effectiveRole === 'SUPER_ADMIN') {
        navigate(`/dashboard/super-admin#${tabId}`);
      } else if (effectiveRole === 'MANAGER') {
        navigate(`/dashboard/manager#${tabId}`);
      } else {
        navigate(`/dashboard/hr-admin#${tabId}`);
      }
    },
    [navigate, effectiveRole]
  );

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          activeTab="recruitment"
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={toggleSidebar}
      fullWidth
    >
      <div className="w-full space-y-6">
        {/* Header with Breadcrumbs & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-zinc-800">
          <div>
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mb-1">
              <Link
                to="/recruitment/dashboard"
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Recruitment
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800 dark:text-zinc-200">
                Job Requisitions
              </span>
            </nav>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Job Requisitions (Manpower Requests)
                </h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Track departmental headcount requests, budget authorizations, and approval workflows.
                </p>
              </div>
            </div>
          </div>

          {/* Role-guarded Raise Requisition Action Button */}
          {canCreateRequisition && (
            <Button
              type="button"
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="h-10 px-4 rounded-xl font-semibold inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white shadow-sm shadow-teal-600/20 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Raise Requisition</span>
            </Button>
          )}
        </div>

        {/* Data Table */}
        <RequisitionsTable
          onRaiseRequisitionClick={() => setIsCreateModalOpen(true)}
          canCreate={canCreateRequisition}
        />

        {/* Create Requisition Modal */}
        <CreateRequisitionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </DashboardShell>
  );
};

export default RequisitionsPage;
