import type {
  ApiList,
  Candidate,
  CandidateApplication,
  CandidateDocument,
  CandidateEducation,
  CandidateExperience,
  CandidateFeedback,
  CandidateNote,
  CandidateProject,
  CandidateTimelineEvent,
  EmploymentType,
  Interview,
  InterviewMode,
  InterviewRecommendation,
  InterviewStatus,
  Job,
  JobStatus,
  Offer,
  OfferApproval,
  OfferStatus,
  Stage,
  WorkMode,
} from '../types';

type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const firstValue = (record: ApiRecord, ...keys: string[]): unknown => {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
};

const asString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
};

const optionalString = (value: unknown): string | undefined => {
  const parsed = asString(value).trim();
  return parsed ? parsed : undefined;
};

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const optionalNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = asNumber(value, Number.NaN);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const nullableNumber = (value: unknown): number | null => optionalNumber(value) ?? null;

const asStringList = (value: unknown, splitLines = false): string[] => {
  if (typeof value === 'string') {
    return splitLines
      ? value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
      : value.trim() ? [value.trim()] : [];
  }
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item === 'string') return item.trim() ? [item.trim()] : [];
    if (!isRecord(item)) return [];
    const name = optionalString(firstValue(item, 'skill_name', 'skillName'));
    return name ? [name] : [];
  });
};

const asRecords = (value: unknown): ApiRecord[] =>
  Array.isArray(value) ? value.filter(isRecord) : [];

const asBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true';
  return false;
};

const normalizedKey = (value: unknown): string =>
  asString(value).trim().toLowerCase().replace(/[\s_]+/g, '-');

const mapEmploymentType = (value: unknown): EmploymentType => {
  switch (normalizedKey(value)) {
    case 'part-time':
      return 'Part-time';
    case 'contract':
      return 'Contract';
    case 'intern':
    case 'internship':
      return 'Internship';
    case 'temporary':
      return 'Temporary';
    case 'full-time':
    default:
      return 'Full-time';
  }
};

const mapWorkMode = (value: unknown): WorkMode => {
  switch (normalizedKey(value)) {
    case 'remote':
      return 'Remote';
    case 'hybrid':
      return 'Hybrid';
    case 'onsite':
    case 'on-site':
    default:
      return 'Onsite';
  }
};

const mapJobStatus = (value: unknown): JobStatus => {
  const key = normalizedKey(value);
  if (key === 'published' || key === 'active') return 'active';
  if (key === 'closed') return 'closed';
  if (key === 'archived') return 'archived';
  return 'draft';
};

const mapStage = (value: unknown, fallback: Stage = 'applied'): Stage => {
  const key = normalizedKey(value);
  const stage = key.replace(/-/g, '');
  switch (stage) {
    case 'applied':
    case 'screening':
    case 'assessment':
    case 'interview':
    case 'technical':
    case 'hr':
    case 'offer':
    case 'hired':
    case 'rejected':
      return stage;
    default:
      return fallback;
  }
};

const experienceFromRange = (min: unknown, max: unknown): string => {
  const minimum = optionalNumber(min);
  const maximum = optionalNumber(max);
  return minimum !== undefined && maximum !== undefined ? `${minimum}-${maximum} yrs` : '';
};

const mapCandidateExperience = (value: unknown): CandidateExperience[] =>
  asRecords(value).map((item) => ({
    company: asString(firstValue(item, 'company')),
    role: asString(firstValue(item, 'role')),
    start: asString(firstValue(item, 'start')),
    end: asString(firstValue(item, 'end')),
    highlights: asStringList(firstValue(item, 'highlights')),
  }));

const mapCandidateEducation = (value: unknown): CandidateEducation[] =>
  asRecords(value).map((item) => ({
    school: asString(firstValue(item, 'school')),
    degree: asString(firstValue(item, 'degree')),
    start: asString(firstValue(item, 'start')),
    end: asString(firstValue(item, 'end')),
  }));

const mapCandidateProjects = (value: unknown): CandidateProject[] =>
  asRecords(value).map((item) => ({
    name: asString(firstValue(item, 'name')),
    description: asString(firstValue(item, 'description')),
    tech: asStringList(firstValue(item, 'tech')),
  }));

const mapCandidateFeedback = (value: unknown): CandidateFeedback[] =>
  asRecords(value).map((item) => ({
    interviewer: asString(firstValue(item, 'interviewer')),
    round: asString(firstValue(item, 'round')),
    rating: asNumber(firstValue(item, 'rating')),
    notes: asString(firstValue(item, 'notes')),
    date: asString(firstValue(item, 'date')),
  }));

