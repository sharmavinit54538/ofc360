/**
 * @file CompanySection.tsx
 * @description Company Settings section with full form validation, logo upload,
 * and real-time API integration using React Hook Form + Zod.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Palette,
  Image,
  Upload,
  X,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Textarea } from '@/shared/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Separator } from '@/shared/ui/Separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/Tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/Tooltip';
import { useToast } from '@/shared/ui/Toast';
import { useSettingsContext } from './SettingsLayout';
import {
  useGetCompanySettingsQuery,
  useLazyGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useUploadCompanyLogoMutation,
  useDeleteCompanyLogoMutation,
} from '../api/settingsApi';
import {
  updateCompanySettingsSchema,
  companyDetailsSchema,
  companyBrandingSchema,
  type CompanySettingsFormData,
} from '../schemas/settings.schemas';
import type { CompanySettings, CompanyBranding, CompanyDetails } from '../types/settings.types';
import { TIMEZONES, CURRENCIES, DATE_FORMATS, LANGUAGES } from '../types/settings.types';

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

const FormField: React.FC<{
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ label, error, hint, required, children, className }) => (
  <div className={cn('space-y-1.5', className)}>
    <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
      {label}
      {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
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

const ColorInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
}> = ({ value, onChange, label, error }) => (
  <FormField label={label} error={error}>
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg border border-neutral-300 dark:border-neutral-600 cursor-pointer hover:scale-105 transition-transform"
        aria-label={label}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="flex-1 font-mono text-sm uppercase"
        placeholder="#3B82F6"
        maxLength={7}
      />
    </div>
  </FormField>
);

// ==========================================
// Company Section Component
// ==========================================

export const CompanySection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { markDirty, markClean, isSaving } = useSettingsContext();
  const { success, error: toastError } = useToast();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [showBrandingColors, setShowBrandingColors] = useState(false);

  // Form setup
  const form = useForm<CompanySettingsFormData>({
    resolver: zodResolver(updateCompanySettingsSchema),
    defaultValues: {
      details: {
        legalName: '',
        displayName: '',
        registrationNumber: '',
        taxId: '',
        website: '',
        email: '',
        phone: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
      },
      branding: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        fontFamily: 'Inter',
      },
      timezone: 'UTC',
      currency: 'USD',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h',
      weekStartDay: 1,
      fiscalYearStart: 4,
      language: 'en',
    },
    mode: 'onChange',
  });

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors, isDirty, isSubmitting, isValid } } = form;

  // Watched values for dynamic updates
  const watchedDetails = watch('details');
  const watchedBranding = watch('branding');

  // API hooks
  const { data: companySettings, isLoading, error: fetchError, refetch } = useGetCompanySettingsQuery();
  const [updateCompanySettings] = useUpdateCompanySettingsMutation();
  const [uploadLogo] = useUploadCompanyLogoMutation();
  const [deleteLogo] = useDeleteCompanyLogoMutation();

  // Load settings into form
  useEffect(() => {
    if (companySettings && !isLoading) {
      const details = companySettings.details;
      const branding = companySettings.branding;

      reset({
        details: {
          legalName: details.legalName,
          displayName: details.displayName,
          registrationNumber: details.registrationNumber,
          taxId: details.taxId,
          website: details.website || '',
          email: details.email,
          phone: details.phone || '',
          address: details.address,
        },
        branding: {
          primaryColor: branding.primaryColor,
          secondaryColor: branding.secondaryColor,
          fontFamily: branding.fontFamily,
        },
        timezone: companySettings.timezone,
        currency: companySettings.currency,
        dateFormat: companySettings.dateFormat,
        timeFormat: companySettings.timeFormat,
        weekStartDay: companySettings.weekStartDay,
        fiscalYearStart: companySettings.fiscalYearStart,
        language: companySettings.language,
      });

      if (branding.logoUrl) {
        setLogoPreview(branding.logoUrl);
      }
      markClean('company');
    }
  }, [companySettings, isLoading, reset, markClean]);

  // Track dirty state
  useEffect(() => {
    if (isDirty) {
      markDirty('company');
    } else {
      markClean('company');
    }
  }, [isDirty, markDirty, markClean]);

  // Handle logo upload
  const handleLogoUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toastError('Please select an image file', 'Invalid File Type');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toastError('File size must be less than 5MB', 'File Too Large');
      return;
    }

    setLogoUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const result = await uploadLogo(formData).unwrap();
      setLogoPreview(result.url);
      setValue('branding.logoUrl', result.url);
      markDirty('company');
      success('Logo uploaded successfully', 'Upload Complete');
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to upload logo', 'Upload Failed');
    } finally {
      setLogoUploading(false);
    }
  }, [uploadLogo, setValue, markDirty, success, toastError]);

  const handleLogoDelete = useCallback(async () => {
    try {
      await deleteLogo().unwrap();
      setLogoPreview(null);
      setValue('branding.logoUrl', undefined);
      markDirty('company');
      success('Logo removed successfully');
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to remove logo', 'Remove Failed');
    }
  }, [deleteLogo, setValue, markDirty, success, toastError]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleLogoUpload(file);
  }, [handleLogoUpload]);

  // Handle form submit
  const onSubmit = useCallback(async (data: CompanySettingsFormData) => {
    try {
      const result = await updateCompanySettings(data).unwrap();
      reset(result);
      markClean('company');
      success('Company settings updated successfully', 'Settings Saved');
    } catch (err: any) {
      const details = err?.data?.details;
      if (details) {
        Object.entries(details).forEach(([field, messages]) => {
          form.setError(field as any, { type: 'server', message: (messages as string[])[0] });
        });
      }
      toastError(err?.data?.message || 'Failed to update company settings', 'Save Failed');
    }
  }, [updateCompanySettings, reset, markClean, success, toastError, form]);

  // Reset form to server values
  const handleReset = useCallback(() => {
    if (companySettings) {
      refetch();
    }
  }, [companySettings, refetch]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <SectionCard title="Loading..." icon={<Building2 className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<Palette className="w-5 h-5" />} />
        <SectionCard title="Loading..." icon={<Globe className="w-5 h-5" />} />
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
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 mb-6">
          <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Building2 className="w-4 h-4 mr-2 inline" />
            Details
          </TabsTrigger>
          <TabsTrigger value="branding" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Palette className="w-4 h-4 mr-2 inline" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="localization" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Globe className="w-4 h-4 mr-2 inline" />
            Localization
          </TabsTrigger>
        </TabsList>

        {/* Company Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <SectionCard
            title="Legal Information"
            description="Official company details used for legal documents and compliance"
            icon={<Building2 className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Controller
                name="details.legalName"
                control={control}
                rules={{ required: 'Legal name is required', maxLength: 200 }}
                render={({ field }) => (
                  <FormField label="Legal Name" required error={errors.details?.legalName?.message}>
                    <Input {...field} placeholder="Acme Corporation Inc." />
                  </FormField>
                )}
              />
              <Controller
                name="details.displayName"
                control={control}
                rules={{ required: 'Display name is required', maxLength: 200 }}
                render={({ field }) => (
                  <FormField label="Display Name" required error={errors.details?.displayName?.message}>
                    <Input {...field} placeholder="Acme Corp" />
                  </FormField>
                )}
              />
              <Controller
                name="details.registrationNumber"
                control={control}
                rules={{ required: 'Registration number is required', maxLength: 100 }}
                render={({ field }) => (
                  <FormField label="Registration Number" required error={errors.details?.registrationNumber?.message}>
                    <Input {...field} placeholder="CIN: U72900MH2020PTC123456" />
                  </FormField>
                )}
              />
              <Controller
                name="details.taxId"
                control={control}
                rules={{ required: 'Tax ID is required', maxLength: 100 }}
                render={({ field }) => (
                  <FormField label="Tax ID (GSTIN/EIN)" required error={errors.details?.taxId?.message}>
                    <Input {...field} placeholder="27AAACA1234A1Z5" />
                  </FormField>
                )}
              />
              <Controller
                name="details.website"
                control={control}
                rules={{ maxLength: 200, pattern: { value: /^https?:\/\/.+/, message: 'Invalid URL' } }}
                render={({ field }) => (
                  <FormField label="Website" error={errors.details?.website?.message} hint="Optional">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">https://</span>
                      <Input {...field} placeholder="acmecorp.com" className="pl-18" />
                    </div>
                  </FormField>
                )}
              />
              <Controller
                name="details.email"
                control={control}
                rules={{ required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } }}
                render={({ field }) => (
                  <FormField label="Official Email" required error={errors.details?.email?.message}>
                    <Input {...field} type="email" placeholder="legal@acmecorp.com" />
                  </FormField>
                )}
              />
              <Controller
                name="details.phone"
                control={control}
                rules={{ maxLength: 30 }}
                render={({ field }) => (
                  <FormField label="Phone" error={errors.details?.phone?.message} hint="Optional, include country code">
                    <Input {...field} type="tel" placeholder="+1 (555) 123-4567" />
                  </FormField>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Registered Address"
            description="Official registered address for legal and compliance purposes"
            icon={<MapPin className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Controller
                name="details.address.line1"
                control={control}
                rules={{ required: 'Address line 1 is required', maxLength: 200 }}
                render={({ field }) => (
                  <FormField label="Address Line 1" required error={errors.details?.address?.line1?.message}>
                    <Input {...field} placeholder="123 Business Park, Tower A" />
                  </FormField>
                )}
              />
              <Controller
                name="details.address.line2"
                control={control}
                rules={{ maxLength: 200 }}
                render={({ field }) => (
                  <FormField label="Address Line 2" error={errors.details?.address?.line2?.message} hint="Optional (suite, floor, etc.)">
                    <Input {...field} placeholder="Floor 10, Suite 1001" />
                  </FormField>
                )}
              />
              <Controller
                name="details.address.city"
                control={control}
                rules={{ required: 'City is required', maxLength: 100 }}
                render={({ field }) => (
                  <FormField label="City" required error={errors.details?.address?.city?.message}>
                    <Input {...field} placeholder="Mumbai" />
                  </FormField>
                )}
              />
              <Controller
                name="details.address.state"
                control={control}
                rules={{ required: 'State/Province is required', maxLength: 100 }}
                render={({ field }) => (
                  <FormField label="State / Province" required error={errors.details?.address?.state?.message}>
                    <Input {...field} placeholder="Maharashtra" />
                  </FormField>
                )}
              />
              <Controller
                name="details.address.postalCode"
                control={control}
                rules={{ required: 'Postal code is required', maxLength: 20 }}
                render={({ field }) => (
                  <FormField label="Postal Code" required error={errors.details?.address?.postalCode?.message}>
                    <Input {...field} placeholder="400001" />
                  </FormField>
                )}
              />
              <Controller
                name="details.address.country"
                control={control}
                rules={{ required: 'Country is required', maxLength: 100 }}
                render={({ field }) => (
                  <FormField label="Country" required error={errors.details?.address?.country?.message}>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {['India', 'United States', 'United Kingdom', 'Singapore', 'UAE', 'Australia', 'Canada', 'Germany', 'France', 'Japan'].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
            </div>
          </SectionCard>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <SectionCard
            title="Logo & Favicon"
            description="Upload your company logo and favicon for brand consistency"
            icon={<Image className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Company Logo
                    <span className="text-rose-500 ml-1" aria-hidden="true">*</span>
                  </span>
                  <div className="relative">
                    <div className={cn(
                      'aspect-square rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600',
                      'flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-800',
                      logoPreview ? 'border-transparent' : ''
                    )}>
                      {logoPreview ? (
                        <>
                          <img
                            src={logoPreview}
                            alt="Company logo"
                            className="w-full h-full object-cover"
                          />
                          {!logoUploading && (
                            <button
                              type="button"
                              onClick={handleLogoDelete}
                              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-rose-500/90 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
                              aria-label="Remove logo"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-neutral-500 dark:text-neutral-400 p-8">
                          <Upload className="w-8 h-8" />
                          <span className="text-sm font-medium">Click or drag to upload</span>
                          <span className="text-xs">PNG, JPG up to 5MB</span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/svg+xml"
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={logoUploading}
                          />
                        </div>
                      )}
                      {logoUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Favicon
                  </span>
                  <div className={cn(
                    'aspect-square w-20 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600',
                    'flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-800'
                  )}>
                    <div className="flex flex-col items-center gap-2 text-neutral-500 dark:text-neutral-400 p-4">
                      <Image className="w-6 h-6 opacity-50" />
                      <span className="text-xs">Coming Soon</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Favicon upload coming in next release
                  </p>
                </label>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Brand Colors"
            description="Primary and secondary colors used throughout the application"
            icon={<Palette className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="branding.primaryColor"
                control={control}
                rules={{ required: 'Primary color is required' }}
                render={({ field }) => (
                  <ColorInput
                    label="Primary Color"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.branding?.primaryColor?.message}
                  />
                )}
              />
              <Controller
                name="branding.secondaryColor"
                control={control}
                rules={{ required: 'Secondary color is required' }}
                render={({ field }) => (
                  <ColorInput
                    label="Secondary Color"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.branding?.secondaryColor?.message}
                  />
                )}
              />
            </div>

            <Controller
              name="branding.fontFamily"
              control={control}
              rules={{ required: 'Font family is required' }}
              render={({ field }) => (
                <FormField label="Font Family" required error={errors.branding?.fontFamily?.message} hint="CSS font-family value">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Inter', 'Roboto', 'Open Sans', 'Poppins', 'Montserrat', 'Nunito', 'DM Sans', 'Plus Jakarta Sans', 'System UI'].map((font) => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}
            />
          </SectionCard>
        </TabsContent>

        {/* Localization Tab */}
        <TabsContent value="localization" className="space-y-6">
          <SectionCard
            title="Timezone & Currency"
            description="Configure default timezone and currency for the organization"
            icon={<Globe className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Controller
                name="timezone"
                control={control}
                rules={{ required: 'Timezone is required' }}
                render={({ field }) => (
                  <FormField label="Timezone" required error={errors.timezone?.message}>
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
              <Controller
                name="currency"
                control={control}
                rules={{ required: 'Currency is required' }}
                render={({ field }) => (
                  <FormField label="Currency" required error={errors.currency?.message}>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.code} - {c.name} ({c.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
              <Controller
                name="dateFormat"
                control={control}
                rules={{ required: 'Date format is required' }}
                render={({ field }) => (
                  <FormField label="Date Format" required error={errors.dateFormat?.message}>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {DATE_FORMATS.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
              <Controller
                name="timeFormat"
                control={control}
                rules={{ required: 'Time format is required' }}
                render={({ field }) => (
                  <FormField label="Time Format" required error={errors.timeFormat?.message}>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Regional Settings"
            description="Week start, fiscal year, and language preferences"
            icon={<Calendar className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Controller
                name="weekStartDay"
                control={control}
                rules={{ required: 'Week start day is required' }}
                render={({ field }) => (
                  <FormField label="Week Starts On" required error={errors.weekStartDay?.message}>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={0}>Sunday</SelectItem>
                        <SelectItem value={1}>Monday</SelectItem>
                        <SelectItem value={6}>Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
              <Controller
                name="fiscalYearStart"
                control={control}
                rules={{ required: 'Fiscal year start is required' }}
                render={({ field }) => (
                  <FormField label="Fiscal Year Starts" required error={errors.fiscalYearStart?.message}>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <SelectItem key={month} value={month}>
                            {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
              />
              <Controller
                name="language"
                control={control}
                rules={{ required: 'Language is required' }}
                render={({ field }) => (
                  <FormField label="Default Language" required error={errors.language?.message}>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
                        ))}
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
      {companySettings && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5" />
          <span>
            Last updated: {new Date(companySettings.updatedAt).toLocaleString()} by {companySettings.updatedBy}
          </span>
        </div>
      )}
    </form>
  );
};

export default CompanySection;