/**
 * @file signaturesMock.ts
 * @description Seeded mock data and in-memory mock handler for Digital Signatures & E-Signs.
 * Activated strictly when import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true'.
 */

import type {
  SignatureRequest,
  SignatureAuditEvent,
  SignatureStats,
  SignatureRequestsResponse,
  Signer,
  CreateSignatureRequestPayload,
  SignDocumentPayload,
  DeclineSignaturePayload,
} from '../types/signatures.types';
import {
  computeStateAfterSign,
  computeStateAfterDecline,
  calculateAvgTurnaroundHours,
} from '../utils/signatureUtils';

export const INITIAL_MOCK_REQUESTS: SignatureRequest[] = [
  // 1. PENDING - Offer Letter (Single Signer, Employee)
  {
    id: 'sig-req-001',
    referenceNo: 'SIG-2026-0001',
    title: 'Senior Frontend Engineer Offer Letter - Priya Sharma',
    documentType: 'OFFER_LETTER',
    source: 'GENERATED',
    sourceDocumentId: 'doc-gen-101',
    fileName: 'Offer_Letter_Priya_Sharma.pdf',
    fileSize: 245000,
    pageCount: 3,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    message: 'Please review the offer details and compensation package. Sign to confirm acceptance.',
    signingOrder: 'PARALLEL',
    status: 'PENDING',
    createdBy: { id: 'usr-admin-1', name: 'Alok Verma', email: 'alok.hr@ofc360.com' },
    createdAt: '2026-10-25T09:30:00Z',
    sentAt: '2026-10-25T09:35:00Z',
    expiresAt: '2026-11-05T23:59:59Z',
    reminderDays: [3, 7],
    signers: [
      {
        id: 'sgn-101',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        kind: 'EXTERNAL',
        role: 'SIGNER',
        order: 1,
        status: 'PENDING',
        lastReminderAt: null,
      },
    ],
    progress: { signed: 0, total: 1 },
  },

  // 2. IN_PROGRESS - Non-Disclosure Agreement (Multi-Signer, Parallel)
  {
    id: 'sig-req-002',
    referenceNo: 'SIG-2026-0002',
    title: 'Mutual Non-Disclosure Agreement - CyberTech Solutions',
    documentType: 'NDA',
    source: 'UPLOADED',
    fileName: 'Mutual_NDA_CyberTech.pdf',
    fileSize: 412000,
    pageCount: 5,
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    message: 'Confidentiality agreement ahead of enterprise vendor partnership integration.',
    signingOrder: 'PARALLEL',
    status: 'IN_PROGRESS',
    createdBy: { id: 'usr-admin-1', name: 'Alok Verma', email: 'alok.hr@ofc360.com' },
    createdAt: '2026-10-22T14:00:00Z',
    sentAt: '2026-10-22T14:10:00Z',
    expiresAt: '2026-11-02T23:59:59Z',
    reminderDays: [3, 5],
    signers: [
      {
        id: 'sgn-201',
        name: 'Vikram Mehta (OFC360 Director)',
        email: 'vikram.mehta@ofc360.com',
        employeeId: 'EMP-001',
        kind: 'EMPLOYEE',
        role: 'SIGNER',
        order: 1,
        status: 'SIGNED',
        signedAt: '2026-10-23T11:20:00Z',
        signatureMethod: 'DRAW',
      },
      {
        id: 'sgn-202',
        name: 'Rahul Sen (CyberTech CEO)',
        email: 'rahul.sen@cybertech.io',
        kind: 'EXTERNAL',
        role: 'SIGNER',
        order: 2,
        status: 'PENDING',
        viewedAt: '2026-10-24T16:00:00Z',
        lastReminderAt: '2026-10-26T10:00:00Z',
      },
    ],
    progress: { signed: 1, total: 2 },
  },

  // 3. PENDING - Sequential Multi-Signer Appointment Letter
  {
    id: 'sig-req-003',
    referenceNo: 'SIG-2026-0003',
    title: 'Appointment Letter - Rohan Das (Sequential Approval)',
    documentType: 'APPOINTMENT_LETTER',
    source: 'GENERATED',
    sourceDocumentId: 'doc-gen-103',
    fileName: 'Appointment_Letter_Rohan_Das.pdf',
    fileSize: 310000,
    pageCount: 4,
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    message: 'Stage 1: HR Approval, Stage 2: Department Head, Stage 3: Candidate Acceptance.',
    signingOrder: 'SEQUENTIAL',
    status: 'IN_PROGRESS',
    createdBy: { id: 'usr-admin-1', name: 'Alok Verma', email: 'alok.hr@ofc360.com' },
    createdAt: '2026-10-26T11:00:00Z',
    sentAt: '2026-10-26T11:05:00Z',
    expiresAt: '2026-11-09T23:59:59Z',
    reminderDays: [3, 7],
    signers: [
      {
        id: 'sgn-301',
        name: 'Alok Verma (HR Admin)',
        email: 'alok.hr@ofc360.com',
        employeeId: 'EMP-014',
        kind: 'EMPLOYEE',
        role: 'APPROVER',
        order: 1,
        status: 'SIGNED',
        signedAt: '2026-10-26T11:30:00Z',
        signatureMethod: 'TYPE',
      },
      {
        id: 'sgn-302',
        name: 'Kavita Nair (Engineering VP)',
        email: 'kavita.nair@ofc360.com',
        employeeId: 'EMP-007',
        kind: 'EMPLOYEE',
        role: 'SIGNER',
        order: 2,
        status: 'PENDING',
        lastReminderAt: null,
      },
      {
        id: 'sgn-303',
        name: 'Rohan Das (Candidate)',
        email: 'rohan.das@example.com',
        kind: 'EXTERNAL',
        role: 'SIGNER',
        order: 3,
        status: 'WAITING',
      },
    ],
    progress: { signed: 1, total: 3 },
  },

  // 4. COMPLETED - Annual Increment Letter (With Signed PDF + Certificate)
  {
    id: 'sig-req-004',
    referenceNo: 'SIG-2026-0004',
    title: 'FY27 Compensation Revision - Ananya Sen',
    documentType: 'INCREMENT_LETTER',
    source: 'GENERATED',
    sourceDocumentId: 'doc-gen-104',
    fileName: 'Increment_Letter_Ananya_Sen.pdf',
    fileSize: 198000,
    pageCount: 2,
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    message: 'Official compensation increment notification with updated CTC structure.',
    signingOrder: 'PARALLEL',
    status: 'COMPLETED',
    createdBy: { id: 'usr-admin-1', name: 'Alok Verma', email: 'alok.hr@ofc360.com' },
    createdAt: '2026-10-18T10:00:00Z',
    sentAt: '2026-10-18T10:15:00Z',
    expiresAt: '2026-10-31T23:59:59Z',
    completedAt: '2026-10-19T14:45:00Z',
    reminderDays: [3],
    signers: [
      {
        id: 'sgn-401',
        name: 'Ananya Sen',
        email: 'ananya.sen@ofc360.com',
        employeeId: 'EMP-045',
        kind: 'EMPLOYEE',
        role: 'SIGNER',
        order: 1,
        status: 'SIGNED',
        signedAt: '2026-10-19T14:45:00Z',
        signatureMethod: 'DRAW',
      },
    ],
    progress: { signed: 1, total: 1 },
    certificateUrl: '/documents/signatures/sig-req-004/download?type=certificate',
    signedDocumentUrl: '/documents/signatures/sig-req-004/download?type=signed',
  },

  // 5. COMPLETED - Code of Conduct Policy Acknowledgement
  {
    id: 'sig-req-005',
    referenceNo: 'SIG-2026-0005',
    title: 'Enterprise Code of Conduct & Information Security Sign-Off',
    documentType: 'POLICY_ACK',
    source: 'UPLOADED',
    fileName: 'IT_Security_Policy_Signoff_2026.pdf',
    fileSize: 520000,
    pageCount: 8,
    sha256: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    message: 'Mandatory annual IT compliance and data protection protocol sign-off.',
    signingOrder: 'PARALLEL',
    status: 'COMPLETED',
    createdBy: { id: 'usr-admin-2', name: 'Deepa Roy', email: 'deepa.compliance@ofc360.com' },
    createdAt: '2026-10-10T09:00:00Z',
    sentAt: '2026-10-10T09:10:00Z',
    expiresAt: '2026-10-24T23:59:59Z',
    completedAt: '2026-10-12T16:30:00Z',
    reminderDays: [2, 5],
    signers: [
      {
        id: 'sgn-501',
        name: 'Sameer Patel',
        email: 'sameer.patel@ofc360.com',
        employeeId: 'EMP-088',
        kind: 'EMPLOYEE',
        role: 'SIGNER',
        order: 1,
        status: 'SIGNED',
        signedAt: '2026-10-12T16:30:00Z',
        signatureMethod: 'TYPE',
      },
    ],
    progress: { signed: 1, total: 1 },
    certificateUrl: '/documents/signatures/sig-req-005/download?type=certificate',
    signedDocumentUrl: '/documents/signatures/sig-req-005/download?type=signed',
  },

  // 6. DECLINED - Relieving Letter (Candidate contested notice period date)
  {
    id: 'sig-req-006',
    referenceNo: 'SIG-2026-0006',
    title: 'Relieving & Experience Certificate - Gaurav Joshi',
    documentType: 'RELIEVING_LETTER',
    source: 'GENERATED',
    sourceDocumentId: 'doc-gen-106',
    fileName: 'Relieving_Letter_Gaurav_Joshi.pdf',
    fileSize: 185000,
    pageCount: 2,
    sha256: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    message: 'Official relieving certificate and full & final settlement acknowledgment.',
    signingOrder: 'PARALLEL',
    status: 'DECLINED',
    createdBy: { id: 'usr-admin-1', name: 'Alok Verma', email: 'alok.hr@ofc360.com' },
    createdAt: '2026-10-21T11:00:00Z',
    sentAt: '2026-10-21T11:15:00Z',
    expiresAt: '2026-11-04T23:59:59Z',
    reminderDays: [3],
    signers: [
      {
        id: 'sgn-601',
        name: 'Gaurav Joshi',
        email: 'gaurav.joshi@example.com',
        kind: 'EXTERNAL',
        role: 'SIGNER',
        order: 1,
        status: 'DECLINED',
        declinedAt: '2026-10-23T14:15:00Z',
        declineReason: 'Relieving date on certificate is listed as Oct 15 instead of Oct 20. Please reissue.',
      },
    ],
    progress: { signed: 0, total: 1 },
  },

  // 7. EXPIRED - Vendor Master Service Agreement
  {
    id: 'sig-req-007',
    referenceNo: 'SIG-2026-0007',
    title: 'Cloud Infrastructure Service Agreement - Horizon Data Corp',
    documentType: 'CONTRACT',
    source: 'UPLOADED',
    fileName: 'MSA_Horizon_Data_2026.pdf',
    fileSize: 890000,
    pageCount: 14,
    sha256: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    message: 'Master Service Agreement for dedicated hosting racks.',
    signingOrder: 'PARALLEL',
    status: 'EXPIRED',
    createdBy: { id: 'usr-admin-2', name: 'Deepa Roy', email: 'deepa.compliance@ofc360.com' },
    createdAt: '2026-09-20T10:00:00Z',
    sentAt: '2026-09-20T10:30:00Z',
    expiresAt: '2026-10-04T23:59:59Z',
    reminderDays: [3, 7],
    signers: [
      {
        id: 'sgn-701',
        name: 'Suresh Menon (VP Infrastructure)',
        email: 'suresh.menon@ofc360.com',
        employeeId: 'EMP-012',
        kind: 'EMPLOYEE',
        role: 'SIGNER',
        order: 1,
        status: 'PENDING',
        lastReminderAt: '2026-10-02T09:00:00Z',
      },
    ],
    progress: { signed: 0, total: 1 },
  },

  // 8. CANCELLED - Internal Policy Revision
  {
    id: 'sig-req-008',
    referenceNo: 'SIG-2026-0008',
    title: 'Workplace Attendance Policy v4.2 - Deprecated Draft',
    documentType: 'POLICY_ACK',
    source: 'UPLOADED',
    fileName: 'Attendance_Policy_v4.2.pdf',
    fileSize: 210000,
    pageCount: 4,
    sha256: 'fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9',
    message: 'Voided due to revised regulatory overtime guidelines from Ministry of Labour.',
    signingOrder: 'PARALLEL',
    status: 'CANCELLED',
    createdBy: { id: 'usr-admin-1', name: 'Alok Verma', email: 'alok.hr@ofc360.com' },
    createdAt: '2026-10-14T08:00:00Z',
    sentAt: '2026-10-14T08:15:00Z',
    expiresAt: '2026-10-28T23:59:59Z',
    reminderDays: [3],
    signers: [
      {
        id: 'sgn-801',
        name: 'Rajeev Kapoor (Operations Head)',
        email: 'rajeev.kapoor@ofc360.com',
        employeeId: 'EMP-003',
        kind: 'EMPLOYEE',
        role: 'SIGNER',
        order: 1,
        status: 'WAITING',
      },
    ],
    progress: { signed: 0, total: 1 },
  },

  // 9. DRAFT - Consulting Agreement
  {
    id: 'sig-req-009',
    referenceNo: 'SIG-2026-0009',
    title: 'Strategic Advisor Agreement - Dr. Aris Thorne',
    documentType: 'CONTRACT',
    source: 'UPLOADED',
    fileName: 'Advisor_Agreement_Draft.docx',
    fileSize: 145000,
    pageCount: 3,
    sha256: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
    message: 'Draft advisory agreement pending legal clause 7 revision.',
    signingOrder: 'PARALLEL',
    status: 'DRAFT',
    createdBy: { id: 'usr-admin-1', name: 'Alok Verma', email: 'alok.hr@ofc360.com' },
    createdAt: '2026-10-27T16:00:00Z',
    expiresAt: '2026-11-15T23:59:59Z',
    reminderDays: [5],
    signers: [
      {
        id: 'sgn-901',
        name: 'Dr. Aris Thorne',
        email: 'aris.thorne@globaladvisory.com',
        kind: 'EXTERNAL',
        role: 'SIGNER',
        order: 1,
        status: 'WAITING',
      },
    ],
    progress: { signed: 0, total: 1 },
  },

  // 10. PENDING - Expiring Soon (≤3 days left)
  {
    id: 'sig-req-010',
    referenceNo: 'SIG-2026-0010',
    title: 'Intellectual Property Assignment - Neha Kulkarni',
    documentType: 'OTHER',
    source: 'GENERATED',
    sourceDocumentId: 'doc-gen-110',
    fileName: 'IP_Assignment_Neha_Kulkarni.pdf',
    fileSize: 260000,
    pageCount: 4,
    sha256: 'b4b147bc522828731f1a016bfa72c07309ea09424e868987b2b649d2cb092a47',
    message: 'Urgent: Please execute this assignment prior to the quarterly filing cutoff.',
    signingOrder: 'PARALLEL',
    status: 'PENDING',
    createdBy: { id: 'usr-admin-2', name: 'Deepa Roy', email: 'deepa.compliance@ofc360.com' },
    createdAt: '2026-10-15T12:00:00Z',
    sentAt: '2026-10-15T12:15:00Z',
    expiresAt: '2026-10-30T18:00:00Z', // 2 days from current simulated date Oct 28
    reminderDays: [2, 4],
    signers: [
      {
        id: 'sgn-1001',
        name: 'Neha Kulkarni',
        email: 'neha.kulkarni@ofc360.com',
        employeeId: 'EMP-056',
        kind: 'EMPLOYEE',
        role: 'SIGNER',
        order: 1,
        status: 'PENDING',
        lastReminderAt: '2026-10-25T10:00:00Z',
      },
    ],
    progress: { signed: 0, total: 1 },
  },

  // 11. IN_PROGRESS - Multi-Signer 3-Party NDA (2 Signed, 1 Pending)
  {
    id: 'sig-req-011',
    referenceNo: 'SIG-2026-0011',
    title: 'Tri-Party Technology Escrow & NDA',
    documentType: 'NDA',
    source: 'UPLOADED',
    fileName: 'TriParty_NDA_Escrow.pdf',
    fileSize: 670000,
    pageCount: 9,
    sha256: '3a52ce780950d4d969792a2559cd519d7ee8c727ffca3940e69a9254b7197e48',
    message: 'Tri-party software code escrow confidentiality covenant.',
    signingOrder: 'PARALLEL',
    status: 'IN_PROGRESS',
    createdBy: { id: 'usr-admin-1', name: 'Alok Verma', email: 'alok.hr@ofc360.com' },
    createdAt: '2026-10-23T08:00:00Z',
    sentAt: '2026-10-23T08:30:00Z',
    expiresAt: '2026-11-10T23:59:59Z',
    reminderDays: [3, 7],
    signers: [
      {
        id: 'sgn-1101',
        name: 'Alok Verma',
        email: 'alok.hr@ofc360.com',
        employeeId: 'EMP-014',
        kind: 'EMPLOYEE',
        role: 'SIGNER',
        order: 1,
        status: 'SIGNED',
        signedAt: '2026-10-23T09:15:00Z',
        signatureMethod: 'DRAW',
      },
      {
        id: 'sgn-1102',
        name: 'Escrow Agent (IronKey)',
        email: 'custody@ironkeyescrow.com',
        kind: 'EXTERNAL',
        role: 'SIGNER',
        order: 2,
        status: 'SIGNED',
        signedAt: '2026-10-24T12:00:00Z',
        signatureMethod: 'TYPE',
      },
      {
        id: 'sgn-1103',
        name: 'Tarun Mathur (Software Architect)',
        email: 'tarun.mathur@ofc360.com',
        employeeId: 'EMP-031',
        kind: 'EMPLOYEE',
        role: 'SIGNER',
        order: 3,
        status: 'PENDING',
        lastReminderAt: null,
      },
    ],
    progress: { signed: 2, total: 3 },
  },

  // 12. PENDING - Current Logged-in User Slot for Demo / Interactive Testing
  {
    id: 'sig-req-012',
    referenceNo: 'SIG-2026-0012',
    title: 'Remote Work & Security Standards Agreement',
    documentType: 'POLICY_ACK',
    source: 'GENERATED',
    sourceDocumentId: 'doc-gen-112',
    fileName: 'Remote_Work_Security_Agreement.pdf',
    fileSize: 195000,
    pageCount: 3,
    sha256: '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5',
    message: 'Please review remote connectivity requirements, VPN encryption, and sign off.',
    signingOrder: 'PARALLEL',
    status: 'PENDING',
    createdBy: { id: 'usr-admin-2', name: 'Deepa Roy', email: 'deepa.compliance@ofc360.com' },
    createdAt: '2026-10-27T10:00:00Z',
    sentAt: '2026-10-27T10:05:00Z',
    expiresAt: '2026-11-12T23:59:59Z',
    reminderDays: [3, 7],
    signers: [
      {
        id: 'sgn-1201',
        name: 'Enterprise User',
        email: 'admin@ofc360.com',
        employeeId: 'usr_passkey_demo',
        kind: 'EMPLOYEE',
        role: 'SIGNER',
        order: 1,
        status: 'PENDING',
        lastReminderAt: null,
      },
    ],
    progress: { signed: 0, total: 1 },
  },
];

