/**
 * @file AssignAssetModal.tsx
 * @description Dialog modal for assigning equipment to an active staff member,
 * logging device physical condition, and updating custody records.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, ArrowRightLeft, User, Mail, Building2, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { useAssignAssetMutation } from '../api/assetsApi';
import { assignAssetSchema, type AssignAssetFormData } from '../schemas/assetForm.schema';
import type { Asset } from '../types';

interface AssignAssetModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignAssetModal: React.FC<AssignAssetModalProps> = ({ asset, isOpen, onClose }) => {
  const toast = useToast();
  const [assignAsset, { isLoading }] = useAssignAssetMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignAssetFormData>({
    resolver: zodResolver(assignAssetSchema),
    defaultValues: {
      employeeId: '',
      employeeName: '',
      employeeEmail: '',
      department: '',
      assignedDate: new Date().toISOString().split('T')[0],
      condition: 'Good - Working Order',
      notes: '',
    },
  });

  if (!isOpen || !asset) return null;

  const onSubmit = async (data: AssignAssetFormData) => {
    try {
      await assignAsset({
        assetId: asset.id,
        ...data,
      }).unwrap();
      toast.success(
        `Asset ${asset.assetTag} assigned to ${data.employeeName} successfully!`,
        'Asset Assigned'
      );
      reset();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to assign equipment.',
        'Assignment Error'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-asset-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-sm shadow-emerald-500/20">
              <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[10px] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 id="assign-asset-title" className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#ececec]">
                Assign Equipment
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Transfer custody of <span className="font-semibold text-brand-600 dark:text-brand-400">{asset.assetTag}</span> ({asset.assetName})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Employee ID & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Employee ID / Staff Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('employeeId')}
                    placeholder="e.g. EMP-1042"
                    error={errors.employeeId?.message}
                    className="pl-9 font-mono"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Employee Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('employeeName')}
                    placeholder="e.g. Alex Johnson"
                    error={errors.employeeName?.message}
                    className="pl-9"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Email & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Corporate Email
                </label>
                <div className="relative">
                  <Input
                    {...register('employeeEmail')}
                    type="email"
                    placeholder="alex@ofc360.com"
                    error={errors.employeeEmail?.message}
                    className="pl-9"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Department
                </label>
                <div className="relative">
                  <Input
                    {...register('department')}
                    placeholder="e.g. Product Engineering"
                    className="pl-9"
                  />
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Handover Date & Physical Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Handover Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('assignedDate')}
                    type="date"
                    className="pl-9"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Physical Condition
                </label>
                <select
                  {...register('condition')}
                  className="w-full px-3 py-2 rounded-xl text-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="Mint - Brand New">Mint - Brand New</option>
                  <option value="Good - Working Order">Good - Working Order</option>
                  <option value="Fair - Minor Wear">Fair - Minor Wear</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Handover Notes / Peripherals Included
              </label>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Charging adapter, laptop sleeve, or dock included..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-zinc-900/40">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="rounded-xl text-sm px-5"
            >
              {isLoading ? 'Assigning...' : 'Confirm Assignment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignAssetModal;
