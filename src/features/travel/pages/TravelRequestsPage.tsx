import React, { useState, useMemo } from 'react';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetTravelRequestsQuery,
  useGetTravelSummaryQuery,
  useUpdateTravelRequestStatusMutation,
  useDeleteTravelRequestMutation,
} from '../api/travelApi';
import type { TravelRequest, TravelStatus, TravelType, TravelRequestFilters } from '../types/travel.types';
import { TravelStatsCards } from '../components/TravelStatsCards';
import { TravelFilters } from '../components/TravelFilters';
import { TravelRequestsTable } from '../components/TravelRequestsTable';
import { CreateTravelModal } from '../components/CreateTravelModal';
import { TravelApprovalModal } from '../components/TravelApprovalModal';

export const TravelRequestsPage: React.FC = () => {
  const toast = useToast();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TravelStatus | 'ALL'>('ALL');
  const [travelTypeFilter, setTravelTypeFilter] = useState<TravelType | 'ALL'>('ALL');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TravelRequest | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  // RTK Query Filters Payload
  const queryFilters: TravelRequestFilters = useMemo(
    () => ({
      search: searchQuery.trim() || undefined,
      status: statusFilter,
      travelType: travelTypeFilter,
    }),
    [searchQuery, statusFilter, travelTypeFilter]
  );

  // Fetch Requests and KPI Summary from real backend endpoints
  const {
    data: requestsData,
    isLoading: isRequestsLoading,
    isFetching: isRequestsFetching,
    error: requestsError,
    refetch: refetchRequests,
  } = useGetTravelRequestsQuery(queryFilters);

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useGetTravelSummaryQuery();

  // Mutations
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateTravelRequestStatusMutation();
  const [deleteRequest, { isLoading: isDeletingRequest }] = useDeleteTravelRequestMutation();

  const handleRefreshAll = () => {
    refetchRequests();
    refetchSummary();
    toast.info('Refreshed travel data from server', 'Syncing Data');
  };

  const handleReview = (req: TravelRequest) => {
    setSelectedRequest(req);
    setIsApprovalModalOpen(true);
  };

  const handleQuickApprove = async (req: TravelRequest) => {
    try {
      await updateStatus({ id: req.id, status: 'APPROVED' }).unwrap();
      toast.success(`Trip ${req.tripId || req.id} approved successfully!`, 'Request Approved');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to approve travel request', 'Error');
    }
  };

  const handleQuickReject = async (req: TravelRequest) => {
    try {
      await updateStatus({ id: req.id, status: 'REJECTED' }).unwrap();
      toast.info(`Trip ${req.tripId || req.id} was rejected.`, 'Request Rejected');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to reject travel request', 'Error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this travel requisition?')) return;
    try {
      await deleteRequest(id).unwrap();
      toast.success('Travel requisition deleted successfully.', 'Deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete travel request', 'Error');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setTravelTypeFilter('ALL');
  };

  const items = requestsData?.items || [];

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <TravelStatsCards
        summary={summaryData || requestsData?.summary}
        isLoading={isSummaryLoading || isRequestsLoading}
      />

      {/* Real-time Filters & Actions */}
      <TravelFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        travelTypeFilter={travelTypeFilter}
        onTravelTypeChange={setTravelTypeFilter}
        onResetFilters={handleResetFilters}
        onCreateNew={() => setIsCreateModalOpen(true)}
        onRefresh={handleRefreshAll}
        isRefreshing={isRequestsFetching}
      />

      {/* Error Display if query fails */}
      {requestsError ? (
        <ErrorDisplay
          title="Unable to load travel requests"
          error={requestsError}
          onRetry={() => {
            refetchRequests();
          }}
        />
      ) : (
        /* Requests Table / List */
        <TravelRequestsTable
          requests={items}
          isLoading={isRequestsLoading}
          onReview={handleReview}
          onApproveQuick={handleQuickApprove}
          onRejectQuick={handleQuickReject}
          onDelete={handleDelete}
          isActionLoading={isUpdatingStatus || isDeletingRequest}
        />
      )}

      {/* Modals */}
      <CreateTravelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <TravelApprovalModal
        request={selectedRequest}
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
};

export default TravelRequestsPage;
