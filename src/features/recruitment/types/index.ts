export type Stage =
  | 'applied'
  | 'screening'
  | 'assessment'
  | 'interview'
  | 'technical'
  | 'hr'
  | 'offer'
  | 'hired'
  | 'rejected';

export const STAGE_LABELS: Record<Stage, string> = {
  applied: 'Applied',
  screening: 'Screening',
  assessment: 'Assessment',
  interview: 'Interview',
  technical: 'Technical Round',
  hr: 'HR Round',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

export type JobStatus = 'active' | 'draft' | 'closed' | 'archived';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Temporary';
export type WorkMode = 'Remote' | 'Hybrid' | 'Onsite';

export interface Job {
  id: string;
  title: string;
  department: string;
  employmentType: EmploymentType;
  experience: string;
  skills: string[];
  salaryMin: number;
  salaryMax: number;
  currency: string;
  vacancies: number;
  location: string;
  workMode: WorkMode;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  hiringManager: string;
  recruiter: string;
  status: JobStatus;
  publishedAt: string;
  closingAt: string;
  applicants: number;
}

export interface CandidateExperience {
  company: string;
  role: string;
  start: string;
  end: string;
  highlights: string[];
}

export interface CandidateEducation {
  school: string;
  degree: string;
  start: string;
  end: string;
}

export interface CandidateProject {
  name: string;
  description: string;
  tech: string[];
}

export interface CandidateFeedback {
  interviewer: string;
  round: string;
  rating: number;
  notes: string;
  date: string;
}

export interface CandidateNote {
  id: string;
  at: string;
  author: string;
  text: string;
}

export interface CandidateDocument {
  name: string;
  type: string;
}

export type CandidateTimelineKind = 'stage' | 'note' | 'interview' | 'offer' | 'email' | 'system';

export interface CandidateTimelineEvent {
  id: string;
  at: string;
  kind: CandidateTimelineKind;
  title: string;
  detail?: string;
  actor?: string;
}

export interface CandidateApplication {
  id: string;
  jobId: string;
  stage: Stage;
  appliedPosition?: string;
  appliedAt?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  location: string;
  jobId: string;
  applicationId?: string;
  appliedPosition: string;
  stage: Stage;
  atsScore: number | null;
  jobMatch: number | null;
  source: string;
  tags: string[];
  skills: string[];
  yearsExperience: number;
  currentCompany?: string;
  currentRole?: string;
  expectedSalary?: number;
  noticeDays?: number;
  vendorId?: string;
  resumeName: string;
  summary: string;
  experience: CandidateExperience[];
  education: CandidateEducation[];
  projects: CandidateProject[];
  certifications: string[];
  languages: string[];
  feedback: CandidateFeedback[];
  notes: CandidateNote[];
  documents: CandidateDocument[];
  timeline: CandidateTimelineEvent[];
  appliedAt: string;
  applications?: CandidateApplication[];
}

export type InterviewStatus = 'PENDING_SCHEDULE' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type InterviewMode = 'ONLINE' | 'OFFLINE';
export type InterviewRecommendation = 'PASS' | 'REJECT' | 'HOLD';

export interface Interview {
  id: string;
  interviewId: string;
  roundId: string;
  scheduleId: string | null;
  applicationId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  jobId: string;
  jobTitle: string;
  round: string;
  interviewerId: string | null;
  interviewer: string;
  date: string | null;
  durationMins: number;
  timezone?: string;
  mode: InterviewMode;
  meetingLink: string | null;
  officeAddress?: string;
  status: InterviewStatus;
  isOverdue?: boolean;
  rating?: number;
  recommendation?: InterviewRecommendation;
  feedback?: string;
  cancelledReason?: string;
  createdAt?: string;
  notes?: string;
}

export interface Interviewer {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

export type OfferStatus = 'draft' | 'pending-approval' | 'sent' | 'accepted' | 'declined' | 'expired';

export interface OfferApproval {
  stage: string;
  by: string;
  at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Offer {
  id: string;
  applicationId?: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  salary: number;
  currency: string;
  joiningDate: string;
  benefits: string[];
  status: OfferStatus;
  sentAt?: string;
  respondedAt?: string;
  approvals: OfferApproval[];
}

export type ScreeningDecision = 'SHORTLIST' | 'REVIEW' | 'REJECT';
export type HumanDecision = 'SHORTLIST' | 'REJECT' | 'KEEP_REVIEW';
export type ScreeningStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface ScreeningResult {
  id: string;
  screeningId?: string;
  applicationId: string;
  candidateId: string;
  candidateName: string;
  status: ScreeningStatus;
  error?: string;
  decision: ScreeningDecision | null;
  confidence: number;
  matchScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  redFlags: string[];
  greenFlags: string[];
  hiringRecommendation: string;
  hrNotes: string;
  questionsToAsk: string[];
  modelUsed: string;
  screenedAt: string | null;
  humanDecision: HumanDecision | null;
  humanDecisionBy: string | null;
  humanDecisionReason: string | null;
  humanDecidedAt?: string;
}

export interface ScreeningThresholds {
  shortlist: number;
  reject: number;
}

export interface ScreeningRun {
  runId: string;
  status: ScreeningStatus;
  completed: number;
  total: number;
}

export interface ApiList<T> {
  items: T[];
  total?: number;
  page?: number;
  limit?: number;
}

/* =========================================================================
   GROUP 1: PLANNING & SOURCING TYPES
   ========================================================================= */

export type RequisitionStatus =
  | 'draft'
  | 'submitted'
  | 'dept_head_approved'
  | 'finance_approved'
  | 'approved'
  | 'converted'
  | 'rejected';

export type RequisitionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Requisition {
  id: string;
  title: string;
  department: string;
  headcount: number;
  plannedQuarter: string;
  priority: RequisitionPriority;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  skills: string[];
  experienceLevel: string;
  justification: string;
  status: RequisitionStatus;
  createdAt: string;
  createdBy?: string;
}

export type CandidateSource =
  | 'LinkedIn'
  | 'Naukri'
  | 'GitHub'
  | 'Referral'
  | 'Agency'
  | 'Career Site'
  | 'DIRECT'
  | 'Other';

export type CandidateSourcingResponse =
  | 'Sourced'
  | 'Outreach Sent'
  | 'Interested'
  | 'Not Interested'
  | 'Converted';

export interface ProspectCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  currentCompany?: string;
  currentRole?: string;
  experienceYears: number;
  source: CandidateSource;
  responseStatus: CandidateSourcingResponse;
  tags: string[];
  lastContactedAt?: string;
}

export type VendorStatus = 'ACTIVE' | 'PAUSED' | 'TERMINATED';

export interface AgencyVendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  commissionRate: number;
  status: VendorStatus;
  activeReqsCount?: number;
  hiresYtd?: number;
  spendYtd?: number;
  createdAt?: string;
}

export type ReferralStatus = 'Submitted' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export interface Referral {
  id: string;
  candidateId: string;
  candidateName: string;
  referrerEmployeeId: string;
  referrerName: string;
  referrerDepartment: string;
  jobId?: string;
  jobTitle?: string;
  rewardAmount: number;
  status: ReferralStatus;
  submittedAt: string;
  bonusPaid?: boolean;
}

export interface CareerSiteSettings {
  companyName: string;
  tagline: string;
  accentColor: string;
  showSalary: boolean;
  employeeReferrals: boolean;
  showEeo: boolean;
  showGdpr: boolean;
  showCcpa: boolean;
  showWcag: boolean;
}

/* =========================================================================
   GROUP 3: CRM & RESUME INTELLIGENCE TYPES
   ========================================================================= */

export type CrmActivityType = 'email' | 'call' | 'sms' | 'linkedin' | 'note';

export interface CrmActivity {
  id: string;
  candidateId: string;
  type: CrmActivityType;
  summary: string;
  detail?: string;
  scheduledFollowUp?: string;
  completed: boolean;
  createdAt: string;
  createdBy: string;
}

export interface ResumeComparisonItem {
  candidateId: string;
  candidateName: string;
  atsScore: number;
  experienceYears: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
}

/* =========================================================================
   GROUP 4: AI RECRUITER & BOT TYPES
   ========================================================================= */

export interface AiInterviewQuestion {
  id: string;
  questionText: string;
  category?: string;
  timeLimitSeconds?: number;
  questionNumber: number;
  totalQuestions: number;
}

export interface AiInterviewBotSession {
  token: string;
  candidateName: string;
  firstName?: string;
  jobTitle: string;
  companyName?: string;
  estimatedDurationMinutes: number;
  consentText?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
  currentQuestion?: AiInterviewQuestion;
  totalQuestions: number;
  answeredCount: number;
}

export interface AiInterviewBotTranscriptEntry {
  questionId?: string;
  question: string;
  answer: string;
  category?: string;
  timeTakenSeconds?: number;
}

export interface AiInterviewBotResult {
  id: string;
  applicationId: string;
  candidateId?: string;
  candidateName: string;
  jobId: string;
  jobTitle?: string;
  status: 'INVITED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED' | 'FAILED';
  matchScore?: number;
  confidence?: number;
  strengths: string[];
  weaknesses: string[];
  redFlags: string[];
  greenFlags?: string[];
  integritySignals?: {
    tabSwitches?: number;
    pasteCount?: number;
    flags?: string[];
  };
  transcript?: AiInterviewBotTranscriptEntry[];
  humanDecision?: HumanDecision | null;
  invitedAt?: string;
  completedAt?: string;
  error?: string;
}

/* =========================================================================
   GROUP 5 & 6: INTERVIEW BOOKING, BGV & CTC TYPES
   ========================================================================= */

export interface CandidateBookingSlot {
  slotId?: string;
  startTime: string;
  endTime: string;
}

export interface CandidateBookingInfo {
  token: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName?: string;
  roundName: string;
  durationMinutes: number;
  interviewerName?: string;
  status: 'PENDING' | 'BOOKED' | 'EXPIRED' | 'CANCELLED';
  availableSlots: CandidateBookingSlot[];
  bookedSlot?: {
    startTime: string;
    endTime: string;
    meetingUrl?: string;
    officeAddress?: string;
    timezone?: string;
  };
}

export type BgvCheckType = 'IDENTITY' | 'EDUCATION' | 'CRIMINAL' | 'EMPLOYMENT';
export type BgvStatus = 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FLAGGED' | 'FAILED';

export interface BgvRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  checkType: BgvCheckType;
  agencyName?: string;
  status: BgvStatus;
  initiatedAt: string;
  completedAt?: string;
  remarks?: string;
  manualOverrideRationale?: string;
}

