/**
 * @file documentGenerator.types.ts
 * @description TypeScript models and request/response contracts for the AI Hub Document Generator.
 * Adheres strictly to the FastAPI backend API contract under /api/v1/ai-hub/document-generator.
 */

/**
 * Standard OFC360 API envelope wrapper.
 */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: Array<{ field?: string | null; message: string }> | null;
  code?: string;
}

/**
 * Valid document export formats supported by the FastAPI backend.
 */
export type DocumentFormat = 'pdf' | 'docx' | 'html' | 'txt';

export const SUPPORTED_DOCUMENT_FORMATS: ReadonlyArray<{
  value: DocumentFormat;
  label: string;
  extension: string;
  mime: string;
}> = [
  { value: 'pdf', label: 'PDF Document', extension: '.pdf', mime: 'application/pdf' },
  { value: 'docx', label: 'Word Document', extension: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { value: 'html', label: 'HTML Webpage', extension: '.html', mime: 'text/html' },
  { value: 'txt', label: 'Plain Text', extension: '.txt', mime: 'text/plain' },
] as const;

/**
 * Recently generated document summary item.
 */
export interface RecentGeneratedDocument {
  documentId: string;
  title: string;
  format: DocumentFormat | string;
  createdAt: string;
}

/**
 * GET /api/v1/ai-hub/document-generator response data shape.
 */
export interface DocumentGeneratorOverview {
  totalTemplates: number;
  totalGeneratedDocuments: number;
  supportedFormats: string[];
  recentGenerated: RecentGeneratedDocument[];
}

/**
 * Template item returned from GET /api/v1/ai-hub/document-generator/templates.
 */
export interface DocumentTemplateItem {
  templateId: string;
  name: string;
  description: string | null;
  placeholders: string[];
  createdAt: string;
}

/**
 * GET /api/v1/ai-hub/document-generator/templates response data shape.
 */
export interface DocumentTemplatesResponse {
  total: number;
  templates: DocumentTemplateItem[];
}

/**
 * POST /api/v1/ai-hub/document-generator/preview request payload.
 */
export interface DocumentPreviewRequest {
  templateId: string;
  variables: Record<string, unknown>;
}

/**
 * POST /api/v1/ai-hub/document-generator/preview response data shape.
 */
export interface DocumentPreviewResponse {
  templateId: string;
  templateName: string;
  renderedContent: string;
  missingPlaceholders: string[];
  variablesUsed?: Record<string, unknown>;
}

/**
 * POST /api/v1/ai-hub/document-generator/generate request payload.
 */
export interface DocumentGenerateRequest {
  templateId: string;
  title: string;
  variables: Record<string, unknown>;
  format: DocumentFormat;
}

/**
 * POST /api/v1/ai-hub/document-generator/generate response data shape.
 */
export interface DocumentGenerateResponse {
  documentId: string;
  templateId: string;
  title: string;
  format: DocumentFormat | string;
  filePathOrUrl: string;
  variablesApplied?: Record<string, unknown>;
  generatedAt: string;
}

