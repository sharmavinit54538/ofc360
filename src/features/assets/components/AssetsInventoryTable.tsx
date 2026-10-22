/**
 * @file AssetsInventoryTable.tsx
 * @description Enterprise asset inventory data table featuring real-time status badges,
 * hardware category iconography, employee assignment badges, action dropdowns,
 * slide-over inspection triggers, and empty states.
 */

import React from 'react';
import {
  Laptop,
  Monitor,
  Smartphone,
  Server,
  HardDrive,
  Cpu,
  Layers,
  Wrench,
  UserCheck,
  CheckCircle2,
  Archive,
  QrCode,
  Eye,
  Plus,
  User,
  ArrowRightLeft,
  RotateCcw,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type { Asset, AssetStatus, AssetCategory } from '../types';

interface AssetsInventoryTableProps {
  assets: Asset[];
  isLoading: boolean;
  onViewDetails: (asset: Asset) => void;
  onAssignClick: (asset: Asset) => void;
  onReturnClick: (asset: Asset) => void;
  onQrClick: (asset: Asset) => void;
  onAddClick?: () => void;
  isActionLoading?: boolean;
}

export const AssetsInventoryTable: React.FC<AssetsInventoryTableProps> = ({
  assets,
  isLoading,
  onViewDetails,
  onAssignClick,
  onReturnClick,
  onQrClick,
  onAddClick,
  isActionLoading = false,
}) => {
  const getCategoryIcon = (category: AssetCategory) => {
    switch (category) {
      case 'LAPTOP':
        return <Laptop className="w-4 h-4" />;
      case 'DESKTOP':
        return <Monitor className="w-4 h-4" />;
      case 'MOBILE':
        return <Smartphone className="w-4 h-4" />;
      case 'MONITOR':
        return <Monitor className="w-4 h-4" />;
      case 'SERVER':
        return <Server className="w-4 h-4" />;
      case 'NETWORKING':
        return <HardDrive className="w-4 h-4" />;
      case 'PERIPHERAL':
      case 'OTHER':
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <Badge variant="success" size="sm" className="font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Available
          </Badge>
        );
      case 'ASSIGNED':
        return (
          <Badge variant="brand" size="sm" className="font-semibold flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            Assigned
          </Badge>
        );
      case 'MAINTENANCE':
        return (
          <Badge variant="warning" size="sm" className="font-semibold flex items-center gap-1">
            <Wrench className="w-3 h-3" />
            Maintenance
          </Badge>
        );
      case 'RETIRED':
      default:
        return (
          <Badge variant="slate" size="sm" className="font-semibold flex items-center gap-1">
            <Archive className="w-3 h-3" />
            Retired
          </Badge>
        );
    }
  };

  const formatCurrency = (val?: number, currency = 'USD') => {
    if (val === undefined || val === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 animate-pulse">
          <div className="h-4 w-44 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3 w-1/4">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-zinc-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded hidden sm:block" />
              <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded hidden md:block" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-8 w-28 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center shadow-sm">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 border border-brand-200/50 dark:border-brand-900/30">
          <Layers className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
          No Assets Found
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
          There are currently no equipment items matching your search or filters. Register your first device to begin tracking inventory.
        </p>
        {onAddClick && (
          <div className="mt-5">
            <Button
              variant="primary"
              size="sm"
              onClick={onAddClick}
              className="inline-flex items-center gap-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Add Equipment
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/75 dark:bg-zinc-900/60 border-b border-gray-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400">
            <tr>
              <th className="py-3.5 px-4">Asset Details</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Serial / Tag</th>
              <th className="py-3.5 px-4">Current Holder</th>
              <th className="py-3.5 px-4">Purchase & Cost</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 text-gray-700 dark:text-zinc-300">
            {assets.map((asset) => (
              <tr
                key={asset.id}
                className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors"
              >
                {/* Asset Identity */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500/10 to-indigo-500/20 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center border border-brand-200/40 dark:border-brand-900/30 shrink-0">
                      {getCategoryIcon(asset.category)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-[#ececec]">
                        {asset.assetName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400">
                        {asset.location || 'HQ Storage'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">
                    {asset.category}
                  </span>
                </td>

                {/* Tag & Serial */}
                <td className="py-3.5 px-4 font-mono text-xs">
                  <div className="font-bold text-brand-600 dark:text-brand-400">
                    {asset.assetTag}
                  </div>
                  <div className="text-gray-400 dark:text-zinc-500 text-[11px]">
                    SN: {asset.serialNumber}
                  </div>
                </td>

                {/* Current Holder */}
                <td className="py-3.5 px-4">
                  {asset.currentHolder ? (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 border border-indigo-200/50 dark:border-indigo-900/30">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-[#ececec] text-xs">
                          {asset.currentHolder.name}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-zinc-400">
                          {asset.currentHolder.department || asset.currentHolder.employeeId}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500 italic">
                      In Stock / Unassigned
                    </span>
                  )}
                </td>

                {/* Purchase Date & Cost */}
                <td className="py-3.5 px-4 text-xs">
                  <div className="font-semibold text-gray-900 dark:text-[#ececec]">
                    {formatCurrency(asset.cost, asset.currency)}
                  </div>
                  <div className="text-gray-400 dark:text-zinc-500 text-[11px]">
                    {asset.purchaseDate || 'N/A'}
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  {getStatusBadge(asset.status)}
                </td>

                {/* Action Buttons */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Assign Action */}
                    {asset.status === 'AVAILABLE' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isActionLoading}
                        onClick={() => onAssignClick(asset)}
                        title="Assign to Employee"
                        className="rounded-lg text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 text-xs px-2.5 py-1 flex items-center gap-1"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Assign</span>
                      </Button>
                    )}

                    {/* Return Action */}
                    {asset.status === 'ASSIGNED' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isActionLoading}
                        onClick={() => onReturnClick(asset)}
                        title="Return to Inventory"
                        className="rounded-lg text-amber-600 hover:text-amber-700 dark:text-amber-400 text-xs px-2.5 py-1 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Return</span>
                      </Button>
                    )}

                    {/* QR Sticker */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onQrClick(asset)}
                      title="Print Barcode / QR Tag Sticker"
                      className="rounded-lg text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#ececec] text-xs p-1.5"
                    >
                      <QrCode className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </Button>

                    {/* Details Slide-Over */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(asset)}
                      title="View Asset Lifecycle & Specs"
                      className="rounded-lg text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#ececec] text-xs p-1.5"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetsInventoryTable;
