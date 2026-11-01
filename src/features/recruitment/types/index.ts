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
