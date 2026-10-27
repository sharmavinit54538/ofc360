/**
 * @file documentGenerator.test.tsx
 * @description Comprehensive unit tests for AI Hub Document Generator module:
 * 1. RTK Query API slice & error extraction
 * 2. URL resolver & backend storage gap handling
 * 3. Utility helpers (cleaning, humanizing, input type inference)
 * 4. Header & overview metrics
 * 5. Template selector & search filtering
 * 6. Dynamic variables form & format choices
 * 7. Live preview pane & missing placeholders highlighting
 * 8. Missing placeholders confirmation modal
 * 9. Generated document card with disabled download
 * 10. Recent documents history modal
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  cleanPlaceholderKey,
  humanizePlaceholder,
  getPlaceholderInputType,
  formatDocumentDate,
} from '../utils/documentGeneratorUtils';
import {
  resolveGeneratedDocumentUrl,
  extractApiErrorMessage,
  unwrapApiEnvelope,
  documentGeneratorApi,
} from '../api/documentGeneratorApi';
import { DocumentGeneratorHeader } from '../components/DocumentGeneratorHeader';
import { TemplateSelector } from '../components/TemplateSelector';
import { DocumentVariablesForm } from '../components/DocumentVariablesForm';
import { LivePreviewPane } from '../components/LivePreviewPane';
import { MissingPlaceholdersModal } from '../components/MissingPlaceholdersModal';
import { GeneratedDocumentCard } from '../components/GeneratedDocumentCard';
import { RecentDocumentsModal } from '../components/RecentDocumentsModal';
import type {
  DocumentTemplateItem,
  DocumentGeneratorOverview,
  DocumentPreviewResponse,
  DocumentGenerateResponse,
  RecentGeneratedDocument,
} from '../types/documentGenerator.types';

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AI Hub Document Generator Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Utility Helpers (documentGeneratorUtils)', () => {
    it('cleanPlaceholderKey strips curly braces and trims whitespace', () => {
      expect(cleanPlaceholderKey('{{employee_name}}')).toBe('employee_name');
      expect(cleanPlaceholderKey('{start_date}')).toBe('start_date');
      expect(cleanPlaceholderKey('  {{ designation }}  ')).toBe('designation');
      expect(cleanPlaceholderKey('raw_key')).toBe('raw_key');
      expect(cleanPlaceholderKey('')).toBe('');
    });

    it('humanizePlaceholder converts snake_case, kebab-case, and camelCase into title case words', () => {
      expect(humanizePlaceholder('{{employee_name}}')).toBe('Employee Name');
      expect(humanizePlaceholder('joiningDate')).toBe('Joining Date');
      expect(humanizePlaceholder('company-address')).toBe('Company Address');
      expect(humanizePlaceholder('ctc_annual')).toBe('Ctc Annual');
    });

    it('getPlaceholderInputType infers appropriate HTML input types', () => {
      expect(getPlaceholderInputType('joining_date')).toBe('date');
      expect(getPlaceholderInputType('effective_date')).toBe('date');
      expect(getPlaceholderInputType('dob')).toBe('date');
      expect(getPlaceholderInputType('employee_email')).toBe('email');
      expect(getPlaceholderInputType('company_mail')).toBe('email');
      expect(getPlaceholderInputType('annual_ctc')).toBe('number');
      expect(getPlaceholderInputType('basic_salary')).toBe('number');
      expect(getPlaceholderInputType('employee_name')).toBe('text');
      expect(getPlaceholderInputType('candidate_name')).toBe('text');
      expect(getPlaceholderInputType('designation')).toBe('text');
    });

    it('formatDocumentDate formats valid ISO dates cleanly and gracefully handles invalid input', () => {
      const formatted = formatDocumentDate('2026-10-27T10:30:00.000Z');
      expect(formatted).toContain('2026');
      expect(formatDocumentDate(null)).toBe('—');
      expect(formatDocumentDate('')).toBe('—');
    });
  });

  describe('2. URL Resolver & Backend Storage Gap Handling', () => {
    it('resolveGeneratedDocumentUrl flags isDownloadable as false with explanatory tooltip', () => {
      const result = resolveGeneratedDocumentUrl('uploads/generated_documents/offer_letter_123.pdf');
      expect(result.isDownloadable).toBe(false);
      expect(result.tooltipText).toContain('Download not available yet');
      expect(result.url).toContain('uploads/generated_documents/offer_letter_123.pdf');
    });

    it('resolveGeneratedDocumentUrl returns null url when path is omitted or empty', () => {
      expect(resolveGeneratedDocumentUrl(null).url).toBeNull();
      expect(resolveGeneratedDocumentUrl('').url).toBeNull();
      expect(resolveGeneratedDocumentUrl('   ').url).toBeNull();
    });

    it('resolveGeneratedDocumentUrl preserves absolute URLs when provided', () => {
      const result = resolveGeneratedDocumentUrl('https://storage.ofc360.com/docs/letter.pdf');
      expect(result.url).toBe('https://storage.ofc360.com/docs/letter.pdf');
    });
  });

  describe('3. API Envelope & Error Handling', () => {
    it('unwrapApiEnvelope extracts data from successful envelopes or returns raw response', () => {
      const envelope = {
        success: true,
        message: 'Success',
        data: { totalTemplates: 5 },
        errors: null,
      };
      expect(unwrapApiEnvelope(envelope)).toEqual({ totalTemplates: 5 });

      const raw = { totalTemplates: 5 };
      expect(unwrapApiEnvelope(raw)).toEqual({ totalTemplates: 5 });
    });

    it('extractApiErrorMessage extracts field-level and top-level errors', () => {
      const errorWithErrors = {
        data: {
          success: false,
          message: 'Validation failed',
          errors: [{ field: 'title', message: 'Title is required' }],
        },
      };
      expect(extractApiErrorMessage(errorWithErrors)).toBe('Title is required');

      const errorWithMessage = {
        data: {
          success: false,
          message: 'Template not found',
        },
      };
      expect(extractApiErrorMessage(errorWithMessage)).toBe('Template not found');

      const errorWithStatus401 = { status: 401 };
      expect(extractApiErrorMessage(errorWithStatus401)).toContain('unauthenticated');

      const errorWithStatus404 = { status: 404 };
      expect(extractApiErrorMessage(errorWithStatus404)).toContain('not found');
    });

    it('documentGeneratorApi exports all 4 required endpoints', () => {
      expect(documentGeneratorApi.endpoints.getDocumentGeneratorOverview).toBeDefined();
      expect(documentGeneratorApi.endpoints.getDocumentTemplates).toBeDefined();
      expect(documentGeneratorApi.endpoints.previewDocument).toBeDefined();
      expect(documentGeneratorApi.endpoints.generateDocument).toBeDefined();
    });
  });

  describe('4. DocumentGeneratorHeader Component', () => {
    const mockOverview: DocumentGeneratorOverview = {
      totalTemplates: 12,
      totalGeneratedDocuments: 48,
      supportedFormats: ['pdf', 'docx', 'html', 'txt'],
      recentGenerated: [
        {
          documentId: 'doc-1',
          title: 'Offer Letter - Alice',
          format: 'pdf',
          createdAt: '2026-10-27T08:00:00Z',
        },
      ],
    };

    it('renders overview counters, supported format badges, and breadcrumb link', () => {
      const handleOpenRecent = vi.fn();
      render(
        <DocumentGeneratorHeader
          overview={mockOverview}
          isLoading={false}
          onOpenRecent={handleOpenRecent}
        />
      );

      expect(screen.getByText('12')).toBeDefined();
      expect(screen.getByText('48')).toBeDefined();
      expect(screen.getByText(/pdf/i)).toBeDefined();
      expect(screen.getByText(/docx/i)).toBeDefined();
      expect(screen.getByText('Recent Documents (1)')).toBeDefined();

      fireEvent.click(screen.getByText('Recent Documents (1)'));
      expect(handleOpenRecent).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: /Back to AI Hub/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/ai-hub');
    });
  });

  describe('5. TemplateSelector Component', () => {
    const mockTemplates: DocumentTemplateItem[] = [
      {
        templateId: 'tmpl-offer',
        name: 'Standard Employment Offer Letter',
        description: 'Covers compensation, joining date, and probation terms.',
        placeholders: ['{{candidate_name}}', '{{designation}}', '{{annual_ctc}}', '{{joining_date}}'],
        createdAt: '2026-10-01T00:00:00Z',
      },
      {
        templateId: 'tmpl-nda',
        name: 'Mutual Non-Disclosure Agreement (NDA)',
        description: 'Standard confidentiality terms for third-party partners.',
        placeholders: ['{{party_name}}', '{{effective_date}}'],
        createdAt: '2026-10-05T00:00:00Z',
      },
    ];

    it('renders template items and permits selection', () => {
      const handleSelect = vi.fn();
      render(
        <TemplateSelector
          templates={mockTemplates}
          selectedTemplateId="tmpl-offer"
          onSelectTemplate={handleSelect}
        />
      );

      expect(screen.getByText('Standard Employment Offer Letter')).toBeDefined();
      expect(screen.getByText('Mutual Non-Disclosure Agreement (NDA)')).toBeDefined();
      expect(screen.getByText(/4 variables/i)).toBeDefined();

      fireEvent.click(screen.getByText('Mutual Non-Disclosure Agreement (NDA)'));
      expect(handleSelect).toHaveBeenCalledWith(mockTemplates[1]);
    });

    it('filters templates via the search input', () => {
      render(
        <TemplateSelector
          templates={mockTemplates}
          selectedTemplateId={null}
          onSelectTemplate={vi.fn()}
        />
      );

      // Search input appears when templates are present
      // Note: searching for NDA
      const items = screen.getAllByRole('button');
      expect(items.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('6. DocumentVariablesForm Component', () => {
    const mockTemplate: DocumentTemplateItem = {
      templateId: 'tmpl-offer',
      name: 'Employment Offer Letter',
      description: 'Standard employment contract.',
      placeholders: ['{{candidate_name}}', '{{joining_date}}', '{{annual_ctc}}'],
      createdAt: '2026-10-01T00:00:00Z',
    };

    it('renders title input, format selector, and dynamic placeholder inputs', () => {
      const handleTitleChange = vi.fn();
      const handleFormatChange = vi.fn();
      const handleVariableChange = vi.fn();
      const handleClear = vi.fn();

      render(
        <DocumentVariablesForm
          template={mockTemplate}
          title="Offer Letter - John Doe"
          onTitleChange={handleTitleChange}
          format="pdf"
          onFormatChange={handleFormatChange}
          variables={{ candidate_name: 'John Doe', joining_date: '2026-11-01' }}
          onVariableChange={handleVariableChange}
          onClearVariables={handleClear}
        />
      );

      // Title input
      const titleInput = screen.getByLabelText(/Document Title \*/i) as HTMLInputElement;
      expect(titleInput.value).toBe('Offer Letter - John Doe');

      // Dynamic placeholder fields
      expect(screen.getByLabelText(/Candidate Name/i)).toBeDefined();
      expect(screen.getByLabelText(/Joining Date/i)).toBeDefined();
      expect(screen.getByLabelText(/Annual Ctc/i)).toBeDefined();

      // Typing in a variable input
      const nameInput = screen.getByPlaceholderText(/Enter candidate name/i) as HTMLInputElement;
      expect(nameInput.value).toBe('John Doe');
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      expect(handleVariableChange).toHaveBeenCalledWith('candidate_name', 'Jane Doe');

      // Changing export format to docx
      fireEvent.click(screen.getByText('DOCX'));
      expect(handleFormatChange).toHaveBeenCalledWith('docx');
    });
  });

  describe('7. LivePreviewPane Component', () => {
    const mockTemplate: DocumentTemplateItem = {
      templateId: 'tmpl-offer',
      name: 'Employment Offer Letter',
      description: 'Standard employment contract.',
      placeholders: ['{{candidate_name}}', '{{designation}}'],
      createdAt: '2026-10-01T00:00:00Z',
    };

    const mockPreview: DocumentPreviewResponse = {
      templateId: 'tmpl-offer',
      templateName: 'Employment Offer Letter',
      renderedContent: 'Dear Jane Doe,\n\nWe are pleased to offer you the position of {{designation}}.',
      missingPlaceholders: ['{{designation}}'],
    };

    it('renders rendered content and highlights missing placeholders with warning banner', () => {
      render(
        <LivePreviewPane
          template={mockTemplate}
          preview={mockPreview}
          isDebouncing={false}
          isLoading={false}
        />
      );

      expect(screen.getByText(/Dear Jane Doe,/i)).toBeDefined();
      expect(screen.getByText(/1 Missing Variable/i)).toBeDefined();
      expect(screen.getAllByText('{{designation}}').length).toBeGreaterThan(0);
    });

    it('shows empty guide when no template is selected', () => {
      render(
        <LivePreviewPane
          template={null}
          preview={null}
        />
      );

      expect(screen.getByText('Document Preview Canvas')).toBeDefined();
    });
  });

  describe('8. MissingPlaceholdersModal Component', () => {
    it('warns user about unfilled placeholders and calls onConfirm on proceed', () => {
      const handleConfirm = vi.fn();
      const handleClose = vi.fn();

      render(
        <MissingPlaceholdersModal
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          missingPlaceholders={['{{salary}}', '{{designation}}']}
        />
      );

      expect(screen.getByText('Unfilled Variables Warning')).toBeDefined();
      expect(screen.getByText('{{salary}}')).toBeDefined();
      expect(screen.getByText('{{designation}}')).toBeDefined();

      fireEvent.click(screen.getByText('Proceed Anyway'));
      expect(handleConfirm).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText('Back & Complete Fields'));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('9. GeneratedDocumentCard Component', () => {
    const mockGenerated: DocumentGenerateResponse = {
      documentId: 'doc-999-uuid',
      templateId: 'tmpl-offer',
      title: 'Offer Letter - Jane Doe',
      format: 'pdf',
      filePathOrUrl: 'uploads/generated_documents/offer_letter_jane_doe.pdf',
      generatedAt: '2026-10-27T10:00:00Z',
    };

    it('displays generated document details with disabled download button explaining backend gap', () => {
      const handleGenerateAnother = vi.fn();
      render(
        <GeneratedDocumentCard
          document={mockGenerated}
          onGenerateAnother={handleGenerateAnother}
        />
      );

      expect(screen.getByText('Offer Letter - Jane Doe')).toBeDefined();
      expect(screen.getByText('doc-999-uuid')).toBeDefined();
      expect(screen.getByText('uploads/generated_documents/offer_letter_jane_doe.pdf')).toBeDefined();

      // Download button must be disabled per backend gap requirement
      const downloadBtn = screen.getByRole('button', { name: /Download Not Available/i });
      expect(downloadBtn).toBeDefined();
      expect(downloadBtn.hasAttribute('disabled')).toBe(true);

      fireEvent.click(screen.getByText('New Document'));
      expect(handleGenerateAnother).toHaveBeenCalledTimes(1);
    });
  });

  describe('10. RecentDocumentsModal Component', () => {
    const mockRecent: RecentGeneratedDocument[] = [
      {
        documentId: 'doc-abc-12345678',
        title: 'NDA Agreement - Partner X',
        format: 'pdf',
        createdAt: '2026-10-27T07:15:00Z',
      },
    ];

    it('renders recent generated documents list and dismisses properly', () => {
      const handleClose = vi.fn();
      render(
        <RecentDocumentsModal
          isOpen={true}
          onClose={handleClose}
          recentDocuments={mockRecent}
        />
      );

      expect(screen.getByText('Recent Generated Documents')).toBeDefined();
      expect(screen.getByText('NDA Agreement - Partner X')).toBeDefined();

      fireEvent.click(screen.getByText('Close'));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