const mapCandidateNotes = (value: unknown): CandidateNote[] =>
  asRecords(value).map((item) => {
    const authorValue = firstValue(item, 'author');
    const authorRecord = isRecord(authorValue) ? authorValue : {};
    const authorName = [
      firstValue(authorRecord, 'first_name', 'firstName'),
      firstValue(authorRecord, 'last_name', 'lastName'),
    ]
      .map((part) => asString(part).trim())
      .filter(Boolean)
      .join(' ');

    return {
      id: asString(firstValue(item, 'id')),
      at: asString(firstValue(item, 'created_at', 'createdAt', 'at')),
      author: authorName || asString(authorValue),
      text: asString(firstValue(item, 'note_text', 'noteText', 'text')),
    };
  });

const mapCandidateDocuments = (value: unknown): CandidateDocument[] =>
  asRecords(value).map((item) => ({
    name: asString(firstValue(item, 'name')),
    type: asString(firstValue(item, 'type')),
  }));

const mapTimelineKind = (value: unknown): CandidateTimelineEvent['kind'] => {
  const kind = normalizedKey(value);
  switch (kind) {
    case 'stage':
    case 'note':
    case 'interview':
    case 'offer':
    case 'email':
      return kind;
    default:
      return 'system';
  }
};

const mapCandidateTimeline = (value: unknown): CandidateTimelineEvent[] =>
  asRecords(value).map((item) => {
    const detail = optionalString(firstValue(item, 'detail'));
    const actor = optionalString(firstValue(item, 'actor'));
    return {
      id: asString(firstValue(item, 'id')),
      at: asString(firstValue(item, 'at', 'created_at', 'createdAt')),
      kind: mapTimelineKind(firstValue(item, 'kind')),
      title: asString(firstValue(item, 'title')),
      ...(detail ? { detail } : {}),
      ...(actor ? { actor } : {}),
    };
  });

const mapApplication = (item: ApiRecord): CandidateApplication => {
  const job = isRecord(firstValue(item, 'job')) ? firstValue(item, 'job') as ApiRecord : {};
  const appliedPosition = optionalString(firstValue(job, 'title')) ??
    optionalString(firstValue(item, 'applied_position', 'appliedPosition'));
  const appliedAt = optionalString(firstValue(item, 'created_at', 'createdAt'));

  return {
    id: asString(firstValue(item, 'id')),
    jobId: asString(firstValue(item, 'job_id', 'jobId') ?? firstValue(job, 'id')),
    stage: mapStage(firstValue(item, 'status', 'stage')),
    ...(appliedPosition ? { appliedPosition } : {}),
    ...(appliedAt ? { appliedAt } : {}),
  };
};

const applicationTimestamp = (item: ApiRecord): number => {
  const timestamp = asString(firstValue(item, 'updated_at', 'updatedAt', 'created_at', 'createdAt'));
  const parsed = Date.parse(timestamp);
  return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
};

const latestApplication = (applications: ApiRecord[]): ApiRecord | undefined => {
  let latest = applications[0];
  for (const application of applications.slice(1)) {
    if (applicationTimestamp(application) >= applicationTimestamp(latest)) latest = application;
  }
  return latest;
};

const namesFrom = (first: unknown, last: unknown): string =>
  [asString(first).trim(), asString(last).trim()].filter(Boolean).join(' ');

const mapInterviewStatus = (value: unknown): InterviewStatus => {
  const key = normalizedKey(value);
  if (key === 'scheduled' || key === 'schedule') return 'SCHEDULED';
  if (key === 'completed') return 'COMPLETED';
  if (key === 'cancelled' || key === 'canceled') return 'CANCELLED';
  if (key === 'no-show') return 'NO_SHOW';
  return 'PENDING_SCHEDULE';
};

const mapInterviewMode = (value: unknown): InterviewMode =>
  normalizedKey(value) === 'offline' ? 'OFFLINE' : 'ONLINE';

const mapInterviewRecommendation = (value: unknown): InterviewRecommendation | undefined => {
  const recommendation = asString(value).trim().toUpperCase();
  return recommendation === 'PASS' || recommendation === 'REJECT' || recommendation === 'HOLD'
    ? recommendation
    : undefined;
};

const mapOfferStatus = (value: unknown): OfferStatus => {
  const status = normalizedKey(value);
  switch (status) {
    case 'pending-approval':
    case 'sent':
    case 'accepted':
    case 'declined':
    case 'expired':
    case 'draft':
      return status;
    default:
      return 'draft';
  }
};

