/**
 * @file AssetsSection.tsx
 * @description Assets Settings section with categories, tag configuration, and allocation rules.
 */

import React, { useCallback, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Package,
  Tag,
  Shield,
  Settings,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Loader2,
  AlertCircle,
  Info,
  Wrench,
  ClipboardCheck,
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
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/ui/Toast';
import { useSettingsContext } from './SettingsLayout';
import {
  useGetAssetsSettingsQuery,
  useUpdateAssetsSettingsMutation,
} from '../api/settingsApi';
import {
  updateAssetsSettingsSchema,
  type AssetsSettingsFormData,
} from '../schemas/settings.schemas';
import type { AssetsSettings, AssetCategory, AssetTagConfig, AllocationRule, UserRole } from '../types/settings.types';

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

const DEPRECIATION_METHODS = [
  { value: 'straight_line', label: 'Straight Line' },
  { value: 'declining_balance', label: 'Declining Balance' },
  { value: 'sum_of_years', label: 'Sum of Years Digits' },
  { value: 'units_of_production', label: 'Units of Production' },
];

const ALLOCATION_CONDITIONS = [
  { value: 'role', label: 'By Role' },
  { value: 'department', label: 'By Department' },
  { value: 'employee', label: 'By Employee' },
  { value: 'location', label: 'By Location' },
];

const ROLE_OPTIONS: UserRole[] = ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN'];

export const AssetsSection: React.FC = () => {
  const { markDirty, markClean, isSaving } = useSettingsContext();
  const { success, error: toastError } = useToast();

  const form = useForm<AssetsSettingsFormData>({
    resolver: zodResolver(updateAssetsSettingsSchema),
    defaultValues: {
      categories: [],
      tagConfig: {
        prefix: 'AST',
        separator: '-',
        sequenceLength: 6,
        includeCategoryCode: true,
        includeYear: true,
        currentSequence: 0,
      },
      allocationRules: [],
      defaultWarrantyMonths: 12,
      enableMaintenanceTracking: true,
      maintenanceReminderDays: [30, 7, 1],
      enableAssetAudit: true,
      auditFrequencyMonths: 12,
    },
    mode: 'onChange',
  });

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors, isDirty, isSubmitting, isValid } } = form;
  const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray({ control, name: 'categories' });
  const { fields: ruleFields, append: appendRule, remove: removeRule } = useFieldArray({ control, name: 'allocationRules' });

  // API hooks
  const { data: assetsSettings, isLoading, error: fetchError, refetch } = useGetAssetsSettingsQuery();
  const [updateAssetsSettings] = useUpdateAssetsSettingsMutation();

  useEffect(() => {
    if (assetsSettings && !isLoading) {
      reset({
        categories: assetsSettings.categories,
        tagConfig: assetsSettings.tagConfig,
        allocationRules: assetsSettings.allocationRules,
        defaultWarrantyMonths: assetsSettings.defaultWarrantyMonths,
        enableMaintenanceTracking: assetsSettings.enableMaintenanceTracking,
        maintenanceReminderDays: assetsSettings.maintenanceReminderDays,
        enableAssetAudit: assetsSettings.enableAssetAudit,
        auditFrequencyMonths: assetsSettings.auditFrequencyMonths,
      });
      markClean('assets');
    }
  }, [assetsSettings, isLoading, reset, markClean]);

  useEffect(() => {
    if (isDirty) {
      markDirty('assets');
    } else {
      markClean('assets');
    }
  }, [isDirty, markDirty, markClean]);

  const onSubmit = useCallback(async (data: AssetsSettingsFormData) => {
    try {
      await updateAssetsSettings(data).unwrap();
      markClean('assets');
      success('Asset settings updated successfully', 'Settings Saved');
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to update asset settings', 'Save Failed');
    }
  }, [updateAssetsSettings, markClean, success, toastError]);

  const handleReset = useCallback(() => {
    if (assetsSettings) refetch();
  }, [assetsSettings, refetch]);

  const addDefaultCategory = useCallback(() => {
    appendCategory({
      name: `Category ${categoryFields.length + 1}`,
      code: `CAT${categoryFields.length + 1}`,
      prefix: 'AST',
      icon: 'box',
      color: '#6366F1',
      depreciationMethod: 'straight_line',
      usefulLifeYears: 5,
      salvageValuePercentage: 10,
      requiresAllocationApproval: false,
      allocatableRoles: ['IT_ADMIN', 'HR_ADMIN'],
      isActive: true,
      sortOrder: categoryFields.length,
    });
  }, [categoryFields.length, appendCategory]);

  const addDefaultRule = useCallback(() => {
    appendRule({
      categoryId: '',
      condition: 'role',
      conditionValue: '',
      maxQuantity: 1,
      requiresApproval: true,
      approverRoles: ['MANAGER'],
    });
  }, [appendRule]);

  const generateTagExample = useCallback(() => {
    const { prefix, separator, sequenceLength, includeCategoryCode, includeYear, currentSequence } = watch('tagConfig');
    let example = prefix;
    if (includeCategoryCode) example += separator + 'LAP';
    if (includeYear) example += separator + new Date().getFullYear();
    example += separator + String(currentSequence + 1).padStart(sequenceLength, '0');
    return example;
  }, [watch]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    );
  }

  if (fetchError) {
    return (
      <ErrorDisplay
        title="Failed to Load Asset Settings"
        error={fetchError}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 mb-6">
          <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Package className="w-4 h-4 mr-2 inline" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="tags" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Tag className="w-4 h-4 mr-2 inline" />
            Tag Config
          </TabsTrigger>
          <TabsTrigger value="allocation" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Shield className="w-4 h-4 mr-2 inline" />
            Allocation
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Wrench className="w-4 h-4 mr-2 inline" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <SectionCard
            title="Asset Categories"
            description="Define asset categories with depreciation and allocation settings"
            icon={<Package className="w-5 h-5 text-indigo-600" />}
          >
            {categoryFields.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No categories configured</p>
                <Button variant="outline" onClick={addDefaultCategory}><Plus className="w-4 h-4 mr-2" />Add Category</Button>
              </div>
            )}

            {categoryFields.map((field, index) => (
              <AccordionItem key={field.id} value={field.id} className="border-neutral-200 dark:border-neutral-700 mb-2">
                <AccordionTrigger className="flex items-center gap-3 py-3 px-0 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <Controller
                    name={`categories.${index}.isActive`}
                    control={control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} className="shrink-0" />
                    )}
                  />
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <Controller
                      name={`categories.${index}.color`}
                      control={control}
                      render={({ field }) => (
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: field.value }} />
                      )}
                    />
                    <Controller
                      name={`categories.${index}.name`}
                      control={control}
                      rules={{ required: 'Name is required' }}
                      render={({ field }) => (
                        <Input {...field} placeholder="Category Name" className="font-medium bg-transparent border-none focus:ring-0 p-0" />
                      )}
                    />
                    <Controller
                      name={`categories.${index}.code`}
                      control={control}
                      rules={{ required: 'Code is required', pattern: { value: /^[A-Z0-9_]+$/, message: 'Uppercase, numbers, underscore only' } }}
                      render={({ field }) => (
                        <Input {...field} placeholder="CODE" className="font-mono bg-transparent border-none focus:ring-0 p-0 w-24 uppercase" maxLength={20} />
                      )}
                    />
                    <Controller
                      name={`categories.${index}.prefix`}
                      control={control}
                      rules={{ required: 'Prefix is required', maxLength: 10, pattern: { value: /^[A-Z0-9]+$/, message: 'Uppercase letters and numbers only' } }}
                      render={({ field }) => (
                        <Input {...field} placeholder="PRF" className="font-mono bg-transparent border-none focus:ring-0 p-0 w-20 uppercase" maxLength={10} />
                      )}
                    />
                    <Badge variant="outline" size="sm" className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: watch(`categories.${index}.color`) || '#6366F1' }} />
                      {watch(`categories.${index}.depreciationMethod`) || 'straight_line'}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => removeCategory(index)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Controller
                      name={`categories.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Description" error={field.error} className="md:col-span-2">
                          <Input {...field} placeholder="Category description" />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`categories.${index}.icon`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Icon" error={field.error} hint="Lucide icon name">
                          <Input {...field} placeholder="laptop" />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`categories.${index}.color`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Color" error={field.error}>
                          <div className="flex items-center gap-2">
                            <input type="color" value={field.value} onChange={(e) => field.onChange(e.target.value)} className="w-10 h-10 rounded border-none cursor-pointer" />
                            <Input {...field} className="font-mono uppercase flex-1" />
                          </div>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`categories.${index}.depreciationMethod`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Depreciation Method" error={field.error}>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                            <SelectContent>
                              {DEPRECIATION_METHODS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`categories.${index}.usefulLifeYears`}
                      control={control}
                      rules={{ min: 1, max: 50 }}
                      render={({ field }) => (
                        <FormField label="Useful Life (Years)" error={field.error}>
                          <Input {...field} type="number" min={1} max={50} step={1} />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`categories.${index}.salvageValuePercentage`}
                      control={control}
                      rules={{ min: 0, max: 100 }}
                      render={({ field }) => (
                        <FormField label="Salvage Value (%)" error={field.error}>
                          <Input {...field} type="number" min={0} max={100} step={1} />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`categories.${index}.requiresAllocationApproval`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Require Allocation Approval" error={field.error} className="md:col-span-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                            <span className="font-medium text-neutral-900 dark:text-white">Require approval for asset allocation</span>
                          </label>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`categories.${index}.allocatableRoles`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Allocatable Roles" error={field.error} className="md:col-span-2">
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
                      name={`categories.${index}.sortOrder`}
                      control={control}
                      rules={{ min: 0 }}
                      render={({ field }) => (
                        <FormField label="Sort Order" error={field.error}>
                          <Input {...field} type="number" min={0} step={1} />
                        </FormField>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}

            <Button variant="outline" onClick={addDefaultCategory} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </SectionCard>
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags" className="space-y-6">
          <SectionCard
            title="Asset Tag Configuration"
            description="Configure the automatic asset tag generation pattern"
            icon={<Tag className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Controller
                name="tagConfig.prefix"
                control={control}
                rules={{ required: 'Prefix is required', maxLength: 10, pattern: { value: /^[A-Z0-9]+$/, message: 'Uppercase letters and numbers only' } }}
                render={({ field }) => (
                  <FormField label="Prefix" required error={field.error}>
                    <Input {...field} placeholder="AST" className="uppercase" maxLength={10} />
                  </FormField>
                )}
              />
              <Controller
                name="tagConfig.separator"
                control={control}
                rules={{ maxLength: 3 }}
                render={({ field }) => (
                  <FormField label="Separator" error={field.error}>
                    <Input {...field} placeholder="-" maxLength={3} />
                  </FormField>
                )}
              />
              <Controller
                name="tagConfig.sequenceLength"
                control={control}
                rules={{ required: 'Sequence length is required', min: 3, max: 10 }}
                render={({ field }) => (
                  <FormField label="Sequence Length" required error={field.error}>
                    <Input {...field} type="number" min={3} max={10} step={1} />
                  </FormField>
                )}
              />
              <Controller
                name="tagConfig.currentSequence"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <FormField label="Current Sequence" error={field.error} hint="Next tag will use this number">
                    <Input {...field} type="number" min={0} step={1} />
                  </FormField>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <Controller
                name="tagConfig.includeCategoryCode"
                control={control}
                render={({ field }) => (
                  <FormField label="Include Category Code" error={field.error}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <span className="font-medium text-neutral-900 dark:text-white">Include category prefix in tag</span>
                    </label>
                  </FormField>
                )}
              />
              <Controller
                name="tagConfig.includeYear"
                control={control}
                render={({ field }) => (
                  <FormField label="Include Year" error={field.error}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <span className="font-medium text-neutral-900 dark:text-white">Include current year in tag</span>
                    </label>
                  </FormField>
                )}
              />
            </div>

            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mt-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm px-3 py-1.5">Preview</Badge>
                <code className="font-mono text-lg text-neutral-900 dark:text-white bg-transparent px-4 py-2">{generateTagExample()}</code>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Allocation Tab */}
        <TabsContent value="allocation" className="space-y-6">
          <SectionCard
            title="Allocation Rules"
            description="Define rules for automatic asset allocation based on role, department, or location"
            icon={<Shield className="w-5 h-5 text-indigo-600" />}
          >
            {ruleFields.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No allocation rules configured</p>
                <Button variant="outline" onClick={addDefaultRule}><Plus className="w-4 h-4 mr-2" />Add Rule</Button>
              </div>
            )}

            {ruleFields.map((field, index) => (
              <AccordionItem key={field.id} value={field.id} className="border-neutral-200 dark:border-neutral-700 mb-2">
                <AccordionTrigger className="flex items-center gap-3 py-3 px-0 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <Controller
                      name={`allocationRules.${index}.condition`}
                      control={control}
                      render={({ field }) => (
                        <Badge variant="outline" size="sm">{ALLOCATION_CONDITIONS.find(c => c.value === field.value)?.label || field.value}</Badge>
                      )}
                    />
                    <Controller
                      name={`allocationRules.${index}.conditionValue`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Value" className="font-medium bg-transparent border-none focus:ring-0 p-0 w-32" />
                      )}
                    />
                    <Controller
                      name={`allocationRules.${index}.categoryId`}
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value} className="w-40">
                          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                          <SelectContent>
                            {categoryFields.map((c, i) => (
                              <SelectItem key={c.id} value={c.id}>{watch(`categories.${i}.name`) || `Category ${i + 1}`}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeRule(index)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Controller
                      name={`allocationRules.${index}.condition`}
                      control={control}
                      rules={{ required: 'Condition is required' }}
                      render={({ field }) => (
                        <FormField label="Condition" required error={field.error}>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                            <SelectContent>
                              {ALLOCATION_CONDITIONS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`allocationRules.${index}.conditionValue`}
                      control={control}
                      rules={{ required: 'Condition value is required' }}
                      render={({ field }) => (
                        <FormField label="Condition Value" required error={field.error} hint="Role name, department, employee ID, or location">
                          <Input {...field} placeholder="MANAGER" />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`allocationRules.${index}.categoryId`}
                      control={control}
                      rules={{ required: 'Category is required' }}
                      render={({ field }) => (
                        <FormField label="Asset Category" required error={field.error}>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                            <SelectContent>
                              {categoryFields.map((c, i) => (
                                <SelectItem key={c.id} value={c.id}>{watch(`categories.${i}.name`) || `Category ${i + 1}`}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`allocationRules.${index}.maxQuantity`}
                      control={control}
                      rules={{ required: 'Max quantity is required', min: 1, max: 100 }}
                      render={({ field }) => (
                        <FormField label="Max Quantity" required error={field.error}>
                          <Input {...field} type="number" min={1} max={100} step={1} />
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`allocationRules.${index}.requiresApproval`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Requires Approval" error={field.error} className="md:col-span-2">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                            <span className="font-medium text-neutral-900 dark:text-white">Require approval for allocation</span>
                          </label>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`allocationRules.${index}.approverRoles`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Approver Roles" error={field.error} className="md:col-span-2">
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
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}

            <Button variant="outline" onClick={addDefaultRule} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Allocation Rule
            </Button>
          </SectionCard>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <SectionCard
            title="Maintenance & Audit Settings"
            description="Configure maintenance tracking and asset audit schedules"
            icon={<Wrench className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Controller
                name="defaultWarrantyMonths"
                control={control}
                rules={{ min: 0, max: 120 }}
                render={({ field }) => (
                  <FormField label="Default Warranty (Months)" error={field.error}>
                    <Input {...field} type="number" min={0} max={120} step={1} />
                  </FormField>
                )}
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              {[
                { key: 'enableMaintenanceTracking', label: 'Enable Maintenance Tracking', description: 'Track asset maintenance schedules and history' },
                { key: 'enableAssetAudit', label: 'Enable Asset Audit', description: 'Schedule periodic physical asset audits' },
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
              name="maintenanceReminderDays"
              control={control}
              render={({ field }) => (
                <FormField label="Maintenance Reminder Days" error={field.error} hint="Days before due date (comma-separated)" className="max-w-md" disabled={!watch('enableMaintenanceTracking')}>
                  <Input {...field} placeholder="30, 7, 1" disabled={!watch('enableMaintenanceTracking')} />
                </FormField>
              )}
            />

            <Controller
              name="auditFrequencyMonths"
              control={control}
              rules={{ min: 1, max: 24 }}
              render={({ field }) => (
                <FormField label="Audit Frequency (Months)" error={field.error} className="max-w-xs" disabled={!watch('enableAssetAudit')}>
                  <Input {...field} type="number" min={1} max={24} step={1} disabled={!watch('enableAssetAudit')} />
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

      {assetsSettings && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5" />
          <span>
            Last updated: {new Date(assetsSettings.updatedAt).toLocaleString()} by {assetsSettings.updatedBy}
          </span>
        </div>
      )}
    </form>
  );
};

export default AssetsSection;