/**
 * @file types.ts
 * @description Enterprise TypeScript models and interfaces for the Employee Timeline Module,
 * capturing career milestones, role changes, performance evaluations, certifications, and organizational events.
 */

export type TimelineEventType =
  | 'JOINING'
  | 'PROMOTION'
  | 'ROLE_CHANGE'
  | 'DEPARTMENT_TRANSFER'
  | 'PERFORMANCE_REVIEW'
  | 'AWARD_RECOGNITION'
  | 'TRAINING_CERTIFICATION'
  | 'LEAVE_SABBATICAL'
  | 'DOCUMENT_UPLOAD'
  | 'EXIT_INITIATED';

export interface TimelineAttachment {
  id?: string;
  name: string;
  url: string;
  size?: string;
  type?: string;
}

export interface TimelineMetadata {
  oldRole?: string;
  newRole?: string;
  oldDepartment?: string;
  newDepartment?: string;
  rating?: string | number;
  reviewPeriod?: string;
  awardTitle?: string;
  certificationName?: string;
  issuingOrganization?: string;
  leaveType?: string;
  durationDays?: number;
  documentCategory?: string;
  reason?: string;
  [key: string]: any;
}

export interface TimelineEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  eventType: TimelineEventType;
  title: string;
  description: string;
  timestamp: string; // ISO date-time string
  actorId?: string;
  actorName?: string;
  metadata?: TimelineMetadata;
  attachments?: TimelineAttachment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TimelineFilterParams {
  employeeId?: string;
  eventType?: TimelineEventType | 'ALL';
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TimelineResponse {
  items: TimelineEvent[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTimelineEventPayload {
  employeeId: string;
  employeeName: string;
  eventType: TimelineEventType;
  title: string;
  description: string;
  timestamp?: string;
  metadata?: TimelineMetadata;
  attachments?: TimelineAttachment[];
}