/** Unwraps nested API response envelopes of the documented `{data}` / `{success, data}` forms. */
export const unwrapApiResponse = (response: unknown): unknown => {
  let current = response;
  while (isRecord(current) && Object.prototype.hasOwnProperty.call(current, 'data')) {
    current = current.data;
  }
  return current;
};

const findMetadataNumber = (response: unknown, key: 'total' | 'page' | 'limit'): number | undefined => {
  let current = response;
  while (isRecord(current)) {
    const parsed = optionalNumber(current[key]);
    if (parsed !== undefined) return parsed;
    if (!Object.prototype.hasOwnProperty.call(current, 'data')) break;
    current = current.data;
  }
  return undefined;
};

/** Extracts documented list shapes and keeps pagination metadata when present. */
export const normalizeList = <T>(
  response: unknown,
  mapItem: (item: unknown) => T,
): ApiList<T> => {
  const unwrapped = unwrapApiResponse(response);
  const record = isRecord(unwrapped) ? unwrapped : {};
  const rawItems = Array.isArray(unwrapped)
    ? unwrapped
    : Array.isArray(record.items)
      ? record.items
      : Array.isArray(record.results)
        ? record.results
        : [];
  const result: ApiList<T> = { items: rawItems.map(mapItem) };
  const total = findMetadataNumber(response, 'total');
  const page = findMetadataNumber(response, 'page');
  const limit = findMetadataNumber(response, 'limit');
  if (total !== undefined) result.total = total;
  if (page !== undefined) result.page = page;
  if (limit !== undefined) result.limit = limit;
  return result;
};

export const mapJob = (input: unknown): Job => {
  const record = isRecord(input) ? input : {};
  const minSalary = firstValue(record, 'min_salary', 'minSalary');
  const maxSalary = firstValue(record, 'max_salary', 'maxSalary');
  const minimumExperience = firstValue(record, 'min_experience', 'minExperience');
  const maximumExperience = firstValue(record, 'max_experience', 'maxExperience');
  const experience = optionalString(firstValue(record, 'experience_required', 'experienceRequired')) ??
    experienceFromRange(minimumExperience, maximumExperience);
  const applications = firstValue(record, 'applications');

  return {
    id: asString(firstValue(record, 'id')),
    title: asString(firstValue(record, 'title')),
    department: asString(firstValue(record, 'department')),
    employmentType: mapEmploymentType(firstValue(record, 'employment_type', 'employmentType')),
    experience,
    skills: asStringList(firstValue(record, 'skills')),
    salaryMin: asNumber(minSalary),
    salaryMax: asNumber(maxSalary),
    currency: 'INR',
    vacancies: asNumber(firstValue(record, 'vacancies'), 1),
    location: asString(firstValue(record, 'location')),
    workMode: mapWorkMode(firstValue(record, 'work_mode', 'workMode')),
    description: asString(firstValue(record, 'job_description', 'jobDescription')),
    responsibilities: asStringList(firstValue(record, 'responsibilities'), true),
    requirements: asStringList(firstValue(record, 'requirements'), true),
    benefits: asStringList(firstValue(record, 'benefits'), true),
    hiringManager: asString(firstValue(record, 'hiring_manager', 'hiringManager')),
    recruiter: asString(firstValue(record, 'recruiter')),
    status: mapJobStatus(firstValue(record, 'status')),
    publishedAt: asString(firstValue(record, 'created_at', 'createdAt')),
    closingAt: asString(firstValue(record, 'updated_at', 'updatedAt')),
    applicants: Array.isArray(applications)
      ? applications.length
      : asNumber(firstValue(record, 'applicants')),
  };
};

export interface JobWritePayload {
  title: string;
  department: string;
  designation: string;
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  experience_required: string;
  min_experience?: number;
  max_experience?: number;
  min_salary: number;
  max_salary: number;
  location: string;
  vacancies: number;
  job_description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  status: 'PUBLISHED' | 'DRAFT' | 'CLOSED' | 'ARCHIVED';
  rounds: string[];
  skills: string[];
}

const toApiEmploymentType = (value: EmploymentType): JobWritePayload['employment_type'] => {
  switch (value) {
    case 'Part-time':
      return 'PART_TIME';
    case 'Contract':
      return 'CONTRACT';
    case 'Internship':
      return 'INTERN';
    case 'Temporary':
    case 'Full-time':
    default:
      return 'FULL_TIME';
  }
};

