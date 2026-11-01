## 4. DATA CONTRACT (save to docs/RECRUITMENT_CONTRACT.md)

### 4.1 Conventions
- Admin API base = `/api/v1` (relative paths below). `/api/v2/...` paths are ABSOLUTE: build them with a helper `apiV2Url(path)` from the
  origin of VITE_API_BASE_URL (verify fetchBaseQuery keeps absolute URLs unchanged; unit-test it).
- Responses may be wrapped `{ success, data }` or `{ data }`: always unwrap. List extraction accepts: array | `{items}` | `{results}` |
  `{data: []}` | `{data: {items}}`. Lists also carry `{total, page, limit}` when paginated.
- IDs are UUID strings. Only call update/stage endpoints when the id is a real UUID (isUuid).

### 4.2 UI domain types (write them in `src/features/recruitment/types/index.ts`)
- `Stage = "applied"|"screening"|"assessment"|"interview"|"technical"|"hr"|"offer"|"hired"|"rejected"`; labels: Applied, Screening, Assessment,
  Interview, Technical Round, HR Round, Offer, Hired, Rejected.
- `JobStatus = "active"|"draft"|"closed"|"archived"`; `EmploymentType = "Full-time"|"Part-time"|"Contract"|"Internship"|"Temporary"`;
  `WorkMode = "Remote"|"Hybrid"|"Onsite"`.
- `Job { id,title,department,employmentType,experience,skills:string[],salaryMin,salaryMax,currency,vacancies,location,workMode,description,
  responsibilities:string[],requirements:string[],benefits:string[],hiringManager,recruiter,status,publishedAt,closingAt,applicants }`.
- `Candidate { id,name,email,phone,photoUrl?,location,jobId,applicationId?,appliedPosition,stage,atsScore:number|null,jobMatch:number|null,
  source,tags[],skills[],yearsExperience,currentCompany?,currentRole?,expectedSalary?,noticeDays?,vendorId?,resumeName,summary,
  experience[{company,role,start,end,highlights[]}],education[{school,degree,start,end}],projects[{name,description,tech[]}],
  certifications[],languages[],feedback[{interviewer,round,rating,notes,date}],notes[{id,at,author,text}],documents[{name,type}],
  timeline[{id,at,kind:"stage"|"note"|"interview"|"offer"|"email"|"system",title,detail?,actor?}],appliedAt,
  applications?[{id,jobId,stage,appliedPosition?,appliedAt?}] }`.
- `InterviewStatus = "PENDING_SCHEDULE"|"SCHEDULED"|"COMPLETED"|"CANCELLED"|"NO_SHOW"`; `InterviewMode = "ONLINE"|"OFFLINE"`;
  `InterviewRecommendation = "PASS"|"REJECT"|"HOLD"`.
- `Interview { id,interviewId,roundId,scheduleId|null,applicationId,candidateId,candidateName,candidateEmail?,jobId,jobTitle,round,
  interviewerId|null,interviewer,date|null (ISO),durationMins,timezone?,mode,meetingLink|null,officeAddress?,status,isOverdue?,rating?,
  recommendation?,feedback?,cancelledReason?,createdAt?,notes? }`; `Interviewer { id,name,email?,role? }`.
- `OfferStatus = "draft"|"pending-approval"|"sent"|"accepted"|"declined"|"expired"`;
  `Offer { id,applicationId?,candidateId,candidateName,jobId,jobTitle,salary,currency,joiningDate,benefits[],status,sentAt?,respondedAt?,
  approvals[{stage,by,at,status:"pending"|"approved"|"rejected"}] }`.
- Screening: `ScreeningDecision = "SHORTLIST"|"REVIEW"|"REJECT"`, `HumanDecision = "SHORTLIST"|"REJECT"|"KEEP_REVIEW"`,
  `ScreeningStatus = "PENDING"|"RUNNING"|"COMPLETED"|"FAILED"`;
  `ScreeningResult { id,screeningId?,applicationId,candidateId,candidateName,status,error?,decision|null,confidence,matchScore,strengths[],
  weaknesses[],missingSkills[],redFlags[],greenFlags[],hiringRecommendation,hrNotes,questionsToAsk[],modelUsed,screenedAt|null,
  humanDecision|null,humanDecisionBy|null,humanDecisionReason|null,humanDecidedAt? }`; `ScreeningThresholds { shortlist, reject }`;
  `ScreeningRun { runId,status,completed,total }`.

