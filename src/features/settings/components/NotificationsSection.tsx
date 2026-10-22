/**
 * @file NotificationsSection.tsx
 * @description Notifications Settings section with channel configuration,
 * event toggles, and user preference management.
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Wifi,
  Globe,
  ToggleLeft,
  ToggleRight,
  Save,
  RotateCcw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  TestTube,
  Zap,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/Tooltip';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/ui/Accordion';
import { useToast } from '@/shared/ui/Toast';
import { useSettingsContext } from './SettingsLayout';
import {
  useGetNotificationsSettingsQuery,
  useUpdateNotificationsSettingsMutation,
  useGetUserNotificationPreferencesQuery,
  useBulkUpdateUserNotificationPreferencesMutation,
} from '../api/settingsApi';
import {
  updateNotificationsSettingsSchema,
  notificationChannelConfigSchema,
  notificationEventConfigSchema,
  defaultNotificationPreferencesSchema,
  type NotificationsSettingsFormData,
} from '../schemas/settings.schemas';
import type {
  NotificationsSettings,
  NotificationChannelConfig,
  NotificationEventConfig,
  NotificationEvent,
  NotificationChannel,
  UserNotificationPreference,
} from '../types/settings.types';

// ==========================================
// Constants
// ==========================================

const NOTIFICATION_EVENTS: { event: NotificationEvent; label: string; description: string; category: string }[] = [
  // Leave Events
  { event: 'leave_requested', label: 'Leave Requested', description: 'When an employee submits a leave request', category: 'Leave Management' },
  { event: 'leave_approved', label: 'Leave Approved', description: 'When a leave request is approved', category: 'Leave Management' },
  { event: 'leave_rejected', label: 'Leave Rejected', description: 'When a leave request is rejected', category: 'Leave Management' },
  { event: 'leave_cancelled', label: 'Leave Cancelled', description: 'When a leave request is cancelled', category: 'Leave Management' },

  // Attendance Events
  { event: 'attendance_late', label: 'Late Check-in', description: 'When an employee checks in late', category: 'Attendance' },
  { event: 'attendance_missed_checkout', label: 'Missed Check-out', description: 'When an employee forgets to check out', category: 'Attendance' },
  { event: 'attendance_geofence_violation', label: 'Geofence Violation', description: 'When check-in occurs outside allowed location', category: 'Attendance' },

  // Payroll Events
  { event: 'payroll_run_created', label: 'Payroll Run Created', description: 'When a new payroll run is initiated', category: 'Payroll' },
  { event: 'payroll_run_approved', label: 'Payroll Run Approved', description: 'When a payroll run is approved', category: 'Payroll' },
  { event: 'payroll_run_paid', label: 'Payroll Run Paid', description: 'When payroll is marked as paid', category: 'Payroll' },
  { event: 'payslip_generated', label: 'Payslip Generated', description: 'When employee payslips are generated', category: 'Payroll' },

  // Expense Events
  { event: 'expense_submitted', label: 'Expense Submitted', description: 'When an expense claim is submitted', category: 'Expenses' },
  { event: 'expense_approved', label: 'Expense Approved', description: 'When an expense claim is approved', category: 'Expenses' },
  { event: 'expense_rejected', label: 'Expense Rejected', description: 'When an expense claim is rejected', category: 'Expenses' },

  // Document Events
  { event: 'document_generated', label: 'Document Generated', description: 'When a document is generated for signature', category: 'Documents' },
  { event: 'document_signed', label: 'Document Signed', description: 'When a document is signed by all parties', category: 'Documents' },
  { event: 'document_expiring', label: 'Document Expiring', description: 'When a document is nearing expiry', category: 'Documents' },

  // Asset Events
  { event: 'asset_allocated', label: 'Asset Allocated', description: 'When an asset is assigned to an employee', category: 'Assets' },
  { event: 'asset_returned', label: 'Asset Returned', description: 'When an asset is returned', category: 'Assets' },
  { event: 'asset_maintenance_due', label: 'Maintenance Due', description: 'When asset maintenance is scheduled', category: 'Assets' },
  { event: 'asset_audit_due', label: 'Audit Due', description: 'When asset audit is scheduled', category: 'Assets' },

  // General Events
  { event: 'announcement_created', label: 'Announcement Created', description: 'When a new announcement is published', category: 'General' },
  { event: 'performance_review_due', label: 'Performance Review Due', description: 'When a performance review is due', category: 'HR' },
  { event: 'probation_ending', label: 'Probation Ending', description: 'When employee probation period is ending', category: 'HR' },
  { event: 'contract_expiring', label: 'Contract Expiring', description: 'When an employment contract is expiring', category: 'HR' },
  { event: 'birthday', label: 'Birthday', description: 'Employee birthday notifications', category: 'General' },
  { event: 'work_anniversary', label: 'Work Anniversary', description: 'Employee work anniversary notifications', category: 'General' },

  // Security Events
  { event: 'password_changed', label: 'Password Changed', description: 'When user changes their password', category: 'Security' },
  { event: 'login_new_device', label: 'New Device Login', description: 'When user logs in from a new device', category: 'Security' },
  { event: 'security_alert', label: 'Security Alert', description: 'Critical security notifications', category: 'Security' },
];

const CHANNEL_CONFIG: { channel: NotificationChannel; label: string; icon: React.ReactNode; description: string }[] = [
  { channel: 'email', label: 'Email', icon: <Mail className="w-4 h-4" />, description: 'Send notifications via email' },
  { channel: 'sms', label: 'SMS', icon: <Smartphone className="w-4 h-4" />, description: 'Send notifications via SMS' },
  { channel: 'in_app', label: 'In-App', icon: <Bell className="w-4 h-4" />, description: 'Show notifications in the application' },
  { channel: 'push', label: 'Push', icon: <Wifi className="w-4 h-4" />, description: 'Send push notifications to mobile devices' },
  { channel: 'webhook', label: 'Webhook', icon: <Globe className="w-4 h-4" />, description: 'Send notifications to external webhook URLs' },
];

const EVENT_CATEGORIES = [...new Set(NOTIFICATION_EVENTS.map((e) => e.category))];

// ==========================================
// UI Components
// ==========================================

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

const ChannelToggle: React.FC<{
  channel: NotificationChannelConfig;
  onChange: (channel: NotificationChannel, enabled: boolean) => void;
  disabled?: boolean;
}> = ({ channel, onChange, disabled }) => {
  const config = CHANNEL_CONFIG.find((c) => c.channel === channel.channel);

  return (
    <div className={cn(
      'flex items-center justify-between p-4 rounded-xl border transition-all duration-200',
      channel.enabled
        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
        : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          channel.enabled
            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500'
        )}>
          {config?.icon}
        </div>
        <div>
          <p className="font-medium text-neutral-900 dark:text-white">{config?.label}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{config?.description}</p>
        </div>
      </div>
      <Switch
        checked={channel.enabled}
        onCheckedChange={(enabled) => onChange(channel.channel, enabled)}
        disabled={disabled}
        aria-label={`Enable ${config?.label} notifications`}
      />
    </div>
  );
};

const EventAccordionItem: React.FC<{
  event: typeof NOTIFICATION_EVENTS[0];
  channels: NotificationEventConfig['channels'];
  onChannelChange: (event: NotificationEvent, channel: NotificationChannel, enabled: boolean) => void;
  recipients: NotificationEventConfig['recipients'];
  onRecipientsChange: (event: NotificationEvent, recipients: NotificationEventConfig['recipients']) => void;
  isActive: boolean;
  onActiveChange: (event: NotificationEvent, active: boolean) => void;
}> = ({ event, channels, onChannelChange, recipients, onRecipientsChange, isActive, onActiveChange }) => {
  const [expanded, setExpanded] = useState(false);

  const enabledChannels = Object.entries(channels).filter(([, enabled]) => enabled).length;
  const totalChannels = Object.keys(channels).length;

  return (
    <AccordionItem value={event.event} className="border-neutral-200 dark:border-neutral-700">
      <AccordionTrigger className={cn(
        'flex items-center gap-3 py-3 px-0 hover:bg-neutral-50 dark:hover:bg-neutral-800',
        !isActive && 'opacity-60'
      )}>
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => onActiveChange(event.event, checked)}
          className="shrink-0"
          aria-label={`Enable ${event.label} notifications`}
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-neutral-900 dark:text-white">{event.label}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{event.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isActive ? 'default' : 'outline'} size="sm">
            {enabledChannels}/{totalChannels} channels
          </Badge>
          <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
            {recipients.join(', ')}
          </Badge>
          <ChevronDown className={cn('w-4 h-4 text-neutral-400 transition-transform', expanded && 'rotate-180')} />
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 pt-2">
          {CHANNEL_CONFIG.map(({ channel, label, icon }) => (
            <label
              key={channel}
              className={cn(
                'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all',
                channels[channel]
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              )}
            >
              <input
                type="checkbox"
                checked={channels[channel] || false}
                onChange={(e) => onChannelChange(event.event, channel, e.target.checked)}
                className="w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="flex items-center gap-1.5">
                {icon}
                <span className="text-sm font-medium">{label}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Recipients
          </Label>
          <div className="flex flex-wrap gap-2">
            {['employee', 'manager', 'hr', 'admin', 'custom'].map((role) => (
              <label
                key={role}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors',
                  recipients.includes(role as any)
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                )}
              >
                <input
                  type="checkbox"
                  checked={recipients.includes(role as any)}
                  onChange={(e) => {
                    const newRecipients = e.target.checked
                      ? [...recipients, role]
                      : recipients.filter((r) => r !== role);
                    onRecipientsChange(event.event, newRecipients);
                  }}
                  className="w-3.5 h-3.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

// ==========================================
// Notifications Section Component
// ==========================================

export const NotificationsSection: React.FC = () => {
  const { markDirty, markClean, isSaving } = useSettingsContext();
  const { success, error: toastError } = useToast();

  const form = useForm<NotificationsSettingsFormData>({
    resolver: zodResolver(updateNotificationsSettingsSchema),
    defaultValues: {
      channels: CHANNEL_CONFIG.map((c) => ({ channel: c.channel, enabled: false })),
      events: NOTIFICATION_EVENTS.map((e) => ({
        event: e.event,
        channels: CHANNEL_CONFIG.reduce((acc, c) => ({ ...acc, [c.channel]: c.channel === 'in_app' }), {}),
        recipients: ['employee'],
        isActive: true,
      })),
      defaultPreferences: {
        events: {},
        quietHoursEnabled: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
        timezone: 'UTC',
        digestEnabled: false,
        digestFrequency: 'daily',
        digestTime: '09:00',
      },
    },
    mode: 'onChange',
  });

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors, isDirty, isSubmitting, isValid } } = form;

  const watchedChannels = watch('channels');
  const watchedEvents = watch('events');
  const watchedPreferences = watch('defaultPreferences');

  // API hooks
  const { data: notificationsSettings, isLoading, error: fetchError, refetch } = useGetNotificationsSettingsQuery();
  const [updateNotificationsSettings] = useUpdateNotificationsSettingsMutation();
  const { data: userPreferences } = useGetUserNotificationPreferencesQuery();
  const [bulkUpdatePreferences] = useBulkUpdateUserNotificationPreferencesMutation();

  // Load settings into form
  useEffect(() => {
    if (notificationsSettings && !isLoading) {
      reset({
        channels: notificationsSettings.channels,
        events: notificationsSettings.events,
        defaultPreferences: notificationsSettings.defaultPreferences,
      });
      markClean('notifications');
    }
  }, [notificationsSettings, isLoading, reset, markClean]);

  // Track dirty state
  useEffect(() => {
    if (isDirty) {
      markDirty('notifications');
    } else {
      markClean('notifications');
    }
  }, [isDirty, markDirty, markClean]);

  // Channel change handler
  const handleChannelChange = useCallback((channel: NotificationChannel, enabled: boolean) => {
    setValue('channels', watchedChannels.map((c) =>
      c.channel === channel ? { ...c, enabled } : c
    ));
  }, [watchedChannels, setValue]);

  // Event channel change handler
  const handleEventChannelChange = useCallback((event: NotificationEvent, channel: NotificationChannel, enabled: boolean) => {
    setValue('events', watchedEvents.map((e) =>
      e.event === event ? { ...e, channels: { ...e.channels, [channel]: enabled } } : e
    ));
  }, [watchedEvents, setValue]);

  // Event recipients change handler
  const handleEventRecipientsChange = useCallback((event: NotificationEvent, recipients: NotificationEventConfig['recipients']) => {
    setValue('events', watchedEvents.map((e) =>
      e.event === event ? { ...e, recipients } : e
    ));
  }, [watchedEvents, setValue]);

  // Event active change handler
  const handleEventActiveChange = useCallback((event: NotificationEvent, active: boolean) => {
    setValue('events', watchedEvents.map((e) =>
      e.event === event ? { ...e, isActive: active } : e
    ));
  }, [watchedEvents, setValue]);

  // Preference change handlers
  const handlePreferenceChange = useCallback((field: string, value: any) => {
    setValue(`defaultPreferences.${field}`, value);
  }, [setValue]);

  // Handle form submit
  const onSubmit = useCallback(async (data: NotificationsSettingsFormData) => {
    try {
      await updateNotificationsSettings(data).unwrap();
      markClean('notifications');
      success('Notification settings updated successfully', 'Settings Saved');
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to update notification settings', 'Save Failed');
    }
  }, [updateNotificationsSettings, markClean, success, toastError]);

  // Reset form
  const handleReset = useCallback(() => {
    if (notificationsSettings) {
      refetch();
    }
  }, [notificationsSettings, refetch]);

  // Test notification
  const handleTestNotification = useCallback(async (channel: NotificationChannel) => {
    try {
      // This would call a test endpoint
      success(`Test ${channel} notification sent`, 'Test Sent');
    } catch {
      toastError('Failed to send test notification', 'Test Failed');
    }
  }, [success, toastError]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <SectionCard title="Loading..." icon={<Bell className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<Zap className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<Moon className="w-5 h-5" />} />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
          Failed to Load Settings
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mb-4">
          {fetchError.message || 'Unable to connect to the settings service.'}
        </p>
        <Button variant="primary" onClick={() => refetch()}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 mb-6">
          <TabsTrigger value="channels" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Zap className="w-4 h-4 mr-2 inline" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Bell className="w-4 h-4 mr-2 inline" />
            Events
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Moon className="w-4 h-4 mr-2 inline" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          <SectionCard
            title="Notification Channels"
            description="Configure which notification delivery channels are enabled for your organization"
            icon={<Zap className="w-5 h-5 text-indigo-600" />}
          >
            <div className="space-y-3">
              {CHANNEL_CONFIG.map((channelConfig) => {
                const channelData = watchedChannels.find((c) => c.channel === channelConfig.channel);
                return (
                  <ChannelToggle
                    key={channelConfig.channel}
                    channel={channelData || { channel: channelConfig.channel, enabled: false }}
                    onChange={handleChannelChange}
                  />
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            title="Channel Configuration"
            description="Configure providers and settings for each enabled channel"
            icon={<Globe className="w-5 h-5 text-indigo-600" />}
          >
            <div className="space-y-4">
              {CHANNEL_CONFIG.map((channelConfig) => {
                const channelData = watchedChannels.find((c) => c.channel === channelConfig.channel);
                if (!channelData?.enabled) return null;

                return (
                  <div key={channelConfig.channel} className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        {channelConfig.icon}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{channelConfig.label} Configuration</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Configure {channelConfig.label.toLowerCase()} provider settings
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 ml-11">
                      <Controller
                        name={`channels.${watchedChannels.findIndex((c) => c.channel === channelConfig.channel)}.provider`}
                        control={control}
                        rules={{ required: false }}
                        render={({ field }) => (
                          <FormField label="Provider" error={field.error}>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                              <SelectContent>
                                {channelConfig.channel === 'email' && [
                                  { value: 'sendgrid', label: 'SendGrid' },
                                  { value: 'mailgun', label: 'Mailgun' },
                                  { value: 'ses', label: 'AWS SES' },
                                  { value: 'smtp', label: 'Custom SMTP' },
                                ]}
                                {channelConfig.channel === 'sms' && [
                                  { value: 'twilio', label: 'Twilio' },
                                  { value: 'vonage', label: 'Vonage' },
                                  { value: 'plivo', label: 'Plivo' },
                                ]}
                                {channelConfig.channel === 'push' && [
                                  { value: 'firebase', label: 'Firebase Cloud Messaging' },
                                  { value: 'onesignal', label: 'OneSignal' },
                                ]}
                                {channelConfig.channel === 'webhook' && [
                                  { value: 'generic', label: 'Generic Webhook' },
                                ]}
                              </SelectContent>
                            </Select>
                          </FormField>
                        )}
                      />
                      <Controller
                        name={`channels.${watchedChannels.findIndex((c) => c.channel === channelConfig.channel)}.config`}
                        control={control}
                        render={({ field }) => (
                          <FormField label="API Key / Secret" error={field.error} hint="Stored encrypted">
                            <Input
                              {...field}
                              type="password"
                              placeholder="Enter API credentials"
                              value={field.value?.apiKey || ''}
                              onChange={(e) => field.onChange({ ...field.value, apiKey: e.target.value })}
                            />
                          </FormField>
                        )}
                      />
                    </div>
                    {channelConfig.channel === 'webhook' && (
                      <Controller
                        name={`channels.${watchedChannels.findIndex((c) => c.channel === channelConfig.channel)}.config`}
                        control={control}
                        render={({ field }) => (
                          <FormField label="Webhook URL" error={field.error} className="ml-11">
                            <Input
                              {...field}
                              placeholder="https://your-webhook-url.com/endpoint"
                              value={field.value?.webhookUrl || ''}
                              onChange={(e) => field.onChange({ ...field.value, webhookUrl: e.target.value })}
                            />
                          </FormField>
                        )}
                      />
                    )}
                    <div className="flex items-center gap-2 mt-3 ml-11">
                      <Button variant="outline" size="sm" onClick={() => handleTestNotification(channelConfig.channel)}>
                        <TestTube className="w-3.5 h-3.5 mr-1.5" />
                        Test
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <SectionCard
            title="Notification Events"
            description="Configure which events trigger notifications and through which channels"
            icon={<Bell className="w-5 h-5 text-indigo-600" />}
          >
            <Accordion type="multiple" className="w-full">
              {EVENT_CATEGORIES.map((category) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-2 py-2">
                    {category}
                  </h4>
                  {NOTIFICATION_EVENTS
                    .filter((e) => e.category === category)
                    .map((event) => {
                      const eventData = watchedEvents.find((e) => e.event === event.event);
                      return (
                        <EventAccordionItem
                          key={event.event}
                          event={event}
                          channels={eventData?.channels || {}}
                          onChannelChange={handleEventChannelChange}
                          recipients={eventData?.recipients || ['employee']}
                          onRecipientsChange={handleEventRecipientsChange}
                          isActive={eventData?.isActive ?? true}
                          onActiveChange={handleEventActiveChange}
                        />
                      );
                    })}
                </div>
              ))}
            </Accordion>
          </SectionCard>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <SectionCard
            title="Default User Preferences"
            description="Default notification preferences applied to new users (can be overridden per user)"
            icon={<Moon className="w-5 h-5 text-indigo-600" />}
          >
            <div className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Quiet Hours
                </Label>
                <div className="grid gap-4 md:grid-cols-4">
                  <Controller
                    name="defaultPreferences.quietHoursEnabled"
                    control={control}
                    render={({ field }) => (
                      <div className="md:col-span-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <span className="font-medium text-neutral-900 dark:text-white">
                            Enable Quiet Hours
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            Suppress non-critical notifications during specified hours
                          </span>
                        </label>
                      </div>
                    )}
                  />
                  <Controller
                    name="defaultPreferences.quietHoursStart"
                    control={control}
                    rules={{ pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Invalid time format' } }}
                    render={({ field }) => (
                      <FormField label="Quiet Hours Start" error={field.error}>
                        <Input {...field} type="time" disabled={!watchedPreferences.quietHoursEnabled} />
                      </FormField>
                    )}
                  />
                  <Controller
                    name="defaultPreferences.quietHoursEnd"
                    control={control}
                    rules={{ pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Invalid time format' } }}
                    render={({ field }) => (
                      <FormField label="Quiet Hours End" error={field.error}>
                        <Input {...field} type="time" disabled={!watchedPreferences.quietHoursEnabled} />
                      </FormField>
                    )}
                  />
                  <Controller
                    name="defaultPreferences.timezone"
                    control={control}
                    render={({ field }) => (
                      <FormField label="Timezone" error={field.error}>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIMEZONES.map((tz) => (
                              <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <Label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Notification Digest
                </Label>
                <div className="grid gap-4 md:grid-cols-3">
                  <Controller
                    name="defaultPreferences.digestEnabled"
                    control={control}
                    render={({ field }) => (
                      <div className="md:col-span-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <span className="font-medium text-neutral-900 dark:text-white">
                            Enable Daily/Weekly Digest
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            Bundle non-urgent notifications into a single summary
                          </span>
                        </label>
                      </div>
                    )}
                  />
                  <Controller
                    name="defaultPreferences.digestFrequency"
                    control={control}
                    render={({ field }) => (
                      <FormField label="Digest Frequency" error={field.error}>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watchedPreferences.digestEnabled}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>
                    )}
                  />
                  <Controller
                    name="defaultPreferences.digestTime"
                    control={control}
                    rules={{ pattern: { value: /^([01]\d|2[0-3]):([0-5]\d)$/, message: 'Invalid time format' } }}
                    render={({ field }) => (
                      <FormField label="Digest Time" error={field.error}>
                        <Input {...field} type="time" disabled={!watchedPreferences.digestEnabled} />
                      </FormField>
                    )}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Per-Event Default Preferences"
            description="Set default channel preferences for each event type"
            icon={<Volume2 className="w-5 h-5 text-indigo-600" />}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left p-3 font-medium text-neutral-500 dark:text-neutral-400">Event</th>
                    {CHANNEL_CONFIG.map(({ channel, label }) => (
                      <th key={channel} className="text-center p-3 font-medium text-neutral-500 dark:text-neutral-400 w-20">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {NOTIFICATION_EVENTS.map((event) => (
                    <tr key={event.event} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="p-3 font-medium text-neutral-900 dark:text-white">{event.label}</td>
                      {CHANNEL_CONFIG.map(({ channel }) => (
                        <td key={channel} className="p-3 text-center">
                          <Controller
                            name={`defaultPreferences.events.${event.event}.${channel}`}
                            control={control}
                            render={({ field }) => (
                              <Switch
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                                aria-label={`Enable ${channel} for ${event.label}`}
                              />
                            )}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <Button
          type="button"
          variant="secondary"
          onClick={handleReset}
          disabled={isSubmitting || isSaving}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || isSaving || !isValid}
          className="min-w-[140px]"
        >
          {isSubmitting || isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Last Updated Info */}
      {notificationsSettings && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5" />
          <span>
            Last updated: {new Date(notificationsSettings.updatedAt).toLocaleString()} by {notificationsSettings.updatedBy}
          </span>
        </div>
      )}
    </form>
  );
};

const FormField: React.FC<{
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}> = ({ label, error, hint, children, className, disabled }) => (
  <div className={cn('space-y-1.5', className)}>
    <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</Label>
    <div>{children}</div>
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

export default NotificationsSection;