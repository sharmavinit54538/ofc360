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
  | 'HOLIDAY';

export type WorkMode = 'OFFICE' | 'WFM' | 'FIELD';

export type RegularizationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type RegularizationCorrectionType =
  | 'MISSED_PUNCH_IN'
  | 'MISSED_PUNCH_OUT'
  | 'BOTH'
  | 'ON_DUTY';

export type AttendanceScope = 'MY' | 'TEAM' | 'ALL';

export interface ShiftWindow {
  name: string;
  startTime: string;
  endTime: string;
}

/**
 * Real-time punch status of the authenticated employee for today.
 */
export interface TodayPunchStatus {
  isPunchedIn: boolean;
  punchInTime?: string;
  punchOutTime?: string;
  currentStatus: AttendanceStatus;
  assignedShift?: ShiftWindow;
  totalWorkedMinutes: number;
  isLate: boolean;
}

export interface PunchInPayload {
  timestamp: string;
  workMode: WorkMode;
  latitude?: number;
  longitude?: number;
  locationAddress?: string;
  ipAddress?: string;
  deviceInfo?: string;
}

export interface PunchOutPayload {
  timestamp: string;
  workNotes?: string;
  latitude?: number;
  longitude?: number;
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
  regularizationPending: number;
}

export interface AttendanceEmployee {
  id: string;
  name: string;
  department?: string;
  designation?: string;
  avatarUrl?: string;
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
  shift: AttendanceShiftRef;
  punchIn?: string;
  punchOut?: string;
  totalHours: number;
  status: AttendanceStatus;
  workMode: WorkMode;
  isLate: boolean;
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
