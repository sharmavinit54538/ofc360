import React, { useState } from 'react';
import {
  Box,
  Laptop,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Search,
  DollarSign,
  User,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Input } from '@/shared/ui/Input';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetExitCasesQuery,
  useReturnExitAssetMutation,
} from '../api/exitsApi';
import type { ExitCase, ExitAssetItem } from '../types/exit.types';

export const ExitAssetRecoveryPage: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const userRole = user?.role || 'EMPLOYEE';
  const canSignoff = userRole === 'IT_ADMIN' || userRole === 'HR_ADMIN' || userRole === 'SUPER_ADMIN';

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'RETURNED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  // Asset return modal state
  const [returningAsset, setReturningAsset] = useState<{ exitCase: ExitCase; asset: ExitAssetItem } | null>(null);
  const [returnCondition, setReturnCondition] = useState<'GOOD' | 'FAIR' | 'DAMAGED' | 'LOST'>('GOOD');
  const [recoveryAmount, setRecoveryAmount] = useState<number>(0);
  const [returnRemarks, setReturnRemarks] = useState('');

  const {
    data: casesResponse,
    isLoading,
    error,
    refetch,
  } = useGetExitCasesQuery();

  const [returnAsset, { isLoading: isReturning }] = useReturnExitAssetMutation();

  const allCases = casesResponse?.items || [];
  const activeCases = allCases.filter(
    (c) => c.stage !== 'COMPLETED' && c.stage !== 'REJECTED' && c.stage !== 'WITHDRAWN'
  );

  // Flatten all assets across cases
  const allAssetRows: { exitCase: ExitCase; asset: ExitAssetItem }[] = [];
  for (const c of activeCases) {
    for (const a of c.assignedAssets || []) {
      allAssetRows.push({ exitCase: c, asset: a });
    }
  }

  // Filter assets
  const filteredAssets = allAssetRows.filter(({ exitCase, asset }) => {
    if (activeTab === 'PENDING' && asset.status === 'RETURNED') return false;
    if (activeTab === 'RETURNED' && asset.status !== 'RETURNED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.assetId.toLowerCase().includes(q) ||
        (asset.serialNumber || '').toLowerCase().includes(q) ||
        exitCase.employeeName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenReturnModal = (exitCase: ExitCase, asset: ExitAssetItem) => {
    setReturningAsset({ exitCase, asset });
    setReturnCondition(asset.condition || 'GOOD');
    setRecoveryAmount(asset.recoveryAmount || 0);
    setReturnRemarks(asset.remarks || '');
  };

  const handleConfirmReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returningAsset) return;

    try {
      await returnAsset({
        id: returningAsset.exitCase.id,
        assetId: returningAsset.asset.assetId,
        condition: returnCondition,
        recoveryAmount: Number(recoveryAmount),
        remarks: returnRemarks.trim() || undefined,
      }).unwrap();

      toast.success(
        `Asset "${returningAsset.asset.name}" return verified for ${returningAsset.exitCase.employeeName}!`,
        'Asset Return Recorded'
      );
      setReturningAsset(null);
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to record asset return',
        'Action Error'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Box className="w-5 h-5 text-brand-500" />
            <span>Asset Recovery &amp; Return Handover</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Track hardware, laptops, peripherals, and security tokens assigned to departing employees.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          {[
            { id: 'PENDING', label: 'Pending Return' },
            { id: 'RETURNED', label: 'Returned & Verified' },
            { id: 'ALL', label: 'All Allocated' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 shadow-xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
        <Input
          placeholder="Filter by asset name, serial, ID, or employee..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {/* Main States */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-32 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorDisplay title="Unable to load asset recovery items" error={error} onRetry={refetch} />
      ) : filteredAssets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {activeTab === 'PENDING' ? 'No Assets Pending Return' : 'No Assets Found'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            All allocated equipment has been accounted for or no assets match the filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/75 dark:bg-zinc-900/50 text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Asset Details</th>
                  <th className="py-3 px-4">Employee & Case</th>
                  <th className="py-3 px-4">Allocated / Returned</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Recovery Dues</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
                {filteredAssets.map(({ exitCase, asset }) => (
                  <tr key={`${exitCase.id}-${asset.id}`} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/30">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {asset.name}
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                        <span className="bg-gray-100 dark:bg-zinc-800 px-1 py-0.2 rounded font-bold">
                          {asset.assetId}
                        </span>
                        {asset.serialNumber && <span>SN: {asset.serialNumber}</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {exitCase.employeeName}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-zinc-400 font-mono">
                        {exitCase.caseNumber} &bull; LWD:{' '}
                        {exitCase.expectedLastWorkingDay
                          ? new Date(exitCase.expectedLastWorkingDay).toLocaleDateString()
                          : 'TBD'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 dark:text-zinc-400">
                      <div>Assigned: {asset.assignedDate ? new Date(asset.assignedDate).toLocaleDateString() : 'N/A'}</div>
                      {asset.returnDate && (
                        <div className="text-[11px] text-emerald-600 font-medium">
                          Returned: {new Date(asset.returnDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          asset.condition === 'GOOD'
                            ? 'success'
                            : asset.condition === 'FAIR'
                            ? 'neutral'
                            : 'error'
                        }
                        size="sm"
                      >
                        {asset.condition || 'GOOD'}
                      </Badge>
                      {asset.remarks && (
                        <div className="text-[10px] text-gray-400 mt-0.5 max-w-xs truncate" title={asset.remarks}>
                          {asset.remarks}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {asset.recoveryAmount && asset.recoveryAmount > 0 ? (
                        <span className="font-semibold text-rose-600">
                          ₹{asset.recoveryAmount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">₹0</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={asset.status === 'RETURNED' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {asset.status}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {asset.status !== 'RETURNED' && canSignoff ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReturnModal(exitCase, asset)}
                          className="text-xs h-7 gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Verify Return</span>
                        </Button>
                      ) : (
                        <span className="text-[11px] text-gray-400">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Return Signoff Modal */}
      {returningAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
          <div
            className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                  Sign Off Asset Return
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  {returningAsset.asset.name} ({returningAsset.asset.assetId})
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Physical Condition Assessment *
                </label>
                <select
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900"
                >
                  <option value="GOOD">GOOD — Normal wear, fully functional</option>
                  <option value="FAIR">FAIR — Minor cosmetic wear</option>
                  <option value="DAMAGED">DAMAGED — Physical damage / requires repair</option>
                  <option value="LOST">LOST — Missing / unreturned</option>
                </select>
              </div>

              {(returnCondition === 'DAMAGED' || returnCondition === 'LOST') && (
                <div>
                  <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
                    Recovery Deduction Amount (₹)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={recoveryAmount}
                    onChange={(e) => setRecoveryAmount(Number(e.target.value))}
                    className="text-xs"
                    placeholder="Enter cost to deduct in F&F settlement..."
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Inspection Remarks &amp; Peripherals Check
                </label>
                <Input
                  value={returnRemarks}
                  onChange={(e) => setReturnRemarks(e.target.value)}
                  placeholder="e.g. Charger returned, screen intact, passwords reset..."
                  className="text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReturningAsset(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isReturning}
                  className="text-xs bg-brand-600 hover:bg-brand-700 text-white"
                >
                  {isReturning ? 'Saving...' : 'Confirm Return Sign-off'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitAssetRecoveryPage;
