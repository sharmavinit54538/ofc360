/**
 * @file signatures.types.ts
 * @description Enterprise TypeScript definitions for Digital Signatures & E-Signs module.
 */

export type SignatureRequestStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELLED';

export type SignerStatus =
  | 'WAITING'
  | 'PENDING'
  | 'VIEWED'
  | 'SIGNED'
  | 'DECLINED';

export type SignerKind = 'EMPLOYEE' | 'EXTERNAL';

export type SignerRole = 'SIGNER' | 'APPROVER' | 'CC';

export type SigningOrder = 'SEQUENTIAL' | 'PARALLEL';

export type DocumentType =
  | 'OFFER_LETTER'
  | 'APPOINTMENT_LETTER'
  | 'INCREMENT_LETTER'
  | 'RELIEVING_LETTER'
  | 'NDA'
  | 'POLICY_ACK'
  | 'CONTRACT'
  | 'OTHER';

export type SignatureMethod = 'DRAW' | 'TYPE' | 'UPLOAD';

export type AuditEventType =
  | 'CREATED'
  | 'SENT'
  | 'VIEWED'
  | 'OTP_VERIFIED'
  | 'SIGNED'
  | 'DECLINED'
  | 'REMINDER_SENT'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'DOWNLOADED';

export interface Signer {
  id: string;
  name: string;
  email: string;
  employeeId?: string;
  kind: SignerKind;
  role: SignerRole;
  order: number;
  status: SignerStatus;
  viewedAt?: string | null;
  signedAt?: string | null;
  declinedAt?: string | null;
  declineReason?: string | null;
  signatureMethod?: SignatureMethod | null;
  signatureImage?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  lastReminderAt?: string | null;
}

export interface SignatureProgress {
  signed: number;
  total: number;
}

export interface SignatureRequestUser {
  id: string;
  name: string;
  email: string;
}

export interface SignatureRequest {
  id: string;
  referenceNo: string;
  title: string;
  documentType: DocumentType;
  source: 'GENERATED' | 'UPLOADED';
  sourceDocumentId?: string;
  fileName: string;
  fileSize?: number;
  fileUrl?: string;
  pageCount?: number;
  sha256: string;
  message?: string;
  signingOrder: SigningOrder;
  status: SignatureRequestStatus;
  createdBy: SignatureRequestUser;
  createdAt: string;
  sentAt?: string | null;
  expiresAt: string;
  completedAt?: string | null;
  reminderDays: number[];
  signers: Signer[];
  progress: SignatureProgress;
  certificateUrl?: string;
  signedDocumentUrl?: string;
}

export interface SignatureAuditEvent {
  id: string;
  requestId: string;
  type: AuditEventType;
  actorName: string;
  actorEmail: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface SignatureStats {
  awaitingMySignature: number;
  waitingOnOthers: number;
  completedLast30Days: number;
  expiringSoon: number;
  declined: number;
  expired: number;
  avgTurnaroundHours: number;
}

export interface SignatureFilterParams {
  scope?: 'all' | 'mine';
  status?: SignatureRequestStatus | 'ALL' | string;
  type?: DocumentType | 'ALL' | string;
  search?: string;
  from?: string;
  to?: string;
  createdByMe?: boolean;
  page?: number;
  limit?: number;
}

export interface SignatureRequestsResponse {
  items: SignatureRequest[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateSignerInput {
  name: string;
  email: string;
  employeeId?: string;
  kind: SignerKind;
  role: SignerRole;
  order: number;
}

export interface CreateSignatureRequestPayload {
  title: string;
  documentType: DocumentType;
  source: 'GENERATED' | 'UPLOADED';
  sourceDocumentId?: string;
  fileName?: string;
  fileSize?: number;
  file?: File;
  signingOrder: SigningOrder;
  message?: string;
  expiresAt: string;
  reminderDays: number[];
  signers: CreateSignerInput[];
  sendNow: boolean;
}

export interface SignDocumentPayload {
  signerId: string;
  method: SignatureMethod;
  signatureImage: string;
  consent: true;
  otp?: string;
}

export interface DeclineSignaturePayload {
  signerId: string;
  reason: string;
}

export interface CancelRequestPayload {
  reason: string;
}

export interface RemindSignersPayload {
  signerIds?: string[];
}

export interface ResendRequestPayload {
  extendDays?: number;
}

export interface PublicSignatureTokenData {
  token: string;
  request: SignatureRequest;
  signer: Signer;
  requiresOtp: boolean;
  otpSent?: boolean;
  isOtpVerified?: boolean;
}

