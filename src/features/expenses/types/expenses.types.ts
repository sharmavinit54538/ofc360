/**
 * @file expenses.types.ts
 * @description Enterprise TypeScript models and interfaces for Expense Claims,
 * Receipts, Tax Breakdown, and Reimbursement Approvals.
 */

export type ExpenseStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PAID' | 'REJECTED';

export type ExpenseCategory =
  | 'TRAVEL'
  | 'MEALS'
  | 'LODGING'
  | 'OFFICE_SUPPLIES'
  | 'SOFTWARE'
  | 'EQUIPMENT'
  | 'CLIENT_ENTERTAINMENT'
  | 'TRAINING'
  | 'OTHER';

export interface ExpenseEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  avatarUrl?: string;
  designation?: string;
}

export interface ExpenseLineItem {
  id?: string;
  date: string;
  merchant: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  taxAmount: number;
  receiptUrl?: string;
}

export interface ExpenseClaim {
  id: string;
  claimNumber: string;
  employeeId: string;
  employee: ExpenseEmployee;
  title: string;
  description?: string;
  category: ExpenseCategory;
  items: ExpenseLineItem[];
  totalAmount: number;
  taxAmount: number;
  currency: string;
  status: ExpenseStatus;
  receiptUrls: string[];
  approverComments?: string;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseClaimPayload {
  title: string;
  description?: string;
  category: ExpenseCategory;
  currency: string;
  items: ExpenseLineItem[];
  receiptUrls?: string[];
  notes?: string;
}

export interface UpdateExpenseStatusPayload {
  id: string;
  status: 'APPROVED' | 'PAID' | 'REJECTED';
  comments?: string;
}

export interface ExpenseFilters {
  search?: string;
  status?: ExpenseStatus | 'ALL';
  category?: ExpenseCategory | 'ALL';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ExpensesSummaryMetrics {
  totalClaimed: number;
  pendingApproval: number;
  totalReimbursed: number;
  rejectedClaims: number;
  currency: string;
}

export interface ExpenseClaimListResponse {
  items: ExpenseClaim[];
  total: number;
  page: number;
  limit: number;
  summary?: ExpensesSummaryMetrics;
}

export interface ReceiptUploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}
