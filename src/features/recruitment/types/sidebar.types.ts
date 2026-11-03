export type RecruitmentRole =
  | 'SUPER_ADMIN'
  | 'HR_ADMIN'
  | 'HR_EXECUTIVE'
  | 'MANAGER'
  | 'IT_ADMIN'
  | 'EMPLOYEE';

export interface SidebarBadgesResponse {
  pending_req_approvals_count?: number;
  active_openings_count?: number;
  new_applications_count?: number;
  today_interviews_count?: number;
  pending_offer_approvals_count?: number;
  bgv_discrepancy_alerts_count?: number;
  my_open_vacancies_count?: number;
  pending_profile_reviews_count?: number;
  overdue_scorecards_count?: number;
  pending_my_offer_approvals_count?: number;
  pending_it_provisioning_count?: number;
  active_referral_updates_count?: number;
  pending_scorecards_count?: number;
}

export type BadgeVariant = 'default' | 'destructive';

export interface RecruitmentSidebarTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  roles: RecruitmentRole[];
  badgeKey?: keyof SidebarBadgesResponse;
  badgeVariant?: BadgeVariant;
  condition?: (user: { has_assigned_interviews?: boolean } | null) => boolean;
}

export interface RecruitmentSidebarSectionConfig {
  sectionId: 'recruitment';
  label: 'TALENT & RECRUITMENT';
  icon: React.ComponentType<{ className?: string }>;
  order: 3;
  collapsible: true;
  defaultExpanded: true;
  tabs: RecruitmentSidebarTab[];
}

export const RECRUITMENT_SIDEBAR_SECTION: RecruitmentSidebarSectionConfig = {
  sectionId: 'recruitment',
  label: 'TALENT & RECRUITMENT',
  icon: {} as React.ComponentType<{ className?: string }>,
  order: 3,
  collapsible: true,
  defaultExpanded: true,
  tabs: [],
};