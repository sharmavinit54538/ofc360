# Specification: Digital Signatures & E-Signs Module (OFC360 Frontend)

Status: FINALIZED
Date: 2026-10-28
Author: OFC360 Engineering

## 1. Executive Summary & Objective

Transform the placeholder card in the Documents Hub (`src/features/documents/pages/DocumentsComplianceHubPage.tsx`) into a full-featured, enterprise-grade **Signature Center**. The module enables creating multi-party signature requests, tracking statuses, reminding/canceling/resending, in-app and external signing with an HTML5 canvas signature pad, viewing immutable audit trails, and downloading executed documents and certificates of completion.

All hardcoded counters (`14`, `14 Awaiting`) in `DocumentsComplianceHubPage.tsx` are replaced with dynamic values derived from real RTK Query endpoints, backed by graceful empty/zero fallbacks on network error and an opt-in mock database enabled via `VITE_ENABLE_MOCK_FALLBACK=true`.

---

## 2. Core Constraints & Conventions

1. **Location**: All feature code resides under `src/features/documents/` adhering strictly to standard sub-directories: `api/`, `types/`, `schemas/`, `components/`, `pages/`, `utils/`, `__tests__/`.
2. **Architecture**:
   - RTK Query slice (`signaturesApi`) with `reducerPath: 'signaturesApi'`, registered in `src/app/store.ts` (both reducer and middleware).
   - Base query uses `baseQueryWithReauth` from `@/shared/api/baseQuery`.
   - Robust response normalizers supporting both camelCase and snake_case payloads, and both raw objects and `{ success: true, data: ... }` API envelopes.
   - Multipart `FormData` file uploads supported by fixing `prepareHeaders` in `src/shared/api/baseQuery.ts`.
3. **Zero New NPM Dependencies**:
   - Signature capture is implemented with native HTML5 `<canvas>` handling touch, pen, and mouse pointer events with device pixel ratio scaling, undo, and stroke threshold checks.
   - Script-font typed signatures render to `<canvas>` and export to transparent PNG data URLs.
   - Document preview uses an `<iframe>` / `<object>` loading a local Blob URL or data URL.
4. **Design System & UI**:
   - Shared primitives only: `@/shared/ui` (`Button`, `Badge`, `Card*`, `Tabs*`, `Select*`, `Input`, `Textarea`, `Label`, `Switch`, `Tooltip`, `Skeleton`, `EmptyState`, `ErrorDisplay`, `useToast`).
   - Tailwind styling with `rounded-2xl`, `dark:bg-[#1a1a1a]`, indigo accents, and full responsive support down to 360px mobile viewport.
   - Inline modal dialogs with `role="dialog"`, `aria-modal="true"`, focus management, and Escape key handling.
5. **RBAC & Permissions**:
   - `SUPER_ADMIN` / `HR_ADMIN`: full access (`scope=all`), can create, remind, resend, and cancel.
   - `MANAGER`: can view requests they created or are a signer on, can sign their own.
   - `EMPLOYEE` / `IT_ADMIN`: can only view their own requests (`scope=mine`) and sign when it is their turn; cannot create new requests.

---

## 3. Data Model (`src/features/documents/types/signatures.types.ts`)

### 3.1 Status Enums
- `SignatureRequestStatus`: `'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED'`
- `SignerStatus`: `'WAITING' | 'PENDING' | 'VIEWED' | 'SIGNED' | 'DECLINED'`
- `SignerKind`: `'EMPLOYEE' | 'EXTERNAL'`
- `SignerRole`: `'SIGNER' | 'APPROVER' | 'CC'`
- `SigningOrder`: `'SEQUENTIAL' | 'PARALLEL'`
- `DocumentType`: `'OFFER_LETTER' | 'APPOINTMENT_LETTER' | 'INCREMENT_LETTER' | 'RELIEVING_LETTER' | 'NDA' | 'POLICY_ACK' | 'CONTRACT' | 'OTHER'`
- `SignatureMethod`: `'DRAW' | 'TYPE' | 'UPLOAD'`
- `AuditEventType`: `'CREATED' | 'SENT' | 'VIEWED' | 'OTP_VERIFIED' | 'SIGNED' | 'DECLINED' | 'REMINDER_SENT' | 'EXPIRED' | 'CANCELLED' | 'COMPLETED' | 'DOWNLOADED'`

### 3.2 Entities
- **`Signer`**:
  - `id: string`
  - `name: string`
  - `email: string`
  - `employeeId?: string`
  - `kind: SignerKind`
  - `role: SignerRole`
  - `order: number` (1-based index)
  - `status: SignerStatus`
  - `viewedAt?: string`
  - `signedAt?: string`
  - `declinedAt?: string`
  - `declineReason?: string`
  - `signatureMethod?: SignatureMethod`
  - `ipAddress?: string`
  - `userAgent?: string`
  - `lastReminderAt?: string`