export const INITIAL_MOCK_AUDIT: Record<string, SignatureAuditEvent[]> = {
  'sig-req-001': [
    {
      id: 'aud-001-1',
      requestId: 'sig-req-001',
      type: 'CREATED',
      actorName: 'Alok Verma',
      actorEmail: 'alok.hr@ofc360.com',
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '2026-10-25T09:30:00Z',
      metadata: { action: 'Draft signature request created from Offer Letter template' },
    },
    {
      id: 'aud-001-2',
      requestId: 'sig-req-001',
      type: 'SENT',
      actorName: 'Alok Verma',
      actorEmail: 'alok.hr@ofc360.com',
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '2026-10-25T09:35:00Z',
      metadata: { recipients: ['priya.sharma@example.com'], deliveryChannel: 'Email Notification' },
    },
  ],
  'sig-req-002': [
    {
      id: 'aud-002-1',
      requestId: 'sig-req-002',
      type: 'CREATED',
      actorName: 'Alok Verma',
      actorEmail: 'alok.hr@ofc360.com',
      timestamp: '2026-10-22T14:00:00Z',
    },
    {
      id: 'aud-002-2',
      requestId: 'sig-req-002',
      type: 'SENT',
      actorName: 'Alok Verma',
      actorEmail: 'alok.hr@ofc360.com',
      timestamp: '2026-10-22T14:10:00Z',
    },
    {
      id: 'aud-002-3',
      requestId: 'sig-req-002',
      type: 'VIEWED',
      actorName: 'Vikram Mehta',
      actorEmail: 'vikram.mehta@ofc360.com',
      ipAddress: '49.207.180.12',
      timestamp: '2026-10-23T11:15:00Z',
    },
    {
      id: 'aud-002-4',
      requestId: 'sig-req-002',
      type: 'SIGNED',
      actorName: 'Vikram Mehta',
      actorEmail: 'vikram.mehta@ofc360.com',
      ipAddress: '49.207.180.12',
      timestamp: '2026-10-23T11:20:00Z',
      metadata: { method: 'DRAW', consent: true },
    },
    {
      id: 'aud-002-5',
      requestId: 'sig-req-002',
      type: 'REMINDER_SENT',
      actorName: 'System Automation',
      actorEmail: 'noreply@ofc360.com',
      timestamp: '2026-10-26T10:00:00Z',
      metadata: { targetSigner: 'rahul.sen@cybertech.io' },
    },
  ],
  'sig-req-004': [
    {
      id: 'aud-004-1',
      requestId: 'sig-req-004',
      type: 'CREATED',
      actorName: 'Alok Verma',
      actorEmail: 'alok.hr@ofc360.com',
      timestamp: '2026-10-18T10:00:00Z',
    },
    {
      id: 'aud-004-2',
      requestId: 'sig-req-004',
      type: 'SENT',
      actorName: 'Alok Verma',
      actorEmail: 'alok.hr@ofc360.com',
      timestamp: '2026-10-18T10:15:00Z',
    },
    {
      id: 'aud-004-3',
      requestId: 'sig-req-004',
      type: 'SIGNED',
      actorName: 'Ananya Sen',
      actorEmail: 'ananya.sen@ofc360.com',
      ipAddress: '103.21.124.9',
      timestamp: '2026-10-19T14:45:00Z',
      metadata: { method: 'DRAW', consent: true },
    },
    {
      id: 'aud-004-4',
      requestId: 'sig-req-004',
      type: 'COMPLETED',
      actorName: 'OFC360 E-Sign Engine',
      actorEmail: 'signatures@ofc360.com',
      timestamp: '2026-10-19T14:45:05Z',
      metadata: { certificateGenerated: true },
    },
  ],
};

