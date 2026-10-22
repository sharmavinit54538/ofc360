import React, { useState, useMemo } from 'react';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetExpenseClaimsQuery,
  useGetExpensesSummaryQuery,
  useUpdateExpenseClaimStatusMutation,
  useDeleteExpenseClaimMutation,
} from '../api/expensesApi';
import type {
  ExpenseClaim,
  ExpenseStatus,
  ExpenseCategory,
  ExpenseFilters as ExpenseFiltersType,
} from '../types/expenses.types';
import { ExpenseStatsCards } from '../components/ExpenseStatsCards';
import { ExpenseFilters } from '../components/ExpenseFilters';
import { ExpenseClaimsTable } from '../components/ExpenseClaimsTable';
import { CreateExpenseModal } from '../components/CreateExpenseModal';
import { ExpenseApprovalModal } from '../components/ExpenseApprovalModal';

export const ExpenseClaimsPage: React.FC = () => {
  const toast = useToast();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'ALL'>('ALL');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  // RTK Query Filters Payload
  const queryFilters: ExpenseFiltersType = useMemo(
    () => ({
      search: searchQuery.trim() || undefined,
      status: statusFilter,
      category: categoryFilter,
    }),
    [searchQuery, statusFilter, categoryFilter]
  );

  // Fetch Claims and Metrics from live backend endpoints
  const {
    data: claimsData,
    isLoading: isClaimsLoading,
    isFetching: isClaimsFetching,
    error: claimsError,
    refetch: refetchClaims,
  } = useGetExpenseClaimsQuery(queryFilters);

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useGetExpensesSummaryQuery();

  // Mutations
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateExpenseClaimStatusMutation();
  const [deleteClaim, { isLoading: isDeletingClaim }] = useDeleteExpenseClaimMutation();

  const handleRefreshAll = () => {
    refetchClaims();
    refetchSummary();
    toast.info('Refreshed expense claims from server', 'Syncing Data');
  };

  const handleReview = (claim: ExpenseClaim) => {
    setSelectedClaim(claim);
    setIsApprovalModalOpen(true);
  };

  const handleQuickApprove = async (claim: ExpenseClaim) => {
    try {
      await updateStatus({ id: claim.id, status: 'APPROVED' }).unwrap();
      toast.success(
        `Claim ${claim.claimNumber || claim.id} approved successfully!`,
        'Claim Approved'
      );
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to approve claim', 'Action Error');
    }
  };

  const handleQuickReject = async (claim: ExpenseClaim) => {
    try {
      await updateStatus({ id: claim.id, status: 'REJECTED' }).unwrap();
      toast.info(`Claim ${claim.claimNumber || claim.id} was rejected.`, 'Claim Rejected');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to reject claim', 'Action Error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense claim?')) return;
    try {
      await deleteClaim(id).unwrap();
      toast.success('Expense claim deleted successfully.', 'Claim Deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete claim', 'Action Error');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
  };

  const items = claimsData?.items || [];

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <ExpenseStatsCards
        summary={summaryData || claimsData?.summary}
        isLoading={isSummaryLoading || isClaimsLoading}
      />

      {/* Real-time Filters & Actions */}
      <ExpenseFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onResetFilters={handleResetFilters}
        onCreateNew={() => setIsCreateModalOpen(true)}
        onRefresh={handleRefreshAll}
        isRefreshing={isClaimsFetching}
      />

      {/* Error Display if query fails */}
      {claimsError ? (
        <ErrorDisplay
          title="Unable to load expense claims"
          error={claimsError}
          onRetry={() => {
            refetchClaims();
          }}
        />
      ) : (
        /* Claims Table / List */
        <ExpenseClaimsTable
          claims={items}
          isLoading={isClaimsLoading}
          onReview={handleReview}
          onApproveQuick={handleQuickApprove}
          onRejectQuick={handleQuickReject}
          onDelete={handleDelete}
          isActionLoading={isUpdatingStatus || isDeletingClaim}
        />
      )}

      {/* Create Expense Modal */}
      <CreateExpenseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Review / Approval Modal */}
      <ExpenseApprovalModal
        claim={selectedClaim}
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false);
          setSelectedClaim(null);
        }}
      />
    </div>
  );
};

export default ExpenseClaimsPage;