const experienceBounds = (experience: string): { min?: number; max?: number } => {
  const match = experience.match(/^\s*(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*(?:yrs?|years?)?\s*$/i);
  if (!match) return {};
  return { min: Number(match[1]), max: Number(match[2]) };
};

export const getJobWriteGaps = (job: Pick<Job, 'employmentType'>): string[] =>
  job.employmentType === 'Temporary'
    ? ['Temporary employment type maps to FULL_TIME; the backend contract has no Temporary value.']
    : [];

export const toJobWritePayload = (job: Job): JobWritePayload => {
  const bounds = experienceBounds(job.experience);
  const department = job.department;
  const technicalDepartment = /engineering|tech|data/i.test(department);

  return {
    title: job.title,
    department,
    designation: job.title,
    employment_type: toApiEmploymentType(job.employmentType),
    experience_required: job.experience,
    ...(bounds.min !== undefined ? { min_experience: bounds.min } : {}),
    ...(bounds.max !== undefined ? { max_experience: bounds.max } : {}),
    min_salary: job.salaryMin,
    max_salary: job.salaryMax,
    location: job.location,
    vacancies: job.vacancies,
    job_description: job.description,
    responsibilities: job.responsibilities.join('\n'),
    requirements: job.requirements.join('\n'),
    benefits: job.benefits.join('\n'),
    status: job.status === 'active' ? 'PUBLISHED' : job.status.toUpperCase() as JobWritePayload['status'],
    rounds: technicalDepartment
      ? ['Screening', 'Technical', 'Manager', 'HR']
      : ['Screening', 'Domain Assessment', 'Manager', 'HR'],
    skills: [...job.skills],
  };
};

export const mapCandidate = (input: unknown): Candidate => {
  const record = isRecord(input) ? input : {};
  const applicationRecords = asRecords(firstValue(record, 'applications'));
  const latestRawApplication = latestApplication(applicationRecords);
  const latest = latestRawApplication ? mapApplication(latestRawApplication) : undefined;
  const mappedApplications = applicationRecords.map(mapApplication);
  const nestedJob = latestRawApplication && isRecord(firstValue(latestRawApplication, 'job'))
    ? firstValue(latestRawApplication, 'job') as ApiRecord
    : {};
  const jobId = latest?.jobId || asString(firstValue(record, 'job_id', 'jobId'));
  const appliedPosition = latest?.appliedPosition ??
    optionalString(firstValue(record, 'applied_position', 'appliedPosition')) ??
    asString(firstValue(nestedJob, 'title'));
  const isTalentPool = asBoolean(firstValue(record, 'is_talent_pool', 'isTalentPool'));
  const stage = latest?.stage ?? (isTalentPool ? 'screening' : 'applied');
  const appliedAt = latest?.appliedAt ?? asString(firstValue(record, 'created_at', 'createdAt'));
  const id = asString(firstValue(record, 'id'));
  const rawName = optionalString(firstValue(record, 'name', 'full_name', 'fullName'));
  const name = rawName ?? namesFrom(
    firstValue(record, 'first_name', 'firstName'),
    firstValue(record, 'last_name', 'lastName'),
  );
  const resumePath = optionalString(firstValue(record, 'resume_path', 'resumePath'));
  const resumeName = optionalString(firstValue(record, 'resume_name', 'resumeName')) ??
    (resumePath ? resumePath.split(/[\\/]/).pop() ?? resumePath : '');
  const documents = mapCandidateDocuments(firstValue(record, 'documents'));
  if (resumePath && !documents.some((document) => document.name === resumeName)) {
    documents.push({ name: resumeName, type: 'resume' });
  }

  const timeline = mapCandidateTimeline(firstValue(record, 'timeline'));
  if (timeline.length === 0) {
    const jobTitle = appliedPosition || asString(firstValue(nestedJob, 'title'));
    const stageAt = asString(firstValue(latestRawApplication ?? {}, 'updated_at', 'updatedAt')) || appliedAt;
    timeline.push(
      {
        id: `${id}:applied`,
        at: appliedAt,
        kind: 'system',
        title: `Applied for ${jobTitle}`,
      },
      {
        id: `${id}:stage`,
        at: stageAt,
        kind: 'system',
        title: `Moved to ${stage}`,
      },
    );
  }

  return {
    id,
    name,
    email: asString(firstValue(record, 'email')),
    phone: asString(firstValue(record, 'phone')),
    ...(optionalString(firstValue(record, 'photo_url', 'photoUrl'))
      ? { photoUrl: optionalString(firstValue(record, 'photo_url', 'photoUrl')) }
      : {}),
    location: asString(firstValue(record, 'location')),
    jobId,
    ...(latest?.id ? { applicationId: latest.id } : optionalString(firstValue(record, 'application_id', 'applicationId'))
      ? { applicationId: optionalString(firstValue(record, 'application_id', 'applicationId')) }
      : {}),
    appliedPosition,
    stage,
    atsScore: nullableNumber(firstValue(record, 'ats_score', 'atsScore')),
    jobMatch: nullableNumber(firstValue(record, 'job_match', 'jobMatch')),
    source: asString(firstValue(record, 'source'), 'DIRECT') || 'DIRECT',
    tags: asStringList(firstValue(record, 'tags')),
    skills: asStringList(firstValue(record, 'skills')),
    yearsExperience: asNumber(firstValue(record, 'years_experience', 'yearsExperience')),
    ...(optionalString(firstValue(record, 'current_company', 'currentCompany'))
      ? { currentCompany: optionalString(firstValue(record, 'current_company', 'currentCompany')) }
      : {}),
    ...(optionalString(firstValue(record, 'current_role', 'currentRole'))
      ? { currentRole: optionalString(firstValue(record, 'current_role', 'currentRole')) }
      : {}),
    ...(optionalNumber(firstValue(record, 'expected_salary', 'expectedSalary')) !== undefined
      ? { expectedSalary: optionalNumber(firstValue(record, 'expected_salary', 'expectedSalary')) }
      : {}),
    ...(optionalNumber(firstValue(record, 'notice_days', 'noticeDays')) !== undefined
      ? { noticeDays: optionalNumber(firstValue(record, 'notice_days', 'noticeDays')) }
      : {}),
    ...(optionalString(firstValue(record, 'vendor_id', 'vendorId'))
      ? { vendorId: optionalString(firstValue(record, 'vendor_id', 'vendorId')) }
      : {}),
    resumeName,
    summary: asString(firstValue(record, 'summary')),
    experience: mapCandidateExperience(firstValue(record, 'experience')),
    education: mapCandidateEducation(firstValue(record, 'education')),
    projects: mapCandidateProjects(firstValue(record, 'projects')),
    certifications: asStringList(firstValue(record, 'certifications')),
    languages: asStringList(firstValue(record, 'languages')),
    feedback: mapCandidateFeedback(firstValue(record, 'feedback')),
    notes: mapCandidateNotes(firstValue(record, 'notes')),
    documents,
    timeline,
    appliedAt,
    ...(Array.isArray(firstValue(record, 'applications')) ? { applications: mappedApplications } : {}),
  };
};

export interface CandidateWritePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  tags: string[];
  years_experience: number;
  current_company?: string;
  current_role?: string;
  expected_salary?: number;
  notice_days?: number;
  source: string;
  is_talent_pool: boolean;
}