// In-Memory store clone for runtime mutations during demo mode
let mockDatabase: SignatureRequest[] = JSON.parse(JSON.stringify(INITIAL_MOCK_REQUESTS));
let mockAuditDatabase: Record<string, SignatureAuditEvent[]> = JSON.parse(JSON.stringify(INITIAL_MOCK_AUDIT));

export const resetMockDatabase = (): void => {
  mockDatabase = JSON.parse(JSON.stringify(INITIAL_MOCK_REQUESTS));
  mockAuditDatabase = JSON.parse(JSON.stringify(INITIAL_MOCK_AUDIT));
};

export const getMockStats = (currentUserEmail?: string): SignatureStats => {
  const email = (currentUserEmail || 'admin@ofc360.com').toLowerCase().trim();

  let awaitingMySignature = 0;
  let waitingOnOthers = 0;

  for (const req of mockDatabase) {
    if (['COMPLETED', 'DECLINED', 'CANCELLED', 'EXPIRED', 'DRAFT'].includes(req.status)) continue;

    const mySigner = req.signers.find((s) => s.email.toLowerCase().trim() === email);
    if (mySigner && (mySigner.status === 'PENDING' || mySigner.status === 'VIEWED')) {
      awaitingMySignature += 1;
    } else {
      waitingOnOthers += 1;
    }
  }

  const completedLast30Days = mockDatabase.filter((r) => r.status === 'COMPLETED').length;
  const expiringSoon = mockDatabase.filter((r) => {
    if (r.status !== 'PENDING' && r.status !== 'IN_PROGRESS') return false;
    const expiry = new Date(r.expiresAt).getTime();
    const diff = expiry - Date.now();
    return diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000;
  }).length;

  const declined = mockDatabase.filter((r) => r.status === 'DECLINED').length;
  const expired = mockDatabase.filter((r) => r.status === 'EXPIRED').length;
  const avgTurnaroundHours = calculateAvgTurnaroundHours(mockDatabase);

  return {
    awaitingMySignature,
    waitingOnOthers,
    completedLast30Days,
    expiringSoon,
    declined,
    expired,
    avgTurnaroundHours,
  };
};

