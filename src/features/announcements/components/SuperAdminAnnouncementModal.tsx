/**
 * @file SuperAdminAnnouncementModal.tsx
 * @description Accessible dialog for Super Admins to broadcast global notices across all tenants.
 * Restricted to superadmin@ofc360.com / SUPER_ADMIN role.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import {
  useCreateSuperAdminAnnouncementMutation,
  useUpdateSuperAdminAnnouncementMutation,
} from '../api/announcementsApi';
import type {
  SuperAdminAnnouncementResponse,
  SuperAdminAnnouncementPayload,
} from '../types/announcements.types';

export interface SuperAdminAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcementToEdit?: SuperAdminAnnouncementResponse | null;
  onSuccess?: () => void;
}

export const SuperAdminAnnouncementModal: React.FC<SuperAdminAnnouncementModalProps> = ({
  isOpen,
  onClose,
  announcementToEdit,
  onSuccess,
}) => {
  const toast = useToast();
  const [formData, setFormData] = useState<SuperAdminAnnouncementPayload>({
    title: '',
    content: '',
    target_audience: 'ALL_TENANTS',
  });

  const [createSuperAdminAnnouncement, { isLoading: isCreating }] =
    useCreateSuperAdminAnnouncementMutation();
  const [updateSuperAdminAnnouncement, { isLoading: isUpdating }] =
    useUpdateSuperAdminAnnouncementMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      if (announcementToEdit) {
        setFormData({
          title: announcementToEdit.title || '',
          content: announcementToEdit.content || '',
          target_audience: announcementToEdit.target_audience || 'ALL_TENANTS',
        });
      } else {
        setFormData({
          title: '',
          content: '',
          target_audience: 'ALL_TENANTS',
        });
      }
    }
  }, [isOpen, announcementToEdit]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    },
    [isLoading, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.content?.trim() || isLoading) return;

    try {
      if (announcementToEdit) {
        await updateSuperAdminAnnouncement({
          ann_id: announcementToEdit.ann_id,
          data: {
            title: formData.title.trim(),
            content: formData.content.trim(),
            target_audience: formData.target_audience || 'ALL_TENANTS',
          },
        }).unwrap();
        toast.success('Platform broadcast updated successfully.', 'Updated');
      } else {
        await createSuperAdminAnnouncement({
          title: formData.title.trim(),
          content: formData.content.trim(),
          target_audience: formData.target_audience || 'ALL_TENANTS',
        }).unwrap();
        toast.success('Platform-wide announcement broadcasted to all tenants.', 'Broadcast Dispatched');
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      const msg = err?.data?.message || err?.data?.detail || err?.message || 'Failed to dispatch broadcast.';
      toast.error(msg, 'Broadcast Error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="super-admin-announcement-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-2xl border border-purple-200 dark:border-purple-900/40 shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 id="super-admin-announcement-title" className="text-base font-bold text-gray-900 dark:text-white">
                {announcementToEdit ? 'Edit Global Broadcast' : 'Dispatch Global Tenant Broadcast'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Super Admin cross-tenant broadcast & emergency notice
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 min-h-0">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Broadcast Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
              placeholder="e.g. Scheduled Maintenance Window: Nov 15th 02:00 UTC"
              required
              disabled={isLoading}
              maxLength={150}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Message Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors resize-none"
              placeholder="Explain the scheduled downtime, platform upgrade, or compliance requirement..."
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Target Audience
            </label>
            <select
              value={formData.target_audience || 'ALL_TENANTS'}
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs font-medium text-gray-900 dark:text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            >
              <option value="ALL_TENANTS">All Tenants & Organizations</option>
              <option value="ENTERPRISE_TIER">Enterprise Tier Only</option>
              <option value="STANDARD_TIER">Standard Tier Only</option>
            </select>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!formData.title?.trim() || !formData.content?.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{announcementToEdit ? 'Update Broadcast' : 'Dispatch Platform Broadcast'}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminAnnouncementModal;

