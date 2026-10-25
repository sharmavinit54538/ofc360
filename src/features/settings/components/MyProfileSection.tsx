/**
 * @file MyProfileSection.tsx
 * @description My Profile / Security Settings with password management, 2FA, passkeys, and session management.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Shield,
  Key,
  Smartphone,
  Fingerprint,
  User,
  Users,
  LogOut,
  Save,
  Loader2,
  AlertCircle,
  Info,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  Clock,
  MapPin,
  Wifi,
  Mail,
  Bell,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Switch } from '@/shared/ui/Switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Separator } from '@/shared/ui/Separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/ui/Accordion';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/ui/Toast';
import { useSettingsContext } from './SettingsLayout';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetSecuritySettingsQuery,
  useChangePasswordMutation,
  useEnable2FAMutation,
  useDisable2FAMutation,
  useGet2FASetupQuery,
  useLazyGet2FASetupQuery,
  useGetPasskeysQuery,
  useRegisterPasskeyMutation,
  useVerifyPasskeyRegistrationMutation,
  useDeletePasskeyMutation,
  useGetActiveSessionsQuery,
  useRevokeSessionMutation,
  useRevokeAllSessionsMutation,
  useUpdateSecuritySettingsMutation,
} from '../api/settingsApi';
import {
  profileFormSchema,
  changePasswordSchema,
  enable2FASchema,
  disable2FASchema,
  registerPasskeySchema,
  deletePasskeySchema,
  type ProfileFormData,
  type ChangePasswordFormData,
  type Enable2FAFormData,
  type Disable2FAFormData,
  type RegisterPasskeyFormData,
  type DeletePasskeyFormData,
} from '../schemas/settings.schemas';
import type { SecuritySettings, PasskeyInfo, ActiveSession } from '../types/settings.types';
import { useAuth } from '@/features/auth/hooks/useAuth';

const SectionCard: React.FC<{
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, icon, children, className }) => (
  <Card className={cn('bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800', className)}>
    <CardHeader className="pb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {description}
            </CardDescription>
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">{children}</CardContent>
  </Card>
);

const FormField: React.FC<{
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ label, error, hint, required, children, className }) => (
  <div className={cn('space-y-1.5', className)}>
    <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
      {label}
      {required && <span className="text-rose-500" aria-hidden="true">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
    )}
    {hint && !error && (
      <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
        <Info className="w-3 h-3" />
        {hint}
      </p>
    )}
  </div>
);

const PasswordInput: React.FC<{
  label: string;
  name: string;
  control: any;
  rules?: any;
  error?: string;
  hint?: string;
  required?: boolean;
}> = ({ label, name, control, rules, error, hint, required }) => {
  const [show, setShow] = useState(false);
  return (
    <FormField label={label} error={error} hint={hint} required={required}>
      <div className="relative">
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <Input
              {...field}
              type={show ? 'text' : 'password'}
              placeholder="Enter password"
              className="pr-12"
              autoComplete="new-password"
            />
          )}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </FormField>
  );
};

export const MyProfileSection: React.FC = () => {
  const { markDirty, markClean, isSaving } = useSettingsContext();
  const { user } = useAuth();
  const { success, error: toastError, info } = useToast();

  // Personal Profile Form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      personalEmail: '',
      department: '',
      designation: '',
      emergencyContact: '',
    },
    mode: 'onChange',
  });

  // Password Form
  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onChange',
  });

  // 2FA Forms
  const enable2FAForm = useForm<Enable2FAFormData>({
    resolver: zodResolver(enable2FASchema),
    defaultValues: { method: 'authenticator', code: '' },
    mode: 'onChange',
  });

  const disable2FAForm = useForm<Disable2FAFormData>({
    resolver: zodResolver(disable2FASchema),
    defaultValues: { password: '', code: '' },
    mode: 'onChange',
  });

  // Passkey Form
  const passkeyForm = useForm<RegisterPasskeyFormData>({
    resolver: zodResolver(registerPasskeySchema),
    defaultValues: { deviceName: '' },
    mode: 'onChange',
  });

  // Security Settings Form
  const securityForm = useForm<{ twoFactorEnabled?: boolean; twoFactorMethod?: 'authenticator' | 'sms' | 'email' | 'passkey' }>({
    defaultValues: {},
    mode: 'onChange',
  });

  // API hooks
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useGetProfileQuery();
  const [updateProfile, { isLoading: profileSaving }] = useUpdateProfileMutation();
  const { data: securitySettings, isLoading: securityLoading, error: securityError, refetch: refetchSecurity } = useGetSecuritySettingsQuery();
  const { data: passkeys, isLoading: passkeysLoading } = useGetPasskeysQuery();
  const { data: sessions, isLoading: sessionsLoading } = useGetActiveSessionsQuery();
  const { data: twoFASetup, isLoading: twoFASetupLoading, refetch: refetch2FASetup } = useGet2FASetupQuery({ skip: true });

  const [changePassword] = useChangePasswordMutation();
  const [enable2FA] = useEnable2FAMutation();
  const [disable2FA] = useDisable2FAMutation();
  const [registerPasskey] = useRegisterPasskeyMutation();
  const [verifyPasskeyRegistration] = useVerifyPasskeyRegistrationMutation();
  const [deletePasskey] = useDeletePasskeyMutation();
  const [revokeSession] = useRevokeSessionMutation();
  const [revokeAllSessions] = useRevokeAllSessionsMutation();
  const [updateSecuritySettings] = useUpdateSecuritySettingsMutation();
  const [get2FASetup] = useLazyGet2FASetupQuery();

  // Hydrate the profile form from the live profile payload
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        personalEmail: profile.personalEmail || '',
        department: profile.department || '',
        designation: profile.designation || '',
        emergencyContact: profile.emergencyContact || '',
      });
    }
  }, [profile, profileForm]);

  const handleProfileSubmit = profileForm.handleSubmit(async (data) => {
    try {
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        personalEmail: data.personalEmail || undefined,
        department: data.department || undefined,
        designation: data.designation || undefined,
        emergencyContact: data.emergencyContact || undefined,
      }).unwrap();
      success('Profile updated successfully', 'Profile Saved');
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to update profile', 'Save Failed');
    }
  });

  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showPasskeyRegistration, setShowPasskeyRegistration] = useState(false);
  const [pendingPasskeyCredential, setPendingPasskeyCredential] = useState<any>(null);
  const [selected2FAMethod, setSelected2FAMethod] = useState<'authenticator' | 'sms' | 'email'>('authenticator');

  // Track dirty state for password form
  useEffect(() => {
    const subscription = passwordForm.watch((formState) => {
      if (formState.isDirty) markDirty('profile');
      else markClean('profile');
    });
    return () => subscription.unsubscribe();
  }, [passwordForm, markDirty, markClean]);

  // Load 2FA setup when needed
  const handleEnable2FA = useCallback(async (method: 'authenticator' | 'sms' | 'email') => {
    setSelected2FAMethod(method);
    setShow2FASetup(true);
    try {
      await get2FASetup().unwrap();
    } catch {
      toastError('Failed to load 2FA setup', 'Error');
    }
  }, [get2FASetup, toastError]);

  const handlePasswordSubmit = useCallback(async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data).unwrap();
      passwordForm.reset();
      markClean('profile');
      success('Password changed successfully', 'Password Updated');
      refetchSecurity();
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to change password', 'Error');
    }
  }, [changePassword, passwordForm, markClean, success, toastError, refetchSecurity]);

  const handle2FASubmit = useCallback(async (data: Enable2FAFormData) => {
    try {
      const result = await enable2FA({ ...data, method: selected2FAMethod }).unwrap();
      if (result.backupCodes) {
        info('Backup codes generated! Save them securely.', 'Backup Codes', { duration: 0 });
        // Show backup codes in a modal or toast
        alert('Backup Codes:\n' + result.backupCodes.join('\n') + '\n\nSave these securely!');
      }
      setShow2FASetup(false);
      enable2FAForm.reset();
      success('Two-factor authentication enabled', '2FA Enabled');
      refetchSecurity();
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to enable 2FA', 'Error');
    }
  }, [enable2FA, selected2FAMethod, enable2FAForm, success, toastError, info, refetchSecurity]);

  const handleDisable2FA = useCallback(async (data: Disable2FAFormData) => {
    try {
      await disable2FA(data).unwrap();
      disable2FAForm.reset();
      success('Two-factor authentication disabled', '2FA Disabled');
      refetchSecurity();
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to disable 2FA', 'Error');
    }
  }, [disable2FA, disable2FAForm, success, toastError, refetchSecurity]);

  const handlePasskeyRegister = useCallback(async (data: RegisterPasskeyFormData) => {
    try {
      const result = await registerPasskey(data).unwrap();
      setPendingPasskeyCredential(result.options);
      // In real implementation, trigger WebAuthn API here
      // For now, we'll simulate
      setShowPasskeyRegistration(true);
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to start passkey registration', 'Error');
    }
  }, [registerPasskey, toastError]);

  const handlePasskeyVerify = useCallback(async (credential: any) => {
    try {
      await verifyPasskeyRegistration({ credential, deviceName: passkeyForm.getValues('deviceName') }).unwrap();
      setShowPasskeyRegistration(false);
      setPendingPasskeyCredential(null);
      passkeyForm.reset();
      success('Passkey registered successfully', 'Passkey Added');
      refetchSecurity();
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to verify passkey', 'Error');
    }
  }, [verifyPasskeyRegistration, passkeyForm, success, toastError, refetchSecurity]);

  const handleDeletePasskey = useCallback(async (credentialId: string) => {
    if (!confirm('Are you sure you want to delete this passkey?')) return;
    try {
      await deletePasskey({ credentialId }).unwrap();
      success('Passkey deleted', 'Passkey Removed');
      refetchSecurity();
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to delete passkey', 'Error');
    }
  }, [deletePasskey, success, toastError, refetchSecurity]);

  const handleRevokeSession = useCallback(async (sessionId: string) => {
    try {
      await revokeSession({ sessionId }).unwrap();
      success('Session revoked', 'Session Ended');
      refetchSecurity();
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to revoke session', 'Error');
    }
  }, [revokeSession, success, toastError, refetchSecurity]);

  const handleRevokeAllSessions = useCallback(async () => {
    if (!confirm('This will sign you out of all other devices. Continue?')) return;
    try {
      await revokeAllSessions({ excludeCurrent: true }).unwrap();
      success('All other sessions revoked', 'Sessions Ended');
      refetchSecurity();
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to revoke sessions', 'Error');
    }
  }, [revokeAllSessions, success, toastError, refetchSecurity]);

  if (securityLoading || passkeysLoading || sessionsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <SectionCard title="Loading..." icon={<Shield className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<Key className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<Fingerprint className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<Users className="w-5 h-5" />} />
      </div>
    );
  }

  if (securityLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    );
  }

  if (securityError) {
    return (
      <ErrorDisplay
        title="Failed to Load Profile Settings"
        error={securityError}
        onRetry={() => refetchSecurity()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 mb-6">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <User className="w-4 h-4 mr-2 inline" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Key className="w-4 h-4 mr-2 inline" />
            Password
          </TabsTrigger>
          <TabsTrigger value="2fa" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Smartphone className="w-4 h-4 mr-2 inline" />
            2FA
          </TabsTrigger>
          <TabsTrigger value="passkeys" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Fingerprint className="w-4 h-4 mr-2 inline" />
            Passkeys
          </TabsTrigger>
          <TabsTrigger value="sessions" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Users className="w-4 h-4 mr-2 inline" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Shield className="w-4 h-4 mr-2 inline" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <SectionCard
            title="Personal Information"
            description="Your name, contact details, and organization placement"
            icon={<User className="w-5 h-5 text-indigo-600" />}
          >
            {profileError ? (
              <ErrorDisplay
                title="Failed to Load Profile"
                error={profileError}
                onRetry={() => refetchProfile()}
              />
            ) : profileLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonListItem key={i} />
                ))}
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                {profile?.email && (
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-3 text-sm text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                    <Badge variant="brand" size="sm" className="ml-auto text-[11px] shrink-0">
                      Work Email
                    </Badge>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="Your first name"
                    error={profileForm.formState.errors.firstName?.message}
                    {...profileForm.register('firstName')}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Your last name"
                    error={profileForm.formState.errors.lastName?.message}
                    {...profileForm.register('lastName')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone"
                    placeholder="+91 98765 43210"
                    error={profileForm.formState.errors.phone?.message}
                    {...profileForm.register('phone')}
                  />
                  <Input
                    label="Personal Email"
                    type="email"
                    placeholder="you@personal-mail.com"
                    error={profileForm.formState.errors.personalEmail?.message}
                    {...profileForm.register('personalEmail')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Department"
                    placeholder="e.g. Engineering"
                    error={profileForm.formState.errors.department?.message}
                    {...profileForm.register('department')}
                  />
                  <Input
                    label="Designation"
                    placeholder="e.g. Senior Engineer"
                    error={profileForm.formState.errors.designation?.message}
                    {...profileForm.register('designation')}
                  />
                </div>

                <Input
                  label="Emergency Contact"
                  placeholder="+91 91234 56780"
                  error={profileForm.formState.errors.emergencyContact?.message}
                  {...profileForm.register('emergencyContact')}
                />

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={profileSaving}
                    className="min-w-[140px]"
                  >
                    {profileSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </SectionCard>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password" className="space-y-6">
          <SectionCard
            title="Change Password"
            description="Update your account password"
            icon={<Key className="w-5 h-5 text-indigo-600" />}
          >
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4 max-w-md">
              <PasswordInput
                label="Current Password"
                name="currentPassword"
                control={passwordForm.control}
                rules={{ required: 'Current password is required' }}
                error={passwordForm.formState.errors.currentPassword?.message}
                required
              />
              <PasswordInput
                label="New Password"
                name="newPassword"
                control={passwordForm.control}
                rules={{
                  required: 'New password is required',
                  minLength: { value: 8, message: 'At least 8 characters' },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
                    message: 'Must contain uppercase, lowercase, number, and special character'
                  }
                }}
                error={passwordForm.formState.errors.newPassword?.message}
                hint="At least 8 characters with uppercase, lowercase, number, and special character"
                required
              />
              <PasswordInput
                label="Confirm New Password"
                name="confirmPassword"
                control={passwordForm.control}
                rules={{ required: 'Please confirm your password' }}
                error={passwordForm.formState.errors.confirmPassword?.message}
                required
              />
              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" disabled={passwordForm.formState.isSubmitting} className="min-w-[140px]">
                  {passwordForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </SectionCard>

          {securitySettings?.passwordLastChanged && (
            <SectionCard
              title="Password History"
              description="Your password was last changed"
              icon={<Clock className="w-5 h-5 text-indigo-600" />}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    Last changed: {new Date(securitySettings.passwordLastChanged).toLocaleString()}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Passwords cannot be reused from recent history
                  </p>
                </div>
              </div>
            </SectionCard>
          )}
        </TabsContent>

        {/* 2FA Tab */}
        <TabsContent value="2fa" className="space-y-6">
          {securitySettings?.twoFactorEnabled ? (
            <SectionCard
              title="Two-Factor Authentication Enabled"
              description={`Currently using ${securitySettings.twoFactorMethod || 'authenticator'} for 2FA`}
              icon={<Smartphone className="w-5 h-5 text-indigo-600" />}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">Two-factor authentication is active</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Method: {securitySettings.twoFactorMethod?.charAt(0).toUpperCase() + securitySettings.twoFactorMethod?.slice(1)}
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => disable2FAForm.reset()}>
                  <X className="w-4 h-4 mr-2" />
                  Disable 2FA
                </Button>
              </div>

              <form onSubmit={disable2FAForm.handleSubmit(handleDisable2FA)} className="space-y-4 max-w-md mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h4 className="font-medium text-neutral-900 dark:text-white">Disable Two-Factor Authentication</h4>
                <PasswordInput
                  label="Password"
                  name="password"
                  control={disable2FAForm.control}
                  rules={{ required: 'Password is required' }}
                  error={disable2FAForm.formState.errors.password?.message}
                  required
                />
                <Controller
                  name="code"
                  control={disable2FAForm.control}
                  rules={{ pattern: { value: /^\d{6}$/, message: '6-digit code required' } }}
                  render={({ field }) => (
                    <FormField label="2FA Code" error={field.error} hint="Enter code from authenticator app">
                      <Input {...field} type="text" placeholder="123456" maxLength={6} autoComplete="one-time-code" />
                    </FormField>
                  )}
                />
                <div className="flex justify-end pt-4">
                  <Button type="submit" variant="destructive" disabled={disable2FAForm.formState.isSubmitting} className="min-w-[140px]">
                    {disable2FAForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Disabling...
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Disable 2FA
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </SectionCard>
          ) : (
            <SectionCard
              title="Enable Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              icon={<Smartphone className="w-5 h-5 text-indigo-600" />}
            >
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                {[
                  { method: 'authenticator', label: 'Authenticator App', desc: 'Google Authenticator, Authy, Microsoft Authenticator', icon: <Smartphone className="w-5 h-5" /> },
                  { method: 'sms', label: 'SMS', desc: 'Receive codes via text message', icon: <Mail className="w-5 h-5" /> },
                  { method: 'email', label: 'Email', desc: 'Receive codes via email', icon: <Bell className="w-5 h-5" /> },
                ].map(({ method, label, desc, icon }) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => handleEnable2FA(method as any)}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-all',
                      selected2FAMethod === method
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                      {icon}
                    </div>
                    <h4 className="font-medium text-neutral-900 dark:text-white">{label}</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{desc}</p>
                  </button>
                ))}
              </div>

              {show2FASetup && twoFASetup && (
                <form onSubmit={enable2FAForm.handleSubmit(handle2FASubmit)} className="space-y-4 max-w-md">
                  <h4 className="font-medium text-neutral-900 dark:text-white">
                    Set up {selected2FAMethod.charAt(0).toUpperCase() + selected2FAMethod.slice(1)} Authentication
                  </h4>
                  {selected2FAMethod === 'authenticator' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Scan this QR code with your authenticator app</p>
                        <div className="inline-block p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          {twoFASetup.qrCode && (
                            <img src={twoFASetup.qrCode} alt="2FA QR Code" className="w-48 h-48" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Secret: <code className="font-mono">{twoFASetup.secret}</code></p>
                      </div>
                      <Controller
                        name="code"
                        control={enable2FAForm.control}
                        rules={{ required: 'Code is required', pattern: { value: /^\d{6}$/, message: '6-digit code required' } }}
                        render={({ field }) => (
                          <FormField label="Enter 6-digit code" required error={field.error}>
                            <Input {...field} type="text" placeholder="123456" maxLength={6} autoComplete="one-time-code" autoFocus />
                          </FormField>
                        )}
                      />
                      {twoFASetup.backupCodes && twoFASetup.backupCodes.length > 0 && (
                        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                          <p className="font-medium text-amber-900 dark:text-amber-100 mb-2">Backup Codes (save these!)</p>
                          <div className="grid grid-cols-3 gap-2 text-sm font-mono">
                            {twoFASetup.backupCodes.map((code, i) => (
                              <code key={i} className="px-2 py-1 bg-white dark:bg-neutral-800 rounded">{code}</code>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {['sms', 'email'].includes(selected2FAMethod) && (
                    <div className="space-y-4">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        A 6-digit code will be sent to your {selected2FAMethod === 'sms' ? 'phone number' : 'email address'} on file.
                      </p>
                      <Controller
                        name="code"
                        control={enable2FAForm.control}
                        rules={{ required: 'Code is required', pattern: { value: /^\d{6}$/, message: '6-digit code required' } }}
                        render={({ field }) => (
                          <FormField label="Enter 6-digit code" required error={field.error}>
                            <Input {...field} type="text" placeholder="123456" maxLength={6} autoComplete="one-time-code" autoFocus />
                          </FormField>
                        )}
                      />
                    </div>
                  )}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={() => { setShow2FASetup(false); enable2FAForm.reset(); }}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={enable2FAForm.formState.isSubmitting} className="min-w-[140px]">
                      {enable2FAForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enabling...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Enable 2FA
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </SectionCard>
          )}
        </TabsContent>

        {/* Passkeys Tab */}
        <TabsContent value="passkeys" className="space-y-6">
          <SectionCard
            title="Passkeys"
            description="Passwordless authentication using device biometrics or security keys"
            icon={<Fingerprint className="w-5 h-5 text-indigo-600" />}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-neutral-900 dark:text-white">Registered Passkeys</h4>
              <Button variant="outline" onClick={() => { passkeyForm.reset(); setShowPasskeyRegistration(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Passkey
              </Button>
            </div>

            {passkeys && passkeys.length > 0 ? (
              <div className="space-y-3">
                {passkeys.map((pk: PasskeyInfo) => (
                  <div key={pk.id} className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <Fingerprint className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{pk.deviceName}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Added: {new Date(pk.createdAt).toLocaleDateString()}
                          {pk.lastUsedAt && ` • Last used: ${new Date(pk.lastUsedAt).toLocaleDateString()}`}
                          {pk.signCount > 0 && ` • Used ${pk.signCount} times`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm" className="flex items-center gap-1">
                        {pk.transports.map(t => <span key={t} className="text-xs capitalize">{t}</span>).join(', ')}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePasskey(pk.credentialId)}>
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Fingerprint className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                <h4 className="font-medium text-neutral-900 dark:text-white mb-2">No passkeys registered</h4>
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">Add a passkey for passwordless sign-in</p>
                <Button variant="outline" onClick={() => { passkeyForm.reset(); setShowPasskeyRegistration(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Passkey
                </Button>
              </div>
            )}
          </SectionCard>

          {showPasskeyRegistration && (
            <SectionCard
              title="Register New Passkey"
              description="Follow the prompts on your device to create a passkey"
              icon={<Fingerprint className="w-5 h-5 text-indigo-600" />}
            >
              <form onSubmit={passkeyForm.handleSubmit(handlePasskeyRegister)} className="space-y-4 max-w-md">
                <Controller
                  name="deviceName"
                  control={passkeyForm.control}
                  rules={{ required: 'Device name is required' }}
                  render={({ field }) => (
                    <FormField label="Device Name" required error={field.error}>
                      <Input {...field} placeholder="e.g., MacBook Pro Touch ID, iPhone Face ID" autoFocus />
                    </FormField>
                  )}
                />
                <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    After clicking "Register", your browser/device will prompt you to authenticate using biometrics, PIN, or security key.
                  </p>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setShowPasskeyRegistration(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={passkeyForm.formState.isSubmitting} className="min-w-[140px]">
                    {passkeyForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-4 h-4 mr-2" />
                        Register Passkey
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </SectionCard>
          )}
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <SectionCard
            title="Active Sessions"
            description="Manage your active login sessions across devices"
            icon={<Users className="w-5 h-5 text-indigo-600" />}
          >
            {sessions && sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session: ActiveSession) => (
                  <div key={session.id} className={cn(
                    'flex items-center justify-between p-4 rounded-lg border',
                    session.isCurrent
                      ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800'
                  )}>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        session.isCurrent
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                      )}>
                        {session.isCurrent ? <Wifi className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-900 dark:text-white">{session.deviceName}</p>
                          {session.isCurrent && (
                            <Badge variant="success" size="xs">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {session.location || 'Unknown location'} • {session.ipAddress}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                          Started: {new Date(session.startedAt).toLocaleString()} • Last active: {new Date(session.lastActivityAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <Button variant="ghost" size="icon" onClick={() => handleRevokeSession(session.id)}>
                        <LogOut className="w-4 h-4 text-rose-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-500 dark:text-neutral-400">No active sessions found</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <Button variant="outline" onClick={handleRevokeAllSessions} className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out of All Other Sessions
              </Button>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <SectionCard
            title="Security Preferences"
            description="Configure your account security settings"
            icon={<Shield className="w-5 h-5 text-indigo-600" />}
          >
            <form onSubmit={securityForm.handleSubmit(async (data) => {
              try {
                await updateSecuritySettings(data).unwrap();
                success('Security settings updated', 'Settings Saved');
              } catch (err: any) {
                toastError(err?.data?.message || 'Failed to update security settings', 'Error');
              }
            })} className="space-y-4">
              <Controller
                name="twoFactorEnabled"
                control={securityForm.control}
                render={({ field }) => (
                  <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Require additional verification when signing in
                      </p>
                    </div>
                    <Switch
                      checked={field.value || securitySettings?.twoFactorEnabled || false}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      disabled={!securitySettings?.twoFactorEnabled}
                    />
                  </div>
                )}
              />
              {securitySettings?.twoFactorEnabled && (
                <Controller
                  name="twoFactorMethod"
                  control={securityForm.control}
                  render={({ field }) => (
                    <FormField label="2FA Method" error={field.error}>
                      <Select onValueChange={field.onChange} value={field.value || securitySettings.twoFactorMethod}>
                        <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="authenticator">Authenticator App</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="passkey">Passkey</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  )}
                />
              )}
              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" disabled={securityForm.formState.isSubmitting} className="min-w-[140px]">
                  {securityForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </form>
          </SectionCard>

          <SectionCard
            title="Account Security Info"
            description="Current security status of your account"
            icon={<Info className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Email Verified</p>
                    <p className="font-medium text-neutral-900 dark:text-white">{user?.isEmailVerified ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">2FA Enabled</p>
                    <p className="font-medium text-neutral-900 dark:text-white">{securitySettings?.twoFactorEnabled ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Passkeys Registered</p>
                    <p className="font-medium text-neutral-900 dark:text-white">{passkeys?.length || 0}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Active Sessions</p>
                    <p className="font-medium text-neutral-900 dark:text-white">{sessions?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyProfileSection;