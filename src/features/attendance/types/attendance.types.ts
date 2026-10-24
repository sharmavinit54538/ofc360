/**
 * @file attendance.types.ts
 * @description Enterprise TypeScript models and interfaces for Attendance Management:
 * punch status, KPI stats, daily records, regularization workflows, shifts,
 * rosters, and holiday calendars.
 */

export type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'HALF_DAY'
  | 'ON_LEAVE'
  | 'WEEK_OFF'
  | 'HOLIDAY'
  | 'LATE'
  | 'NOT_CHECKED_IN'
  | 'OVERTIME';

export type WorkMode = 'OFFICE' | 'WFM' | 'FIELD' | 'REMOTE' | 'HYBRID';

export type RegularizationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type RegularizationCorrectionType =
  | 'MISSED_PUNCH_IN'
  | 'MISSED_PUNCH_OUT'
  | 'BOTH'
  | 'ON_DUTY';

export type AttendanceScope = 'MY' | 'TEAM' | 'ALL' | 'COMPANY';

export interface ShiftWindow {
  name: string;
  startTime: string;
  endTime: string;
}

/**
 * Real-time punch status of the authenticated employee for today.
 */
export interface TodayPunchStatus {
  id?: string;
  date?: string;
  isPunchedIn: boolean;
  isCheckedIn?: boolean;
  isCheckedOut?: boolean;
  punchIn?: string | null;
  punchOut?: string | null;
  punchInTime?: string;
  punchOutTime?: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  currentStatus: AttendanceStatus;
  status?: string;
  assignedShift?: ShiftWindow;
  totalWorkedMinutes: number;
  totalHours?: number;
  isLate: boolean;
  breaks?: any[];
}

export interface PunchInPayload {
  timestamp?: string;
  workMode?: WorkMode;
  work_mode?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  locationAddress?: string;
  ipAddress?: string;
  deviceInfo?: string;
  faceImage?: string;
  face_image?: string;
  photoDataUrl?: string;
  image?: string;
  image_base64?: string;
  cleanBase64?: string;
  notes?: string;
}

export interface PunchOutPayload {
  timestamp?: string;
  workNotes?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  faceImage?: string;
  face_image?: string;
  photoDataUrl?: string;
  image?: string;
  image_base64?: string;
  cleanBase64?: string;
}

export interface FaceVerificationPayload {
  image: string;
  face_image?: string;
  image_base64?: string;
  workMode?: string;
  work_mode?: string;
  latitude?: number;
  longitude?: number;
}

export interface FaceVerificationResult {
  verified: boolean;
  confidence?: number;
  message?: string;
  employee_id?: string;
  employeeId?: string;
}

export interface FaceEnrollmentPayload {
  employeeId?: string;
  employee_id?: string;
  images: string[];
}

export interface FaceEnrollmentResult {
  success: boolean;
  message: string;
  enrolledFacesCount?: number;
}

/**
 * Organization-wide aggregate attendance KPI metrics.
 */
export interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateArrivals: number;
  onLeaveToday: number;
  halfDayCount: number;
  avgWorkHours: number;
  averageWorkHours?: number;
  wfhToday?: number;
  attendancePercentage?: number;
  regularizationPending: number;
}

export interface AttendanceEmployee {
  id: string;
  name: string;
  department?: string;
  designation?: string;
  avatarUrl?: string | null;
}

export interface AttendanceShiftRef {
  id: string;
  name: string;
  timings?: string;
}

/**
 * Single daily attendance record for an employee.
 */
export interface AttendanceRecord {
  id: string;
  date: string;
  employee: AttendanceEmployee;
  employeeId?: string;
  employeeName?: string;
  employeeCode?: string;
  department?: string;
  avatarUrl?: string | null;
  shift: AttendanceShiftRef;
  punchIn?: string | null;
  checkInTime?: string | null;
  punchOut?: string | null;
  checkOutTime?: string | null;
  totalHours: number;
  workHours?: number;
  overtimeHours?: number;
  breakMinutes?: number;
  status: AttendanceStatus;
  isLate: boolean;
  lateMinutes?: number;
  workMode: WorkMode;
  location?: string;
  verificationMethod?: string;
  notes?: string;
  isRegularized: boolean;
}

export interface AttendanceFilterParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus | 'ALL';
  departmentId?: string;
  search?: string;
  scope?: AttendanceScope;
}

export interface AttendanceRecordListResponse {
  items: AttendanceRecord[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Missed-punch / on-duty regularization application and its review trail.
 */
export interface RegularizationRequest {
  id: string;
  attendanceRecordId: string;
  employee?: AttendanceEmployee;
  date: string;
  correctionType: RegularizationCorrectionType;
  requestedCheckIn?: string;
  requestedCheckOut?: string;
  reason: string;
  status: RegularizationStatus;
  appliedAt: string;
  approverComment?: string;
}

export interface ApplyRegularizationPayload {
  attendanceRecordId?: string;
  date: string;
  correctionType: RegularizationCorrectionType;
  requestedCheckIn?: string;
  requestedCheckOut?: string;
  reason: string;
}

export interface ReviewRegularizationPayload {
  id: string;
  status: 'APPROVED' | 'REJECTED';
  approverComment?: string;
}

export interface RegularizationListResponse {
  items: RegularizationRequest[];
  total: number;
}

/**
 * Configured operative shift definition.
 */
export interface ShiftItem {
  id: string;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  halfDayMinimumHours: number;
  fullDayMinimumHours: number;
  isNightShift: boolean;
  isActive: boolean;
}

export interface ShiftFormPayload {
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  halfDayMinimumHours: number;
  fullDayMinimumHours: number;
  isNightShift: boolean;
  isActive?: boolean;
}

/**
 * Single cell of the published duty roster.
 */
export interface RosterItem {
  id: string;
  date: string;
  employee: AttendanceEmployee;
  shift: AttendanceShiftRef;
  department?: string;
}

export interface RosterListResponse {
  items: RosterItem[];
  month: number;
  year: number;
}

export interface RosterQueryParams {
  month?: number;
  year?: number;
  departmentId?: string;
}

export interface RosterAssignmentPayload {
  shiftId: string;
  employeeIds: string[];
  startDate: string;
  endDate: string;
  overrideExisting: boolean;
}

export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  day: string;
  isOptional: boolean;
}
