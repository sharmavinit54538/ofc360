/**
 * @file AssetManagementPage.tsx
 * @description Enterprise Asset Management dashboard integrating hardware inventory,
 * equipment allocation workflows, lifecycle statuses, KPI metric cards, and RTK Query hooks.
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetAssetsListQuery,
  useGetAssetStatsQuery,
  useReturnAssetMutation,
  useMarkAssetMaintenanceMutation,
} from '../api/assetsApi';
import type {
  Asset,
  AssetCategory,
  AssetStatus,
  AssetListFilters,
} from '../types';
import { AssetsStatsCards } from '../components/AssetsStatsCards';
import { AssetsInventoryTable } from '../components/AssetsInventoryTable';
import { AssetDetailSheet } from '../components/AssetDetailSheet';
import { AddAssetModal } from '../components/AddAssetModal';
import { AssignAssetModal } from '../components/AssignAssetModal';
import { QrStickerModal } from '../components/QrStickerModal';

const CATEGORIES: { label: string; value: AssetCategory | 'ALL' }[] = [
  { label: 'All Categories', value: 'ALL' },
  { label: 'Laptops', value: 'LAPTOP' },
  { label: 'Desktops', value: 'DESKTOP' },
  { label: 'Mobile Devices', value: 'MOBILE' },
  { label: 'Monitors', value: 'MONITOR' },
  { label: 'Peripherals', value: 'PERIPHERAL' },
  { label: 'Servers', value: 'SERVER' },
  { label: 'Networking', value: 'NETWORKING' },
  { label: 'Furniture', value: 'FURNITURE' },
  { label: 'Other', value: 'OTHER' },
];

export const AssetManagementPage: React.FC = () => {
  const toast = useToast();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'ALL'>('ALL');

  // Modal / Drawer States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // RTK Query Filters Payload
  const queryFilters: AssetListFilters = useMemo(
    () => ({
      search: searchQuery.trim() || undefined,
      category: categoryFilter,
      status: statusFilter,
    }),
    [searchQuery, categoryFilter, statusFilter]
  );

  // RTK Query Hooks (Real backend integration, zero mock data)
  const {
    data: assetsData,
    isLoading: isAssetsLoading,
    isFetching: isAssetsFetching,
    error: assetsError,
    refetch: refetchAssets,
  } = useGetAssetsListQuery(queryFilters);

  const {
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetAssetStatsQuery();

  // Mutations
  const [returnAsset, { isLoading: isReturning }] = useReturnAssetMutation();
  const [markMaintenance, { isLoading: isMarkingMaintenance }] = useMarkAssetMaintenanceMutation();

  const handleRefresh = () => {
    refetchAssets();
    refetchStats();
    toast.info('Syncing hardware inventory with server...', 'Data Refreshed');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
  };

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDetailSheetOpen(true);
  };

  const handleAssignClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsAssignModalOpen(true);
  };

  const handleQrClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsQrModalOpen(true);
  };

  const handleReturnClick = async (asset: Asset) => {
    if (!window.confirm(`Process return of ${asset.assetTag} (${asset.assetName}) back to inventory?`)) {
      return;
    }
    try {
      await returnAsset({ assetId: asset.id }).unwrap();
      toast.success(`Asset ${asset.assetTag} returned to available inventory.`, 'Asset Returned');
      if (selectedAsset?.id === asset.id) {
        setIsDetailSheetOpen(false);
        setSelectedAsset(null);
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to return asset.',
        'Action Error'
      );
    }
  };

  const handleMaintenanceClick = async (asset: Asset) => {
    const issue = window.prompt(`Enter maintenance / repair details for ${asset.assetTag}:`);
    if (!issue || !issue.trim()) return;

    try {
      await markMaintenance({
        assetId: asset.id,
        issueDescription: issue.trim(),
      }).unwrap();
      toast.success(`Asset ${asset.assetTag} transferred to maintenance queue.`, 'Sent to Maintenance');
      if (selectedAsset?.id === asset.id) {
        setIsDetailSheetOpen(false);
        setSelectedAsset(null);
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to update maintenance status.',
        'Action Error'
      );
    }
  };

  const items = assetsData?.items || [];
  const stats = statsData || assetsData?.stats;
  const isActionLoading = isReturning || isMarkingMaintenance;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
            Asset Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Track hardware lifecycle, employee device allocations, warranty expirations, and IT service repairs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isAssetsFetching}
            className="rounded-xl flex items-center gap-1.5"
            title="Refresh assets from server"
          >
            <RefreshCw className={`w-4 h-4 ${isAssetsFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-xl flex items-center gap-2 shadow-sm shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Equipment
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <AssetsStatsCards
        stats={stats}
        isLoading={isStatsLoading || isAssetsLoading}
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by asset name, tag, or serial no..."
              className="pl-9 pr-4 rounded-xl text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 hidden sm:block shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as AssetCategory | 'ALL')}
              className="w-full sm:w-44 px-3 py-2 rounded-xl text-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AssetStatus | 'ALL')}
              className="w-full sm:w-40 px-3 py-2 rounded-xl text-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="RETIRED">Retired</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Reset */}
        {(searchQuery || categoryFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-[#ececec] flex items-center gap-1 rounded-xl self-end md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </Button>
        )}
      </div>

      {/* Main Table or Server Error */}
      {assetsError ? (
        <ErrorDisplay
          title="Unable to load asset inventory"
          error={assetsError}
          onRetry={refetchAssets}
        />
      ) : (
        <AssetsInventoryTable
          assets={items}
          isLoading={isAssetsLoading}
          onViewDetails={handleViewDetails}
          onAssignClick={handleAssignClick}
          onReturnClick={handleReturnClick}
          onQrClick={handleQrClick}
          onAddClick={() => setIsAddModalOpen(true)}
          isActionLoading={isActionLoading}
        />
      )}

      {/* Slide-over Asset Detail Sheet */}
      <AssetDetailSheet
        asset={selectedAsset}
        isOpen={isDetailSheetOpen}
        onClose={() => {
          setIsDetailSheetOpen(false);
          setSelectedAsset(null);
        }}
        onAssignClick={handleAssignClick}
        onReturnClick={handleReturnClick}
        onMaintenanceClick={handleMaintenanceClick}
      />

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Assign Asset Modal */}
      <AssignAssetModal
        asset={selectedAsset}
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedAsset(null);
        }}
      />

      {/* Printable QR Sticker Modal */}
      <QrStickerModal
        asset={selectedAsset}
        isOpen={isQrModalOpen}
        onClose={() => {
          setIsQrModalOpen(false);
          setSelectedAsset(null);
        }}
      />
    </div>
  );
};

export default AssetManagementPage;
