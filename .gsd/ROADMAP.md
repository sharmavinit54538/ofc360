# ROADMAP: Digital Signatures & E-Signs Module

## Waves

- [ ] **Wave 1: Foundation (Data Layer, API, Utils & Tests)**
  - [x] Finalize `SPEC.md` and `ROADMAP.md`
  - [ ] Fix `prepareHeaders` in `src/shared/api/baseQuery.ts` for `FormData` and add unit test
  - [ ] Implement `types/signatures.types.ts` and `schemas/signatures.schemas.ts`
  - [ ] Implement `utils/signatureUtils.ts` (business rules, sequential order, expiration, decline, reminder throttling) with comprehensive Vitest tests
  - [ ] Implement `api/signaturesMock.ts` with seeded realistic fixtures (12 requests, 7 statuses, audit events)
  - [ ] Implement `api/signaturesApi.ts` with robust normalizers (envelope/raw, camel/snake) and register in `src/app/store.ts`
  - [ ] Add unit tests for `signaturesApi.ts` normalizers and error fallbacks

- [ ] **Wave 2: Tracking & Hub Integration (Dashboard, Requests, Timeline)**
  - [ ] Integrate into `DocumentsComplianceHubPage.tsx`: remove hardcoded '14' counters, add 'esign' category, hero button, and deep-link routing
  - [ ] Implement `SignatureStatsCards.tsx` (KPI metrics)
  - [ ] Implement `SignatureRequestsTable.tsx` with filter bar (search, status, type, date range, scope), countdowns, and action menus
  - [ ] Implement `SignatureAuditTimeline.tsx` and `SignatureRequestDetailSheet.tsx`
  - [ ] Implement `SignatureCenter.tsx` shell hosting Overview, Requests, To Sign, Templates & Settings tabs
  - [ ] Add integration tests for `SignatureCenter.tsx` and `DocumentsComplianceHubPage.tsx`

- [ ] **Wave 3: Creation, Signing & Document Generator Hook-in**
  - [ ] Implement `SignaturePad.tsx` (Draw canvas with undo & stroke detection, Type with fonts, Upload) with unit tests
  - [ ] Implement `NewSignatureRequestWizard.tsx` (4 steps: Document, Signers, Details, Review) with validation tests
  - [ ] Implement `SignDocumentModal.tsx` (consent gating, optional OTP, confirmation screen)
  - [ ] Implement action dialogs: `DeclineSignatureModal.tsx`, `CancelRequestModal.tsx`, `RemindSignersModal.tsx`, `ResendRequestModal.tsx`
  - [ ] Add "Send for E-Sign" action in `GeneratedDocumentCard.tsx` with auto-send hint

- [ ] **Wave 4: External Signer Experience, Polish & Final Verification**
  - [ ] Implement `/sign/:token` public route (`ExternalSignPage.tsx`) in `src/app/router/AppRoutes.tsx`
  - [ ] Add `DigitalSignatureConfig` disabled banner & Settings link in Templates & Settings tab
  - [ ] Mobile responsive (360px) and dark mode styling audit
  - [ ] Final verification: full test suite, build check, and zero hardcoded '14' counters
