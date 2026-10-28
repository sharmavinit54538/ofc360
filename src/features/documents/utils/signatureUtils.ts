/**
 * @file signatureUtils.ts
 * @description Pure utility and business rule functions for Digital Signatures & E-Signs module.
 */

import {
  SignatureRequest,
  Signer,
  SignatureRequestStatus,
  DocumentType,
  SignerRole,
} from '../types/signatures.types';

/**
 * Checks whether the request is configured for sequential signing order.
 */
export const isSequentialOrder = (order: string): boolean => {
  return order.toUpperCase() === 'SEQUENTIAL';
};

/**
 * Returns true if the given request is expired (expiresAt < now)
 * and is not already in a terminal state (COMPLETED, DECLINED, or CANCELLED).
 */
export const isRequestExpired = (request: Pick<SignatureRequest, 'expiresAt' | 'status'>, now = new Date()): boolean => {
  if (['COMPLETED', 'DECLINED', 'CANCELLED'].includes(request.status)) {
    return false;
  }
  const expiryTime = new Date(request.expiresAt).getTime();
  return !isNaN(expiryTime) && expiryTime < now.getTime();
};

/**
 * Returns the effective status of the request, factoring in client-side expiration.
 */
export const resolveEffectiveStatus = (
  request: Pick<SignatureRequest, 'expiresAt' | 'status'>,
  now = new Date()
): SignatureRequestStatus => {
  if (isRequestExpired(request, now)) {
    return 'EXPIRED';
  }
  return request.status;
};

/**
 * Checks if a request expires within 3 days and is not yet expired.
 */
export const isExpiringSoon = (expiresAt: string, now = new Date()): boolean => {
  const expiry = new Date(expiresAt).getTime();
  if (isNaN(expiry)) return false;
  const diffMs = expiry - now.getTime();
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
  return diffMs > 0 && diffMs <= threeDaysMs;
};

/**
 * Generates a human-readable relative expiry countdown string.
 * e.g., "3 days left", "8 hours left", "Expired 2h ago"
 */
export const formatExpiryCountdown = (expiresAt: string, now = new Date()): string => {
  const expiry = new Date(expiresAt).getTime();
  if (isNaN(expiry)) return 'No expiry';
  const diffMs = expiry - now.getTime();

  if (diffMs <= 0) {
    const elapsedMs = Math.abs(diffMs);
    const hoursAgo = Math.floor(elapsedMs / (1000 * 60 * 60));
    if (hoursAgo < 1) return 'Expired just now';
    if (hoursAgo < 24) return `Expired ${hoursAgo}h ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    return `Expired ${daysAgo}d ago`;
  }

  const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
  if (hoursLeft < 1) {
    const minsLeft = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${minsLeft}m left`;
  }
  if (hoursLeft < 24) {
    return `${hoursLeft}h left`;
  }
  const daysLeft = Math.floor(hoursLeft / 24);
  const remainingHours = hoursLeft % 24;
  return remainingHours > 0 ? `${daysLeft}d ${remainingHours}h left` : `${daysLeft}d left`;
};

/**
 * In sequential signing, determines whose turn it is.
 * Returns the signer with the lowest order among unsigned/undeclined signers.
 */
export const getActiveSequentialSigner = (signers: Signer[]): Signer | null => {
  if (!signers || signers.length === 0) return null;
  const sorted = [...signers].sort((a, b) => a.order - b.order);
  for (const signer of sorted) {
    if (signer.status === 'SIGNED') continue;
    if (signer.status === 'DECLINED') return null; // blocked
    return signer;
  }
  return null;
};

/**
 * Determines whether it is currently this signer's turn to act.
 */
export const isSignerTurn = (request: SignatureRequest, signerId: string): boolean => {
  const effectiveStatus = resolveEffectiveStatus(request);
  if (effectiveStatus !== 'PENDING' && effectiveStatus !== 'IN_PROGRESS') {
    return false;
  }

  const signer = request.signers.find((s) => s.id === signerId);
  if (!signer || signer.status === 'SIGNED' || signer.status === 'DECLINED') {
    return false;
  }

  if (!isSequentialOrder(request.signingOrder)) {
    // In parallel mode, any signer with status PENDING or VIEWED can sign
    return signer.status === 'PENDING' || signer.status === 'VIEWED';
  }

  // In sequential mode, must be the lowest active order
  const activeSigner = getActiveSequentialSigner(request.signers);
  return activeSigner?.id === signerId;
};

