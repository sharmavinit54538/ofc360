/**
 * @file SuperAdminDashboard.tsx
 * @description Super Administrator Command Center with Global Tenant Broadcast Portal,
 * RBAC security management, and platform-wide announcement integrations.
 */

import React, { useState } from 'react';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import {
  Shield,
  Server,
  Users,
  Activity,
  Lock,
  CheckCircle2,
  Megaphone,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Globe,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { SkeletonCard } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import {
  useGetSuperAdminAnnouncementsQuery,
  useDeleteSuperAdminAnnouncementMutation,
  type SuperAdminAnnouncementResponse,
  SuperAdminAnnouncementModal,
} from '@/features/announcements';

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBroadcast, setEditingBroadcast] = useState<SuperAdminAnnouncementResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // RTK Query: Platform-Wide Super Admin Broadcasts
  const {
    data: broadcasts = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetSuperAdminAnnouncementsQuery();

  const [deleteBroadcast] = useDeleteSuperAdminAnnouncementMutation();

  const handleDelete = async (annId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete platform broadcast "${title}"?`)) {
      return;
    }
    setDeletingId(annId);
    try {
      await deleteBroadcast(annId).unwrap();
      toast.success('Platform broadcast deleted successfully.', 'Deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to delete broadcast', 'Error');
    } finally {
      setDeletingId(null);
    }
  };

  const isSuperAdminEmail = user?.email === 'superadmin@ofc360.com';

  return (
    <DashboardShell
      title="Super Administrator Command Center"
      subtitle="Highest-tier system clearance — Global Multi-Tenant & Security Administration."
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
              <span className="text-xs uppercase font-semibold">Total Tenants</span>
              <Server className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec]">128</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% compliant & isolated</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
              <span className="text-xs uppercase font-semibold">Active User Base</span>
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec]">45,820</div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400">+1,420 joined this month</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
              <span className="text-xs uppercase font-semibold">Security Posture</span>
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">A+ SOC2</div>
            <div className="text-[11px] text-gray-600 dark:text-zinc-400">Zero vulnerability alerts</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
              <span className="text-xs uppercase font-semibold">API Gateway Throughput</span>
              <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec]">1.8M / hr</div>
            <div className="text-[11px] text-gray-600 dark:text-zinc-400">Avg latency 18ms</div>
          </div>
        </div>

        {/* Global Multi-Tenant Broadcast Center (Exclusive to Super Admin) */}
        <RoleGuard
          allowedRoles={['SUPER_ADMIN']}
          fallback={<div className="text-xs text-rose-600 dark:text-rose-400">Access Restricted</div>}
        >
          <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-purple-200 dark:border-purple-900/30 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>Platform-Wide Multi-Tenant Broadcasts</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
                      {broadcasts.length} Active
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    Broadcast global maintenance notices, security advisories, and system circulars to all tenants.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="text-xs rounded-xl"
                  aria-label="Refresh platform broadcasts"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>

                {isSuperAdminEmail && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingBroadcast(null);
                      setIsModalOpen(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-purple-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Dispatch Global Broadcast</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Error Display */}
            {!isLoading && error && (
              <ErrorDisplay error={error} onRetry={refetch} className="py-6" />
            )}

            {/* Empty State */}
            {!isLoading && !error && broadcasts.length === 0 && (
              <EmptyState
                icon={<Globe className="w-6 h-6 text-purple-500" />}
                title="No Platform Broadcasts Active"
                description="Cross-tenant broadcasts dispatched by Super Admins will be displayed here."
                action={
                  isSuperAdminEmail
                    ? {
                        label: 'Dispatch First Broadcast',
                        onClick: () => {
                          setEditingBroadcast(null);
                          setIsModalOpen(true);
                        },
                      }
                    : undefined
                }
              />
            )}

            {/* Broadcasts List */}
            {!isLoading && !error && broadcasts.length > 0 && (
              <div className="space-y-3">
                {broadcasts.map((b) => (
                  <div
                    key={b.ann_id}
                    className="p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-900/40 space-y-3 hover:border-purple-300 dark:hover:border-purple-800 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {b.ann_id}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                          Audience: {b.target_audience}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                          {b.title}
                        </h4>
                      </div>

                      {isSuperAdminEmail && (
                        <div className="flex items-center gap-1 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBroadcast(b);
                              setIsModalOpen(true);
                            }}
                            title="Edit broadcast"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(b.ann_id, b.title)}
                            disabled={deletingId === b.ann_id}
                            title="Delete broadcast"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
                          >
                            {deletingId === b.ann_id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                      {b.content}
                    </p>

                    <div className="text-[11px] text-gray-400 dark:text-zinc-500 pt-1 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                      <span>Dispatch Target: {b.target_audience}</span>
                      <span>{b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Platform Broadcast'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RoleGuard>

        {/* Super Admin Privileged Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-purple-200 dark:border-purple-900/30 space-y-4">
          <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 font-semibold text-sm">
            <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Privileged Super Admin RBAC Operations</span>
          </div>

          <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
            As a Super Admin, your account ({user?.email}) possesses overarching clearance to configure tenant isolation policies, cryptographic keys, and master audit streams.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 space-y-1">
              <div className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">Role Delegation Matrix</div>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">Assign & revoke roles for any user across organizations.</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 space-y-1">
              <div className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">Master Encryption Keys</div>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">Rotate AES-256 tenant envelope keys and database secrets.</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 space-y-1">
              <div className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">Zero-Trust Audit Stream</div>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">Inspect real-time authentication logs and anomaly detections.</p>
            </div>
          </div>
        </div>

        {/* Component-level RoleGuard demonstration */}
        <RoleGuard
          allowedRoles={['SUPER_ADMIN']}
          fallback={<div className="text-xs text-rose-600 dark:text-rose-400">Access Restricted</div>}
        >
          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/30 text-xs text-purple-700 dark:text-purple-300 flex items-center justify-between">
            <span>Verified: Protected by Component-level RoleGuard (SUPER_ADMIN)</span>
            <span className="font-mono text-[10px] bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded">CLEARED</span>
          </div>
        </RoleGuard>

        {/* Super Admin Announcement Modal */}
        <SuperAdminAnnouncementModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBroadcast(null);
          }}
          announcementToEdit={editingBroadcast}
          onSuccess={() => refetch()}
        />
      </div>
    </DashboardShell>
  );
};

export default SuperAdminDashboard;