export const getMockRequests = (params: {
  scope?: string;
  status?: string;
  type?: string;
  search?: string;
  createdByMe?: boolean;
  page?: number;
  limit?: number;
  currentUserEmail?: string;
}): SignatureRequestsResponse => {
  const {
    scope = 'all',
    status,
    type,
    search,
    createdByMe,
    page = 1,
    limit = 10,
    currentUserEmail = 'admin@ofc360.com',
  } = params;

  const userEmail = currentUserEmail.toLowerCase().trim();

  let filtered = [...mockDatabase];

  if (scope === 'mine') {
    filtered = filtered.filter((r) =>
      r.signers.some((s) => s.email.toLowerCase().trim() === userEmail) ||
      r.createdBy.email.toLowerCase().trim() === userEmail
    );
  }

  if (createdByMe) {
    filtered = filtered.filter((r) => r.createdBy.email.toLowerCase().trim() === userEmail);
  }

  if (status && status !== 'ALL') {
    filtered = filtered.filter((r) => r.status === status);
  }

  if (type && type !== 'ALL') {
    filtered = filtered.filter((r) => r.documentType === type);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (r) =>
        r.referenceNo.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.fileName.toLowerCase().includes(q) ||
        r.signers.some((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
    );
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const items = filtered.slice(startIndex, startIndex + limit);

  return {
    items,
    total,
    page,
    limit,
  };
};

export const getMockRequestById = (id: string): SignatureRequest | undefined => {
  return mockDatabase.find((r) => r.id === id);
};

export const getMockAudit = (requestId: string): SignatureAuditEvent[] => {
  return mockAuditDatabase[requestId] || [];
};

export const createMockRequest = (
  payload: CreateSignatureRequestPayload,
  user: { id: string; name: string; email: string }
): SignatureRequest => {
  const newId = `sig-req-${Date.now()}`;
  const refNum = Math.floor(1000 + Math.random() * 9000);
  const referenceNo = `SIG-2026-${refNum}`;

  const signers: Signer[] = payload.signers.map((s, index) => ({
    id: `sgn-${Date.now()}-${index}`,
    name: s.name,
    email: s.email,
    employeeId: s.employeeId,
    kind: s.kind,
    role: s.role,
    order: s.order || index + 1,
    status:
      payload.signingOrder === 'SEQUENTIAL'
        ? index === 0
          ? 'PENDING'
          : 'WAITING'
        : 'PENDING',
  }));

  const newReq: SignatureRequest = {
    id: newId,
    referenceNo,
    title: payload.title,
    documentType: payload.documentType,
    source: payload.source,
    sourceDocumentId: payload.sourceDocumentId,
    fileName: payload.fileName || (payload.file ? payload.file.name : 'Untitled_Document.pdf'),
    fileSize: payload.fileSize || (payload.file ? payload.file.size : 150000),
    pageCount: 3,
    sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    message: payload.message,
    signingOrder: payload.signingOrder,
    status: payload.sendNow ? 'PENDING' : 'DRAFT',
    createdBy: user,
    createdAt: new Date().toISOString(),
    sentAt: payload.sendNow ? new Date().toISOString() : null,
    expiresAt: payload.expiresAt,
    reminderDays: payload.reminderDays,
    signers,
    progress: { signed: 0, total: signers.length },
  };

  mockDatabase.unshift(newReq);

  mockAuditDatabase[newId] = [
    {
      id: `aud-${Date.now()}-1`,
      requestId: newId,
      type: 'CREATED',
      actorName: user.name,
      actorEmail: user.email,
      timestamp: new Date().toISOString(),
      metadata: { sendNow: payload.sendNow },
    },
  ];

  if (payload.sendNow) {
    mockAuditDatabase[newId].push({
      id: `aud-${Date.now()}-2`,
      requestId: newId,
      type: 'SENT',
      actorName: user.name,
      actorEmail: user.email,
      timestamp: new Date().toISOString(),
    });
  }

  return newReq;
};

export const remindMockSigners = (
  requestId: string,
  signerIds?: string[],
  actor?: { name: string; email: string }
): boolean => {
  const req = mockDatabase.find((r) => r.id === requestId);
  if (!req) return false;

  const now = new Date().toISOString();
  req.signers = req.signers.map((s) => {
    if (!signerIds || signerIds.includes(s.id)) {
      return { ...s, lastReminderAt: now };
    }
    return s;
  });

  const audit = mockAuditDatabase[requestId] || [];
  audit.push({
    id: `aud-${Date.now()}`,
    requestId,
    type: 'REMINDER_SENT',
    actorName: actor?.name || 'Administrator',
    actorEmail: actor?.email || 'admin@ofc360.com',
    timestamp: now,
    metadata: { signerIds },
  });
  mockAuditDatabase[requestId] = audit;

  return true;
};

export const resendMockRequest = (
  requestId: string,
  extendDays = 7,
  actor?: { name: string; email: string }
): boolean => {
  const req = mockDatabase.find((r) => r.id === requestId);
  if (!req) return false;

  const now = new Date();
  const newExpiry = new Date(now.getTime() + extendDays * 24 * 60 * 60 * 1000).toISOString();
  req.expiresAt = newExpiry;
  if (req.status === 'EXPIRED') {
    req.status = 'PENDING';
  }
  req.sentAt = now.toISOString();

  const audit = mockAuditDatabase[requestId] || [];
  audit.push({
    id: `aud-${Date.now()}`,
    requestId,
    type: 'SENT',
    actorName: actor?.name || 'Administrator',
    actorEmail: actor?.email || 'admin@ofc360.com',
    timestamp: now.toISOString(),
    metadata: { action: 'Resent and extended expiry', extendDays, newExpiry },
  });
  mockAuditDatabase[requestId] = audit;

  return true;
};

export const cancelMockRequest = (
  requestId: string,
  reason: string,
  actor?: { name: string; email: string }
): boolean => {
  const req = mockDatabase.find((r) => r.id === requestId);
  if (!req) return false;

  req.status = 'CANCELLED';

  const audit = mockAuditDatabase[requestId] || [];
  audit.push({
    id: `aud-${Date.now()}`,
    requestId,
    type: 'CANCELLED',
    actorName: actor?.name || 'Administrator',
    actorEmail: actor?.email || 'admin@ofc360.com',
    timestamp: new Date().toISOString(),
    metadata: { reason },
  });
  mockAuditDatabase[requestId] = audit;

  return true;
};

export const signMockDocument = (
  requestId: string,
  payload: SignDocumentPayload,
  actor?: { name: string; email: string }
): SignatureRequest | undefined => {
  const req = mockDatabase.find((r) => r.id === requestId);
  if (!req) return undefined;

  const { requestStatus, updatedSigners, progress } = computeStateAfterSign(req, payload.signerId, true);
  req.status = requestStatus;
  req.signers = updatedSigners;
  req.progress = progress;

  if (requestStatus === 'COMPLETED') {
    req.completedAt = new Date().toISOString();
    req.certificateUrl = `/documents/signatures/${requestId}/download?type=certificate`;
    req.signedDocumentUrl = `/documents/signatures/${requestId}/download?type=signed`;
  }

  const signer = req.signers.find((s) => s.id === payload.signerId);
  const audit = mockAuditDatabase[requestId] || [];
  audit.push({
    id: `aud-${Date.now()}-sign`,
    requestId,
    type: 'SIGNED',
    actorName: signer?.name || actor?.name || 'Signer',
    actorEmail: signer?.email || actor?.email || 'signer@example.com',
    timestamp: new Date().toISOString(),
    metadata: { method: payload.method, consent: payload.consent },
  });

  if (requestStatus === 'COMPLETED') {
    audit.push({
      id: `aud-${Date.now()}-comp`,
      requestId,
      type: 'COMPLETED',
      actorName: 'OFC360 E-Sign Engine',
      actorEmail: 'signatures@ofc360.com',
      timestamp: new Date().toISOString(),
      metadata: { certificateGenerated: true },
    });
  }

  mockAuditDatabase[requestId] = audit;
  return req;
};

export const declineMockDocument = (
  requestId: string,
  payload: DeclineSignaturePayload,
  actor?: { name: string; email: string }
): SignatureRequest | undefined => {
  const req = mockDatabase.find((r) => r.id === requestId);
  if (!req) return undefined;

  const { requestStatus, updatedSigners } = computeStateAfterDecline(req, payload.signerId, payload.reason);
  req.status = requestStatus;
  req.signers = updatedSigners;

  const signer = req.signers.find((s) => s.id === payload.signerId);
  const audit = mockAuditDatabase[requestId] || [];
  audit.push({
    id: `aud-${Date.now()}-dec`,
    requestId,
    type: 'DECLINED',
    actorName: signer?.name || actor?.name || 'Signer',
    actorEmail: signer?.email || actor?.email || 'signer@example.com',
    timestamp: new Date().toISOString(),
    metadata: { reason: payload.reason },
  });
  mockAuditDatabase[requestId] = audit;

  return req;
};