export const toCandidateWritePayload = (candidate: Candidate): CandidateWritePayload => {
  const nameParts = candidate.name.trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ') || 'Candidate';

  return {
    first_name: firstName,
    last_name: lastName,
    email: candidate.email,
    phone: candidate.phone,
    location: candidate.location,
    summary: candidate.summary,
    skills: [...candidate.skills],
    tags: [...candidate.tags],
    years_experience: candidate.yearsExperience,
    ...(candidate.currentCompany ? { current_company: candidate.currentCompany } : {}),
    ...(candidate.currentRole ? { current_role: candidate.currentRole } : {}),
    ...(candidate.expectedSalary !== undefined ? { expected_salary: candidate.expectedSalary } : {}),
    ...(candidate.noticeDays !== undefined ? { notice_days: candidate.noticeDays } : {}),
    source: candidate.source || 'DIRECT',
    is_talent_pool: candidate.stage === 'screening' || !candidate.jobId,
  };
};

export const mapInterview = (input: unknown): Interview => {
  const record = isRecord(input) ? input : {};
  const scheduleRecords = asRecords(firstValue(record, 'schedules'));
  const explicitSchedule = isRecord(firstValue(record, 'schedule')) ? firstValue(record, 'schedule') as ApiRecord : undefined;
  const schedule = explicitSchedule ?? scheduleRecords[0] ?? {};
  const candidate = isRecord(firstValue(record, 'candidate')) ? firstValue(record, 'candidate') as ApiRecord : {};
  const job = isRecord(firstValue(record, 'job')) ? firstValue(record, 'job') as ApiRecord : {};
  const interviewerValue = firstValue(record, 'interviewer');
  const interviewerRecord = isRecord(interviewerValue) ? interviewerValue : {};
  const interviewerName = asString(firstValue(interviewerRecord, 'name')) ||
    namesFrom(firstValue(interviewerRecord, 'first_name', 'firstName'), firstValue(interviewerRecord, 'last_name', 'lastName')) ||
    asString(firstValue(record, 'interviewer_name', 'interviewerName')) ||
    asString(interviewerValue);
  const id = asString(firstValue(record, 'interview_id', 'interviewId', 'id'));
  const date = optionalString(firstValue(record, 'scheduled_at', 'scheduledAt', 'date')) ?? null;
  const status = mapInterviewStatus(firstValue(record, 'status'));
  const dateTime = date ? Date.parse(date) : Number.NaN;
  const isOverdue = asBoolean(firstValue(record, 'is_overdue', 'isOverdue')) ||
    (status === 'SCHEDULED' && Number.isFinite(dateTime) && dateTime < Date.now());
  const recommendation = mapInterviewRecommendation(firstValue(record, 'recommendation'));
  const rating = optionalNumber(firstValue(record, 'rating'));
  const candidateName = asString(firstValue(candidate, 'name')) ||
    namesFrom(firstValue(candidate, 'first_name', 'firstName'), firstValue(candidate, 'last_name', 'lastName')) ||
    asString(firstValue(record, 'candidate_name', 'candidateName'));
  const roundValue = firstValue(record, 'round_name', 'roundName', 'round');
  const round = isRecord(roundValue) ? asString(firstValue(roundValue, 'name')) : asString(roundValue);

  return {
    id,
    interviewId: id,
    roundId: asString(firstValue(record, 'round_id', 'roundId')),
    scheduleId: optionalString(firstValue(record, 'schedule_id', 'scheduleId')) ??
      optionalString(firstValue(schedule, 'id')) ?? null,
    applicationId: asString(firstValue(record, 'application_id', 'applicationId')),
    candidateId: asString(firstValue(record, 'candidate_id', 'candidateId') ?? firstValue(candidate, 'id')),
    candidateName,
    ...(optionalString(firstValue(candidate, 'email')) ?? optionalString(firstValue(record, 'candidate_email', 'candidateEmail'))
      ? { candidateEmail: optionalString(firstValue(candidate, 'email')) ?? optionalString(firstValue(record, 'candidate_email', 'candidateEmail')) }
      : {}),
    jobId: asString(firstValue(record, 'job_id', 'jobId') ?? firstValue(job, 'id')),
    jobTitle: asString(firstValue(job, 'title') ?? firstValue(record, 'job_title', 'jobTitle')),
    round,
    interviewerId: optionalString(firstValue(record, 'interviewer_id', 'interviewerId') ?? firstValue(interviewerRecord, 'id')) ?? null,
    interviewer: interviewerName,
    date,
    durationMins: asNumber(firstValue(record, 'duration_minutes', 'durationMins')),
    ...(optionalString(firstValue(record, 'timezone')) ? { timezone: optionalString(firstValue(record, 'timezone')) } : {}),
    mode: mapInterviewMode(firstValue(record, 'mode')),
    meetingLink: optionalString(firstValue(record, 'meeting_url', 'meetingUrl', 'meeting_link', 'meetingLink')) ??
      optionalString(firstValue(schedule, 'meeting_link', 'meetingLink')) ?? null,
    ...(optionalString(firstValue(record, 'office_address', 'officeAddress'))
      ? { officeAddress: optionalString(firstValue(record, 'office_address', 'officeAddress')) }
      : {}),
    status,
    isOverdue,
    ...(rating !== undefined ? { rating } : {}),
    ...(recommendation ? { recommendation } : {}),
    ...(optionalString(firstValue(record, 'feedback', 'feedback_notes', 'feedbackNotes'))
      ? { feedback: optionalString(firstValue(record, 'feedback', 'feedback_notes', 'feedbackNotes')) }
      : {}),
    ...(optionalString(firstValue(record, 'cancelled_reason', 'cancelledReason'))
      ? { cancelledReason: optionalString(firstValue(record, 'cancelled_reason', 'cancelledReason')) }
      : {}),
    ...(optionalString(firstValue(record, 'created_at', 'createdAt'))
      ? { createdAt: optionalString(firstValue(record, 'created_at', 'createdAt')) }
      : {}),
    ...(optionalString(firstValue(record, 'notes')) ? { notes: optionalString(firstValue(record, 'notes')) } : {}),
  };
};

