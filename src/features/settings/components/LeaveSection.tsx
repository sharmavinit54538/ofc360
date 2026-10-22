/**
 * @file LeaveSection.tsx
 * @description Leave Settings section with leave types, policies, and accrual rules.
 */

import React, { useCallback, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  FileText,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Loader2,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Settings,
  ArrowUpDown,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Switch } from '@/shared/ui/Switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Separator } from '@/shared/ui/Separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/ui/Accordion';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useSettingsContext } from './SettingsLayout';
import {
  useGetLeaveSettingsQuery,
  useUpdateLeaveSettingsMutation,
} from '../api/settingsApi';
import {
  updateLeaveSettingsSchema,
  type LeaveSettingsFormData,
} from '../schemas/settings.schemas';
import type { LeaveSettings, LeaveType, LeavePolicy, UserRole } from '../types/settings.types';

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

const LEAVE_TYPE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];
const ROLE_OPTIONS: UserRole[] = ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN'];

const LeaveTypeAccordionItem: React.FC<{
  index: number;
  field: any;
  control: any;
  removeLeaveType: (index: number) => void;
  watch: any;
}> = ({ index, field, control, removeLeaveType, watch }) => {
  const isActive = watch(`leaveTypes.${index}.isActive`);
  const isPaid = watch(`leaveTypes.${index}.isPaid`);
  const color = watch(`leaveTypes.${index}.color`);
  const name = watch(`leaveTypes.${index}.name`);
  const code = watch(`leaveTypes.${index}.code`);
  const requiresApproval = watch(`leaveTypes.${index}.requiresApproval`);
  const approvalWorkflow = watch(`leaveTypes.${index}.approvalWorkflow`);
  const requiresDocument = watch(`leaveTypes.${index}.requiresDocument`);
  const accrualEnabled = watch(`leaveTypes.${index}.accrualEnabled`);
  const carryForwardType = watch(`leaveTypes.${index}.carryForwardType`);

  return (
    <AccordionItem key={field.id} value={field.id} className="border-neutral-200 dark:border-neutral-700 mb-2">
      <AccordionTrigger className="flex items-center gap-3 py-3 px-0 hover:bg-neutral-50 dark:hover:bg-neutral-800">
        <Controller
          name={`leaveTypes.${index}.isActive`}
          control={control}
          render={({ field: activeField }) => (
            <Switch checked={activeField.value} onCheckedChange={activeField.onChange} className="shrink-0" />
          )}
        />
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <Controller
            name={`leaveTypes.${index}.color`}
            control={control}
            render={({ field: colorField }) => (
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colorField.value }} />
            )}
          />
          <Controller
            name={`leaveTypes.${index}.name`}
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field: nameField }) => (
              <Input {...nameField} placeholder="Leave Type Name" className="font-medium bg-transparent border-none focus:ring-0 p-0" />
            )}
          />
          <Controller
            name={`leaveTypes.${index}.code`}
            control={control}
            rules={{ required: 'Code is required', pattern: { value: /^[A-Z0-9_]+$/, message: 'Uppercase, numbers, underscore only' } }}
            render={({ field: codeField }) => (
              <Input {...codeField} placeholder="CODE" className="font-mono bg-transparent border-none focus:ring-0 p-0 w-20 uppercase" maxLength={10} />
            )}
          />
          <Badge variant={isPaid ? 'success' : 'outline'} size="sm">
            {isPaid ? 'Paid' : 'Unpaid'}
          </Badge>
          <Button variant="ghost" size="icon" onClick={() => removeLeaveType(index)}><Trash2 className="w-4 h-4" /></Button>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4 pt-2">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Controller
            name={`leaveTypes.${index}.description`}
            control={control}
            render={({ field: descField }) => (
              <FormField label="Description" error={descField.error} className="md:col-span-2">
                <Textarea {...descField} placeholder="Description" rows={2} />
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.icon`}
            control={control}
            render={({ field: iconField }) => (
              <FormField label="Icon" error={iconField.error} hint="Lucide icon name">
                <Input {...iconField} placeholder="calendar" />
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.color`}
            control={control}
            render={({ field: colorField }) => (
              <FormField label="Color" error={colorField.error}>
                <div className="flex items-center gap-2">
                  <input type="color" value={colorField.value} onChange={(e) => colorField.onChange(e.target.value)} className="w-10 h-10 rounded border-none cursor-pointer" />
                  <Input {...colorField} className="font-mono uppercase flex-1" />
                </div>
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.isPaid`}
            control={control}
            render={({ field: paidField }) => (
              <FormField label="Paid Leave" error={paidField.error}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Switch checked={paidField.value} onCheckedChange={paidField.onChange} />
                  <span className="font-medium text-neutral-900 dark:text-white">This is a paid leave type</span>
                </label>
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.requiresApproval`}
            control={control}
            render={({ field: approvalField }) => (
              <FormField label="Requires Approval" error={approvalField.error}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Switch checked={approvalField.value} onCheckedChange={approvalField.onChange} />
                  <span className="font-medium text-neutral-900 dark:text-white">Requires manager/HR approval</span>
                </label>
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.approvalWorkflow`}
            control={control}
            render={({ field: workflowField }) => (
              <FormField label="Approval Workflow" error={workflowField.error}>
                <Select onValueChange={workflowField.onChange} defaultValue={workflowField.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-approve</SelectItem>
                    <SelectItem value="manager">Manager approval</SelectItem>
                    <SelectItem value="hr">HR approval</SelectItem>
                    <SelectItem value="multi_level">Multi-level approval</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.approverRoles`}
            control={control}
            render={({ field: rolesField }) => (
              <FormField label="Approver Roles" error={rolesField.error}>
                <div className="flex flex-wrap gap-2">
                  {ROLE_OPTIONS.map((role) => (
                    <label key={role} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border">
                      <input
                        type="checkbox"
                        checked={(rolesField.value as UserRole[]).includes(role)}
                        onChange={(e) => {
                          const newVal = e.target.checked
                            ? [...(rolesField.value as UserRole[]), role]
                            : (rolesField.value as UserRole[]).filter((r) => r !== role);
                          rolesField.onChange(newVal);
                        }}
                        className="w-3.5 h-3.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </FormField>
            )}
          />
        </div>

        <Separator className="my-4" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Controller
            name={`leaveTypes.${index}.accrualEnabled`}
            control={control}
            render={({ field: accrualField }) => (
              <FormField label="Enable Accrual" error={accrualField.error} className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Switch checked={accrualField.value} onCheckedChange={accrualField.onChange} />
                  <span className="font-medium text-neutral-900 dark:text-white">Enable automatic accrual</span>
                </label>
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.accrualFrequency`}
            control={control}
            render={({ field: freqField }) => (
              <FormField label="Accrual Frequency" error={freqField.error}>
                <Select onValueChange={freqField.onChange} defaultValue={freqField.value} disabled={!accrualEnabled}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                    <SelectItem value="per_pay_period">Per Pay Period</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.accrualRate`}
            control={control}
            rules={{ min: 0, max: 365 }}
            render={({ field: rateField }) => (
              <FormField label="Accrual Rate (Days)" error={rateField.error}>
                <Input {...rateField} type="number" min={0} max={365} step={0.5} disabled={!accrualEnabled} />
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.maxAccrualDays`}
            control={control}
            rules={{ min: 0, max: 365 }}
            render={({ field: maxField }) => (
              <FormField label="Max Accrual (Days)" error={maxField.error}>
                <Input {...maxField} type="number" min={0} max={365} step={1} disabled={!accrualEnabled} />
              </FormField>
            )}
          />
        </div>

        <Separator className="my-4" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Controller
            name={`leaveTypes.${index}.carryForwardType`}
            control={control}
            render={({ field: carryField }) => (
              <FormField label="Carry Forward" error={carryField.error}>
                <Select onValueChange={carryField.onChange} defaultValue={carryField.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.maxCarryForwardDays`}
            control={control}
            rules={{ min: 0, max: 365 }}
            render={({ field: maxField }) => (
              <FormField label="Max Carry Forward (Days)" error={maxField.error}>
                <Input {...maxField} type="number" min={0} max={365} step={1} disabled={carryForwardType === 'none'} />
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.carryForwardExpiryMonths`}
            control={control}
            rules={{ min: 0, max: 24 }}
            render={({ field: expiryField }) => (
              <FormField label="Expiry (Months)" error={expiryField.error}>
                <Input {...expiryField} type="number" min={0} max={24} step={1} disabled={carryForwardType === 'none'} />
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.minAdvanceNoticeDays`}
            control={control}
            rules={{ min: 0, max: 365 }}
            render={({ field: noticeField }) => (
              <FormField label="Min Notice (Days)" error={noticeField.error}>
                <Input {...noticeField} type="number" min={0} max={365} step={1} />
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.maxConsecutiveDays`}
            control={control}
            rules={{ min: 1, max: 365 }}
            render={({ field: maxField }) => (
              <FormField label="Max Consecutive (Days)" error={maxField.error}>
                <Input {...maxField} type="number" min={1} max={365} step={1} />
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.minTenureDays`}
            control={control}
            rules={{ min: 0, max: 3650 }}
            render={({ field: tenureField }) => (
              <FormField label="Min Tenure (Days)" error={tenureField.error} hint="Days before eligible">
                <Input {...tenureField} type="number" min={0} max={3650} step={1} />
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.requiresDocument`}
            control={control}
            render={({ field: docField }) => (
              <FormField label="Requires Document" error={docField.error} className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Switch checked={docField.value} onCheckedChange={docField.onChange} />
                  <span className="font-medium text-neutral-900 dark:text-white">Requires supporting document</span>
                </label>
              </FormField>
            )}
          />
          <Controller
            name={`leaveTypes.${index}.documentTypes`}
            control={control}
            render={({ field: docTypesField }) => (
              <FormField label="Document Types" error={docTypesField.error} hint="Comma-separated" className="md:col-span-2">
                <Input {...docTypesField} placeholder="Medical Certificate, Death Certificate" disabled={!requiresDocument} />
              </FormField>
            )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

const PolicyAccordionItem: React.FC<{
  index: number;
  field: any;
  control: any;
  removePolicy: (index: number) => void;
  watch: any;
  leaveTypeFields: any[];
}> = ({ index, field, control, removePolicy, watch, leaveTypeFields }) => {
  const isDefault = watch(`policies.${index}.isDefault`);
  const name = watch(`policies.${index}.name`);
  const eligibilityRule = watch(`policies.${index}.eligibilityRule`);

  return (
    <AccordionItem key={field.id} value={field.id} className="border-neutral-200 dark:border-neutral-700 mb-2">
      <AccordionTrigger className="flex items-center gap-3 py-3 px-0 hover:bg-neutral-50 dark:hover:bg-neutral-800">
        <Controller
          name={`policies.${index}.isDefault`}
          control={control}
          render={({ field: defaultField }) => (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="defaultPolicy" checked={defaultField.value} onChange={() => defaultField.onChange(true)} className="w-4 h-4 text-indigo-600 border-neutral-300 focus:ring-indigo-500" />
              <Badge variant={defaultField.value ? 'default' : 'outline'} size="sm">Default</Badge>
            </label>
          )}
        />
        <Controller
          name={`policies.${index}.name`}
          control={control}
          rules={{ required: 'Policy name is required' }}
          render={({ field: nameField }) => (
            <Input {...nameField} placeholder="Policy Name" className="font-medium bg-transparent border-none focus:ring-0 p-0 flex-1" />
          )}
        />
        <Button variant="ghost" size="icon" onClick={() => removePolicy(index)}><Trash2 className="w-4 h-4" /></Button>
      </AccordionTrigger>
      <AccordionContent className="pb-4 pt-2">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Controller
            name={`policies.${index}.description`}
            control={control}
            render={({ field: descField }) => (
              <FormField label="Description" error={descField.error} className="md:col-span-2">
                <Textarea {...descField} placeholder="Policy description" rows={2} />
              </FormField>
            )}
          />
          <Controller
            name={`policies.${index}.eligibilityRule`}
            control={control}
            render={({ field: ruleField }) => (
              <FormField label="Eligibility Rule" error={ruleField.error}>
                <Select onValueChange={ruleField.onChange} defaultValue={ruleField.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="tenure">Based on Tenure</SelectItem>
                    <SelectItem value="department">By Department</SelectItem>
                    <SelectItem value="role">By Role</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            )}
          />
          <Controller
            name={`policies.${index}.eligibilityValue`}
            control={control}
            render={({ field: valueField }) => (
              <FormField label="Eligibility Value" error={valueField.error} hint="Department/Role name or tenure in days">
                <Input {...valueField} placeholder="Engineering or 365" />
              </FormField>
            )}
          />
          <Controller
            name={`policies.${index}.probationPeriodDays`}
            control={control}
            rules={{ min: 0, max: 365 }}
            render={({ field: probField }) => (
              <FormField label="Probation Period (Days)" error={probField.error}>
                <Input {...probField} type="number" min={0} max={365} step={1} />
              </FormField>
            )}
          />
          <Controller
            name={`policies.${index}.leaveTypeIds`}
            control={control}
            render={({ field: typeIdsField }) => (
              <FormField label="Included Leave Types" error={typeIdsField.error} className="md:col-span-3">
                <div className="flex flex-wrap gap-2">
                  {leaveTypeFields.map((lt, i) => (
                    <label key={lt.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border">
                      <input
                        type="checkbox"
                        checked={(typeIdsField.value as string[]).includes(lt.id)}
                        onChange={(e) => {
                          const newVal = e.target.checked
                            ? [...(typeIdsField.value as string[]), lt.id]
                            : (typeIdsField.value as string[]).filter((id) => id !== lt.id);
                          typeIdsField.onChange(newVal);
                        }}
                        className="w-3.5 h-3.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: watch(`leaveTypes.${i}.color`) || '#10B981' }} />
                        {watch(`leaveTypes.${i}.name`) || `Type ${i + 1}`}
                      </span>
                    </label>
                  ))}
                </div>
              </FormField>
            )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export const LeaveSection: React.FC = () => {
  const { markDirty, markClean, isSaving } = useSettingsContext();
  const { success, error: toastError } = useToast();

  const form = useForm<LeaveSettingsFormData>({
    resolver: zodResolver(updateLeaveSettingsSchema),
    defaultValues: {
      leaveTypes: [],
      policies: [],
      defaultPolicyId: '',
      globalMinAdvanceNoticeDays: 1,
      globalMaxConsecutiveDays: 30,
      enableHalfDayLeave: true,
      enableHourlyLeave: false,
      weekendInclusion: 'exclude',
      holidayInclusion: 'exclude',
      compOffEnabled: false,
      compOffExpiryDays: 30,
    },
    mode: 'onChange',
  });

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors, isDirty, isSubmitting, isValid } } = form;
  const { fields: leaveTypeFields, append: appendLeaveType, remove: removeLeaveType } = useFieldArray({ control, name: 'leaveTypes' });
  const { fields: policyFields, append: appendPolicy, remove: removePolicy } = useFieldArray({ control, name: 'policies' });

  // API hooks
  const { data: leaveSettings, isLoading, error: fetchError, refetch } = useGetLeaveSettingsQuery();
  const [updateLeaveSettings] = useUpdateLeaveSettingsMutation();

  useEffect(() => {
    if (leaveSettings && !isLoading) {
      reset({
        leaveTypes: leaveSettings.leaveTypes,
        policies: leaveSettings.policies,
        defaultPolicyId: leaveSettings.defaultPolicyId || '',
        globalMinAdvanceNoticeDays: leaveSettings.globalMinAdvanceNoticeDays,
        globalMaxConsecutiveDays: leaveSettings.globalMaxConsecutiveDays,
        enableHalfDayLeave: leaveSettings.enableHalfDayLeave,
        enableHourlyLeave: leaveSettings.enableHourlyLeave,
        weekendInclusion: leaveSettings.weekendInclusion,
        holidayInclusion: leaveSettings.holidayInclusion,
        compOffEnabled: leaveSettings.compOffEnabled,
        compOffExpiryDays: leaveSettings.compOffExpiryDays,
      });
      markClean('leave');
    }
  }, [leaveSettings, isLoading, reset, markClean]);

  useEffect(() => {
    if (isDirty) {
      markDirty('leave');
    } else {
      markClean('leave');
    }
  }, [isDirty, markDirty, markClean]);

  const onSubmit = useCallback(async (data: LeaveSettingsFormData) => {
    try {
      await updateLeaveSettings(data).unwrap();
      markClean('leave');
      success('Leave settings updated successfully', 'Settings Saved');
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to update leave settings', 'Save Failed');
    }
  }, [updateLeaveSettings, markClean, success, toastError]);

  const handleReset = useCallback(() => {
    if (leaveSettings) refetch();
  }, [leaveSettings, refetch]);

  const addDefaultLeaveType = useCallback(() => {
    const colors = LEAVE_TYPE_COLORS;
    const nextColor = colors[leaveTypeFields.length % colors.length];
    appendLeaveType({
      name: `Leave Type ${leaveTypeFields.length + 1}`,
      code: `LT${leaveTypeFields.length + 1}`,
      color: nextColor,
      icon: 'calendar',
      isActive: true,
      isPaid: true,
      requiresApproval: true,
      approvalWorkflow: 'manager',
      approverRoles: ['MANAGER'],
      accrualEnabled: false,
      accrualFrequency: 'monthly',
      accrualRate: 1,
      maxAccrualDays: 30,
      carryForwardType: 'limited',
      maxCarryForwardDays: 15,
      carryForwardExpiryMonths: 12,
      minAdvanceNoticeDays: 1,
      maxConsecutiveDays: 30,
      minTenureDays: 0,
      requiresDocument: false,
      sortOrder: leaveTypeFields.length,
    });
  }, [leaveTypeFields.length, appendLeaveType]);

  const addDefaultPolicy = useCallback(() => {
    appendPolicy({
      name: `Policy ${policyFields.length + 1}`,
      leaveTypeIds: [],
      eligibilityRule: 'all',
      probationPeriodDays: 90,
      isDefault: policyFields.length === 0,
    });
  }, [policyFields.length, appendPolicy]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <SectionCard title="Loading..." icon={<Calendar className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<FileText className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<Settings className="w-5 h-5" />} />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">Failed to Load Settings</h3>
        <p className="text-neutral-500 dark:text-neutral-400 mb-4">{fetchError.message || 'Unable to connect to the settings service.'}</p>
        <Button variant="primary" onClick={() => refetch()}><RotateCcw className="w-4 h-4 mr-2" />Retry</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Tabs defaultValue="leaveTypes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 mb-6">
          <TabsTrigger value="leaveTypes" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Calendar className="w-4 h-4 mr-2 inline" />
            Leave Types
          </TabsTrigger>
          <TabsTrigger value="policies" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <FileText className="w-4 h-4 mr-2 inline" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="global" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Settings className="w-4 h-4 mr-2 inline" />
            Global Rules
          </TabsTrigger>
        </TabsList>

        {/* Leave Types Tab */}
        <TabsContent value="leaveTypes" className="space-y-6">
          <SectionCard
            title="Leave Types"
            description="Define all leave types available in the organization"
            icon={<Calendar className="w-5 h-5 text-indigo-600" />}
          >
            {leaveTypeFields.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No leave types configured</p>
                <Button variant="outline" onClick={addDefaultLeaveType}><Plus className="w-4 h-4 mr-2" />Add Leave Type</Button>
              </div>
            )}

            <Accordion type="multiple" className="w-full">
              {leaveTypeFields.map((field, index) => (
                <LeaveTypeAccordionItem
                  key={field.id}
                  index={index}
                  field={field}
                  control={control}
                  removeLeaveType={removeLeaveType}
                  watch={watch}
                />
              ))}
            </Accordion>

            <Button variant="outline" onClick={addDefaultLeaveType} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Leave Type
            </Button>
          </SectionCard>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          <SectionCard
            title="Leave Policies"
            description="Group leave types into policies for different employee segments"
            icon={<FileText className="w-5 h-5 text-indigo-600" />}
          >
            {policyFields.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No policies configured</p>
                <Button variant="outline" onClick={addDefaultPolicy}><Plus className="w-4 h-4 mr-2" />Add Policy</Button>
              </div>
            )}

            <Accordion type="multiple" className="w-full">
              {policyFields.map((field, index) => (
                <PolicyAccordionItem
                  key={field.id}
                  index={index}
                  field={field}
                  control={control}
                  removePolicy={removePolicy}
                  watch={watch}
                  leaveTypeFields={leaveTypeFields}
                />
              ))}
            </Accordion>

            <Button variant="outline" onClick={addDefaultPolicy} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Policy
            </Button>
          </SectionCard>

          <SectionCard
            title="Default Policy"
            description="Select the default policy applied to new employees"
            icon={<Settings className="w-5 h-5 text-indigo-600" />}
          >
            <Controller
              name="defaultPolicyId"
              control={control}
              render={({ field }) => (
                <FormField label="Default Policy" error={field.error}>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (use first policy)</SelectItem>
                      {policyFields.map((p, i) => (
                        <SelectItem key={p.id} value={p.id}>{watch(`policies.${i}.name`) || `Policy ${i + 1}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}
            />
          </SectionCard>
        </TabsContent>

        {/* Global Rules Tab */}
        <TabsContent value="global" className="space-y-6">
          <SectionCard
            title="Global Leave Rules"
            description="Organization-wide leave policies that apply to all leave types"
            icon={<Settings className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Controller
                name="globalMinAdvanceNoticeDays"
                control={control}
                rules={{ min: 0, max: 365 }}
                render={({ field }) => (
                  <FormField label="Global Min Notice (Days)" error={field.error}>
                    <Input {...field} type="number" min={0} max={365} step={1} />
                  </FormField>
                )}
              />
              <Controller
                name="globalMaxConsecutiveDays"
                control={control}
                rules={{ min: 1, max: 365 }}
                render={({ field }) => (
                  <FormField label="Global Max Consecutive (Days)" error={field.error}>
                    <Input {...field} type="number" min={1} max={365} step={1} />
                  </FormField>
                )}
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              {[
                { key: 'enableHalfDayLeave', label: 'Enable Half-Day Leave', description: 'Allow employees to take half-day leave' },
                { key: 'enableHourlyLeave', label: 'Enable Hourly Leave', description: 'Allow employees to take leave in hourly increments' },
                { key: 'compOffEnabled', label: 'Enable Compensatory Off', description: 'Allow compensatory off for overtime/holiday work' },
              ].map((rule) => (
                <Controller
                  key={rule.key}
                  name={rule.key}
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{rule.label}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{rule.description}</p>
                      </div>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
              ))}
            </div>

            <Controller
              name="compOffExpiryDays"
              control={control}
              rules={{ min: 0, max: 365 }}
              render={({ field }) => (
                <FormField label="Comp Off Expiry (Days)" error={field.error} hint="Days before compensatory off expires" className="max-w-xs">
                  <Input {...field} type="number" min={0} max={365} step={1} disabled={!watch('compOffEnabled')} />
                </FormField>
              )}
            />
          </SectionCard>

          <SectionCard
            title="Weekend & Holiday Handling"
            description="How weekends and holidays are treated in leave calculations"
            icon={<ArrowUpDown className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="weekendInclusion"
                control={control}
                render={({ field }) => (
                  <FormField label="Weekend Inclusion" error={field.error}>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exclude">Exclude weekends from leave count</SelectItem>
                        <SelectItem value="include">Include weekends in leave count</SelectItem>
                        <SelectItem value="count_as_leave">Count weekends as leave days</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
              <Controller
                name="holidayInclusion"
                control={control}
                render={({ field }) => (
                  <FormField label="Holiday Inclusion" error={field.error}>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exclude">Exclude holidays from leave count</SelectItem>
                        <SelectItem value="include">Include holidays in leave count</SelectItem>
                        <SelectItem value="count_as_leave">Count holidays as leave days</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <Button type="button" variant="secondary" onClick={handleReset} disabled={isSubmitting || isSaving}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting || isSaving || !isValid} className="min-w-[140px]">
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

      {leaveSettings && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5" />
          <span>
            Last updated: {new Date(leaveSettings.updatedAt).toLocaleString()} by {leaveSettings.updatedBy}
          </span>
        </div>
      )}
    </form>
  );
};

export default LeaveSection;