/**
 * Determines if a given user has permission to sign on a specific signer slot.
 */
export const canUserSign = (
  request: SignatureRequest,
  signer: Signer,
  user: { id?: string; email?: string; employeeId?: string } | null
): boolean => {
  if (!user) return false;
  if (!isSignerTurn(request, signer.id)) return false;

  const userEmail = (user.email || '').toLowerCase().trim();
  const signerEmail = (signer.email || '').toLowerCase().trim();
  const emailMatches = Boolean(userEmail && signerEmail && userEmail === signerEmail);

  const empIdMatches = Boolean(
    user.employeeId && signer.employeeId && user.employeeId.toLowerCase() === signer.employeeId.toLowerCase()
  );

  const userIdMatches = Boolean(user.id && signer.employeeId && user.id === signer.employeeId);

  return emailMatches || empIdMatches || userIdMatches;
};

/**
 * Finds the specific signer entry in the request that matches the logged-in user.
 */
export const findSignerForUser = (
  request: SignatureRequest,
  user: { id?: string; email?: string; employeeId?: string } | null
): Signer | undefined => {
  if (!user) return undefined;
  const userEmail = (user.email || '').toLowerCase().trim();
  return request.signers.find((s) => {
    const sEmail = (s.email || '').toLowerCase().trim();
    if (userEmail && sEmail && userEmail === sEmail) return true;
    if (user.employeeId && s.employeeId && user.employeeId.toLowerCase() === s.employeeId.toLowerCase()) return true;
    if (user.id && s.employeeId && user.id === s.employeeId) return true;
    return false;
  });
};

/**
 * Checks whether a manual reminder can be sent for a signer (24-hour throttling rule).
 */
export const canRemindSigner = (
  signer: Signer,
  now = new Date()
): { canRemind: boolean; remainingHours?: number; remainingMinutes?: number; reason?: string } => {
  if (signer.status === 'SIGNED') {
    return { canRemind: false, reason: 'Signer has already signed' };
  }
  if (signer.status === 'DECLINED') {
    return { canRemind: false, reason: 'Signer has declined' };
  }
  if (signer.status === 'WAITING') {
    return { canRemind: false, reason: 'Waiting for preceding signers in sequence' };
  }

  if (!signer.lastReminderAt) {
    return { canRemind: true };
  }

  const lastReminder = new Date(signer.lastReminderAt).getTime();
  if (isNaN(lastReminder)) {
    return { canRemind: true };
  }

  const twentyFourHoursMs = 24 * 60 * 60 * 1000;
  const elapsed = now.getTime() - lastReminder;

  if (elapsed >= twentyFourHoursMs) {
    return { canRemind: true };
  }

  const remainingMs = twentyFourHoursMs - elapsed;
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    canRemind: false,
    remainingHours,
    remainingMinutes,
    reason: `Reminder sent recently. Please wait ${remainingHours}h ${remainingMinutes}m before reminding again.`,
  };
};

/**
 * Calculates updated request state after a signature action.
 */
export const computeStateAfterSign = (
  request: SignatureRequest,
  signerId: string,
  requireAllSignatures = true
): {
  requestStatus: SignatureRequestStatus;
  updatedSigners: Signer[];
  progress: { signed: number; total: number };
} => {
  const updatedSigners = request.signers.map((s) => {
    if (s.id === signerId) {
      return {
        ...s,
        status: 'SIGNED' as const,
        signedAt: new Date().toISOString(),
      };
    }
    return s;
  });

  const signerRoles: SignerRole[] = ['SIGNER'];
  const allActionSigners = updatedSigners.filter((s) => signerRoles.includes(s.role));
  const signedCount = allActionSigners.filter((s) => s.status === 'SIGNED').length;
  const totalActionSigners = allActionSigners.length;

  let requestStatus: SignatureRequestStatus = 'IN_PROGRESS';

  if (requireAllSignatures) {
    if (signedCount >= totalActionSigners && totalActionSigners > 0) {
      requestStatus = 'COMPLETED';
    } else {
      // In sequential flow, advance the next WAITING signer to PENDING
      if (isSequentialOrder(request.signingOrder)) {
        const nextActive = getActiveSequentialSigner(updatedSigners);
        if (nextActive && nextActive.status === 'WAITING') {
          nextActive.status = 'PENDING';
        }
      }
    }
  } else {
    // If not requiring all signatures, completion occurs upon first signature
    if (signedCount >= 1) {
      requestStatus = 'COMPLETED';
    }
  }

  return {
    requestStatus,
    updatedSigners,
    progress: {
      signed: updatedSigners.filter((s) => s.status === 'SIGNED').length,
      total: updatedSigners.length,
    },
  };
};