### 4.3 Backend -> UI mapping (write as unit-tested pure functions in `utils/apiMappers.ts`; tolerate snake_case and camelCase)
- Job: `id,title,department`; `employment_type` FULL_TIME|PART_TIME|CONTRACT|INTERN -> Full-time|Part-time|Contract|Internship (default
  Full-time); `experience_required` (else `${min_experience}-${max_experience} yrs`); `skills` = array of `{skill_name}` or strings;
  `min_salary,max_salary` -> salaryMin/Max; currency fixed "INR"; `vacancies` (default 1); `location`; `work_mode`; `job_description`;
  `responsibilities|requirements|benefits` = newline-joined string OR string[] -> string[]; `status` PUBLISHED -> "active", else lowercase
  (draft|closed|archived); `created_at` -> publishedAt, `updated_at` -> closingAt; `applications[]` length -> applicants.
- Job WRITE payload (POST `/jobs`, PUT `/jobs/{id}` when id is UUID): `title, department, designation(=title), employment_type (map back;
  Temporary -> FULL_TIME, log a gap), experience_required, min_experience, max_experience, min_salary, max_salary, location, vacancies,
  job_description, responsibilities (join "\n"), requirements (join "\n"), benefits (join "\n"), status (active -> PUBLISHED else UPPERCASE),
  rounds (Engineering/Tech/Data departments -> ["Screening","Technical","Manager","HR"], else ["Screening","Domain Assessment","Manager","HR"]),
  skills (string[])`.
- Candidate: `first_name+last_name -> name`, `email, phone, location`, `applications[]` ({id, job_id, status|stage, created_at, updated_at,
  job:{title}}); latest application drives `jobId, applicationId, appliedPosition, stage (status lowercased)`; with no application:
  `is_talent_pool` -> "screening" else "applied". `notes[]` ({id, created_at, note_text, author:{first_name,last_name}}), `ats_score`,
  `job_match`, `source` (default DIRECT), `tags, skills, years_experience, current_company, current_role, expected_salary, notice_days,
  resume_name, resume_path (-> documents), summary, experience[], education[], projects[], certifications[], languages[], feedback[],
  timeline[]` (if empty, synthesize "Applied for <job>" and "Moved to <stage>" system events), `vendor_id, created_at`.
- Candidate WRITE payload (POST `/candidates`, PUT `/candidates/{id}`): `first_name, last_name (default "Candidate"), email, phone,
  location, summary, skills[], tags[], years_experience, current_company, current_role, expected_salary, notice_days, source (DIRECT),
  is_talent_pool (stage==="screening" or no job)`. Do NOT fabricate defaults like phone "0000000000": require real input in the form.
- Interview: row may be an interview, a round or a schedule. `interview_id|id`, `round_id`, `schedule_id|schedules[0].id`, `application_id`,
  `candidate_id`, candidate name from `candidate.name|first_name+last_name`, interviewer from `interviewer.name|first_name+last_name|
  interviewer_name`, `scheduled_at -> date`, `duration_minutes`, `meeting_url|schedule.meeting_link`, `office_address`, `status` upper-cased
  (SCHEDULE->SCHEDULED, "no-show"->NO_SHOW, default PENDING_SCHEDULE), `mode` (OFFLINE else ONLINE), `round_name|round`, `is_overdue`,
  `rating`, `recommendation`, `feedback|feedback_notes`, `cancelled_reason`, `timezone`, `job.title`.
  Overdue rule: `isOverdue` OR (date in the past AND status SCHEDULED).
- Offer: `id, application_id, ctc -> salary, joining_date, status (lowercase), created_at -> sentAt, updated_at -> respondedAt,
  application.candidate.first_name/last_name, application.job.title`. Do not invent benefits or approvals; render only what the API returns.
- Dashboard data = parallel `Promise.allSettled` of GET `/jobs`, `/candidates`, `/interviews`, `/offers`; partial success is fine
  (failed list = empty + inline warning); cache with `lastFetchedAt` and a `force` refetch after every mutation.

