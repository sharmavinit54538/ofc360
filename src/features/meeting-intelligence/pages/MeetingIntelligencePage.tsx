/**
 * @file MeetingIntelligencePage.tsx
 * @description Enterprise AI Meeting Intelligence Page orchestrating KPI summaries,
 * meeting history lists, automated executive summaries, sentiment dynamics,
 * interactive action items, and audio upload modal.
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Video,
  Upload,
  Search,
  RefreshCw,
  Sparkles,
  Calendar,
  Filter,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetMeetingIntelligenceListQuery,
  useGetMeetingKpiSummaryQuery,
  useProcessMeetingAudioMutation,
  useUpdateActionItemStatusMutation,
  useExportMeetingNotesMutation,
} from '../api/meetingIntelligenceApi';
import type {
  MeetingIntelligenceRecord,
  MeetingFilterParams,
  ProcessMeetingAudioPayload,
  ActionItemStatus,
} from '../types';
import { MeetingKpiCards } from '../components/MeetingKpiCards';
import { MeetingHistoryList } from '../components/MeetingHistoryList';
import { MeetingSummaryView } from '../components/MeetingSummaryView';
import { MeetingActionItemsTable } from '../components/MeetingActionItemsTable';
import { UploadMeetingModal } from '../components/UploadMeetingModal';
import { MeetingEmptyState } from '../components/MeetingEmptyState';

export const MeetingIntelligencePage: React.FC = () => {
  const toast = useToast();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | undefined>(undefined);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const queryFilters: MeetingFilterParams = useMemo(
    () => ({
      search: searchTerm.trim() || undefined,
    }),
    [searchTerm]
  );

  // RTK Query: Meetings list
  const {
    data: meetings = [],
    isLoading: isMeetingsLoading,
    isFetching: isMeetingsFetching,
    refetch: refetchMeetings,
  } = useGetMeetingIntelligenceListQuery(queryFilters);

  // RTK Query: KPIs
  const {
    data: kpiSummary,
    isLoading: isKpiLoading,
    refetch: refetchKpis,
  } = useGetMeetingKpiSummaryQuery();

  // Mutations
  const [processAudio, { isLoading: isProcessingAudio }] = useProcessMeetingAudioMutation();
  const [updateActionStatus, { isLoading: isUpdatingAction }] = useUpdateActionItemStatusMutation();
  const [exportNotes, { isLoading: isExporting }] = useExportMeetingNotesMutation();

  // Auto-select first meeting if none selected
  useEffect(() => {
    if (!selectedMeetingId && meetings.length > 0) {
      setSelectedMeetingId(meetings[0].id);
    }
  }, [meetings, selectedMeetingId]);

  const activeMeeting = useMemo(
    () => meetings.find((m) => m.id === selectedMeetingId) || meetings[0],
    [meetings, selectedMeetingId]
  );

  const handleRefresh = () => {
    refetchMeetings();
    refetchKpis();
    toast.info('Refreshing meeting transcripts and action items...', 'Refreshed');
  };

  const handleUploadSubmit = async (payload: ProcessMeetingAudioPayload) => {
    try {
      const res = await processAudio(payload).unwrap();
      toast.success(
        `Meeting "${res?.meetingTitle || payload.meetingTitle}" submitted for AI transcription.`,
        'Processing Initiated'
      );
      if (res?.id) {
        setSelectedMeetingId(res.id);
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to submit meeting recording.',
        'Upload Error'
      );
    }
  };

  const handleToggleActionStatus = async (
    actionId: string,
    currentStatus: ActionItemStatus
  ) => {
    if (!activeMeeting) return;
    const nextStatus: ActionItemStatus =
      currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    try {
      await updateActionStatus({
        meetingId: activeMeeting.id,
        actionId,
        status: nextStatus,
      }).unwrap();
      toast.success(
        `Action item marked as ${nextStatus.toLowerCase()}.`,
        'Status Updated'
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message || 'Unable to update action item status.',
        'Update Error'
      );
    }
  };

  const handleExportMeeting = async (meetingId: string, format: 'PDF' | 'MARKDOWN') => {
    try {
      const res = await exportNotes({ meetingId, format }).unwrap();
      toast.success(
        `Meeting summary exported as ${res?.fileName || format}.`,
        'Export Ready'
      );
      if (res?.downloadUrl) {
        window.open(res.downloadUrl, '_blank');
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || 'Failed to export meeting notes.',
        'Export Error'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
            Meeting Intelligence & Action Tracking
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Automated speech-to-text transcription, executive synthesis, strategic decision logs, and deliverable tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isMeetingsFetching}
            className="rounded-xl flex items-center gap-1.5"
            title="Refresh from server"
          >
            <RefreshCw className={`w-4 h-4 ${isMeetingsFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            className="rounded-xl flex items-center gap-1.5 shadow-sm shadow-brand-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>Process Audio</span>
          </Button>
        </div>
      </div>

      {/* High-Level KPI Cards */}
      <MeetingKpiCards kpis={kpiSummary} isLoading={isKpiLoading} />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search meetings by title, topic, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
          {meetings.length} Recorded Sessions
        </div>
      </div>

      {/* Main Content Layout: Left History List, Right Summary & Action Items */}
      {meetings.length === 0 && !isMeetingsLoading ? (
        <MeetingEmptyState
          isFiltered={Boolean(searchTerm)}
          onClearFilters={() => setSearchTerm('')}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Meeting Records List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 px-1">
              Recorded Sessions
            </h3>
            <MeetingHistoryList
              meetings={meetings}
              activeMeetingId={activeMeeting?.id}
              onSelectMeeting={(m) => setSelectedMeetingId(m.id)}
              isLoading={isMeetingsLoading}
            />
          </div>

          {/* Right Column: Active Meeting Summary & Action Items (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {activeMeeting ? (
              <>
                <MeetingSummaryView
                  meeting={activeMeeting}
                  isLoading={isMeetingsLoading}
                  onExport={handleExportMeeting}
                  isExporting={isExporting}
                />

                {/* Extracted Deliverables & Action Items Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                      Deliverables & Action Items ({activeMeeting.actionItems?.length || 0})
                    </h3>
                  </div>

                  <MeetingActionItemsTable
                    actionItems={activeMeeting.actionItems || []}
                    meetingId={activeMeeting.id}
                    onToggleStatus={handleToggleActionStatus}
                    isUpdating={isUpdatingAction}
                  />
                </div>
              </>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
                <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Select a meeting session from the left to view transcripts, decisions, and action items.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Meeting Recording Modal */}
      <UploadMeetingModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
        isSubmitting={isProcessingAudio}
      />
    </div>
  );
};

export default MeetingIntelligencePage;
