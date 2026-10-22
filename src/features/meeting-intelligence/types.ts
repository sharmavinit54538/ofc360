/**
 * @file types.ts
 * @description Enterprise TypeScript models and interfaces for the Meeting Intelligence Module,
 * capturing audio transcription, AI executive summaries, key decisions, action tracking,
 * and conversational sentiment metrics.
 */

export type ActionItemPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type ActionItemStatus = 'PENDING' | 'COMPLETED';

export interface MeetingActionItem {
  id: string;
  task: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  priority: ActionItemPriority;
  status: ActionItemStatus;
}

export interface MeetingSentiment {
  positiveScore: number;
  neutralScore: number;
  negativeScore: number;
  overallTone: string; // e.g. "Collaborative", "Constructive", "Neutral"
}

export interface MeetingParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

export interface MeetingIntelligenceRecord {
  id: string;
  meetingTitle: string;
  meetingDate: string;
  durationMinutes: number;
  participants: MeetingParticipant[];
  recordingUrl?: string;
  transcriptSnippet?: string;
  aiExecutiveSummary: string;
  keyDecisions: string[];
  actionItems: MeetingActionItem[];
  sentimentAnalysis?: MeetingSentiment;
  tags: string[];
  status?: 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

export interface MeetingFilterParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  participantId?: string;
  status?: string;
}

export interface MeetingKpiSummary {
  totalMeetings: number;
  pendingActionItems: number;
  avgDurationMinutes: number;
  participationScore: number; // 0 - 100
}

export interface ProcessMeetingAudioPayload {
  meetingTitle: string;
  meetingDate: string;
  recordingUrl?: string;
  file?: File;
  calendarEventId?: string;
  participants?: string[];
  tags?: string[];
}

export interface ExportMeetingNotesResponse {
  downloadUrl: string;
  fileName: string;
  generatedAt: string;
}
