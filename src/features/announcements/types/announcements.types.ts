/**
 * @file announcements.types.ts
 * @description Enterprise TypeScript definitions for Announcements module:
 * Company Announcements, Super Admin Platform Broadcasts, and Unified Dashboard Feed.
 */

export type AnnouncementPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type AnnouncementStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AnnouncementVisibility = 'ALL_EMPLOYEES' | 'DEPARTMENT' | 'BRANCH' | 'SPECIFIC_ROLES' | string;

export interface CreateAnnouncementPayload {
  title: string;
  description: string;
  category?: string;
  priority?: AnnouncementPriority;
  department?: string | null;
  branch?: string | null;
  visibility?: AnnouncementVisibility;
  publish_date?: string;
  expiry_date?: string | null;
  is_pinned?: boolean;
  status?: AnnouncementStatus;
}

export interface UpdateAnnouncementPayload {
  title: string;
  description: string;
  category?: string;
  priority?: AnnouncementPriority;
  department?: string | null;
  branch?: string | null;
  visibility?: AnnouncementVisibility;
  publish_date?: string;
  expiry_date?: string | null;
  is_pinned?: boolean;
  status?: AnnouncementStatus;
}

export interface AnnouncementResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: AnnouncementPriority;
  department: string | null;
  branch: string | null;
  visibility: AnnouncementVisibility;
  publish_date: string;
  expiry_date: string | null;
  is_pinned: boolean;
  status: AnnouncementStatus;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  author_name?: string;
  author_role?: string;
  read_count?: number;
  total_recipients?: number;
}

export interface AnnouncementListParams {
  status?: AnnouncementStatus;
  priority?: AnnouncementPriority;
  department?: string;
  branch?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AnnouncementListResponse {
  items: AnnouncementResponse[];
  data?: AnnouncementResponse[];
  total: number;
  page: number;
  limit: number;
  pages?: number;
  total_pages?: number;
}

export interface SuperAdminAnnouncementPayload {
  title: string;
  content: string;
  target_audience?: string;
}

export interface UpdateSuperAdminAnnouncementPayload {
  title?: string;
  content?: string;
  target_audience?: string;
}

export interface SuperAdminAnnouncementResponse {
  ann_id: string;
  title: string;
  content: string;
  target_audience: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InternalDashboardFeedResponse {
  pinned_announcements: AnnouncementResponse[];
  recent_announcements: AnnouncementResponse[];
  super_admin_broadcasts?: SuperAdminAnnouncementResponse[];
  news?: Array<{
    id: string;
    title: string;
    summary?: string;
    content?: string;
    published_at?: string;
  }>;
  events?: Array<{
    id: string;
    title: string;
    event_date?: string;
    type?: string;
  }>;
  polls?: Array<{
    id: string;
    question: string;
    options?: string[];
  }>;
}

export interface APIResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  status?: number;
}