const mapOfferApprovals = (value: unknown): OfferApproval[] =>
  asRecords(value).map((item) => {
    const status = normalizedKey(firstValue(item, 'status'));
    return {
      stage: asString(firstValue(item, 'stage')),
      by: asString(firstValue(item, 'by')),
      at: asString(firstValue(item, 'at')),
      status: status === 'approved' || status === 'rejected' ? status : 'pending',
    };
  });

export const mapOffer = (input: unknown): Offer => {
  const record = isRecord(input) ? input : {};
  const application = isRecord(firstValue(record, 'application')) ? firstValue(record, 'application') as ApiRecord : {};
  const candidate = isRecord(firstValue(application, 'candidate')) ? firstValue(application, 'candidate') as ApiRecord : {};
  const job = isRecord(firstValue(application, 'job')) ? firstValue(application, 'job') as ApiRecord : {};
  const candidateName = asString(firstValue(candidate, 'name')) ||
    namesFrom(firstValue(candidate, 'first_name', 'firstName'), firstValue(candidate, 'last_name', 'lastName')) ||
    asString(firstValue(record, 'candidate_name', 'candidateName'));
  const applicationId = optionalString(firstValue(record, 'application_id', 'applicationId')) ??
    optionalString(firstValue(application, 'id'));
  const sentAt = optionalString(firstValue(record, 'created_at', 'createdAt'));
  const respondedAt = optionalString(firstValue(record, 'updated_at', 'updatedAt'));

  return {
    id: asString(firstValue(record, 'id')),
    ...(applicationId ? { applicationId } : {}),
    candidateId: asString(firstValue(record, 'candidate_id', 'candidateId') ?? firstValue(candidate, 'id')),
    candidateName,
    jobId: asString(firstValue(record, 'job_id', 'jobId') ?? firstValue(job, 'id')),
    jobTitle: asString(firstValue(job, 'title') ?? firstValue(record, 'job_title', 'jobTitle')),
    salary: asNumber(firstValue(record, 'ctc', 'salary')),
    currency: asString(firstValue(record, 'currency')),
    joiningDate: asString(firstValue(record, 'joining_date', 'joiningDate')),
    benefits: asStringList(firstValue(record, 'benefits')),
    status: mapOfferStatus(firstValue(record, 'status')),
    ...(sentAt ? { sentAt } : {}),
    ...(respondedAt ? { respondedAt } : {}),
    approvals: mapOfferApprovals(firstValue(record, 'approvals')),
  };
};