export interface CtcBreakdown {
  totalCtc: number;
  basicSalary: number;       // 50% of annual CTC
  hra: number;               // 25% of annual CTC
  specialAllowance: number;  // Remainder (~25%)
  bonus: number;
  esopValue: number;
  joiningBonus: number;
  monthlyGross: number;
}

export interface OfferNegotiationEntry {
  id: string;
  version: number;
  offeredCtc: number;
  candidateExpectedCtc: number;
  notes: string;
  date: string;
  status: 'countered' | 'accepted' | 'rejected';
}

/* =========================================================================
   GROUP 7 & 8: ONBOARDING, AUTOMATION & OPS
   ========================================================================= */

export interface PreboardingJoiner {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  department: string;
  joiningDate: string;
  readinessPercent: number;
  buddyEmployeeId?: string;
  buddyName?: string;
  swagKitSent: boolean;
  status: 'upcoming' | 'ready' | 'delayed';
}

export type ProbationTimelineStage = '30_DAY' | '60_DAY' | '90_DAY';

export interface ProbationRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  joiningDate: string;
  currentDay: number;
  timelineStage: ProbationTimelineStage;
  confirmationStatus: 'PENDING' | 'CONFIRMED' | 'EXTENDED_30_DAYS';
  managerFeedback?: string;
}