- **`SignatureRequest`**:
  - `id: string`
  - `referenceNo: string` (e.g. `SIG-2026-0042`)
  - `title: string`
  - `documentType: DocumentType`
  - `source: 'GENERATED' | 'UPLOADED'`
  - `sourceDocumentId?: string`
  - `fileName: string`
  - `fileSize?: number`
  - `pageCount?: number`
  - `sha256: string`
  - `message?: string`
  - `signingOrder: SigningOrder`
  - `status: SignatureRequestStatus`
  - `createdBy: { id: string; name: string; email: string }`
  - `createdAt: string`
  - `sentAt?: string`
  - `expiresAt: string`
  - `completedAt?: string`
  - `reminderDays: number[]`
  - `signers: Signer[]`
  - `progress: { signed: number; total: number }`

- **`SignatureAuditEvent`**:
  - `id: string`
  - `requestId: string`
  - `type: AuditEventType`
  - `actorName: string`
  - `actorEmail: string`
  - `ipAddress?: string`
  - `userAgent?: string`
  - `timestamp: string`
  - `metadata?: Record<string, unknown>`

- **`SignatureStats`**:
  - `awaitingMySignature: number`
  - `waitingOnOthers: number`
  - `completedLast30Days: number`
  - `expiringSoon: number` (expires in ≤ 3 days)
  - `declined: number`
  - `expired: number`
  - `avgTurnaroundHours: number`

---

## 4. Business Logic & Invariants (`src/features/documents/utils/signatureUtils.ts`)

1. **Sequential vs Parallel Signing**:
   - `SEQUENTIAL`: Only the lowest `order` signer whose status is not yet terminal (`SIGNED` or `DECLINED`) is given status `PENDING`. All subsequent signers remain in status `WAITING`.
   - `PARALLEL`: All signers are initially marked `PENDING` immediately when sent.
2. **Current User Signability**:
   - A signer slot can only be signed if:
     - The signer's status is `PENDING` (or `VIEWED`).
     - The logged-in user's email or employeeId matches the signer slot.
     - The overall request status is `PENDING` or `IN_PROGRESS`.
3. **Decline Cascades**:
   - If any `SIGNER` or `APPROVER` declines, the entire signature request immediately transitions to `DECLINED`. Any signers with status `WAITING` or `PENDING` are cancelled.
4. **Completion Rule (`requireAllSignatures`)**:
   - Assumption: When `requireAllSignatures === true`, the request enters `COMPLETED` when **every** signer with role `SIGNER` has signed.
   - When `requireAllSignatures === false`, the request completes when the **first** signer with role `SIGNER` signs.
   - Role `CC` signers do not block completion.
   - Role `APPROVER` must approve before signers proceed in sequential flows.
5. **Expiration Handling**:
   - If `new Date(request.expiresAt) < new Date()` and the request is not `COMPLETED`, `DECLINED`, or `CANCELLED`, it is displayed as `EXPIRED`. Actions are restricted to `Resend` (which extends expiry).
6. **Immutability & Cancellation**:
   - Requests that have been sent cannot be edited. A cancellation requires a mandatory reason (minimum 5 characters) and appends an immutable `CANCELLED` event to the audit timeline.
7. **Reminder Throttling**:
   - Manual reminders can be dispatched at most once per 24 hours per signer (`Date.now() - lastReminderAt >= 24 * 3600 * 1000`). The UI disables the button and displays a relative tooltip countdown.
8. **File Downloads**:
   - Download of the final signed PDF and Certificate of Completion is enabled **only** when `request.status === 'COMPLETED'`.
9. **Legal Disclosure**:
   - Every signing screen clearly displays: "I agree to sign this document electronically (Information Technology Act, 2000)." No false claims of Aadhaar eSign or DSC compliance are made.

---

## 5. API Contract & Endpoints (`src/features/documents/api/signaturesApi.ts`)

Base path: `/documents/signatures`

