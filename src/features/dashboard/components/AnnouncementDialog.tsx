/**
 * @file AnnouncementDialog.tsx
 * @description Accessible dialog for creating and publishing corporate announcements.
 * Shared across HR Dashboard Overview, Connect Announcement portal, and HR Ops Quick Actions.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, Megaphone, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { Announcement } from '@/features/hr-dashboard/types/hrDashboard.types';

export interface AnnouncementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Announcement>) => Promise<void>;
  loading?: boolean;
}

const INITIAL_FORM_STATE: Partial<Announcement> = {
  title: '',
  content: '',
  type: 'INFO',
  priority: 'MEDIUM',
  targetAudience: 'ALL',
  isPinned: false,
};

export const AnnouncementDialog: React.FC<AnnouncementDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Announcement>>(INITIAL_FORM_STATE);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [isOpen]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    },
    [loading, onClose]
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
    if (!formData.title?.trim() || !formData.content?.trim() || loading) return;

    try {
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        content: formData.content.trim(),
      });
      // Only close and reset if onSubmit resolves without error
      onClose();
      setFormData(INITIAL_FORM_STATE);
    } catch {
      // Keep modal open and form data intact on error so user doesn't lose content
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 id="announcement-dialog-title" className="text-base font-bold text-gray-900 dark:text-white">
                Post Announcement
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Broadcast official circular or company notice
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
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
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-colors"
              placeholder="e.g. Q4 Townhall & Annual Policy Update"
              required
              disabled={loading}
              maxLength={150}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-colors resize-none"
              placeholder="Write your announcement details, instructions, or policy summary..."
              required
              disabled={loading}
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Category
              </label>
              <select
                value={formData.type || 'INFO'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Announcement['type'] })}
                disabled={loading}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs font-medium text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-colors"
              >
                <option value="INFO">Information</option>
                <option value="WARNING">Warning</option>
                <option value="URGENT">Urgent Notice</option>
                <option value="POLICY">Policy Update</option>
                <option value="EVENT">Event</option>
                <option value="CELEBRATION">Celebration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority || 'MEDIUM'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Announcement['priority'] })}
                disabled={loading}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs font-medium text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-colors"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Target Audience
            </label>
            <select
              value={formData.targetAudience || 'ALL'}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as Announcement['targetAudience'] })}
              disabled={loading}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs font-medium text-gray-900 dark:text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-colors"
            >
              <option value="ALL">All Employees (Company-wide)</option>
              <option value="DEPARTMENT">Specific Department</option>
              <option value="ROLE">Specific Role</option>
              <option value="SPECIFIC">Specific Individuals</option>
            </select>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="isPinned"
              checked={formData.isPinned || false}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              disabled={loading}
              className="w-4 h-4 rounded border-gray-300 dark:border-zinc-700 text-rose-600 focus:ring-rose-500"
            />
            <label htmlFor="isPinned" className="text-xs text-gray-600 dark:text-zinc-300 cursor-pointer select-none">
              Pin to top of announcement feed
            </label>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!formData.title?.trim() || !formData.content?.trim() || loading}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Publish Announcement</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementDialog;

