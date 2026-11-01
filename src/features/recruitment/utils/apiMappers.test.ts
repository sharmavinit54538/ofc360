import { describe, expect, it } from 'vitest';
import {
  getJobWriteGaps,
  mapCandidate,
  mapInterview,
  mapJob,
  mapOffer,
  normalizeList,
  toCandidateWritePayload,
  toJobWritePayload,
  unwrapApiResponse,
} from './apiMappers';
import type { Candidate, Job } from '../types';

describe('recruitment API mappers', () => {
  it('unwraps documented success/data envelopes, including nested data wrappers', () => {
    expect(unwrapApiResponse({ success: true, data: { data: [{ id: 'job-1' }] } })).toEqual([
      { id: 'job-1' },
    ]);
  });

  it('normalizes arrays, items, results, and nested paginated lists', () => {
    const identity = (item: unknown): unknown => item;
    expect(normalizeList([{ id: '1' }], identity).items).toEqual([{ id: '1' }]);
    expect(normalizeList({ items: [{ id: '2' }], total: 8, page: 2, limit: 5 }, identity)).toEqual({
      items: [{ id: '2' }],
      total: 8,
      page: 2,
      limit: 5,
    });
    expect(normalizeList({ results: [{ id: '3' }] }, identity).items).toEqual([{ id: '3' }]);
    expect(normalizeList({ data: { items: [{ id: '4' }], total: 1 } }, identity)).toEqual({
      items: [{ id: '4' }],
      total: 1,
    });
  });

  it('maps snake_case and camelCase job fields and applies the documented defaults', () => {
    const snakeCase = mapJob({
      id: 'job-1',
      title: 'Senior Engineer',
      department: 'Engineering',
      employment_type: 'FULL_TIME',
      min_experience: 4,
      max_experience: 7,
      skills: [{ skill_name: 'TypeScript' }, 'React'],
      min_salary: '1800000',
      max_salary: 2400000,
      work_mode: 'HYBRID',
      job_description: 'Build software',
      responsibilities: 'Design systems\nReview code',
      requirements: ['Experience'],
      benefits: 'Health cover\nLearning budget',
      status: 'PUBLISHED',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-02-01T00:00:00Z',
      applications: [{ id: 'app-1' }, { id: 'app-2' }],
    });
    expect(snakeCase).toMatchObject({
      experience: '4-7 yrs',
      skills: ['TypeScript', 'React'],
      salaryMin: 1800000,
      salaryMax: 2400000,
      currency: 'INR',
      vacancies: 1,
      workMode: 'Hybrid',
      responsibilities: ['Design systems', 'Review code'],
      benefits: ['Health cover', 'Learning budget'],
      status: 'active',
      publishedAt: '2026-01-01T00:00:00Z',
      closingAt: '2026-02-01T00:00:00Z',
      applicants: 2,
    });

    expect(mapJob({ employmentType: 'INTERN', workMode: 'Remote', vacancies: 3, status: 'draft' }))
      .toMatchObject({ employmentType: 'Internship', workMode: 'Remote', vacancies: 3, status: 'draft' });
  });

  it('builds the documented job write payload without guessing experience bounds', () => {
    const job: Job = {
      id: 'job-1', title: 'Data Analyst', department: 'Data', employmentType: 'Temporary',
      experience: '3-5 yrs', skills: ['SQL'], salaryMin: 800000, salaryMax: 1200000,
      currency: 'INR', vacancies: 2, location: 'Jaipur', workMode: 'Hybrid', description: 'Analyze data',
      responsibilities: ['Build reports', 'Review metrics'], requirements: ['SQL'], benefits: ['Insurance'],
      hiringManager: '', recruiter: '', status: 'active', publishedAt: '', closingAt: '', applicants: 0,
    };

    expect(toJobWritePayload(job)).toMatchObject({
      designation: 'Data Analyst',
      employment_type: 'FULL_TIME',
      min_experience: 3,
      max_experience: 5,
      responsibilities: 'Build reports\nReview metrics',
      status: 'PUBLISHED',
      rounds: ['Screening', 'Technical', 'Manager', 'HR'],
    });
    expect(getJobWriteGaps(job)).toHaveLength(1);
    expect(toJobWritePayload({ ...job, experience: '3–5 yrs' })).toMatchObject({
      min_experience: 3,
      max_experience: 5,
    });
    expect(toJobWritePayload({ ...job, experience: '5+ years' })).not.toHaveProperty('min_experience');
  });

  it('maps candidates from their latest application and synthesizes an empty timeline', () => {
    const candidate = mapCandidate({
      id: 'candidate-1',
      first_name: 'Mira',
      last_name: 'Rao',
      email: 'mira@example.test',
      phone: '+91 90000 00000',
      years_experience: '6',
      ats_score: 82,
      job_match: 91,
      resume_name: 'mira.pdf',
      resume_path: '/resumes/mira.pdf',
      applications: [
        { id: 'app-old', job_id: 'job-old', status: 'APPLIED', created_at: '2025-01-01', job: { title: 'Old role' } },
        { id: 'app-new', job_id: 'job-new', status: 'TECHNICAL', created_at: '2026-01-01', updated_at: '2026-01-02', job: { title: 'New role' } },
      ],
      notes: [{ id: 'note-1', created_at: '2026-01-03', note_text: 'Strong portfolio', author: { first_name: 'Ari', last_name: 'Lee' } }],
      created_at: '2025-01-01',
    });

    expect(candidate).toMatchObject({
      name: 'Mira Rao',
      jobId: 'job-new',
      applicationId: 'app-new',
      appliedPosition: 'New role',
      stage: 'technical',
      yearsExperience: 6,
      atsScore: 82,
      jobMatch: 91,
      appliedAt: '2026-01-01',
      notes: [{ author: 'Ari Lee', text: 'Strong portfolio' }],
      documents: [{ name: 'mira.pdf', type: 'resume' }],
      timeline: [
        { kind: 'system', title: 'Applied for New role' },
        { kind: 'system', title: 'Moved to technical' },
      ],
    });
    expect(candidate.applications).toHaveLength(2);
  });

  it('maps a no-application talent-pool candidate to screening without fabricating a phone', () => {
    const candidate = mapCandidate({ id: 'candidate-2', is_talent_pool: true, phone: '' });
    expect(candidate.stage).toBe('screening');
    expect(candidate.jobId).toBe('');
    expect(toCandidateWritePayload(candidate)).toMatchObject({
      first_name: '',
      last_name: 'Candidate',
      phone: '',
      is_talent_pool: true,
      source: 'DIRECT',
    });
  });

  it('maps interviews across row/schedule shapes and calculates overdue scheduled interviews', () => {
    const interview = mapInterview({
      interview_id: 'interview-1',
      round_id: 'round-1',
      schedules: [{ id: 'schedule-1', meeting_link: 'https://meet.example.test/1' }],
      application_id: 'application-1',
      candidate_id: 'candidate-1',
      candidate: { first_name: 'Sam', last_name: 'Iyer', email: 'sam@example.test' },
      job_id: 'job-1',
      job: { title: 'Engineer' },
      round_name: 'Technical',
      interviewer: { id: 'user-1', first_name: 'Ravi', last_name: 'Das' },
      scheduled_at: '2020-01-01T00:00:00Z',
      duration_minutes: '60',
      mode: 'OFFLINE',
      status: 'SCHEDULE',
    });
    expect(interview).toMatchObject({
      id: 'interview-1',
      scheduleId: 'schedule-1',
      candidateName: 'Sam Iyer',
      interviewer: 'Ravi Das',
      date: '2020-01-01T00:00:00Z',
      durationMins: 60,
      mode: 'OFFLINE',
      status: 'SCHEDULED',
      meetingLink: 'https://meet.example.test/1',
      isOverdue: true,
    });
    expect(mapInterview({ status: 'no-show', mode: 'anything' })).toMatchObject({
      status: 'NO_SHOW', mode: 'ONLINE', date: null, scheduleId: null,
    });
  });

  it('maps offers from nested application records and leaves missing benefits/approvals empty', () => {
    const offer = mapOffer({
      id: 'offer-1',
      application_id: 'app-1',
      ctc: '2400000',
      joining_date: '2026-03-01',
      status: 'PENDING_APPROVAL',
      created_at: '2026-02-01',
      application: {
        candidate: { id: 'candidate-1', first_name: 'Ana', last_name: 'Sen' },
        job: { id: 'job-1', title: 'Product Designer' },
      },
    });
    expect(offer).toMatchObject({
      applicationId: 'app-1',
      candidateId: 'candidate-1',
      candidateName: 'Ana Sen',
      jobId: 'job-1',
      jobTitle: 'Product Designer',
      salary: 2400000,
      status: 'pending-approval',
      sentAt: '2026-02-01',
      benefits: [],
      approvals: [],
    });
  });
});