| Hook | Method & Path | Description |
|---|---|---|
| `useGetSignatureStatsQuery` | `GET /stats` | Summary KPI cards for the center |
| `useGetSignatureRequestsQuery(filters)` | `GET /?scope=&status=&type=&search=&from=&to=&page=&limit=` | Filterable paginated requests list |
| `useGetSignatureRequestQuery(id)` | `GET /{id}` | Single request details with signers and progress |
| `useGetSignatureAuditQuery(id)` | `GET /{id}/audit` | Immutable audit trail events |
| `useCreateSignatureRequestMutation` | `POST /` | Create draft or send request (JSON or FormData) |
| `useRemindSignersMutation` | `POST /{id}/remind` | Send manual reminder notifications |
| `useResendRequestMutation` | `POST /{id}/resend` | Resend request with optional expiration extension |
| `useCancelSignatureRequestMutation` | `POST /{id}/cancel` | Void/cancel request with mandatory reason |
| `useSignDocumentMutation` | `POST /{id}/sign` | Submit signature data URL, method, consent, OTP |
| `useDeclineSignatureMutation` | `POST /{id}/decline` | Decline signature with reason |
| `useLazyDownloadSignatureFileQuery` | `GET /{id}/download?type=` | Download signed PDF, original, or certificate |
| `useGetPublicSignatureRequestQuery(token)` | `GET /public/{token}` | Public external signer query |
| `useSendPublicOtpMutation(token)` | `POST /public/{token}/otp` | Send email OTP for external signer verification |
| `useSignPublicDocumentMutation(token)` | `POST /public/{token}/sign` | External signer submission |
| `useDeclinePublicSignatureMutation(token)` | `POST /public/{token}/decline` | External signer decline |

### Mock Fallback Layer (`src/features/documents/api/signaturesMock.ts`)
- Active **only** when `import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true'`.
- Seeds 12 realistic signature requests representing all 7 statuses, single and multi-party signers, sequential and parallel flows, and audit events.
- When `VITE_ENABLE_MOCK_FALLBACK` is false and the backend is offline, API hooks gracefully catch errors and return zero/empty structures (`items: []`, zeroed stats), never fabricated numbers.

---

## 6. UI Components & Screen Architecture

1. **`DocumentsComplianceHubPage.tsx` Integration**:
   - Add category `'esign'` to `CATEGORIES` bar.
   - Add hero action button **"E-Sign"** next to "EPFO PF & ECR".
   - Replace hardcoded `Pending Signs = '14'` and `Pending E-Signatures = '14 Awaiting'` with live `stats.awaitingMySignature` and `stats.waitingOnOthers`.
   - Clicking the `digital-signatures` card or the "E-Sign" button sets `selectedCategory = 'esign'` and renders `<SignatureCenter />`.
   - Read URL search params (`?view=esign&new=1&sourceDocumentId=...`) to auto-open `SignatureCenter` and launch the creation wizard when linked externally.
2. **`SignatureCenter.tsx`**:
   - Navigation header with "Back to Documents & Policies Vault" bar.
   - Tabs: **Overview** · **Requests** · **To Sign** · **Templates & Settings**.
   - Disabled banner when `digitalSignature.enabled === false` linking to `/settings/documents`.
3. **`NewSignatureRequestWizard.tsx`**:
   - 4-step wizard modal (`react-hook-form` + zod schema):
     - Step 1 (Document): Select recent generated document from `documentGeneratorApi` or upload PDF/DOCX (≤10MB).
     - Step 2 (Signers): Employee lookup from `workforceApi` or external contact entry, role assignments (Signer, Approver, CC), reordering, Sequential/Parallel toggle.
     - Step 3 (Details): Title, message, expiration days, reminder frequency.
     - Step 4 (Review & Send): Summary, draft save, send dispatch.
4. **`SignatureRequestDetailSheet.tsx`**:
   - Slide-over sheet showing status, reference, expiry countdown, signer stepper, embedded document viewer, `SignatureAuditTimeline`, and contextual action buttons (Remind, Resend, Cancel, Download).
5. **`SignDocumentModal.tsx` & `SignaturePad.tsx`**:
   - 3-mode signature adoption: Draw (canvas with clear/undo/stroke verification), Type (4 font styles), Upload (image).
   - Mandatory legal consent checkbox.
   - Optional 6-digit OTP verification for external signers.
6. **Public Route `/sign/:token` (`ExternalSignPage.tsx`)**:
   - Standalone branded page for non-employees with token validation, OTP verification, document review, and signing/decline flow.
7. **Document Generator Integration (`GeneratedDocumentCard.tsx`)**:
   - "Send for E-Sign" button linking directly to `/dashboard/documents?view=esign&new=1&sourceDocumentId={documentId}`.

---

## 7. Verification & Acceptance Criteria

1. **Typecheck & Build**:
   - `npm run typecheck` produces 0 new errors in the documents/signature module.
   - `npm run build` succeeds cleanly.
2. **Unit & Integration Tests**:
   - `signaturesApi` transforms both camelCase and snake_case, handles error falls.
   - `baseQuery` FormData header fix prevents overwriting multipart headers.
   - `signatureUtils` validates business rules (turn calculation, decline cascading, reminder throttling, turnaround time).
   - `SignaturePad` enforces minimum stroke length and canvas rendering.
   - `SignatureCenter` displays live stats, filter bar, tab switching, and consent gating.
   - `DocumentsComplianceHubPage` has 0 instances of `'14 Awaiting'` or `value: '14'`.