export type AutomationTriggerEvent =
  | 'application_received'
  | 'interview_scheduled'
  | 'offer_accepted'
  | 'orientation_done';

export type AutomationActionType =
  | 'send_email'
  | 'send_whatsapp'
  | 'move_stage'
  | 'create_it_ticket'
  | 'assign_mentor';

export interface RecruitmentAutomationRule {
  id: string;
  name: string;
  description: string;
  triggerEvent: AutomationTriggerEvent;
  action: AutomationActionType;
  enabled: boolean;
  executionCount?: number;
  lastExecutedAt?: string;
}

/* =========================================================================
   SMART JD GENERATOR TYPES
   ========================================================================= */

export type JdDomain =
  | 'hr'
  | 'sales'
  | 'marketing'
  | 'finance'
  | 'operations'
  | 'support'
  | 'healthcare'
  | 'design'
  | 'education'
  | 'legal'
  | 'admin'
  | 'data'
  | 'engineering'
  | 'general';

export type JdExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';

export interface SmartJdConfig {
  role: string;
  domain: JdDomain;
  experienceLevel: JdExperienceLevel;
  workMode: WorkMode;
  location?: string;
  customSkills?: string[];
}

export interface GeneratedJd {
  title: string;
  department: string;
  domain: JdDomain;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  markdown: string;
}
