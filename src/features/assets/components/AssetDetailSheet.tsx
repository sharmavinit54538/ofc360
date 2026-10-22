/**
 * @file AssetDetailSheet.tsx
 * @description Slide-over drawer component displaying comprehensive asset specifications,
 * warranty coverage, active employee custody, allocation history, and maintenance logs.
 */

import React from 'react';
import {
  X,
  Box,
  ShieldCheck,
  Calendar,
  DollarSign,
  User,
  Wrench,
  Clock,
  Building2,
  FileText,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type { Asset } from '../types';

interface AssetDetailSheetProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignClick?: (asset: Asset) => void;
  onReturnClick?: (asset: Asset) => void;
  onMaintenanceClick?: (asset: Asset) => void;
}

export const AssetDetailSheet: React.FC<AssetDetailSheetProps> = ({
  asset,
  isOpen,
  onClose,
  onAssignClick,
  onReturnClick,
  onMaintenanceClick,
}) => {
  if (!isOpen || !asset) return null;

  const formatCurrency = (val?: number, currency = 'USD') => {
    if (val === undefined || val === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in-50"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-[#171717] border-l border-gray-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center border border-brand-200/50 dark:border-brand-900/30">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec]">
                  {asset.assetName}
                </h2>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
                  <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">
                    {asset.assetTag}
                  </span>
                  <span>•</span>
                  <span>{asset.category}</span>
                </div>
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

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status and Action Ribbon */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 dark:text-zinc-400 block mb-1">
                  Lifecycle Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {asset.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {asset.status === 'AVAILABLE' && onAssignClick && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onAssignClick(asset)}
                    className="rounded-xl text-xs"
                  >
                    Assign to Staff
                  </Button>
                )}
                {asset.status === 'ASSIGNED' && onReturnClick && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onReturnClick(asset)}
                    className="rounded-xl text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
                  >
                    Process Return
                  </Button>
                )}
                {onMaintenanceClick && asset.status !== 'MAINTENANCE' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMaintenanceClick(asset)}
                    className="rounded-xl text-xs text-gray-600 hover:text-gray-900 dark:text-zinc-400"
                  >
                    Send to Repair
                  </Button>
                )}
              </div>
            </div>

            {/* Current Custody / Assignment */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Current Custody
              </h3>
              {asset.currentHolder ? (
                <div className="p-4 rounded-2xl border border-indigo-200/50 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-950/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-[#ececec] text-sm">
                        {asset.currentHolder.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">
                        {asset.currentHolder.department || 'Staff'} • {asset.currentHolder.employeeId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500 dark:text-zinc-400 font-mono">
                    Since: {asset.currentHolder.assignedDate || 'N/A'}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 text-center text-xs text-gray-400 dark:text-zinc-500">
                  Currently in central storage (Unassigned)
                </div>
              )}
            </div>

            {/* Specifications Grid */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Hardware Specifications & Logistics
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80">
                  <span className="text-gray-400 dark:text-zinc-500 block mb-0.5">Serial Number</span>
                  <span className="font-mono font-semibold text-gray-800 dark:text-zinc-200">
                    {asset.serialNumber}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80">
                  <span className="text-gray-400 dark:text-zinc-500 block mb-0.5">Purchase Cost</span>
                  <span className="font-semibold text-gray-800 dark:text-zinc-200">
                    {formatCurrency(asset.cost, asset.currency)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80">
                  <span className="text-gray-400 dark:text-zinc-500 block mb-0.5">Purchase Date</span>
                  <span className="font-medium text-gray-800 dark:text-zinc-200">
                    {asset.purchaseDate || 'N/A'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80">
                  <span className="text-gray-400 dark:text-zinc-500 block mb-0.5">Warranty Expiry</span>
                  <span className="font-medium text-gray-800 dark:text-zinc-200">
                    {asset.warrantyExpiry || 'No coverage logged'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80">
                  <span className="text-gray-400 dark:text-zinc-500 block mb-0.5">Vendor / Supplier</span>
                  <span className="font-medium text-gray-800 dark:text-zinc-200">
                    {asset.vendor || 'Authorized Distributor'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80">
                  <span className="text-gray-400 dark:text-zinc-500 block mb-0.5">Assigned Location</span>
                  <span className="font-medium text-gray-800 dark:text-zinc-200">
                    {asset.location || 'Headquarters'}
                  </span>
                </div>
              </div>
            </div>

            {/* Allocation History */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Allocation History
              </h3>
              {asset.allocations && asset.allocations.length > 0 ? (
                <div className="space-y-2">
                  {asset.allocations.map((alloc) => (
                    <div
                      key={alloc.id}
                      className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-[#ececec]">
                          {alloc.employeeName}
                        </div>
                        <div className="text-gray-500 dark:text-zinc-400 text-[11px]">
                          {alloc.department || 'Staff'} • Condition: {alloc.conditionOnAssign || 'Good'}
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-gray-400 dark:text-zinc-500 font-mono">
                        {alloc.assignedDate} → {alloc.returnDate || 'Present'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 dark:text-zinc-500 italic p-3 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl text-center">
                  No prior allocation history for this device.
                </p>
              )}
            </div>

            {/* Maintenance History */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> Maintenance & Repair Log
              </h3>
              {asset.maintenanceRecords && asset.maintenanceRecords.length > 0 ? (
                <div className="space-y-2">
                  {asset.maintenanceRecords.map((record) => (
                    <div
                      key={record.id}
                      className="p-3 rounded-xl border border-gray-200 dark:border-zinc-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-[#ececec]">
                          {record.issueDescription}
                        </span>
                        <span className="font-mono text-xs text-brand-600 dark:text-brand-400">
                          {formatCurrency(record.cost)}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center justify-between">
                        <span>Vendor: {record.vendor || 'Internal IT'}</span>
                        <span className="font-mono">{record.startDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 dark:text-zinc-500 italic p-3 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl text-center">
                  No maintenance incidents or repairs logged.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailSheet;