/**
 * Calculates updated request state after a decline action.
 */
export const computeStateAfterDecline = (
  request: SignatureRequest,
  signerId: string,
  declineReason: string
): {
  requestStatus: SignatureRequestStatus;
  updatedSigners: Signer[];
} => {
  const updatedSigners = request.signers.map((s) => {
    if (s.id === signerId) {
      return {
        ...s,
        status: 'DECLINED' as const,
        declinedAt: new Date().toISOString(),
        declineReason,
      };
    }
    return s;
  });

  return {
    requestStatus: 'DECLINED',
    updatedSigners,
  };
};

/**
 * Computes average turnaround time in hours for completed requests.
 */
export const calculateAvgTurnaroundHours = (requests: SignatureRequest[]): number => {
  const completed = requests.filter((r) => r.status === 'COMPLETED' && r.completedAt && (r.sentAt || r.createdAt));
  if (completed.length === 0) return 0;

  const totalHours = completed.reduce((sum, r) => {
    const start = new Date(r.sentAt || r.createdAt).getTime();
    const end = new Date(r.completedAt!).getTime();
    const hours = Math.max(0, (end - start) / (1000 * 60 * 60));
    return sum + hours;
  }, 0);

  return Math.round((totalHours / completed.length) * 10) / 10;
};

/**
 * Formats a document type into a friendly label.
 */
export const formatDocumentTypeLabel = (type: DocumentType | string): string => {
  switch (type) {
    case 'OFFER_LETTER':
      return 'Offer Letter';
    case 'APPOINTMENT_LETTER':
      return 'Appointment Letter';
    case 'INCREMENT_LETTER':
      return 'Increment Letter';
    case 'RELIEVING_LETTER':
      return 'Relieving Letter';
    case 'NDA':
      return 'Non-Disclosure Agreement (NDA)';
    case 'POLICY_ACK':
      return 'Policy Acknowledgement';
    case 'CONTRACT':
      return 'Commercial Contract';
    case 'OTHER':
    default:
      return 'General Document';
  }
};

/**
 * Returns human-readable label and badge variant for request status.
 */
export const getStatusBadgeConfig = (
  status: SignatureRequestStatus
): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'slate' } => {
  switch (status) {
    case 'COMPLETED':
      return { label: 'Completed', variant: 'success' };
    case 'IN_PROGRESS':
      return { label: 'In Progress', variant: 'info' };
    case 'PENDING':
      return { label: 'Pending', variant: 'warning' };
    case 'DECLINED':
      return { label: 'Declined', variant: 'danger' };
    case 'EXPIRED':
      return { label: 'Expired', variant: 'slate' };
    case 'CANCELLED':
      return { label: 'Cancelled', variant: 'slate' };
    case 'DRAFT':
    default:
      return { label: 'Draft', variant: 'slate' };
  }
};

/**
 * Returns label and badge styling for individual signer status.
 */
export const getSignerStatusBadgeConfig = (
  status: Signer['status']
): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'slate' } => {
  switch (status) {
    case 'SIGNED':
      return { label: 'Signed', variant: 'success' };
    case 'VIEWED':
      return { label: 'Viewed', variant: 'info' };
    case 'PENDING':
      return { label: 'Pending', variant: 'warning' };
    case 'WAITING':
      return { label: 'Waiting', variant: 'slate' };
    case 'DECLINED':
      return { label: 'Declined', variant: 'danger' };
    default:
      return { label: status, variant: 'slate' };
  }
};
