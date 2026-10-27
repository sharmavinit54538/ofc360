/**
 * @file DocumentVariablesForm.tsx
 * @description Dynamic form component generating validated inputs for template placeholders,
 * document title, and format selection for the AI Document Generator.
 */

import React from 'react';
import {
  FileText,
  RotateCcw,
  Sparkles,
  FileType,
  FileCode,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import {
  cleanPlaceholderKey,
  humanizePlaceholder,
  getPlaceholderInputType,
} from '../utils/documentGeneratorUtils';
import type {
  DocumentTemplateItem,
  DocumentFormat,
} from '../types/documentGenerator.types';

export interface DocumentVariablesFormProps {
  template: DocumentTemplateItem;
  title: string;
  onTitleChange: (title: string) => void;
  titleError?: string | null;
  format: DocumentFormat;
  onFormatChange: (format: DocumentFormat) => void;
  variables: Record<string, string>;
  onVariableChange: (key: string, value: string) => void;
  onClearVariables: () => void;
  fieldErrors?: Record<string, string>;
}

export const DocumentVariablesForm: React.FC<DocumentVariablesFormProps> = ({
  template,
  title,
  onTitleChange,
  titleError,
  format,
  onFormatChange,
  variables,
  onVariableChange,
  onClearVariables,
  fieldErrors = {},
}) => {
  const placeholders = template.placeholders || [];

  const formatOptions: Array<{ value: DocumentFormat; label: string; icon: React.ReactNode }> = [
    { value: 'pdf', label: 'PDF', icon: <FileText className="w-3.5 h-3.5 text-rose-500" /> },
    { value: 'docx', label: 'DOCX', icon: <FileType className="w-3.5 h-3.5 text-blue-500" /> },
    { value: 'html', label: 'HTML', icon: <FileCode className="w-3.5 h-3.5 text-amber-500" /> },
    { value: 'txt', label: 'TXT', icon: <FileText className="w-3.5 h-3.5 text-slate-500" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Document Settings Section */}
      <div className="space-y-3 pt-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
          2. Document Settings <span className="text-rose-500">*</span>
        </label>

        {/* Title Input */}
        <Input
          label="Document Title *"
          id="doc-title-input"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={`e.g. ${template.name} - Official`}
          error={titleError || fieldErrors.title}
          helperText="Required. Displayed on exports and audit registers."
        />

        {/* Format Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-900 dark:text-[#ececec]">
            Export Format <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {formatOptions.map((opt) => {
              const isSelected = format === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onFormatChange(opt.value)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/25 shadow-xs'
                      : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-zinc-300 hover:border-gray-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400 dark:text-zinc-500">
            Strictly constrained to the 4 supported formats accepted by the backend.
          </p>
        </div>
      </div>

      {/* Dynamic Placeholder Variables Section */}
      <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              3. Template Variables
            </label>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">
              Fill placeholder values. Live preview reflects changes instantly.
            </p>
          </div>
          {Object.keys(variables).length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearVariables}
              className="text-[11px] h-7 px-2 text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset All
            </Button>
          )}
        </div>

        {placeholders.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>This template has no dynamic variable placeholders. You can generate it directly.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {placeholders.map((rawPlaceholder) => {
              const cleanKey = cleanPlaceholderKey(rawPlaceholder);
              const humanLabel = humanizePlaceholder(rawPlaceholder);
              const inputType = getPlaceholderInputType(cleanKey);
              const currentValue = variables[cleanKey] ?? '';
              const fieldError = fieldErrors[cleanKey] || fieldErrors[rawPlaceholder];

              return (
                <div key={cleanKey}>
                  <Input
                    id={`var-${cleanKey}`}
                    label={humanLabel}
                    labelRight={
                      <span className="font-mono text-[10px] text-gray-400 dark:text-zinc-500 flex items-center gap-0.5">
                        <Tag className="w-2.5 h-2.5" />
                        {rawPlaceholder.startsWith('{') ? rawPlaceholder : `{{${cleanKey}}}`}
                      </span>
                    }
                    type={inputType}
                    value={currentValue}
                    onChange={(e) => onVariableChange(cleanKey, e.target.value)}
                    placeholder={`Enter ${humanLabel.toLowerCase()}...`}
                    error={fieldError}
                    inputSize="sm"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentVariablesForm;
