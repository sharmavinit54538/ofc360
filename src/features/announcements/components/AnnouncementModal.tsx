/**
 * @file AnnouncementModal.tsx
 * @description Accessible dialog for Creating and Updating Company Announcements.
 * Enforces validation schemas, RBAC guards, and handles 403 messaging cleanly.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, Megaphone, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import {
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from '../api/announcementsApi';
import type {
  AnnouncementResponse,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
  AnnouncementPriority,
  AnnouncementStatus,
} from '../types/announcements.types';

export interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcementToEdit?: AnnouncementResponse | null;
  onSuccess?: () => void;
}

const getInitialFormData = (existing?: AnnouncementResponse | null): CreateAnnouncementPayload => {
  if (existing) {
    return {
      title: existing.title || '',
      description: existing.description || '',
      category: existing.category || 'General',
      priority: existing.priority || 'MEDIUM',
      department: existing.department || null,
      branch: existing.branch || null,
      visibility: existing.visibility || 'ALL_EMPLOYEES',
      publish_date: existing.publish_date || new Date().toISOString().split('T')[0],
      expiry_date: existing.expiry_date || null,
      is_pinned: Boolean(existing.is_pinned),
      status: existing.status || 'DRAFT',
    };
  }
  return {
    title: '',
    description: '',
    category: 'General',
    priority: 'MEDIUM',
    department: null,
    branch: null,
    visibility: 'ALL_EMPLOYEES',
    publish_date: new Date().toISOString().split('T')[0],
    expiry_date: null,
    is_pinned: false,
    status: 'DRAFT',
  };
};

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  announcementToEdit,
  onSuccess,
}) => {
  const toast = useToast();
  const [formData, setFormData] = useState<CreateAnnouncementPayload>(() =>
    getInitialFormData(announcementToEdit)
  );

  const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(announcementToEdit));
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
    if (!formData.title?.trim() || !formData.description?.trim() || isLoading) return;

    try {
      if (announcementToEdit) {
        const updatePayload: UpdateAnnouncementPayload = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category || 'General',
          priority: formData.priority || 'MEDIUM',
          department: formData.department || null,
          branch: formData.branch || null,
          visibility: formData.visibility || 'ALL_EMPLOYEES',
          publish_date: formData.publish_date || new Date().toISOString().split('T')[0],
          expiry_date: formData.expiry_date || null,
          is_pinned: Boolean(formData.is_pinned),
          status: formData.status || 'DRAFT',
        };
        await updateAnnouncement({ id: announcementToEdit.id, data: updatePayload }).unwrap();
        toast.success('Announcement updated successfully.', 'Updated');
      } else {
        const createPayload: CreateAnnouncementPayload = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category || 'General',
          priority: formData.priority || 'MEDIUM',
          department: formData.department || null,
          branch: formData.branch || null,
          visibility: formData.visibility || 'ALL_EMPLOYEES',
          publish_date: formData.publish_date || new Date().toISOString().split('T')[0],
          expiry_date: formData.expiry_date || null,
          is_pinned: Boolean(formData.is_pinned),
          status: formData.status || 'DRAFT',
        };
        await createAnnouncement(createPayload).unwrap();
        toast.success('Announcement broadcast created successfully.', 'Published');
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      const status = err?.status || err?.statusCode;
      const rawMsg = err?.data?.message || err?.data?.detail || err?.message;
      if (status === 403 || (typeof rawMsg === 'string' && rawMsg.includes('departments'))) {
        toast.error(
          'Only Super Admin, HR Admin, and IT Admin can manage announcements.',
          'Access Denied'
        );
      } else {
        toast.error(
          typeof rawMsg === 'string' ? rawMsg : 'Failed to save announcement. Please check all fields.',
          'Operation Error'
        );
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-xl bg-white dark:bg-[#171717] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 id="announcement-modal-title" className="text-base font-bold text-gray-900 dark:text-white">
                {announcementToEdit ? 'Edit Announcement' : 'Post Company Announcement'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Official circular, policy bulletin, or department broadcast
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
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-colors"
              placeholder="e.g. Annual Company Offsite & Q4 Product Roadmap"
              required
              disabled={isLoading}
              maxLength={150}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Description / Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-colors resize-none"
              placeholder="Enter full announcement details, links, or instructions..."
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={formData.category || 'General'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={isLoading}
                placeholder="e.g. HR Policy"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority || 'MEDIUM'}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as AnnouncementPriority })
                }
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs font-medium text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Status
              </label>
              <select
                value={formData.status || 'DRAFT'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as AnnouncementStatus })
                }
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs font-medium text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Target Department (Optional)
              </label>
              <input
                type="text"
                value={formData.department || ''}
                onChange={(e) => setFormData({ ...formData, department: e.target.value || null })}
                disabled={isLoading}
                placeholder="Leave blank for All Departments"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Target Branch / Office (Optional)
              </label>
              <input
                type="text"
                value={formData.branch || ''}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value || null })}
                disabled={isLoading}
                placeholder="Leave blank for All Branches"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Publish Date
              </label>
              <input
                type="date"
                value={formData.publish_date || ''}
                onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={formData.expiry_date || ''}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value || null })}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="announcement_is_pinned"
              checked={formData.is_pinned || false}
              onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
              disabled={isLoading}
              className="w-4 h-4 rounded border-gray-300 dark:border-zinc-700 text-rose-600 focus:ring-rose-500"
            />
            <label
              htmlFor="announcement_is_pinned"
              className="text-xs text-gray-600 dark:text-zinc-300 cursor-pointer select-none"
            >
              Pin this announcement to top of employee feed
            </label>
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
              disabled={!formData.title?.trim() || !formData.description?.trim() || isLoading}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>{announcementToEdit ? 'Update Announcement' : 'Publish Announcement'}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;

