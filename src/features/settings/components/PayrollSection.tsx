/**
 * @file PayrollSection.tsx
 * @description Payroll Settings section with salary components, statutory configs, and pay cycles.
 */

import React, { useCallback, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DollarSign,
  FileText,
  Calculator,
  Calendar,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Loader2,
  AlertCircle,
  Info,
  Shield,
  Percent,
  Building2,
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
import { useToast } from '@/shared/ui/Toast';
import { useSettingsContext } from './SettingsLayout';
import {
  useGetPayrollSettingsQuery,
  useUpdatePayrollSettingsMutation,
} from '../api/settingsApi';
import {
  updatePayrollSettingsSchema,
  type PayrollSettingsFormData,
} from '../schemas/settings.schemas';
import type { PayrollSettings, SalaryComponent, StatutoryConfig, PayCycle, UserRole } from '../types/settings.types';

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

const COMPONENT_TYPES = ['earning', 'deduction', 'employer_contribution'] as const;
const CALCULATION_TYPES = ['fixed', 'percentage', 'formula'] as const;
const STATUTORY_TYPES = ['PF', 'ESI', 'PT', 'TDS', 'GRATUITY', 'BONUS', 'OTHER'] as const;
const APPLIES_TO_OPTIONS = ['all', 'specific_roles', 'specific_departments', 'specific_employees'] as const;
const PAY_FREQUENCIES = ['weekly', 'biweekly', 'semimonthly', 'monthly'] as const;
const ROLE_OPTIONS: UserRole[] = ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN'];

export const PayrollSection: React.FC = () => {
  const { markDirty, markClean, isSaving } = useSettingsContext();
  const { success, error: toastError } = useToast();

  const form = useForm<PayrollSettingsFormData>({
    resolver: zodResolver(updatePayrollSettingsSchema),
    defaultValues: {
      salaryComponents: [],
      statutory: {
        pf: { enabled: true, employerRate: 12, employeeRate: 12, wageCeiling: 15000, adminChargesRate: 0.5, edliRate: 0.5 },
        esi: { enabled: true, employerRate: 3.25, employeeRate: 0.75, wageCeiling: 21000 },
        pt: { enabled: true, slabs: [] },
        tds: { enabled: true, regime: 'new', section80CLimit: 150000, standardDeduction: 50000 },
        gratuity: { enabled: true, vestingYears: 5, formula: '15/26' },
        bonus: { enabled: true, minBonusPercentage: 8.33, maxBonusPercentage: 20, eligibilitySalaryCeiling: 21000 },
      },
      payCycles: [],
      defaultPayFrequency: 'monthly',
      bankDetailsRequired: true,
      payslipPasswordFormat: 'DOB_DDMMYYYY',
      enableArrears: true,
      enableReimbursements: true,
    },
    mode: 'onChange',
  });

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors, isDirty, isSubmitting, isValid } } = form;
  const { fields: componentFields, append: appendComponent, remove: removeComponent, move: moveComponent } = useFieldArray({ control, name: 'salaryComponents' });
  const { fields: cycleFields, append: appendCycle, remove: removeCycle } = useFieldArray({ control, name: 'payCycles' });

  // API hooks
  const { data: payrollSettings, isLoading, error: fetchError, refetch } = useGetPayrollSettingsQuery();
  const [updatePayrollSettings] = useUpdatePayrollSettingsMutation();

  useEffect(() => {
    if (payrollSettings && !isLoading) {
      reset({
        salaryComponents: payrollSettings.salaryComponents,
        statutory: payrollSettings.statutory,
        payCycles: payrollSettings.payCycles,
        defaultPayFrequency: payrollSettings.defaultPayFrequency,
        bankDetailsRequired: payrollSettings.bankDetailsRequired,
        payslipPasswordFormat: payrollSettings.payslipPasswordFormat,
        enableArrears: payrollSettings.enableArrears,
        enableReimbursements: payrollSettings.enableReimbursements,
      });
      markClean('payroll');
    }
  }, [payrollSettings, isLoading, reset, markClean]);

  useEffect(() => {
    if (isDirty) {
      markDirty('payroll');
    } else {
      markClean('payroll');
    }
  }, [isDirty, markDirty, markClean]);

  const onSubmit = useCallback(async (data: PayrollSettingsFormData) => {
    try {
      await updatePayrollSettings(data).unwrap();
      markClean('payroll');
      success('Payroll settings updated successfully', 'Settings Saved');
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to update payroll settings', 'Save Failed');
    }
  }, [updatePayrollSettings, markClean, success, toastError]);

  const handleReset = useCallback(() => {
    if (payrollSettings) refetch();
  }, [payrollSettings, refetch]);

  const addDefaultComponent = useCallback(() => {
    appendComponent({
      name: `Component ${componentFields.length + 1}`,
      code: `COMP${componentFields.length + 1}`,
      type: 'earning',
      calculation: 'fixed',
      value: 0,
      isTaxable: true,
      isStatutory: false,
      appliesTo: 'all',
      displayOrder: componentFields.length,
      isActive: true,
    });
  }, [componentFields.length, appendComponent]);

  const addDefaultCycle = useCallback(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const payDate = new Date(today.getFullYear(), today.getMonth() + 1, 5);
    const cutoff = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    appendCycle({
      name: `Pay Cycle ${cycleFields.length + 1}`,
      frequency: 'monthly',
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      payDate: payDate.toISOString().split('T')[0],
      cutoffDate: cutoff.toISOString().split('T')[0],
      isActive: cycleFields.length === 0,
      isCurrent: cycleFields.length === 0,
      status: 'draft',
    });
  }, [cycleFields.length, appendCycle]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <SectionCard title="Loading..." icon={<DollarSign className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<Shield className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<Calendar className="w-5 h-5" />} />
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
      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 mb-6">
          <TabsTrigger value="components" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Calculator className="w-4 h-4 mr-2 inline" />
            Components
          </TabsTrigger>
          <TabsTrigger value="statutory" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Shield className="w-4 h-4 mr-2 inline" />
            Statutory
          </TabsTrigger>
          <TabsTrigger value="cycles" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Calendar className="w-4 h-4 mr-2 inline" />
            Pay Cycles
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Building2 className="w-4 h-4 mr-2 inline" />
            General
          </TabsTrigger>
        </TabsList>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <SectionCard
            title="Salary Components"
            description="Define earnings, deductions, and employer contributions"
            icon={<Calculator className="w-5 h-5 text-indigo-600" />}
          >
            {componentFields.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No salary components configured</p>
                <Button variant="outline" onClick={addDefaultComponent}><Plus className="w-4 h-4 mr-2" />Add Component</Button>
              </div>
            )}

            {componentFields.map((field, index) => (
              <AccordionItem key={field.id} value={field.id} className="border-neutral-200 dark:border-neutral-700 mb-2">
                <AccordionTrigger className="flex items-center gap-3 py-3 px-0 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <Controller
                    name={`salaryComponents.${index}.isActive`}
                    control={control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} className="shrink-0" />
                    )}
                  />
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <Controller
                      name={`salaryComponents.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <Badge variant={field.value === 'earning' ? 'success' : field.value === 'deduction' ? 'destructive' : 'default'} size="sm">
                          {field.value.charAt(0).toUpperCase() + field.value.slice(1)}
                        </Badge>
                      )}
                    />
                    <Controller
                      name={`salaryComponents.${index}.name`}
                      control={control}
                      rules={{ required: 'Name is required' }}
                      render={({ field }) => (
                        <Input {...field} placeholder="Component Name" className="font-medium bg-transparent border-none focus:ring-0 p-0" />
                      )}
                    />
                    <Controller
                      name={`salaryComponents.${index}.code`}
                      control={control}
                      rules={{ required: 'Code is required', pattern: { value: /^[A-Z0-9_]+$/, message: 'Uppercase, numbers, underscore only' } }}
                      render={({ field }) => (
                        <Input {...field} placeholder="CODE" className="font-mono bg-transparent border-none focus:ring-0 p-0 w-24 uppercase" maxLength={20} />
                      )}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeComponent(index)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Controller
                      name={`salaryComponents.${index}.calculation`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Calculation Type" error={field.error}>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {CALCULATION_TYPES.map((t) => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`salaryComponents.${index}.value`}
                      control={control}
                      rules={{ min: 0 }}
                      render={({ field }) => (
                        <FormField label={watch(`salaryComponents.${index}.calculation`) === 'percentage' ? 'Percentage (%)' : 'Amount'} error={field.error}>
                          <Input {...field} type="number" min={0} step={watch(`salaryComponents.${index}.calculation`) === 'percentage' ? '0.01' : '1'} />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`salaryComponents.${index}.formula`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Formula" error={field.error} hint="e.g., basic * 0.12" className="md:col-span-2">
                          <Input {...field} placeholder="basic * 0.12" disabled={watch(`salaryComponents.${index}.calculation`) !== 'formula'} />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`salaryComponents.${index}.isTaxable`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Taxable" error={field.error}>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                            <span className="font-medium text-neutral-900 dark:text-white">Subject to tax</span>
                          </label>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`salaryComponents.${index}.isStatutory`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Statutory Component" error={field.error}>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                            <span className="font-medium text-neutral-900 dark:text-white">Is a statutory component</span>
                          </label>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`salaryComponents.${index}.statutoryType`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Statutory Type" error={field.error}>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watch(`salaryComponents.${index}.isStatutory`)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUTORY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`salaryComponents.${index}.appliesTo`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Applies To" error={field.error}>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select scope" />
                            </SelectTrigger>
                            <SelectContent>
                              {APPLIES_TO_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`salaryComponents.${index}.applicableRoles`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Applicable Roles" error={field.error} hint="When 'Applies To' is 'specific_roles'">
                          <div className="flex flex-wrap gap-2">
                            {ROLE_OPTIONS.map((role) => (
                              <label key={role} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border">
                                <input
                                  type="checkbox"
                                  checked={(field.value as UserRole[]).includes(role)}
                                  onChange={(e) => {
                                    const newVal = e.target.checked
                                      ? [...(field.value as UserRole[]), role]
                                      : (field.value as UserRole[]).filter((r) => r !== role);
                                    field.onChange(newVal);
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
                    <Controller
                      name={`salaryComponents.${index}.displayOrder`}
                      control={control}
                      rules={{ min: 0 }}
                      render={({ field }) => (
                        <FormField label="Display Order" error={field.error}>
                          <Input {...field} type="number" min={0} step={1} />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`salaryComponents.${index}.glAccountCode`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="GL Account Code" error={field.error}>
                          <Input {...field} placeholder="GL-1001" />
                        </FormField>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}

            <Button variant="outline" onClick={addDefaultComponent} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Component
            </Button>
          </SectionCard>
        </TabsContent>

        {/* Statutory Tab */}
        <TabsContent value="statutory" className="space-y-6">
          <SectionCard
            title="Provident Fund (PF)"
            description="Employee Provident Fund configuration"
            icon={<Building2 className="w-5 h-5 text-indigo-600" />}
          >
            <Controller
              name="statutory.pf.enabled"
              control={control}
              render={({ field }) => (
                <FormField label="Enable PF" error={field.error} className="mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <span className="font-medium text-neutral-900 dark:text-white">Enable Provident Fund</span>
                  </label>
                </FormField>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" style={{ opacity: watch('statutory.pf.enabled') ? 1 : 0.5 }}>
              <Controller
                name="statutory.pf.employerRate"
                control={control}
                rules={{ min: 0, max: 100 }}
                render={({ field }) => (
                  <FormField label="Employer Rate (%)" error={field.error}>
                    <Input {...field} type="number" min={0} max={100} step={0.01} disabled={!watch('statutory.pf.enabled')} />
                  </FormField>
                )}
              />
              <Controller
                name="statutory.pf.employeeRate"
                control={control}
                rules={{ min: 0, max: 100 }}
                render={({ field }) => (
                  <FormField label="Employee Rate (%)" error={field.error}>
                    <Input {...field} type="number" min={0} max={100} step={0.01} disabled={!watch('statutory.pf.enabled')} />
                  </FormField>
                )}
              />
              <Controller
                name="statutory.pf.wageCeiling"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <FormField label="Wage Ceiling" error={field.error}>
                    <Input {...field} type="number" min={0} step={1} disabled={!watch('statutory.pf.enabled')} />
                  </FormField>
                )}
              />
              <Controller
                name="statutory.pf.adminChargesRate"
                control={control}
                rules={{ min: 0, max: 100 }}
                render={({ field }) => (
                  <FormField label="Admin Charges (%)" error={field.error}>
                    <Input {...field} type="number" min={0} max={100} step={0.01} disabled={!watch('statutory.pf.enabled')} />
                  </FormField>
                )}
              />
              <Controller
                name="statutory.pf.edliRate"
                control={control}
                rules={{ min: 0, max: 100 }}
                render={({ field }) => (
                  <FormField label="EDLI Rate (%)" error={field.error}>
                    <Input {...field} type="number" min={0} max={100} step={0.01} disabled={!watch('statutory.pf.enabled')} />
                  </FormField>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Employee State Insurance (ESI)"
            description="ESI configuration for applicable employees"
            icon={<Shield className="w-5 h-5 text-indigo-600" />}
          >
            <Controller
              name="statutory.esi.enabled"
              control={control}
              render={({ field }) => (
                <FormField label="Enable ESI" error={field.error} className="mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <span className="font-medium text-neutral-900 dark:text-white">Enable ESI</span>
                  </label>
                </FormField>
              )}
            />
            <div className="grid gap-4 md:grid-cols-3" style={{ opacity: watch('statutory.esi.enabled') ? 1 : 0.5 }}>
              <Controller
                name="statutory.esi.employerRate"
                control={control}
                rules={{ min: 0, max: 100 }}
                render={({ field }) => (
                  <FormField label="Employer Rate (%)" error={field.error}>
                    <Input {...field} type="number" min={0} max={100} step={0.01} disabled={!watch('statutory.esi.enabled')} />
                  </FormField>
                )}
              />
              <Controller
                name="statutory.esi.employeeRate"
                control={control}
                rules={{ min: 0, max: 100 }}
                render={({ field }) => (
                  <FormField label="Employee Rate (%)" error={field.error}>
                    <Input {...field} type="number" min={0} max={100} step={0.01} disabled={!watch('statutory.esi.enabled')} />
                  </FormField>
                )}
              />
              <Controller
                name="statutory.esi.wageCeiling"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <FormField label="Wage Ceiling" error={field.error}>
                    <Input {...field} type="number" min={0} step={1} disabled={!watch('statutory.esi.enabled')} />
                  </FormField>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Professional Tax (PT)"
            description="State-wise Professional Tax slabs"
            icon={<Percent className="w-5 h-5 text-indigo-600" />}
          >
            <Controller
              name="statutory.pt.enabled"
              control={control}
              render={({ field }) => (
                <FormField label="Enable PT" error={field.error} className="mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <span className="font-medium text-neutral-900 dark:text-white">Enable Professional Tax</span>
                  </label>
                </FormField>
              )}
            />
            {watch('statutory.pt.enabled') && (
              <>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Configure PT slabs for each state</p>
                <div className="space-y-2">
                  {watch('statutory.pt.slabs', []).map((slab: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input placeholder="Min Salary" type="number" min={0} step={1} value={slab.min} onChange={(e) => setValue(`statutory.pt.slabs.${i}.min`, Number(e.target.value))} className="w-32" />
                      <span className="text-neutral-500">-</span>
                      <Input placeholder="Max Salary" type="number" min={0} step={1} value={slab.max} onChange={(e) => setValue(`statutory.pt.slabs.${i}.max`, Number(e.target.value))} className="w-32" />
                      <span className="text-neutral-500">→</span>
                      <Input placeholder="Amount" type="number" min={0} step={1} value={slab.amount} onChange={(e) => setValue(`statutory.pt.slabs.${i}.amount`, Number(e.target.value))} className="w-24" />
                      <Button variant="ghost" size="icon" onClick={() => setValue('statutory.pt.slabs', watch('statutory.pt.slabs', []).filter((_: any, idx: number) => idx !== i))}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setValue('statutory.pt.slabs', [...watch('statutory.pt.slabs', []), { min: 0, max: 0, amount: 0 }])}><Plus className="w-4 h-4 mr-2" />Add Slab</Button>
                </div>
              </>
            )}
          </SectionCard>

          <SectionCard
            title="TDS Configuration"
            description="Tax Deducted at Source settings"
            icon={<Calculator className="w-5 h-5 text-indigo-600" />}
          >
            <Controller
              name="statutory.tds.enabled"
              control={control}
              render={({ field }) => (
                <FormField label="Enable TDS" error={field.error} className="mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <span className="font-medium text-neutral-900 dark:text-white">Enable TDS Deduction</span>
                  </label>
                </FormField>
              )}
            />
            <div className="grid gap-4 md:grid-cols-3" style={{ opacity: watch('statutory.tds.enabled') ? 1 : 0.5 }}>
              <Controller
                name="statutory.tds.regime"
                control={control}
                render={({ field }) => (
                  <FormField label="Tax Regime" error={field.error}>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watch('statutory.tds.enabled')}>
                      <SelectTrigger><SelectValue placeholder="Select regime" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="old">Old Regime</SelectItem>
                        <SelectItem value="new">New Regime</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
              <Controller
                name="statutory.tds.section80CLimit"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <FormField label="Section 80C Limit" error={field.error}>
                    <Input {...field} type="number" min={0} step={1} disabled={!watch('statutory.tds.enabled')} />
                  </FormField>
                )}
              />
              <Controller
                name="statutory.tds.standardDeduction"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <FormField label="Standard Deduction" error={field.error}>
                    <Input {...field} type="number" min={0} step={1} disabled={!watch('statutory.tds.enabled')} />
                  </FormField>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Gratuity & Bonus"
            description="Gratuity and Bonus Act configurations"
            icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Controller
                name="statutory.gratuity.enabled"
                control={control}
                render={({ field }) => (
                  <FormField label="Enable Gratuity" error={field.error} className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <span className="font-medium text-neutral-900 dark:text-white">Enable Gratuity</span>
                    </label>
                  </FormField>
                )}
              />
              <Controller
                name="statutory.gratuity.vestingYears"
                control={control}
                rules={{ min: 0, max: 20 }}
                render={({ field }) => (
                  <FormField label="Vesting Years" error={field.error}>
                    <Input {...field} type="number" min={0} max={20} step={1} disabled={!watch('statutory.gratuity.enabled')} />
                  </FormField>
                )}
              />
              <Controller
                name="statutory.gratuity.formula"
                control={control}
                render={({ field }) => (
                  <FormField label="Formula" error={field.error}>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watch('statutory.gratuity.enabled')}>
                      <SelectTrigger><SelectValue placeholder="Select formula" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15/26">15/26 (Monthly)</SelectItem>
                        <SelectItem value="30/26">30/26 (Daily)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />

              <Controller
                name="statutory.bonus.enabled"
                control={control}
                render={({ field }) => (
                  <FormField label="Enable Bonus" error={field.error} className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <span className="font-medium text-neutral-900 dark:text-white">Enable Statutory Bonus</span>
                    </label>
                  </FormField>
                )}
              />
              <Controller
                name="statutory.bonus.minBonusPercentage"
                control={control}
                rules={{ min: 0, max: 100 }}
                render={({ field }) => (
                  <FormField label="Min Bonus %" error={field.error}>
                    <Input {...field} type="number" min={0} max={100} step={0.01} disabled={!watch('statutory.bonus.enabled')} />
                  </FormField>
                )}
              />
              <Controller
                name="statutory.bonus.maxBonusPercentage"
                control={control}
                rules={{ min: 0, max: 100 }}
                render={({ field }) => (
                  <FormField label="Max Bonus %" error={field.error}>
                    <Input {...field} type="number" min={0} max={100} step={0.01} disabled={!watch('statutory.bonus.enabled')} />
                  </FormField>
                )}
              />
              <Controller
                name="statutory.bonus.eligibilitySalaryCeiling"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <FormField label="Eligibility Ceiling" error={field.error}>
                    <Input {...field} type="number" min={0} step={1} disabled={!watch('statutory.bonus.enabled')} />
                  </FormField>
                )}
              />
            </div>
          </SectionCard>
        </TabsContent>

        {/* Pay Cycles Tab */}
        <TabsContent value="cycles" className="space-y-6">
          <SectionCard
            title="Pay Cycles"
            description="Define payroll periods and payment schedules"
            icon={<Calendar className="w-5 h-5 text-indigo-600" />}
          >
            {cycleFields.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No pay cycles configured</p>
                <Button variant="outline" onClick={addDefaultCycle}><Plus className="w-4 h-4 mr-2" />Add Pay Cycle</Button>
              </div>
            )}

            {cycleFields.map((field, index) => (
              <AccordionItem key={field.id} value={field.id} className="border-neutral-200 dark:border-neutral-700 mb-2">
                <AccordionTrigger className="flex items-center gap-3 py-3 px-0 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <Controller
                    name={`payCycles.${index}.isCurrent`}
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="currentCycle" checked={field.value} onChange={() => field.onChange(true)} className="w-4 h-4 text-indigo-600 border-neutral-300 focus:ring-indigo-500" />
                        <Badge variant={field.value ? 'default' : 'outline'} size="sm">Current</Badge>
                      </label>
                    )}
                  />
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <Controller
                      name={`payCycles.${index}.name`}
                      control={control}
                      rules={{ required: 'Name is required' }}
                      render={({ field }) => (
                        <Input {...field} placeholder="Cycle Name" className="font-medium bg-transparent border-none focus:ring-0 p-0" />
                      )}
                    />
                    <Controller
                      name={`payCycles.${index}.frequency`}
                      control={control}
                      render={({ field }) => (
                        <Badge variant="outline" size="sm">{field.value}</Badge>
                      )}
                    />
                    <Controller
                      name={`payCycles.${index}.status`}
                      control={control}
                      render={({ field }) => (
                        <Badge variant={field.value === 'paid' ? 'success' : field.value === 'processing' ? 'warning' : 'outline'} size="sm">
                          {field.value}
                        </Badge>
                      )}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeCycle(index)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Controller
                      name={`payCycles.${index}.frequency`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Frequency" error={field.error}>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                            <SelectContent>
                              {PAY_FREQUENCIES.map((f) => <SelectItem key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`payCycles.${index}.startDate`}
                      control={control}
                      rules={{ required: 'Start date is required' }}
                      render={({ field }) => (
                        <FormField label="Period Start" required error={field.error}>
                          <Input {...field} type="date" />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`payCycles.${index}.endDate`}
                      control={control}
                      rules={{ required: 'End date is required' }}
                      render={({ field }) => (
                        <FormField label="Period End" required error={field.error}>
                          <Input {...field} type="date" />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`payCycles.${index}.payDate`}
                      control={control}
                      rules={{ required: 'Pay date is required' }}
                      render={({ field }) => (
                        <FormField label="Pay Date" required error={field.error}>
                          <Input {...field} type="date" />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`payCycles.${index}.cutoffDate`}
                      control={control}
                      rules={{ required: 'Cutoff date is required' }}
                      render={({ field }) => (
                        <FormField label="Cutoff Date" required error={field.error}>
                          <Input {...field} type="date" />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`payCycles.${index}.isActive`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Active" error={field.error} className="flex items-center">
                          <label className="flex items-center gap-3 cursor-pointer w-full">
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                            <span className="font-medium text-neutral-900 dark:text-white">Active Cycle</span>
                          </label>
                        </FormField>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}

            <Button variant="outline" onClick={addDefaultCycle} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Pay Cycle
            </Button>
          </SectionCard>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <SectionCard
            title="General Payroll Settings"
            description="Global payroll configuration"
            icon={<Building2 className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Controller
                name="defaultPayFrequency"
                control={control}
                render={({ field }) => (
                  <FormField label="Default Pay Frequency" error={field.error}>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                      <SelectContent>
                        {PAY_FREQUENCIES.map((f) => <SelectItem key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              {[
                { key: 'bankDetailsRequired', label: 'Bank Details Required', description: 'Mandate bank account details for all employees' },
                { key: 'enableArrears', label: 'Enable Arrears Processing', description: 'Allow processing of salary arrears' },
                { key: 'enableReimbursements', label: 'Enable Reimbursements', description: 'Allow expense reimbursements in payroll' },
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
              name="payslipPasswordFormat"
              control={control}
              render={({ field }) => (
                <FormField label="Payslip Password Format" error={field.error} hint="Variables: DOB_DDMMYYYY, DOB_YYYYMMDD, PAN_LAST4, EMP_CODE">
                  <Input {...field} placeholder="DOB_DDMMYYYY" />
                </FormField>
              )}
            />
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

      {payrollSettings && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5" />
          <span>
            Last updated: {new Date(payrollSettings.updatedAt).toLocaleString()} by {payrollSettings.updatedBy}
          </span>
        </div>
      )}
    </form>
  );
};

export default PayrollSection;