### 4.4 Endpoints the module uses (verify each against openapi.json)
JOBS: GET `/jobs` | GET `/jobs/{id}` | POST `/jobs` | PUT `/jobs/{id}` | DELETE `/jobs/{id}` | POST `/jobs/{id}/close` | POST `/jobs/{id}/duplicate`
| POST `/jobs/{id}/draft` | GET,POST `/jobs/{id}/publish` (POST body: platform, salary_visible, remote_option, employment_type, skills[], category,
application_method, expiry_date?) | GET `/jobs/{id}/sourcing-link` | GET `/jobs/{id}/qr` | GET `/jobs/{id}/applicants/export` |
POST `/recruitment/jobs/generate-description` (on 404 retry `/jobs/generate-description`) | POST `/recruitment/jobs/modify-description`
(404 -> `/jobs/modify-description`) | POST `/jobs/ai-autofill`.
CANDIDATES: GET `/candidates` (params) | POST `/candidates` | PUT `/candidates/{id}` | GET `/candidates/{id}` | GET `/candidates/export/csv`
(blob) | POST `/candidates/import` (multipart `file`; reply `{success,message}`) | POST `/resume-parser/upload-and-parse` (multipart `file`,
`generate_embedding="true"`).
APPLICATIONS: PATCH `/applications/{applicationId}/stage` body `{stage}` | POST `/applications/{id}/offer` body `{ctc, joining_date
(YYYY-MM-DD), offer_expiry_date (default +7 days)}` | POST `/applications/{id}/send-interview?round_names=` | also available: GET
`/applications`, `/applications/stats`, PATCH `.../shortlist|reject|hold`, POST `/applications/bulk-move|bulk-tag`.
CRM: POST `/crm/notes` body `{candidate_id, note_text}` | GET `/crm/notes/{candidate_id}`.
INTERVIEWS (params `status, from, to, job_id, candidate_id, interviewer_id, page, limit`; page size 50): GET `/interviews` | GET
`/interviews/interviewers` | POST `/interviews/{interviewId}/rounds/{roundId}/schedule` body `{interviewer_id, scheduled_at (ISO UTC),
duration_minutes, mode, meeting_url?, office_address?, timezone?}` | PATCH `/interviews/schedules/{scheduleId}/reschedule` `{scheduled_at,
duration_minutes?, reason?}` | POST `/interviews/schedules/{id}/cancel` `{reason}` | POST `/interviews/schedules/{id}/reminder` | PATCH
`/interviews/schedules/{id}/no-show` | PATCH `/interviews/rounds/{roundId}/{pass|reject|hold}` body `{feedback, score 1-5, interviewer_name?}`.
NOTE: the backend openapi lists `POST /interviews/{id}/schedule` and `PATCH /interviews/rounds/{round_id}/pass|hold|reject`; the paths
for reschedule/cancel/reminder/no-show/interviewers/booking above may not exist there: confirm and log gaps, do not silently change.
SCORECARDS: POST `/scorecards/submissions` | GET `/scorecards/submissions/{round_id}` | GET,POST `/scorecards/templates`.
OFFERS: GET `/offers` | PATCH `/offers/{id}/accept|reject` | POST `/api/v2/offer-letters/generate` | GET `/api/v2/offer-letters/download/{filename}`.
REQUISITIONS: GET `/requisitions` | GET `/requisitions/{id}` | POST `/requisitions` body `{title, department, headcount, planned_quarter,
priority, budget_min, budget_max, currency, skills[], experience_level, justification}` | POST `/requisitions/{id}/approve` (there is NO reject).
VENDORS: GET `/vendors?limit=100` | POST `/vendors` `{name, contact_name, email, phone, commission_rate, status}` | PUT,DELETE `/vendors/{id}`.
REFERRALS: GET `/referrals?limit=100` | POST `/referrals` `{candidate_id, employee_id, job_id|null, reward_amount}` | PUT `/referrals/{id}/status` |
GET `/employees?limit=200` (referrer picker) | GET `/departments?limit=100`.
AUTOMATION: GET `/automations/rules` | POST `/automations/rules` `{name, description, trigger_event, action, enabled}` | POST
`/global-notifications/automation-rules/{id}/toggle` | POST `/global-notifications/automation-rules/{id}/test`.
SCREENING (AI): POST `/api/v2/screening/jobs/{jobId}/run` body `{application_ids?, model?, force?}` -> `{run_id,status,total}` | GET
`/api/v2/screening/jobs/{jobId}/results` -> `{thresholds:{shortlist,reject}|null, run:{run_id,status,completed,total}|null, results:[...]}` with
item fields `id, screening_id, application_id, candidate_id, candidate_name, status, error, decision, confidence, match_score, strengths,
weaknesses, missing_skills, red_flags|redFlags, green_flags|greenFlags, hiring_recommendation, hr_notes, questions_to_ask, model_used,
screened_at, human_decision, human_decision_by, human_decision_reason, human_decided_at` | POST
`/api/v2/screening/results/{screeningId}/decision` body `{action: SHORTLIST|REJECT|KEEP_REVIEW, reason?}` | GET
`/api/v2/screening/history/{applicationId}`. Also: GET `/api/v2/ranking/top/{job_id}`, GET `/ai/job-ranking/{job_id}`, GET
`/ai/recruiter/candidate/{id}/recommendation|score`, POST `/ai/recruiter/interview/questions`.
AI INTERVIEW BOT (all `/api/v2/interview-bot/...`): PUBLIC (no auth, by token): GET `public/{token}` -> `{token, candidate_name, first_name?,
job_title, company_name?, estimated_duration_minutes?, consent_text?, status NOT_STARTED|IN_PROGRESS|COMPLETED|EXPIRED, current_question?
{id, question_text, category?, time_limit_seconds?, question_number, total_questions}, total_questions?, answered_count?}` | POST
`public/{token}/start` body `{consent: true}` | POST `public/{token}/answer` `{question_id, answer_text}` | POST `public/{token}/finish` ->
`{success, status:"COMPLETED"}` | POST `public/{token}/request-human` body `{reason?}` -> `{success, message?}`. ADMIN: POST `invite`
`{application_id}` -> `{success, invite_url?, token?}` | GET `results` (param `job_id`; status and name search are applied client-side unless
openapi shows more params) -> `{items, total}` or array | POST `results/{result_id}/decision` `{action, reason?}`. Result item: `id, application_id, candidate_id?, candidate_name,
job_id, job_title?, status INVITED|IN_PROGRESS|COMPLETED|EXPIRED|FAILED, match_score?, confidence?, strengths[], weaknesses[], red_flags[],
green_flags?[], integrity_signals?{tab_switches?, paste_count?, flags?[]}, transcript?[{question_id?, question, answer, category?,
time_taken_seconds?}], human_decision*, invited_at?, completed_at?, error?`. Feature flag `VITE_AI_INTERVIEW_ENABLED` (enabled unless "false").
BOOKING (public): GET `/interviews/book/{token}` -> `{token, candidate_name, candidate_email, job_title, company_name?, round_name,
duration_minutes, interviewer_name?, status PENDING|BOOKED|EXPIRED|CANCELLED, available_slots[{slot_id?, start_time, end_time}] (UTC ISO),
booked_slot?{start_time,end_time,meeting_url?,office_address?,timezone?}}` | POST `/interviews/book/{token}` `{slot_id?, start_time,
timezone?}` -> `{status:"BOOKED", booked_slot, message?}`.
PUBLIC CAREERS (no auth; origin = VITE_API_BASE_URL origin; base `/api/public/careers`): GET `/{ukey}` then fallback GET `/apply/{ukey}` -> `{success,
data:{ id, slug, title, department, location, job_description, skills[], ... }}`; POST multipart `/{jobIdOrSlug}/apply` or `/apply/{ukey}`
(fallback to the other on 404/405) fields: `resume_file, first_name, last_name, email, phone ("<countryCode> <number>"), city, state,
country, experience_years, declaration_checked, highest_qualification?, current_company?, current_designation?, current_ctc?, expected_ctc?,
notice_period?, linkedin_url?, portfolio_url?, cover_letter?`; reply `{success, message}`.
RECRUITER DASHBOARD: GET `/ai/recruiter/dashboard|funnel|match-distribution|analytics`.
ANALYTICS: GET `/api/v2/analytics/interview-success`, `/api/v2/analytics/offer-acceptance-rate`, GET `/analytics/export`, GET `/reports/export`.
NOTIFICATIONS: GET `/recruitment/notifications`, PUT `/recruitment/notifications/{id}/read` (and the app's existing notification hook with
module "recruitment").
CAREER SITE settings: company settings GET/PUT (only `name` is persisted today).
TEMPLATES: GET,POST `/document-templates`, POST `/document-templates/{id}/generate` (verify fit; otherwise unavailable).
EMPLOYEE ONBOARDING (admin): GET `/admin/employee-onboarding` (params page, limit, search, status, department) | GET
`/admin/employee-onboarding/{employeeId}` | PUT `/admin/employee-onboarding/{employeeId}/document/{documentId}/verify` | (task toggle
`PATCH .../{id}/tasks/{taskKey}` and `POST /admin/employee-onboarding` may not exist: confirm). EMPLOYEE FLOW: `/employee-onboarding/progress|status|draft|complete`,
PUT `/employee-onboarding/step/1..9`, POST `/employee-onboarding/step/8/upload`, DELETE `/employee-onboarding/step/8/document/{docId}`.

### 4.5 Routes with NO backend (UI shows "Backend pending", never fake)
Candidate communications send (email/WhatsApp/SMS) and test dispatch, recruitment template persistence, requisition reject, background
verification (BGV), preboarding, knowledge-transfer/probation (30-60-90), enterprise cross-department onboarding tasks, rehire/alumni, Excel/PDF
hiring report export (unless /analytics/export or /reports/export supports it), vendor performance spend/hires metrics unless returned, compliance
(GDPR/EEO) data unless returned, Workflow canvas persistence beyond automation rules. Log each in `docs/API_GAPS.md`.

