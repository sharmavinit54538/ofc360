/**
 * @file DocumentGeneratorPage.tsx
 * @description Master interactive workspace for the AI Hub Document Generator.
 * Connects directly to FastAPI backend endpoints:
 * - GET /api/v1/ai-hub/document-generator
 * - GET /api/v1/ai-hub/document-generator/templates
 * - POST /api/v1/ai-hub/document-generator/preview (debounced ~600ms)
 * - POST /api/v1/ai-hub/document-generator/generate
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Send,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/shared/ui/Toast';
import { Button } from '@/shared/ui/Button';
import {
  useGetDocumentGeneratorOverviewQuery,
  useGetDocumentTemplatesQuery,
  usePreviewDocumentMutation,
  useGenerateDocumentMutation,
  extractApiErrorMessage,
} from '../api/documentGeneratorApi';
import { DocumentGeneratorHeader } from '../components/DocumentGeneratorHeader';
import { TemplateSelector } from '../components/TemplateSelector';
import { DocumentVariablesForm } from '../components/DocumentVariablesForm';
import { LivePreviewPane } from '../components/LivePreviewPane';
import { MissingPlaceholdersModal } from '../components/MissingPlaceholdersModal';
import { GeneratedDocumentCard } from '../components/GeneratedDocumentCard';
import { RecentDocumentsModal } from '../components/RecentDocumentsModal';
import { cleanPlaceholderKey } from '../utils/documentGeneratorUtils';
import type {
  DocumentTemplateItem,
  DocumentFormat,
  DocumentPreviewResponse,
  DocumentGenerateResponse,
} from '../types/documentGenerator.types';

export const DocumentGeneratorPage: React.FC = () => {
  const toast = useToast();

  // RTK Query hooks
  const {
    data: overview,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
  } = useGetDocumentGeneratorOverviewQuery();

  const {
    data: templatesData,
    isLoading: isTemplatesLoading,
    error: templatesError,
    refetch: refetchTemplates,
  } = useGetDocumentTemplatesQuery();

  const [previewDocument, { isLoading: isPreviewSubmitting }] = usePreviewDocumentMutation();
  const [generateDocument, { isLoading: isGenerating }] = useGenerateDocumentMutation();

  // Form & Selection State
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplateItem | null>(null);
  const [title, setTitle] = useState<string>('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [format, setFormat] = useState<DocumentFormat>('pdf');
  const [variables, setVariables] = useState<Record<string, string>>({});

  // Preview & Generation State
  const [preview, setPreview] = useState<DocumentPreviewResponse | null>(null);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<DocumentGenerateResponse | null>(null);

  // Modals & Error State
  const [showMissingModal, setShowMissingModal] = useState<boolean>(false);
  const [showRecentModal, setShowRecentModal] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const templates = templatesData?.templates || [];

  // Default to selecting the first template once templates load if none selected
  useEffect(() => {
    if (!selectedTemplate && templates.length > 0) {
      handleSelectTemplate(templates[0]);
    }
  }, [templates, selectedTemplate]);

  /**
   * Triggers the /preview mutation with current variables.
   */
  const triggerPreview = useCallback(
    async (templateId: string, currentVars: Record<string, unknown>) => {
      setPreviewError(null);
      try {
        const response = await previewDocument({
          templateId,
          variables: currentVars,
        }).unwrap();
        setPreview(response);
      } catch (err: unknown) {
        const msg = extractApiErrorMessage(err, 'Failed to update live preview');
        setPreviewError(msg);
      } finally {
        setIsDebouncing(false);
      }
    },
    [previewDocument]
  );

  /**
   * Handles template selection: resets variables and triggers initial preview.
   */
  const handleSelectTemplate = useCallback(
    (template: DocumentTemplateItem) => {
      setSelectedTemplate(template);
      setGeneratedDocument(null);
      setTitleError(null);
      setFieldErrors({});
      setGeneralError(null);

      // Default title
      const today = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());
      setTitle(`${template.name} - ${today}`);

      // Initialize empty variables for template placeholders
      const initVars: Record<string, string> = {};
      (template.placeholders || []).forEach((p) => {
        const key = cleanPlaceholderKey(p);
        initVars[key] = '';
      });
      setVariables(initVars);

      // Instant preview on template change
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      setIsDebouncing(true);
      triggerPreview(template.templateId, initVars);
    },
    [triggerPreview]
  );

  /**
   * Handles variable changes with debounced (~600ms) preview updates.
   */
  const handleVariableChange = (key: string, value: string) => {
    const updated = { ...variables, [key]: value };
    setVariables(updated);

    // Clear field-level error on edit
    if (fieldErrors[key]) {
      const nextErrors = { ...fieldErrors };
      delete nextErrors[key];
      setFieldErrors(nextErrors);
    }

    if (!selectedTemplate) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsDebouncing(true);
    debounceTimerRef.current = setTimeout(() => {
      triggerPreview(selectedTemplate.templateId, updated);
    }, 600);
  };

  /**
   * Resets all variable fields.
   */
  const handleClearVariables = () => {
    if (!selectedTemplate) return;
    const cleared: Record<string, string> = {};
    (selectedTemplate.placeholders || []).forEach((p) => {
      cleared[cleanPlaceholderKey(p)] = '';
    });
    setVariables(cleared);
    setFieldErrors({});

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setIsDebouncing(true);
    triggerPreview(selectedTemplate.templateId, cleared);
  };

  /**
   * Performs the final POST /generate API call.
   */
  const executeGeneration = async () => {
    if (!selectedTemplate) return;
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setTitleError('Document title is required');
      return;
    }

    setShowMissingModal(false);
    setGeneralError(null);
    setFieldErrors({});

    try {
      const result = await generateDocument({
        templateId: selectedTemplate.templateId,
        title: cleanTitle,
        variables,
        format,
      }).unwrap();

      setGeneratedDocument(result);
      toast.success(
        `"${result.title}" (${result.format.toUpperCase()}) was generated successfully.`,
        'Document Generated'
      );
      refetchOverview();
    } catch (err: unknown) {
      const msg = extractApiErrorMessage(err, 'Failed to generate document');
      setGeneralError(msg);
      toast.error(msg, 'Generation Failed');

      // Map 422 field errors if present
      if (err && typeof err === 'object' && 'data' in err) {
        const data = (err as { data?: any }).data;
        if (data?.errors && Array.isArray(data.errors)) {
          const mapped: Record<string, string> = {};
          data.errors.forEach((e: { field?: string; message: string }) => {
            if (e.field) mapped[e.field] = e.message;
          });
          setFieldErrors(mapped);
        }
      }
    }
  };

  /**
   * Validates form and opens confirmation modal if placeholders are missing.
   */
  const handleGenerateClick = () => {
    if (!selectedTemplate || isGenerating) return;

    if (!title.trim()) {
      setTitleError('Document title is required');
      return;
    }
    setTitleError(null);

    const missing = preview?.missingPlaceholders || [];
    if (missing.length > 0) {
      setShowMissingModal(true);
    } else {
      executeGeneration();
    }
  };

  /**
   * Resets workspace to generate another document.
   */
  const handleGenerateAnother = () => {
    setGeneratedDocument(null);
    if (selectedTemplate) {
      handleSelectTemplate(selectedTemplate);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Hero Header Banner */}
      <DocumentGeneratorHeader
        overview={overview}
        isLoading={isOverviewLoading}
        onOpenRecent={() => setShowRecentModal(true)}
      />

      {/* General Error Banner */}
      {generalError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-xs flex items-center justify-between gap-3 animate-in fade-in-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="font-medium">{generalError}</span>
          </div>
          <button
            type="button"
            onClick={() => setGeneralError(null)}
            className="text-[11px] underline hover:no-underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success Generated Document Card */}
      {generatedDocument && (
        <div className="animate-in fade-in-50 zoom-in-95">
          <GeneratedDocumentCard
            document={generatedDocument}
            onGenerateAnother={handleGenerateAnother}
          />
        </div>
      )}

      {/* Workspace Grid: Left Controls (1/2) vs Right Preview (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Template Controls (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6 bg-white dark:bg-[#181818] p-5 sm:p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          {/* 1. Template Picker */}
          <TemplateSelector
            templates={templates}
            selectedTemplateId={selectedTemplate?.templateId || null}
            onSelectTemplate={handleSelectTemplate}
            isLoading={isTemplatesLoading}
            error={templatesError}
            onRetry={refetchTemplates}
          />

          {/* 2 & 3. Document Variables & Settings Form */}
          {selectedTemplate && (
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 animate-in fade-in-50">
              <DocumentVariablesForm
                template={selectedTemplate}
                title={title}
                onTitleChange={(val) => {
                  setTitle(val);
                  if (titleError) setTitleError(null);
                }}
                titleError={titleError}
                format={format}
                onFormatChange={setFormat}
                variables={variables}
                onVariableChange={handleVariableChange}
                onClearVariables={handleClearVariables}
                fieldErrors={fieldErrors}
              />

              {/* Missing Placeholders Indicator Warning in Form */}
              {preview?.missingPlaceholders && preview.missingPlaceholders.length > 0 && (
                <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong>{preview.missingPlaceholders.length} variable{preview.missingPlaceholders.length === 1 ? '' : 's'} missing.</strong>{' '}
                    Generating will leave raw tokens in the file unless filled.
                  </div>
                </div>
              )}

              {/* Generate Action Button */}
              <div className="pt-5 mt-5 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedTemplate) {
                      triggerPreview(selectedTemplate.templateId, variables);
                    }
                  }}
                  disabled={!selectedTemplate || isPreviewSubmitting || isDebouncing}
                  className="text-xs rounded-xl"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isDebouncing || isPreviewSubmitting ? 'animate-spin' : ''}`} />
                  <span>Refresh Preview</span>
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleGenerateClick}
                  isLoading={isGenerating}
                  disabled={!selectedTemplate || !title.trim() || isGenerating}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 text-xs font-bold px-5 rounded-xl flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Artifact...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate {format.toUpperCase()}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Preview Pane (7 cols on lg) */}
        <div className="lg:col-span-7 h-full min-h-[580px]">
          <LivePreviewPane
            template={selectedTemplate}
            preview={preview}
            isDebouncing={isDebouncing}
            isLoading={isPreviewSubmitting}
            previewError={previewError}
            onRefreshPreview={() => {
              if (selectedTemplate) {
                triggerPreview(selectedTemplate.templateId, variables);
              }
            }}
          />
        </div>
      </div>

      {/* Confirmation Modal for Missing Placeholders */}
      <MissingPlaceholdersModal
        isOpen={showMissingModal}
        onClose={() => setShowMissingModal(false)}
        onConfirm={executeGeneration}
        missingPlaceholders={preview?.missingPlaceholders || []}
        isGenerating={isGenerating}
      />

      {/* Recent Generated Documents Modal */}
      <RecentDocumentsModal
        isOpen={showRecentModal}
        onClose={() => setShowRecentModal(false)}
        recentDocuments={overview?.recentGenerated || []}
      />
    </div>
  );
};

export default DocumentGeneratorPage;

