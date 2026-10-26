/**
 * @file PayComponentsCatalog.tsx
 * @description Catalog of company-wide Pay Components (Earnings & Deductions)
 * with formula evaluation sandbox and default Indian statutory component initialization.
 */

import React, { useState } from 'react';
import {
  Calculator,
  Code2,
  Layers,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Badge } from '@/shared/ui/Badge';
import { Switch } from '@/shared/ui/Switch';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useCreatePayComponentMutation,
  useDeletePayComponentMutation,
  useEvaluateFormulaMutation,
  useGetPayComponentsQuery,
  useSeedDefaultPayComponentsMutation,
} from '../api/payrollApi';
import type {
  CalculationMethod,
  PayComponentCreatePayload,
  PayComponentType,
} from '../types/payroll.types';

export const PayComponentsCatalog: React.FC = () => {
  const { toast } = useToast();
  const { data: components = [], isLoading, error, refetch } = useGetPayComponentsQuery();
  const [createComponent, { isLoading: isCreating }] = useCreatePayComponentMutation();
  const [deleteComponent] = useDeletePayComponentMutation();
  const [seedDefaults, { isLoading: isSeeding }] = useSeedDefaultPayComponentsMutation();
  const [evaluateFormula, { isLoading: isEvaluating }] = useEvaluateFormulaMutation();

  const [activeTab, setActiveTab] = useState<'all' | 'earning' | 'deduction'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<PayComponentType>('earning');
  const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>('flat');
  const [defaultPercentage, setDefaultPercentage] = useState<string>('0.40');
  const [formulaExpr, setFormulaExpr] = useState('');
  const [taxable, setTaxable] = useState(true);
  const [statutory, setStatutory] = useState(false);
  const [description, setDescription] = useState('');

  // Sandbox State
  const [sandboxFormula, setSandboxFormula] = useState('basic * 0.40 + 1500');
  const [sandboxResult, setSandboxResult] = useState<number | null>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);

  const filteredComponents = components.filter((c) => {
    if (activeTab === 'all') return true;
    return c.type === activeTab;
  });

  const handleSeedDefaults = async () => {
    try {
      await seedDefaults().unwrap();
      toast({
        title: 'Components Initialized',
        description: 'Standard Indian statutory components (Basic, HRA, PF, ESI, PT, TDS) seeded successfully.',
        variant: 'default',
      });
      refetch();
    } catch (err: any) {
      toast({
        title: 'Initialization Failed',
        description: err?.data?.detail || err?.message || 'Could not seed default components.',
        variant: 'destructive',
      });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    const payload: PayComponentCreatePayload = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      type,
      calculation_method: calculationMethod,
      default_percentage:
        calculationMethod.startsWith('percentage_') && defaultPercentage
          ? parseFloat(defaultPercentage)
          : null,
      formula_expr: calculationMethod === 'formula' ? formulaExpr : null,
      taxable,
      statutory,
      description: description.trim() || undefined,
    };

    try {
      await createComponent(payload).unwrap();
      toast({
        title: 'Pay Component Created',
        description: `Successfully added ${payload.name} (${payload.code}).`,
        variant: 'default',
      });
      setIsModalOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast({
        title: 'Creation Failed',
        description: err?.data?.detail || 'Failed to save component.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string, compCode: string) => {
    if (!window.confirm(`Deactivate pay component ${compCode}?`)) return;
    try {
      await deleteComponent(id).unwrap();
      toast({
        title: 'Component Deactivated',
        description: `${compCode} is no longer active in calculation runs.`,
      });
      refetch();
    } catch (err: any) {
      toast({
        title: 'Action Failed',
        description: err?.data?.detail || 'Could not deactivate component.',
        variant: 'destructive',
      });
    }
  };

  const handleTestSandbox = async () => {
    setSandboxError(null);
    setSandboxResult(null);
    try {
      const res = await evaluateFormula({ formula: sandboxFormula }).unwrap();
      setSandboxResult(res.computed_value);
    } catch (err: any) {
      setSandboxError(err?.data?.detail || err?.message || 'Invalid formula expression');
    }
  };

  const resetForm = () => {
    setCode('');
    setName('');
    setType('earning');
    setCalculationMethod('flat');
    setDefaultPercentage('0.40');
    setFormulaExpr('');
    setTaxable(true);
    setStatutory(false);
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            Salary Components & Calculation Rules
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
            Configure Indian earnings (Basic, HRA, Special) and statutory deductions (PF, ESI, PT, LWF, TDS).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSandboxOpen(!isSandboxOpen)}
            leftIcon={<Code2 className="w-4 h-4 text-emerald-500" />}
          >
            Formula Tester
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedDefaults}
            disabled={isSeeding}
            leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
          >
            {isSeeding ? 'Seeding...' : 'Seed Indian Defaults'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Component
          </Button>
        </div>
      </div>

      {/* Formula Evaluation Sandbox Drawer / Panel */}
      {isSandboxOpen && (
        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Sandboxed Formula Evaluator (AST Engine)
              </h3>
            </div>
            <button
              onClick={() => setIsSandboxOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
            Test mathematical expressions safely. Available variables: <code className="bg-emerald-500/10 px-1 py-0.5 rounded text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">basic</code>, <code className="bg-emerald-500/10 px-1 py-0.5 rounded text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">ctc</code>, <code className="bg-emerald-500/10 px-1 py-0.5 rounded text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">gross</code>, <code className="bg-emerald-500/10 px-1 py-0.5 rounded text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">hra</code>, <code className="bg-emerald-500/10 px-1 py-0.5 rounded text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">special</code>, <code className="bg-emerald-500/10 px-1 py-0.5 rounded text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">paid_days</code>. Functions: <code className="font-mono text-[11px]">min</code>, <code className="font-mono text-[11px]">max</code>, <code className="font-mono text-[11px]">round</code>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-1 w-full">
              <Input
                value={sandboxFormula}
                onChange={(e) => setSandboxFormula(e.target.value)}
                placeholder="e.g. min(basic * 0.5, 15000) or basic * 0.40"
                className="font-mono text-sm"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleTestSandbox}
              disabled={isEvaluating}
              leftIcon={<Calculator className="w-4 h-4" />}
            >
              {isEvaluating ? 'Evaluating...' : 'Test Formula'}
            </Button>
          </div>

          {sandboxResult !== null && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
              <span>Sample calculation result (with Basic=₹50,000, CTC=₹12,00,000):</span>
              <span className="font-bold text-sm font-mono">₹{sandboxResult.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          )}

          {sandboxError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400">
              Error: {sandboxError}
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All Components ({components.length})
        </button>
        <button
          onClick={() => setActiveTab('earning')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'earning'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Earnings ({components.filter((c) => c.type === 'earning').length})
        </button>
        <button
          onClick={() => setActiveTab('deduction')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'deduction'
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold'
              : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Deductions & Statutory ({components.filter((c) => c.type === 'deduction').length})
        </button>
      </div>

      {/* Table List */}
      {isLoading ? (
        <div className="p-8 text-center text-sm text-gray-500 dark:text-zinc-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
          Loading pay components...
        </div>
      ) : error ? (
        <ErrorDisplay message="Failed to load pay components catalog." onRetry={() => { refetch(); }} />
      ) : filteredComponents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50">
          <Layers className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">No components found</p>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Click "Seed Indian Defaults" to quickly initialize Basic, HRA, PF, ESI, PT, and TDS.
          </p>
          <Button variant="outline" size="sm" onClick={handleSeedDefaults} className="mt-4">
            Initialize Defaults
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-900/40 text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Component</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Calculation Method</th>
                  <th className="py-3 px-4">Formula / Rate</th>
                  <th className="py-3 px-4">Statutory / Tax</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-zinc-800/80">
                {filteredComponents.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                          {c.name}
                          <span className="font-mono text-[10px] text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded">
                            {c.code}
                          </span>
                        </div>
                        {c.description && (
                          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 line-clamp-1 max-w-md">
                            {c.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={c.type === 'earning' ? 'success' : 'danger'}
                        className="capitalize text-[11px]"
                      >
                        {c.type}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-700 dark:text-zinc-300 font-medium">
                        {c.calculation_method === 'flat' && 'Fixed Flat Amount'}
                        {c.calculation_method === 'percentage_of_basic' && '% of Basic Salary'}
                        {c.calculation_method === 'percentage_of_ctc' && '% of Annual CTC'}
                        {c.calculation_method === 'formula' && 'AST Formula Expression'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {c.calculation_method === 'formula' ? (
                        <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                          {c.formula_expr || 'None'}
                        </code>
                      ) : c.default_percentage ? (
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {(c.default_percentage * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Fixed</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {c.statutory && (
                          <Badge variant="warning" className="text-[10px]">
                            Statutory
                          </Badge>
                        )}
                        {c.taxable ? (
                          <Badge variant="outline" className="text-[10px] text-gray-600 dark:text-zinc-400">
                            Taxable
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            Exempt
                          </Badge>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(c.id, c.code)}
                        className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Pay Component Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-zinc-800 shadow-2xl p-6 space-y-5 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Create Pay Component
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Component Code *</Label>
                  <Input
                    required
                    placeholder="e.g. HRA, SPECIAL"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="font-mono uppercase text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Component Name *</Label>
                  <Input
                    required
                    placeholder="e.g. House Rent Allowance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Type</Label>
                  <Select value={type} onValueChange={(val: any) => setType(val)}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earning">Earning</SelectItem>
                      <SelectItem value="deduction">Deduction</SelectItem>
                      <SelectItem value="employer_contribution">Employer Contribution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Calculation Method</Label>
                  <Select
                    value={calculationMethod}
                    onValueChange={(val: any) => setCalculationMethod(val)}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat Amount</SelectItem>
                      <SelectItem value="percentage_of_basic">% of Basic Salary</SelectItem>
                      <SelectItem value="percentage_of_ctc">% of Annual CTC</SelectItem>
                      <SelectItem value="formula">Formula Expression</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {calculationMethod.startsWith('percentage_') && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Default Percentage (e.g. 0.40 for 40%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={defaultPercentage}
                    onChange={(e) => setDefaultPercentage(e.target.value)}
                    placeholder="0.40"
                    className="text-xs"
                  />
                </div>
              )}

              {calculationMethod === 'formula' && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Formula Expression *</Label>
                  <Input
                    required
                    value={formulaExpr}
                    onChange={(e) => setFormulaExpr(e.target.value)}
                    placeholder="e.g. max(0, (ctc / 12) - (basic + hra))"
                    className="font-mono text-xs"
                  />
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                    Allowed vars: <code className="text-indigo-400">basic</code>, <code className="text-indigo-400">ctc</code>, <code className="text-indigo-400">gross</code>, <code className="text-indigo-400">hra</code>.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-zinc-800">
                  <div>
                    <Label className="text-xs font-semibold">Taxable</Label>
                    <p className="text-[10px] text-gray-500">Included in gross income</p>
                  </div>
                  <Switch checked={taxable} onCheckedChange={setTaxable} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-zinc-800">
                  <div>
                    <Label className="text-xs font-semibold">Statutory</Label>
                    <p className="text-[10px] text-gray-500">Government mandatory</p>
                  </div>
                  <Switch checked={statutory} onCheckedChange={setStatutory} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Description (Optional)</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes for payroll admins and payslip display"
                  className="text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Component'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayComponentsCatalog;