/* =========================================================================
   EXTENDED RECRUITMENT MAPPERS: REQUISITIONS, VENDORS, REFERRALS & CTC
   ========================================================================= */

import type {
  AgencyVendor,
  CtcBreakdown,
  Referral,
  ReferralStatus,
  Requisition,
  RequisitionPriority,
  RequisitionStatus,
  VendorStatus,
} from '../types';

export const splitCtcToComponents = (annualCtc: number): CtcBreakdown => {
  const safeCtc = Math.max(0, annualCtc);
  const basicSalary = Math.round(safeCtc * 0.5);
  const hra = Math.round(safeCtc * 0.25);
  const specialAllowance = Math.max(0, safeCtc - basicSalary - hra);
  const monthlyGross = Math.round(safeCtc / 12);

  return {
    totalCtc: safeCtc,
    basicSalary,
    hra,
    specialAllowance,
    bonus: 0,
    joiningBonus: 0,
    esopValue: 0,
    monthlyGross,
  };
};

const mapRequisitionStatus = (value: unknown): RequisitionStatus => {
  const raw = asString(value).trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (
    raw === 'submitted' ||
    raw === 'dept_head_approved' ||
    raw === 'finance_approved' ||
    raw === 'approved' ||
    raw === 'converted' ||
    raw === 'rejected'
  ) {
    return raw as RequisitionStatus;
  }
  return 'draft';
};

const mapRequisitionPriority = (value: unknown): RequisitionPriority => {
  const normalized = asString(value).trim().toUpperCase();
  if (normalized === 'LOW' || normalized === 'MEDIUM' || normalized === 'HIGH' || normalized === 'URGENT') {
    return normalized as RequisitionPriority;
  }
  return 'MEDIUM';
};

