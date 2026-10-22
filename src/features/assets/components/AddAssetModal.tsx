/**
 * @file AddAssetModal.tsx
 * @description React Hook Form + Zod dialog modal for onboarding and registering new company equipment,
 * hardware specifications, cost, and serial identifiers.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Box, Hash, DollarSign, Calendar, Building2, MapPin } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { useCreateAssetMutation } from '../api/assetsApi';
import { assetFormSchema, type AssetFormData } from '../schemas/assetForm.schema';
import type { AssetCategory } from '../types';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { label: string; value: AssetCategory }[] = [
  { label: 'Laptop', value: 'LAPTOP' },
  { label: 'Desktop Workstation', value: 'DESKTOP' },
  { label: 'Mobile Device', value: 'MOBILE' },
  { label: 'Monitor / Display', value: 'MONITOR' },
  { label: 'Peripherals & Accessories', value: 'PERIPHERAL' },
  { label: 'Server & Rack Equipment', value: 'SERVER' },
  { label: 'Networking Equipment', value: 'NETWORKING' },
  { label: 'Office Furniture', value: 'FURNITURE' },
  { label: 'Other Asset', value: 'OTHER' },
];

export const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [createAsset, { isLoading }] = useCreateAssetMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      assetName: '',
      assetTag: '',
      serialNumber: '',
      category: 'LAPTOP',
      purchaseDate: new Date().toISOString().split('T')[0],
      cost: 0,
      currency: 'USD',
      warrantyExpiry: '',
      vendor: '',
      location: 'HQ Central Storage',
      notes: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: AssetFormData) => {
    try {
      await createAsset(data).unwrap();
      toast.success(`Asset ${data.assetName} (${data.assetTag}) registered successfully!`, 'Asset Created');
      reset();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to register equipment. Please check form inputs.',
        'Registration Failed'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-asset-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-sm shadow-brand-500/20">
              <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[10px] flex items-center justify-center text-brand-600 dark:text-brand-400">
                <Box className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 id="add-asset-title" className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#ececec]">
                Register New Equipment
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Record hardware specifications, serial numbers, and cost allocation
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
            {/* Asset Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Asset / Model Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('assetName')}
                    placeholder="e.g. MacBook Pro 16 M3 Max"
                    error={errors.assetName?.message}
                    className="pl-9"
                  />
                  <Box className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Hardware Category <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 rounded-xl text-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Asset Tag & Serial Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Asset Tag / Barcode <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('assetTag')}
                    placeholder="e.g. OFC-AST-1049"
                    error={errors.assetTag?.message}
                    className="pl-9 font-mono"
                  />
                  <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Serial Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('serialNumber')}
                    placeholder="e.g. C02G80XZMD6R"
                    error={errors.serialNumber?.message}
                    className="pl-9 font-mono"
                  />
                  <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Purchase Date & Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Purchase Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('purchaseDate')}
                    type="date"
                    error={errors.purchaseDate?.message}
                    className="pl-9"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Purchase Cost (USD) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('cost')}
                    type="number"
                    step="0.01"
                    placeholder="1999.00"
                    error={errors.cost?.message}
                    className="pl-9"
                  />
                  <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Warranty Expiry & Vendor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Warranty Expiry Date
                </label>
                <div className="relative">
                  <Input
                    {...register('warrantyExpiry')}
                    type="date"
                    className="pl-9"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Vendor / Supplier
                </label>
                <div className="relative">
                  <Input
                    {...register('vendor')}
                    placeholder="e.g. Apple Direct / CDW"
                    className="pl-9"
                  />
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Location & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Default Storage Location
                </label>
                <div className="relative">
                  <Input
                    {...register('location')}
                    placeholder="e.g. HQ Floor 3 - IT Cage"
                    className="pl-9"
                  />
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Additional Notes
                </label>
                <input
                  {...register('notes')}
                  placeholder="e.g. Includes power brick and Thunderbolt hub"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
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
              {isLoading ? 'Registering...' : 'Register Asset'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
