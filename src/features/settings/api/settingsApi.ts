/**
 * @file settingsApi.ts
 * @description Enterprise RTK Query API service for Settings Module endpoints.
 * Provides fully typed CRUD operations for all settings domains with cache invalidation,
 * optimistic updates, and comprehensive error handling.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  CompanySettings,
  UpdateCompanySettingsRequest,
  EmployeeSettings,
  UpdateEmployeeSettingsRequest,
  AttendanceSettings,
  UpdateAttendanceSettingsRequest,
  LeaveSettings,
  UpdateLeaveSettingsRequest,
  PayrollSettings,
  UpdatePayrollSettingsRequest,
  DocumentsSettings,
  UpdateDocumentsSettingsRequest,
  AssetsSettings,
  UpdateAssetsSettingsRequest,
  NotificationsSettings,
  UpdateNotificationsSettingsRequest,
  LogoUploadResponse,
  BulkSettingsUpdateRequest,
  BulkSettingsUpdateResponse,
  SettingCategory,
  UserNotificationPreference,
  SecuritySettings,
  ChangePasswordRequest,
  Enable2FARequest,
  Disable2FARequest,
  RegisterPasskeyRequest,
  DeletePasskeyRequest,
  RevokeSessionRequest,
  RevokeAllSessionsRequest,
  UpdateSecuritySettingsRequest,
  PasskeyInfo,
} from '../types/settings.types';

// Transform helper for backend response envelopes
const transformResponse = <T>(response: any): T => {
  const data = response?.data !== undefined && typeof response.data === 'object' && response.data !== null ? response.data : response;
  return data as T;
};

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'CompanySettings',
    'EmployeeSettings',
    'AttendanceSettings',
    'LeaveSettings',
    'PayrollSettings',
    'DocumentsSettings',
    'AssetsSettings',
    'NotificationsSettings',
    'UserNotificationPreferences',
    'SecuritySettings',
    'Passkeys',
    'ActiveSessions',
  ],
  endpoints: (builder) => ({
    // ==========================================
    // Company Settings
    // ==========================================
    getCompanySettings: builder.query<CompanySettings, void>({
      query: () => '/settings/company',
      transformResponse: (response: any) => transformResponse<CompanySettings>(response),
      providesTags: ['CompanySettings'],
    }),

    updateCompanySettings: builder.mutation<CompanySettings, UpdateCompanySettingsRequest>({
      query: (body) => ({
        url: '/settings/company',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['CompanySettings'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(settingsApi.util.invalidateTags([{ type: 'CompanySettings' }]));
        } catch {
          // Error handled at component level
        }
      },
    }),

    uploadCompanyLogo: builder.mutation<LogoUploadResponse, FormData>({
      query: (formData) => ({
        url: '/settings/company/logo',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['CompanySettings'],
    }),

    deleteCompanyLogo: builder.mutation<void, void>({
      query: () => ({
        url: '/settings/company/logo',
        method: 'DELETE',
      }),
      invalidatesTags: ['CompanySettings'],
    }),

    // ==========================================
    // Employee Settings
    // ==========================================
    getEmployeeSettings: builder.query<EmployeeSettings, void>({
      query: () => '/settings/employees',
      transformResponse: (response: any) => transformResponse<EmployeeSettings>(response),
      providesTags: ['EmployeeSettings'],
    }),

    updateEmployeeSettings: builder.mutation<EmployeeSettings, UpdateEmployeeSettingsRequest>({
      query: (body) => ({
        url: '/settings/employees',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['EmployeeSettings'],
    }),

    // ==========================================
    // Attendance Settings
    // ==========================================
    getAttendanceSettings: builder.query<AttendanceSettings, void>({
      query: () => '/settings/attendance',
      transformResponse: (response: any) => transformResponse<AttendanceSettings>(response),
      providesTags: ['AttendanceSettings'],
    }),

    updateAttendanceSettings: builder.mutation<AttendanceSettings, UpdateAttendanceSettingsRequest>({
      query: (body) => ({
        url: '/settings/attendance',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AttendanceSettings'],
    }),

    // ==========================================
    // Leave Settings
    // ==========================================
    getLeaveSettings: builder.query<LeaveSettings, void>({
      query: () => '/settings/leave',
      transformResponse: (response: any) => transformResponse<LeaveSettings>(response),
      providesTags: ['LeaveSettings'],
    }),

    updateLeaveSettings: builder.mutation<LeaveSettings, UpdateLeaveSettingsRequest>({
      query: (body) => ({
        url: '/settings/leave',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['LeaveSettings'],
    }),

    // ==========================================
    // Payroll Settings
    // ==========================================
    getPayrollSettings: builder.query<PayrollSettings, void>({
      query: () => '/settings/payroll',
      transformResponse: (response: any) => transformResponse<PayrollSettings>(response),
      providesTags: ['PayrollSettings'],
    }),

    updatePayrollSettings: builder.mutation<PayrollSettings, UpdatePayrollSettingsRequest>({
      query: (body) => ({
        url: '/settings/payroll',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['PayrollSettings'],
    }),

    // ==========================================
    // Documents Settings
    // ==========================================
    getDocumentsSettings: builder.query<DocumentsSettings, void>({
      query: () => '/settings/documents',
      transformResponse: (response: any) => transformResponse<DocumentsSettings>(response),
      providesTags: ['DocumentsSettings'],
    }),

    updateDocumentsSettings: builder.mutation<DocumentsSettings, UpdateDocumentsSettingsRequest>({
      query: (body) => ({
        url: '/settings/documents',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['DocumentsSettings'],
    }),

    // ==========================================
    // Assets Settings
    // ==========================================
    getAssetsSettings: builder.query<AssetsSettings, void>({
      query: () => '/settings/assets',
      transformResponse: (response: any) => transformResponse<AssetsSettings>(response),
      providesTags: ['AssetsSettings'],
    }),

    updateAssetsSettings: builder.mutation<AssetsSettings, UpdateAssetsSettingsRequest>({
      query: (body) => ({
        url: '/settings/assets',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AssetsSettings'],
    }),

    // ==========================================
    // Notifications Settings
    // ==========================================
    getNotificationsSettings: builder.query<NotificationsSettings, void>({
      query: () => '/settings/notifications',
      transformResponse: (response: any) => transformResponse<NotificationsSettings>(response),
      providesTags: ['NotificationsSettings'],
    }),

    updateNotificationsSettings: builder.mutation<NotificationsSettings, UpdateNotificationsSettingsRequest>({
      query: (body) => ({
        url: '/settings/notifications',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['NotificationsSettings'],
    }),

    // User notification preferences
    getUserNotificationPreferences: builder.query<UserNotificationPreference[], void>({
      query: () => '/settings/notifications/preferences',
      transformResponse: (response: any) => transformResponse<UserNotificationPreference[]>(response),
      providesTags: ['UserNotificationPreferences'],
    }),

    updateUserNotificationPreference: builder.mutation<UserNotificationPreference, { event: string; channel: string; enabled: boolean }>({
      query: (body) => ({
        url: '/settings/notifications/preferences',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['UserNotificationPreferences'],
    }),

    bulkUpdateUserNotificationPreferences: builder.mutation<UserNotificationPreference[], Partial<UserNotificationPreference>[]>({
      query: (body) => ({
        url: '/settings/notifications/preferences/bulk',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UserNotificationPreferences'],
    }),

    // ==========================================
    // Profile / Security Settings
    // ==========================================
    getSecuritySettings: builder.query<SecuritySettings, void>({
      query: () => '/settings/profile/security',
      transformResponse: (response: any) => transformResponse<SecuritySettings>(response),
      providesTags: ['SecuritySettings', 'Passkeys', 'ActiveSessions'],
    }),

    changePassword: builder.mutation<{ success: boolean; message: string }, ChangePasswordRequest>({
      query: (body) => ({
        url: '/settings/profile/password',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SecuritySettings'],
    }),

    enable2FA: builder.mutation<{ success: boolean; secret?: string; qrCode?: string; backupCodes?: string[]; message: string }, Enable2FARequest>({
      query: (body) => ({
        url: '/settings/profile/2fa/enable',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SecuritySettings', 'Passkeys'],
    }),

    disable2FA: builder.mutation<{ success: boolean; message: string }, Disable2FARequest>({
      query: (body) => ({
        url: '/settings/profile/2fa/disable',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SecuritySettings', 'Passkeys'],
    }),

    get2FASetup: builder.query<{ secret: string; qrCode: string; backupCodes: string[] }, void>({
      query: () => '/settings/profile/2fa/setup',
      transformResponse: (response: any) => transformResponse<{ secret: string; qrCode: string; backupCodes: string[] }>(response),
      providesTags: ['SecuritySettings'],
    }),

    // Passkey management
    getPasskeys: builder.query<PasskeyInfo[], void>({
      query: () => '/settings/profile/passkeys',
      transformResponse: (response: any) => transformResponse<PasskeyInfo[]>(response),
      providesTags: ['Passkeys'],
    }),

    registerPasskey: builder.mutation<{ options: any }, RegisterPasskeyRequest>({
      query: (body) => ({
        url: '/settings/profile/passkeys/register/options',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Passkeys'],
    }),

    verifyPasskeyRegistration: builder.mutation<PasskeyInfo, { credential: any; deviceName: string }>({
      query: (body) => ({
        url: '/settings/profile/passkeys/register/verify',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Passkeys', 'SecuritySettings'],
    }),

    deletePasskey: builder.mutation<void, DeletePasskeyRequest>({
      query: (body) => ({
        url: '/settings/profile/passkeys',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Passkeys', 'SecuritySettings'],
    }),

    // Session management
    getActiveSessions: builder.query<SecuritySettings['activeSessions'], void>({
      query: () => '/settings/profile/sessions',
      transformResponse: (response: any) => transformResponse<SecuritySettings['activeSessions']>(response),
      providesTags: ['ActiveSessions'],
    }),

    revokeSession: builder.mutation<void, RevokeSessionRequest>({
      query: (body) => ({
        url: '/settings/profile/sessions',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['ActiveSessions', 'SecuritySettings'],
    }),

    revokeAllSessions: builder.mutation<{ revokedCount: number }, RevokeAllSessionsRequest>({
      query: (body) => ({
        url: '/settings/profile/sessions/all',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['ActiveSessions', 'SecuritySettings'],
    }),

    updateSecuritySettings: builder.mutation<SecuritySettings, UpdateSecuritySettingsRequest>({
      query: (body) => ({
        url: '/settings/profile/security',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['SecuritySettings', 'Passkeys', 'ActiveSessions'],
    }),

    // ==========================================
    // Bulk Operations
    // ==========================================
    bulkUpdateSettings: builder.mutation<BulkSettingsUpdateResponse, BulkSettingsUpdateRequest>({
      query: (body) => ({
        url: '/settings/bulk',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [
        'CompanySettings',
        'EmployeeSettings',
        'AttendanceSettings',
        'LeaveSettings',
        'PayrollSettings',
        'DocumentsSettings',
        'AssetsSettings',
        'NotificationsSettings',
      ],
    }),

    // ==========================================
    // Settings Export/Import
    // ==========================================
    exportSettings: builder.query<Blob, { categories?: SettingCategory[] }>({
      query: (params) => ({
        url: '/settings/export',
        params: params?.categories ? { categories: params.categories.join(',') } : undefined,
        responseHandler: (response) => response.blob(),
      }),
    }),

    importSettings: builder.mutation<BulkSettingsUpdateResponse, FormData>({
      query: (formData) => ({
        url: '/settings/import',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: [
        'CompanySettings',
        'EmployeeSettings',
        'AttendanceSettings',
        'LeaveSettings',
        'PayrollSettings',
        'DocumentsSettings',
        'AssetsSettings',
        'NotificationsSettings',
      ],
    }),

    // ==========================================
    // Settings Reset
    // ==========================================
    resetSectionToDefaults: builder.mutation<{ success: boolean; message: string }, SettingCategory>({
      query: (category) => ({
        url: `/settings/${category}/reset`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, category) => [{ type: `${category.charAt(0).toUpperCase() + category.slice(1)}Settings` as any }],
    }),
  }),
});

export const {
  // Company
  useGetCompanySettingsQuery,
  useLazyGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useUploadCompanyLogoMutation,
  useDeleteCompanyLogoMutation,
  // Employees
  useGetEmployeeSettingsQuery,
  useLazyGetEmployeeSettingsQuery,
  useUpdateEmployeeSettingsMutation,
  // Attendance
  useGetAttendanceSettingsQuery,
  useLazyGetAttendanceSettingsQuery,
  useUpdateAttendanceSettingsMutation,
  // Leave
  useGetLeaveSettingsQuery,
  useLazyGetLeaveSettingsQuery,
  useUpdateLeaveSettingsMutation,
  // Payroll
  useGetPayrollSettingsQuery,
  useLazyGetPayrollSettingsQuery,
  useUpdatePayrollSettingsMutation,
  // Documents
  useGetDocumentsSettingsQuery,
  useLazyGetDocumentsSettingsQuery,
  useUpdateDocumentsSettingsMutation,
  // Assets
  useGetAssetsSettingsQuery,
  useLazyGetAssetsSettingsQuery,
  useUpdateAssetsSettingsMutation,
  // Notifications
  useGetNotificationsSettingsQuery,
  useLazyGetNotificationsSettingsQuery,
  useUpdateNotificationsSettingsMutation,
  useGetUserNotificationPreferencesQuery,
  useLazyGetUserNotificationPreferencesQuery,
  useUpdateUserNotificationPreferenceMutation,
  useBulkUpdateUserNotificationPreferencesMutation,
  // Profile / Security
  useGetSecuritySettingsQuery,
  useLazyGetSecuritySettingsQuery,
  useChangePasswordMutation,
  useEnable2FAMutation,
  useDisable2FAMutation,
  useGet2FASetupQuery,
  useLazyGet2FASetupQuery,
  useGetPasskeysQuery,
  useLazyGetPasskeysQuery,
  useRegisterPasskeyMutation,
  useVerifyPasskeyRegistrationMutation,
  useDeletePasskeyMutation,
  useGetActiveSessionsQuery,
  useLazyGetActiveSessionsQuery,
  useRevokeSessionMutation,
  useRevokeAllSessionsMutation,
  useUpdateSecuritySettingsMutation,
  // Bulk
  useBulkUpdateSettingsMutation,
  // Export/Import
  useExportSettingsQuery,
  useLazyExportSettingsQuery,
  useImportSettingsMutation,
  // Reset
  useResetSectionToDefaultsMutation,
} = settingsApi;