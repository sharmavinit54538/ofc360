import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  FileCheck,
  AlertTriangle,
  User,
  Building,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetExitCasesQuery,
  useGetExitDocumentsQuery,
  useGenerateExitDocumentsMutation,
} from '../api/exitsApi';
import type { ExitCase, ExitDocumentItem } from '../types/exit.types';

export const ExitDocumentsPage: React.FC = () => {
  const toast = useToast();

  const {
    data: casesResponse,
    isLoading: isCasesLoading,
    error: casesError,
    refetch: refetchCases,
  } = useGetExitCasesQuery();

  const allCases = casesResponse?.items || [];
  const activeCases = allCases.filter(
    (c) => c.stage !== 'REJECTED' && c.stage !== 'WITHDRAWN'
  );

  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const activeCase =
    activeCases.find((c) => c.id === selectedCaseId) || activeCases[0] || null;

  const {
    data: documentsData,
    isLoading: isDocsLoading,
    error: docsError,
    refetch: refetchDocs,
  } = useGetExitDocumentsQuery(activeCase?.id || '', {
    skip: !activeCase?.id,
  });

  const [generateDocs, { isLoading: isGenerating }] = useGenerateExitDocumentsMutation();

  const standardDocTypes = [
    { type: 'RESIGNATION_ACCEPTANCE', title: 'Resignation Acceptance Letter' },
    { type: 'RELIEVING_LETTER', title: 'Relieving Letter' },
    { type: 'EXPERIENCE_LETTER', title: 'Experience & Service Certificate' },
    { type: 'FNF_STATEMENT', title: 'Full & Final Settlement Statement' },
    { type: 'NO_DUES_CERTIFICATE', title: 'No Dues Certificate' },
    { type: 'EXIT_CONFIRMATION', title: 'Formal Exit Confirmation Letter' },
  ];

  const documents = (documentsData && documentsData.length > 0)
    ? documentsData
    : activeCase?.documents || [];

  const handleGenerateDocuments = async () => {
    if (!activeCase) return;

    try {
      await generateDocs({
        id: activeCase.id,
        documentTypes: standardDocTypes.map((d) => d.type),
      }).unwrap();

      toast.success(
        `Exit documents package generated on server for ${activeCase.employeeName}!`,
        'Documents Generated'
      );
      refetchDocs();
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to generate exit documents package',
        'Generation Error'
      );
    }
  };

  const handleDownloadPdf = (doc: ExitDocumentItem) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      toast.info(
        `Retrieving secure PDF for ${doc.title} (${doc.documentNumber}) from server...`,
        'Document Download'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-500" />
            <span>Official Exit Documents &amp; Certificates</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Generate, issue, and download server-stamped relieving letters, experience letters, and no-dues statements.
          </p>
        </div>

        {activeCase && (
          <Button
            variant="primary"
            size="sm"
            disabled={isGenerating}
            onClick={handleGenerateDocuments}
            className="text-xs gap-1.5 bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Generating on Server...' : 'Generate Documents Package'}</span>
          </Button>
        )}
      </div>

      {/* Main 4 States */}
      {isCasesLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-64 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      ) : casesError ? (
        <ErrorDisplay title="Unable to load exit cases" error={casesError} onRetry={refetchCases} />
      ) : activeCases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            No Exit Cases Found
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            There are currently no cases requiring document issuance.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Employee Selector */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Select Employee ({activeCases.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
              {activeCases.map((c) => {
                const isSelected = activeCase?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 shadow-xs'
                        : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 dark:text-gray-100">
                        {c.employeeName}
                      </span>
                      <Badge variant="brand" size="sm">
                        {c.documents?.length || 0} Docs
                      </Badge>
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
                      {c.caseNumber} &bull; {c.department}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Documents Table */}
          <div className="lg:col-span-2 space-y-5">
            {activeCase && (
              <>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {activeCase.employeeName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono">
                      {activeCase.caseNumber} &bull; {activeCase.designation} &bull; LWD:{' '}
                      {activeCase.expectedLastWorkingDay
                        ? new Date(activeCase.expectedLastWorkingDay).toLocaleDateString()
                        : 'TBD'}
                    </p>
                  </div>
                  <Badge variant="brand" size="sm">
                    {activeCase.stage.replace(/_/g, ' ')}
                  </Badge>
                </div>

                <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/75 dark:bg-zinc-900/50 text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                          <th className="py-3 px-4">Document Title &amp; Number</th>
                          <th className="py-3 px-4">Issue Date</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Download PDF</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
                        {standardDocTypes.map((stdDoc, idx) => {
                          const existingDoc = documents.find((d) => d.type === stdDoc.type);
                          const docNumber = existingDoc?.documentNumber || `DOC-${activeCase.id.slice(0, 5).toUpperCase()}-${idx + 101}`;
                          const isGenerated = Boolean(existingDoc) || activeCase.stage === 'COMPLETED';

                          return (
                            <tr key={stdDoc.type} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/30">
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                  <FileCheck className="w-4 h-4 text-brand-500" />
                                  <span>{stdDoc.title}</span>
                                </div>
                                <div className="text-[11px] font-mono text-gray-400 mt-0.5 pl-6">
                                  {docNumber}
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-gray-600 dark:text-zinc-400">
                                {existingDoc?.issueDate
                                  ? new Date(existingDoc.issueDate).toLocaleDateString()
                                  : 'Auto-dated on generation'}
                              </td>

                              <td className="py-3.5 px-4">
                                <Badge
                                  variant={isGenerated ? 'success' : 'neutral'}
                                  size="sm"
                                >
                                  {isGenerated ? (existingDoc?.status || 'GENERATED') : 'PENDING'}
                                </Badge>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDownloadPdf(
                                      existingDoc || {
                                        id: `doc-${idx}`,
                                        title: stdDoc.title,
                                        documentNumber: docNumber,
                                        type: stdDoc.type as any,
                                        issueDate: new Date().toISOString(),
                                        status: 'GENERATED',
                                      }
                                    )
                                  }
                                  className="text-xs h-7 gap-1"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Download</span>
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitDocumentsPage;
