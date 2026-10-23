/**
 * @file DocumentsSection.tsx
 * @description Documents & Templates Settings with letter templates and digital signatures.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FileText,
  PenTool,
  Signature,
  Save,
  RotateCcw,
  Loader2,
  AlertCircle,
  Info,
  Plus,
  Trash2,
  Eye,
  Copy,
  Download,
  Upload,
  Shield,
  Globe,
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
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/ui/Toast';
import { useSettingsContext } from './SettingsLayout';
import {
  useGetDocumentsSettingsQuery,
  useUpdateDocumentsSettingsMutation,
} from '../api/settingsApi';
import {
  updateDocumentsSettingsSchema,
  type DocumentsSettingsFormData,
} from '../schemas/settings.schemas';
import type { DocumentsSettings, DocumentTemplate, DigitalSignatureConfig, TemplateType } from '../types/settings.types';

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

const TEMPLATE_TYPES: { value: TemplateType; label: string; icon: string }[] = [
  { value: 'offer_letter', label: 'Offer Letter', icon: 'file-text' },
  { value: 'appointment_letter', label: 'Appointment Letter', icon: 'file-check' },
  { value: 'relieving_letter', label: 'Relieving Letter', icon: 'file-minus' },
  { value: 'experience_letter', label: 'Experience Letter', icon: 'award' },
  { value: 'nda', label: 'NDA', icon: 'shield' },
  { value: 'employment_contract', label: 'Employment Contract', icon: 'file-signature' },
  { value: 'promotion_letter', label: 'Promotion Letter', icon: 'trending-up' },
  { value: 'transfer_letter', label: 'Transfer Letter', icon: 'arrow-right-left' },
  { value: 'warning_letter', label: 'Warning Letter', icon: 'alert-triangle' },
  { value: 'custom', label: 'Custom Template', icon: 'plus' },
];

const COMMON_VARIABLES = [
  '{{employee_name}}', '{{employee_code}}', '{{employee_email}}', '{{employee_phone}}',
  '{{joining_date}}', '{{designation}}', '{{department}}', '{{reporting_manager}}',
  '{{company_name}}', '{{company_address}}', '{{company_website}}', '{{company_phone}}',
  '{{salary_ctc}}', '{{salary_basic}}', '{{salary_hra}}', '{{salary_allowances}}',
  '{{date}}', '{{current_date}}', '{{financial_year}}',
];

export const DocumentsSection: React.FC = () => {
  const { markDirty, markClean, isSaving } = useSettingsContext();
  const { success, error: toastError } = useToast();

  const form = useForm<DocumentsSettingsFormData>({
    resolver: zodResolver(updateDocumentsSettingsSchema),
    defaultValues: {
      templates: [],
      digitalSignature: {
        enabled: false,
        provider: 'internal',
        autoSendOnGenerate: true,
        requireAllSignatures: true,
        expiryDays: 30,
        reminderDays: [7, 3, 1],
      },
      defaultTemplateIds: {},
      documentStorage: 'local',
    },
    mode: 'onChange',
  });

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors, isDirty, isSubmitting, isValid } } = form;
  const { fields: templateFields, append: appendTemplate, remove: removeTemplate } = useFieldArray({ control, name: 'templates' });

  // API hooks
  const { data: documentsSettings, isLoading, error: fetchError, refetch } = useGetDocumentsSettingsQuery();
  const [updateDocumentsSettings] = useUpdateDocumentsSettingsMutation();

  useEffect(() => {
    if (documentsSettings && !isLoading) {
      reset({
        templates: documentsSettings.templates,
        digitalSignature: documentsSettings.digitalSignature,
        defaultTemplateIds: documentsSettings.defaultTemplateIds,
        documentStorage: documentsSettings.documentStorage,
      });
      markClean('documents');
    }
  }, [documentsSettings, isLoading, reset, markClean]);

  useEffect(() => {
    if (isDirty) {
      markDirty('documents');
    } else {
      markClean('documents');
    }
  }, [isDirty, markDirty, markClean]);

  const onSubmit = useCallback(async (data: DocumentsSettingsFormData) => {
    try {
      await updateDocumentsSettings(data).unwrap();
      markClean('documents');
      success('Document settings updated successfully', 'Settings Saved');
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to update document settings', 'Save Failed');
    }
  }, [updateDocumentsSettings, markClean, success, toastError]);

  const handleReset = useCallback(() => {
    if (documentsSettings) refetch();
  }, [documentsSettings, refetch]);

  const addDefaultTemplate = useCallback(() => {
    appendTemplate({
      name: `Template ${templateFields.length + 1}`,
      type: 'custom',
      subject: '',
      content: '',
      variables: [],
      isDefault: templateFields.length === 0,
      isActive: true,
      version: 1,
    });
  }, [templateFields.length, appendTemplate]);

  const insertVariable = useCallback((variable: string, index: number) => {
    const fieldName = `templates.${index}.content`;
    const currentContent = watch(fieldName) || '';
    const cursorPosition = 0; // Would need textarea ref for actual cursor position
    setValue(fieldName, currentContent + variable);
  }, [setValue, watch]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    );
  }

  if (fetchError) {
    return (
      <ErrorDisplay
        title="Failed to Load Document Settings"
        error={fetchError}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 mb-6">
          <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <FileText className="w-4 h-4 mr-2 inline" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="signatures" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Signature className="w-4 h-4 mr-2 inline" />
            Digital Signatures
          </TabsTrigger>
          <TabsTrigger value="storage" className="data-[state=active]:bg-white data-[state=active]:dark:bg-neutral-900 data-[state=active]:shadow-sm">
            <Globe className="w-4 h-4 mr-2 inline" />
            Storage
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <SectionCard
            title="Document Templates"
            description="Create and manage document templates with variable placeholders"
            icon={<FileText className="w-5 h-5 text-indigo-600" />}
          >
            {templateFields.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">No templates configured</p>
                <Button variant="outline" onClick={addDefaultTemplate}><Plus className="w-4 h-4 mr-2" />Add Template</Button>
              </div>
            )}

            <Accordion type="single" collapsible className="w-full">
              {templateFields.map((field, index) => (
                <AccordionItem key={field.id} value={field.id} className="border-neutral-200 dark:border-neutral-700 mb-2">
                <AccordionTrigger className="flex items-center gap-3 py-3 px-0 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <Controller
                    name={`templates.${index}.isActive`}
                    control={control}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} className="shrink-0" />
                    )}
                  />
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <Controller
                      name={`templates.${index}.isDefault`}
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="defaultTemplate" checked={field.value} onChange={() => field.onChange(true)} className="w-4 h-4 text-indigo-600 border-neutral-300 focus:ring-indigo-500" />
                          <Badge variant={field.value ? 'default' : 'outline'} size="sm">Default</Badge>
                        </label>
                      )}
                    />
                    <Controller
                      name={`templates.${index}.name`}
                      control={control}
                      rules={{ required: 'Name is required' }}
                      render={({ field }) => (
                        <Input {...field} placeholder="Template Name" className="font-medium bg-transparent border-none focus:ring-0 p-0" />
                      )}
                    />
                    <Controller
                      name={`templates.${index}.type`}
                      control={control}
                      render={({ field }) => (
                        <Badge variant="outline" size="sm">
                          {TEMPLATE_TYPES.find(t => t.value === field.value)?.label || field.value}
                        </Badge>
                      )}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeTemplate(index)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Controller
                      name={`templates.${index}.type`}
                      control={control}
                      rules={{ required: 'Type is required' }}
                      render={({ field }) => (
                        <FormField label="Template Type" required error={field.error}>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                              {TEMPLATE_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormField>
                      )}
                    />
                    <Controller
                      name={`templates.${index}.subject`}
                      control={control}
                      rules={{ required: 'Subject is required' }}
                      render={({ field }) => (
                        <FormField label="Subject" required error={field.error}>
                          <Input {...field} placeholder="Offer Letter for {{employee_name}}" />
                        </FormField>
                      )}
                    />
                  </div>

                  <Controller
                    name={`templates.${index}.content`}
                    control={control}
                    rules={{ required: 'Content is required' }}
                    render={({ field }) => (
                      <FormField label="Content (HTML)" required error={field.error} className="mt-4">
                        <div className="mb-2 flex flex-wrap gap-1">
                          {COMMON_VARIABLES.map((v) => (
                            <Button key={v} type="button" variant="ghost" size="sm" className="px-2 py-1 text-xs" onClick={() => insertVariable(v, index)}>
                              {v}
                            </Button>
                          ))}
                        </div>
                        <Textarea
                          {...field}
                          placeholder="<p>Dear {{employee_name}},</p><p>We are pleased to offer you...</p>"
                          rows={10}
                          className="font-mono text-sm"
                        />
                      </FormField>
                    )}
                  />

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <Controller
                      name={`templates.${index}.variables`}
                      control={control}
                      render={({ field }) => (
                        <FormField label="Available Variables" error={field.error} className="md:col-span-3">
                          <div className="flex flex-wrap gap-1">
                            {(field.value as string[]).map((v, i) => (
                              <Badge key={i} variant="outline" size="sm" className="flex items-center gap-1">
                                {v}
                                <button type="button" onClick={() => field.onChange(field.value.filter((_: any, idx: number) => idx !== i))} className="ml-1 hover:text-rose-500">×</button>
                              </Badge>
                            ))}
                            <Button type="button" variant="ghost" size="sm" onClick={() => {
                              const newVar = prompt('Enter variable name (e.g., {{custom_field}}):');
                              if (newVar) field.onChange([...(field.value as string[]), newVar]);
                            }}>
                              <Plus className="w-3.5 h-3.5 mr-1" />
                              Add Variable
                            </Button>
                          </div>
                        </FormField>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
            </Accordion>

            <Button variant="outline" onClick={addDefaultTemplate} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Template
            </Button>
          </SectionCard>

          <SectionCard
            title="Default Templates by Type"
            description="Set the default template for each document type"
            icon={<FileText className="w-5 h-5 text-indigo-600" />}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TEMPLATE_TYPES.filter(t => t.value !== 'custom').map((type) => (
                <Controller
                  key={type.value}
                  name={`defaultTemplateIds.${type.value}`}
                  control={control}
                  render={({ field }) => (
                    <FormField label={type.label} error={field.error}>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select default" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {templateFields.map((t, i) => (
                            <SelectItem key={t.id} value={t.id}>{watch(`templates.${i}.name`) || `Template ${i + 1}`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  )}
                />
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* Digital Signatures Tab */}
        <TabsContent value="signatures" className="space-y-6">
          <SectionCard
            title="Digital Signature Configuration"
            description="Configure digital signature provider and settings"
            icon={<Signature className="w-5 h-5 text-indigo-600" />}
          >
            <Controller
              name="digitalSignature.enabled"
              control={control}
              render={({ field }) => (
                <FormField label="Enable Digital Signatures" error={field.error} className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                    <span className="font-medium text-neutral-900 dark:text-white">Enable digital signature workflow</span>
                  </label>
                </FormField>
              )}
            />

            <div style={{ opacity: watch('digitalSignature.enabled') ? 1 : 0.5 }}>
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="digitalSignature.provider"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Signature Provider" error={field.error} disabled={!watch('digitalSignature.enabled')}>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watch('digitalSignature.enabled')}>
                        <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal (Built-in)</SelectItem>
                          <SelectItem value="docusign">DocuSign</SelectItem>
                          <SelectItem value="adobe_sign">Adobe Sign</SelectItem>
                          <SelectItem value="hellosign">HelloSign (Dropbox Sign)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4" id="provider-config">
                {watch('digitalSignature.provider') === 'internal' ? null : (
                  <>
                    <Controller
                      name="digitalSignature.apiKey"
                      control={control}
                      render={({ field }) => (
                        <FormField label="API Key" error={field.error} hint="Stored encrypted">
                          <Input {...field} type="password" placeholder="Enter API key" disabled={!watch('digitalSignature.enabled') || watch('digitalSignature.provider') === 'internal'} />
                        </FormField>
                      )}
                    />
                    <Controller
                      name="digitalSignature.apiSecret"
                      control={control}
                      render={({ field }) => (
                        <FormField label="API Secret" error={field.error} hint="Stored encrypted">
                          <Input {...field} type="password" placeholder="Enter API secret" disabled={!watch('digitalSignature.enabled') || watch('digitalSignature.provider') === 'internal'} />
                        </FormField>
                      )}
                    />
                    <Controller
                      name="digitalSignature.webhookUrl"
                      control={control}
                      render={({ field }) => (
                        <FormField label="Webhook URL" error={field.error} className="md:col-span-2" disabled={!watch('digitalSignature.enabled') || watch('digitalSignature.provider') === 'internal'}>
                          <Input {...field} placeholder="https://your-domain.com/webhook/docusign" />
                        </FormField>
                      )}
                    />
                  </>
                )}
              </div>

              <Separator className="my-6" />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Controller
                  name="digitalSignature.autoSendOnGenerate"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Auto-send on Generate" error={field.error} disabled={!watch('digitalSignature.enabled')}>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={!watch('digitalSignature.enabled')} />
                        <span className="font-medium text-neutral-900 dark:text-white">Automatically send for signature</span>
                      </label>
                    </FormField>
                  )}
                />
                <Controller
                  name="digitalSignature.requireAllSignatures"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Require All Signatures" error={field.error} disabled={!watch('digitalSignature.enabled')}>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={!watch('digitalSignature.enabled')} />
                        <span className="font-medium text-neutral-900 dark:text-white">All parties must sign</span>
                      </label>
                    </FormField>
                  )}
                />
                <Controller
                  name="digitalSignature.expiryDays"
                  control={control}
                  rules={{ min: 1, max: 365 }}
                  render={({ field }) => (
                    <FormField label="Expiry (Days)" error={field.error} disabled={!watch('digitalSignature.enabled')}>
                      <Input {...field} type="number" min={1} max={365} step={1} disabled={!watch('digitalSignature.enabled')} />
                    </FormField>
                  )}
                />
                <Controller
                  name="digitalSignature.reminderDays"
                  control={control}
                  render={({ field }) => (
                    <FormField label="Reminder Days" error={field.error} hint="Comma-separated" disabled={!watch('digitalSignature.enabled')}>
                      <Input {...field} placeholder="7, 3, 1" disabled={!watch('digitalSignature.enabled')} />
                    </FormField>
                  )}
                />
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage" className="space-y-6">
          <SectionCard
            title="Document Storage"
            description="Configure where generated documents are stored"
            icon={<Globe className="w-5 h-5 text-indigo-600" />}
          >
            <Controller
              name="documentStorage"
              control={control}
              render={({ field }) => (
                <FormField label="Storage Provider" error={field.error}>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="s3">AWS S3</SelectItem>
                      <SelectItem value="azure">Azure Blob Storage</SelectItem>
                      <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              )}
            />

            {watch('documentStorage') !== 'local' && (
              <div className="mt-4 space-y-4" id="storage-config">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Configure {watch('documentStorage').toUpperCase()} credentials</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Controller
                    name="storageConfig.bucket"
                    control={control}
                    render={({ field }) => (
                      <FormField label="Bucket/Container Name" error={field.error}>
                        <Input {...field} placeholder="my-documents-bucket" />
                      </FormField>
                    )}
                  />
                  <Controller
                    name="storageConfig.region"
                    control={control}
                    render={({ field }) => (
                      <FormField label="Region" error={field.error}>
                        <Input {...field} placeholder="us-east-1" />
                      </FormField>
                    )}
                  />
                  <Controller
                    name="storageConfig.accessKey"
                    control={control}
                    render={({ field }) => (
                      <FormField label="Access Key" error={field.error} hint="Stored encrypted">
                        <Input {...field} type="password" placeholder="Access Key ID" />
                      </FormField>
                    )}
                  />
                  <Controller
                    name="storageConfig.secretKey"
                    control={control}
                    render={({ field }) => (
                      <FormField label="Secret Key" error={field.error} hint="Stored encrypted">
                        <Input {...field} type="password" placeholder="Secret Access Key" />
                      </FormField>
                    )}
                  />
                </div>
              </div>
            )}
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

      {documentsSettings && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5" />
          <span>
            Last updated: {new Date(documentsSettings.updatedAt).toLocaleString()} by {documentsSettings.updatedBy}
          </span>
        </div>
      )}
    </form>
  );
};

export default DocumentsSection;