export const mapRequisition = (input: unknown): Requisition => {
  const record = isRecord(input) ? input : {};
  return {
    id: asString(firstValue(record, 'id')),
    title: asString(firstValue(record, 'title', 'role_title')),
    department: asString(firstValue(record, 'department', 'department_name')),
    headcount: asNumber(firstValue(record, 'headcount', 'vacancies'), 1),
    plannedQuarter: asString(firstValue(record, 'planned_quarter', 'plannedQuarter'), 'Q1 2026'),
    priority: mapRequisitionPriority(firstValue(record, 'priority')),
    budgetMin: asNumber(firstValue(record, 'budget_min', 'budgetMin')),
    budgetMax: asNumber(firstValue(record, 'budget_max', 'budgetMax')),
    currency: asString(firstValue(record, 'currency'), 'INR'),
    skills: asStringList(firstValue(record, 'skills')),
    experienceLevel: asString(firstValue(record, 'experience_level', 'experienceLevel'), 'Mid-Level'),
    justification: asString(firstValue(record, 'justification')),
    status: mapRequisitionStatus(firstValue(record, 'status')),
    createdAt: asString(firstValue(record, 'created_at', 'createdAt'), new Date().toISOString()),
    createdBy: optionalString(firstValue(record, 'created_by', 'createdBy')),
  };
};

export const mapVendor = (input: unknown): AgencyVendor => {
  const record = isRecord(input) ? input : {};
  const statusRaw = asString(firstValue(record, 'status')).toUpperCase();
  const status: VendorStatus = statusRaw === 'PAUSED' || statusRaw === 'TERMINATED' ? statusRaw : 'ACTIVE';

  return {
    id: asString(firstValue(record, 'id')),
    name: asString(firstValue(record, 'name', 'agency_name')),
    contactName: asString(firstValue(record, 'contact_name', 'contactName')),
    email: asString(firstValue(record, 'email')),
    phone: asString(firstValue(record, 'phone')),
    commissionRate: asNumber(firstValue(record, 'commission_rate', 'commissionRate')),
    status,
    activeReqsCount: optionalNumber(firstValue(record, 'active_reqs_count', 'activeReqsCount')),
    hiresYtd: optionalNumber(firstValue(record, 'hires_ytd', 'hiresYtd')),
    spendYtd: optionalNumber(firstValue(record, 'spend_ytd', 'spendYtd')),
    createdAt: optionalString(firstValue(record, 'created_at', 'createdAt')),
  };
};

export const mapReferral = (input: unknown): Referral => {
  const record = isRecord(input) ? input : {};
  const candidate = isRecord(firstValue(record, 'candidate')) ? (firstValue(record, 'candidate') as ApiRecord) : {};
  const referrer = isRecord(firstValue(record, 'employee', 'referrer'))
    ? (firstValue(record, 'employee', 'referrer') as ApiRecord)
    : {};
  const job = isRecord(firstValue(record, 'job')) ? (firstValue(record, 'job') as ApiRecord) : {};

  const statusRaw = asString(firstValue(record, 'status')).toLowerCase();
  let status: ReferralStatus = 'Submitted';
  if (statusRaw.includes('interview')) status = 'Interview';
  else if (statusRaw.includes('offer')) status = 'Offer';
  else if (statusRaw.includes('hired')) status = 'Hired';
  else if (statusRaw.includes('reject')) status = 'Rejected';

  return {
    id: asString(firstValue(record, 'id')),
    candidateId: asString(firstValue(record, 'candidate_id', 'candidateId') ?? firstValue(candidate, 'id')),
    candidateName:
      asString(firstValue(candidate, 'name')) ||
      namesFrom(firstValue(candidate, 'first_name'), firstValue(candidate, 'last_name')) ||
      asString(firstValue(record, 'candidate_name')),
    referrerEmployeeId: asString(firstValue(record, 'employee_id', 'employeeId') ?? firstValue(referrer, 'id')),
    referrerName:
      asString(firstValue(referrer, 'name')) ||
      namesFrom(firstValue(referrer, 'first_name'), firstValue(referrer, 'last_name')) ||
      asString(firstValue(record, 'referrer_name')),
    referrerDepartment: asString(firstValue(referrer, 'department') ?? firstValue(record, 'referrer_department'), 'General'),
    jobId: optionalString(firstValue(record, 'job_id', 'jobId') ?? firstValue(job, 'id')),
    jobTitle: optionalString(firstValue(job, 'title') ?? firstValue(record, 'job_title')),
    rewardAmount: asNumber(firstValue(record, 'reward_amount', 'rewardAmount')),
    status,
    submittedAt: asString(firstValue(record, 'created_at', 'submitted_at'), new Date().toISOString()),
    bonusPaid: asBoolean(firstValue(record, 'bonus_paid', 'bonusPaid')),
  };
};
