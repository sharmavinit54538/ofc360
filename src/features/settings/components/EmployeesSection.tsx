/**
 * @file EmployeesSection.tsx
 * @description Employee Settings section with ID formats, role defaults, and visibility rules.
 */

import React, { useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Users,
  BadgePercent,
  Eye,
  EyeOff,
  Mail,
  Hash,
  Save,
  RotateCcw,
  Loader2,
  AlertCircle,
  Info,
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/Tooltip';
import { useToast } from '@/shared/ui/Toast';
import { useSettingsContext } from './SettingsLayout';
import {
  useGetEmployeeSettingsQuery,
  useUpdateEmployeeSettingsMutation,
} from '../api/settingsApi';
import {
  updateEmployeeSettingsSchema,
  type EmployeeSettingsFormData,
} from '../schemas/settings.schemas';
import type { EmployeeSettings, UserRole } from '../types/settings.types';
import { ROLE_DEFAULT_PERMISSIONS } from '@/features/auth/types/auth.types';

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

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'HR_ADMIN', label: 'HR Admin' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'IT_ADMIN', label: 'IT Admin' },
];

export const EmployeesSection: React.FC = () => {
  const { markDirty, markClean, isSaving } = useSettingsContext();
  const { success, error: toastError } = useToast();

  const form = useForm<EmployeeSettingsFormData>({
    resolver: zodResolver(updateEmployeeSettingsSchema),
    defaultValues: {
      idFormat: {
        prefix: 'EMP',
        separator: '-',
        sequenceLength: 5,
        includeYear: true,
        includeDepartment: false,
        currentSequence: 0,
      },
      roleDefaults: {
        defaultRole: 'EMPLOYEE',
        probationPeriodDays: 90,
        noticePeriodDays: 30,
      },
      visibilityRules: {
        showSalaryToManagers: false,
        showPersonalInfoToPeers: false,
        showContactInfoToAll: false,
        maskSsnInExports: true,
        maskBankDetailsInExports: true,
      },
      autoGenerateEmail: true,
      emailDomain: '',
      requireEmployeeCode: true,
    },
    mode: 'onChange',
  });

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors, isDirty, isSubmitting, isValid } } = form;

  const watchedIdFormat = watch('idFormat');
  const generateExample = useCallback(() => {
    const { prefix, separator, sequenceLength, includeYear, includeDepartment } = watchedIdFormat;
    let example = prefix;
    if (includeYear) example += separator + new Date().getFullYear();
    if (includeDepartment) example += separator + 'DEPT';
    example += separator + String(watchedIdFormat.currentSequence + 1).padStart(sequenceLength, '0');
    return example;
  }, [watchedIdFormat]);

  useEffect(() => {
    setValue('idFormat.example', generateExample());
  }, [watchedIdFormat, setValue, generateExample]);

  // API hooks
  const { data: employeeSettings, isLoading, error: fetchError, refetch } = useGetEmployeeSettingsQuery();
  const [updateEmployeeSettings] = useUpdateEmployeeSettingsMutation();

  useEffect(() => {
    if (employeeSettings && !isLoading) {
      reset({
        idFormat: employeeSettings.idFormat,
        roleDefaults: employeeSettings.roleDefaults,
        visibilityRules: employeeSettings.visibilityRules,
        autoGenerateEmail: employeeSettings.autoGenerateEmail,
        emailDomain: employeeSettings.emailDomain || '',
        requireEmployeeCode: employeeSettings.requireEmployeeCode,
      });
      markClean('employees');
    }
  }, [employeeSettings, isLoading, reset, markClean]);

  useEffect(() => {
    if (isDirty) {
      markDirty('employees');
    } else {
      markClean('employees');
    }
  }, [isDirty, markDirty, markClean]);

  const onSubmit = useCallback(async (data: EmployeeSettingsFormData) => {
    try {
      await updateEmployeeSettings(data).unwrap();
      markClean('employees');
      success('Employee settings updated successfully', 'Settings Saved');
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to update employee settings', 'Save Failed');
    }
  }, [updateEmployeeSettings, markClean, success, toastError]);

  const handleReset = useCallback(() => {
    if (employeeSettings) refetch();
  }, [employeeSettings, refetch]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <SectionCard title="Loading..." icon={<Users className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<BadgePercent className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<Eye className="w-5 h-5" />} />
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
      <Tabs defaultValue="idFormat" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 mb-6">
          <TabsTrigger value="idFormat" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Hash className="w-4 h-4 mr-2 inline" />
            ID Format
          </TabsTrigger>
          <TabsTrigger value="roleDefaults" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Users className="w-4 h-4 mr-2 inline" />
            Role Defaults
          </TabsTrigger>
          <TabsTrigger value="visibility" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Eye className="w-4 h-4 mr-2 inline" />
            Visibility
          </TabsTrigger>
        </TabsList>

        {/* ID Format Tab */}
        <TabsContent value="idFormat" className="space-y-6">
          <SectionCard
            title="Employee ID Format"
            description="Configure the automatic employee ID generation pattern"
            icon={<Hash className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Controller
                name="idFormat.prefix"
                control={control}
                rules={{ required: 'Prefix is required', maxLength: 10, pattern: { value: /^[A-Z0-9]+$/, message: 'Uppercase letters and numbers only' } }}
                render={({ field }) => (
                  <FormField label="Prefix" required error={field.error}>
                    <Input {...field} placeholder="EMP" className="uppercase" maxLength={10} />
                  </FormField>
                )}
              />
              <Controller
                name="idFormat.separator"
                control={control}
                rules={{ maxLength: 3 }}
                render={({ field }) => (
                  <FormField label="Separator" error={field.error}>
                    <Input {...field} placeholder="-" maxLength={3} />
                  </FormField>
                )}
              />
              <Controller
                name="idFormat.sequenceLength"
                control={control}
                rules={{ required: 'Sequence length is required', min: 3, max: 10 }}
                render={({ field }) => (
                  <FormField label="Sequence Length" required error={field.error}>
                    <Input {...field} type="number" min={3} max={10} step={1} />
                  </FormField>
                )}
              />
              <Controller
                name="idFormat.currentSequence"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <FormField label="Current Sequence" error={field.error} hint="Next ID will use this number">
                    <Input {...field} type="number" min={0} step={1} />
                  </FormField>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="idFormat.includeYear"
                control={control}
                render={({ field }) => (
                  <FormField label="Include Year" error={field.error}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <span className="font-medium text-neutral-900 dark:text-white">Include current year in ID</span>
                    </label>
                  </FormField>
                )}
              />
              <Controller
                name="idFormat.includeDepartment"
                control={control}
                render={({ field }) => (
                  <FormField label="Include Department" error={field.error}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <span className="font-medium text-neutral-900 dark:text-white">Include department code in ID</span>
                    </label>
                  </FormField>
                )}
              />
            </div>

            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <Badge className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm px-3 py-1.5">
                  Preview
                </Badge>
                <code className="font-mono text-lg text-neutral-900 dark:text-white bg-transparent px-4 py-2">
                  {watchedIdFormat.example || generateExample()}
                </code>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Email Generation"
            description="Configure automatic email address generation for new employees"
            icon={<Mail className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="autoGenerateEmail"
                control={control}
                render={({ field }) => (
                  <FormField label="Auto-generate Email" error={field.error}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <span className="font-medium text-neutral-900 dark:text-white">Automatically generate email addresses</span>
                    </label>
                  </FormField>
                )}
              />
              <Controller
                name="emailDomain"
                control={control}
                rules={{ pattern: { value: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid domain format' } }}
                render={({ field }) => (
                  <FormField label="Email Domain" error={field.error} hint="Used when auto-generation is enabled">
                    <Input {...field} placeholder="company.com" disabled={!watchedIdFormat.autoGenerateEmail} />
                  </FormField>
                )}
              />
              <Controller
                name="requireEmployeeCode"
                control={control}
                render={({ field }) => (
                  <FormField label="Require Employee Code" error={field.error}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <span className="font-medium text-neutral-900 dark:text-white">Employee code is mandatory</span>
                    </label>
                  </FormField>
                )}
              />
            </div>
          </SectionCard>
        </TabsContent>

        {/* Role Defaults Tab */}
        <TabsContent value="roleDefaults" className="space-y-6">
          <SectionCard
            title="Default Role Assignment"
            description="Configure default roles and settings for new employees"
            icon={<Users className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Controller
                name="roleDefaults.defaultRole"
                control={control}
                rules={{ required: 'Default role is required' }}
                render={({ field }) => (
                  <FormField label="Default Role" required error={field.error}>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select default role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
              <Controller
                name="roleDefaults.defaultDepartment"
                control={control}
                render={({ field }) => (
                  <FormField label="Default Department" error={field.error} hint="Optional">
                    <Input {...field} placeholder="Engineering" />
                  </FormField>
                )}
              />
              <Controller
                name="roleDefaults.defaultJobTitle"
                control={control}
                render={({ field }) => (
                  <FormField label="Default Job Title" error={field.error} hint="Optional">
                    <Input {...field} placeholder="Software Engineer" />
                  </FormField>
                )}
              />
            </div>

            <Separator className="my-4" />

            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="roleDefaults.probationPeriodDays"
                control={control}
                rules={{ required: 'Probation period is required', min: 0, max: 365 }}
                render={({ field }) => (
                  <FormField label="Probation Period (Days)" required error={field.error}>
                    <Input {...field} type="number" min={0} max={365} step={1} />
                  </FormField>
                )}
              />
              <Controller
                name="roleDefaults.noticePeriodDays"
                control={control}
                rules={{ required: 'Notice period is required', min: 0, max: 365 }}
                render={({ field }) => (
                  <FormField label="Notice Period (Days)" required error={field.error}>
                    <Input {...field} type="number" min={0} max={365} step={1} />
                  </FormField>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Default Permissions by Role"
            description="View the default permissions assigned to each role (configured in RBAC settings)"
            icon={<BadgePercent className="w-5 h-5 text-indigo-600" />}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left p-3 font-medium text-neutral-500 dark:text-neutral-400">Role</th>
                    <th className="text-left p-3 font-medium text-neutral-500 dark:text-neutral-400">Default Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {ROLE_OPTIONS.map((role) => (
                    <tr key={role.value} className="border-b border-neutral-100 dark:border-neutral-800">
                      <td className="p-3 font-medium text-neutral-900 dark:text-white">{role.label}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {ROLE_DEFAULT_PERMISSIONS[role.value].map((perm) => (
                            <Badge key={perm} variant="outline" size="sm" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Visibility Tab */}
        <TabsContent value="visibility" className="space-y-6">
          <SectionCard
            title="Data Visibility Rules"
            description="Control what information is visible to different user roles"
            icon={<Eye className="w-5 h-5 text-indigo-600" />}
          >
            <div className="space-y-4">
              {[
                { key: 'showSalaryToManagers', label: 'Show Salary to Managers', description: 'Allow managers to view salary information of their direct reports' },
                { key: 'showPersonalInfoToPeers', label: 'Show Personal Info to Peers', description: 'Allow employees to view personal information of colleagues' },
                { key: 'showContactInfoToAll', label: 'Show Contact Info to All', description: 'Display phone and email in company directory' },
                { key: 'maskSsnInExports', label: 'Mask SSN in Exports', description: 'Automatically mask Social Security Numbers in data exports' },
                { key: 'maskBankDetailsInExports', label: 'Mask Bank Details in Exports', description: 'Automatically mask bank account numbers in data exports' },
              ].map((rule) => (
                <Controller
                  key={rule.key}
                  name={`visibilityRules.${rule.key}`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900 dark:text-white">{rule.label}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{rule.description}</p>
                      </div>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
              ))}
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

      {employeeSettings && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5" />
          <span>
            Last updated: {new Date(employeeSettings.updatedAt).toLocaleString()} by {employeeSettings.updatedBy}
          </span>
        </div>
      )}
    </form>
  );
};

export default EmployeesSection;