/**
 * @file StatutoryComplianceCenter.tsx
 * @description Comprehensive Indian Statutory Compliance Center and live Gross-to-Net simulator.
 * Covers PF (₹15k ceiling toggle), ESI (₹21k wage ceiling), State PT slab switcher, LWF,
 * and Old vs New Tax Regime TDS engines.
 */

import React, { useEffect, useState } from 'react';
import {
  Calculator,
  Coins,
  MapPin,
  Save,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Label } from '@/shared/ui/Label';
import { Switch } from '@/shared/ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Badge } from '@/shared/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/Card';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetStatutoryConfigQuery,
  useSimulateStatutoryMutation,
  useUpdateStatutoryConfigMutation,
} from '../api/payrollApi';
import type { StatutorySimulationResult } from '../types/payroll.types';

const INDIAN_STATES_PT = [
  { id: 'MAHARASHTRA', name: 'Maharashtra', desc: '₹200/mo (₹300 in February) if Gross > ₹10,000' },
  { id: 'KARNATAKA', name: 'Karnataka', desc: '₹200/mo if Gross >= ₹15,000' },
  { id: 'GUJARAT', name: 'Gujarat', desc: '₹200/mo if Gross > ₹12,000' },
  { id: 'TELANGANA', name: 'Telangana', desc: '₹150 if 15k-20k, ₹200 if > ₹20,000' },
  { id: 'ANDHRA PRADESH', name: 'Andhra Pradesh', desc: '₹150 if 15k-20k, ₹200 if > ₹20,000' },
  { id: 'WEST BENGAL', name: 'West Bengal', desc: 'Graduated slabs ₹110 to ₹200' },
  { id: 'TAMIL NADU', name: 'Tamil Nadu', desc: 'Graduated half-yearly slabs up to ₹1,025' },
  { id: 'MADHYA PRADESH', name: 'Madhya Pradesh', desc: '₹125 - ₹208/mo based on gross wage slabs' },
  { id: 'DELHI', name: 'Delhi (UT)', desc: 'Exempt — No Professional Tax applicable' },
  { id: 'RAJASTHAN', name: 'Rajasthan', desc: 'Exempt — No Professional Tax applicable' },
  { id: 'HARYANA', name: 'Haryana', desc: 'Exempt — No Professional Tax applicable' },
  { id: 'UTTAR PRADESH', name: 'Uttar Pradesh', desc: 'Exempt — No Professional Tax applicable' },
];

export const StatutoryComplianceCenter: React.FC = () => {
  const { toast } = useToast();
  const { data: config, isLoading: isConfigLoading, refetch } = useGetStatutoryConfigQuery();
  const [updateConfig, { isLoading: isUpdating }] = useUpdateStatutoryConfigMutation();
  const [simulateStatutory, { isLoading: isSimulating }] = useSimulateStatutoryMutation();

  // Local Statutory Config Form
  const [pfEnabled, setPfEnabled] = useState(true);
  const [pfOnFullBasic, setPfOnFullBasic] = useState(false);
  const [esiEnabled, setEsiEnabled] = useState(true);
  const [ptState, setPtState] = useState('MAHARASHTRA');
  const [defaultTaxRegime, setDefaultTaxRegime] = useState('NEW');

  // Simulator Inputs
  const [simBasic, setSimBasic] = useState(30000);
  const [simHra, setSimHra] = useState(12000);
  const [simSpecial, setSimSpecial] = useState(8000);
  const [simPaidDays, setSimPaidDays] = useState(30);
  const simTotalDays = 30;
  const [simState, setSimState] = useState('MAHARASHTRA');
  const [simRegime, setSimRegime] = useState('NEW');
  const [simPfFullBasic, setSimPfFullBasic] = useState(false);
  const [sim80C, setSim80C] = useState(150000);
  const [sim80D, setSim80D] = useState(25000);
  const [simResult, setSimResult] = useState<StatutorySimulationResult | null>(null);

  useEffect(() => {
    if (config) {
      setPfEnabled(config.pf_enabled);
      setPfOnFullBasic(config.pf_on_full_basic);
      setEsiEnabled(config.esi_enabled);
      setPtState(config.pt_state || 'MAHARASHTRA');
      setDefaultTaxRegime(config.default_tax_regime || 'NEW');
      setSimState(config.pt_state || 'MAHARASHTRA');
      setSimPfFullBasic(config.pf_on_full_basic);
    }
  }, [config]);

  // Run initial simulation
  useEffect(() => {
    handleRunSimulation();
  }, [simBasic, simHra, simSpecial, simPaidDays, simTotalDays, simState, simRegime, simPfFullBasic, sim80C, sim80D]);

  const handleSaveConfig = async () => {
    try {
      await updateConfig({
        pfEnabled,
        pfOnFullBasic,
        esiEnabled,
        ptState,
        defaultTaxRegime,
      }).unwrap();
      toast({
        title: 'Statutory Settings Saved',
        description: 'Company-wide statutory parameters have been updated for upcoming runs.',
        variant: 'default',
      });
      refetch();
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err?.data?.detail || 'Could not update statutory settings.',
        variant: 'destructive',
      });
    }
  };

  const handleRunSimulation = async () => {
    try {
      const res = await simulateStatutory({
        basicMonthlyPaise: Math.round(simBasic * 100),
        hraMonthlyPaise: Math.round(simHra * 100),
        specialAllowanceMonthlyPaise: Math.round(simSpecial * 100),
        paidDays: simPaidDays,
        totalDays: simTotalDays,
        state: simState,
        taxRegime: simRegime,
        pfOnFullBasic: simPfFullBasic,
        declarations: {
          section_80c: sim80C,
          section_80d: sim80D,
        },
      }).unwrap();
      setSimResult(res);
    } catch (err: any) {
      // Handled silently for live calculations
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Statutory Engine (EPF, ESIC, PT, TDS)
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Real-time calculation engine & live Gross-to-Net simulator
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSaveConfig}
          disabled={isUpdating || isConfigLoading}
          leftIcon={<Save className="w-3.5 h-3.5" />}
        >
          {isUpdating ? 'Saving...' : 'Save Rulebook'}
        </Button>
      </div>

      {/* Grid: Left = Statutory Rulebook, Right = Live Gross-to-Net Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rulebook Configuration (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Provident Fund (PF) Rule Card */}
          <Card className="rounded-2xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-indigo-500" />
                  <CardTitle className="text-sm font-semibold">Employees' Provident Fund (EPF)</CardTitle>
                </div>
                <Switch checked={pfEnabled} onCheckedChange={setPfEnabled} />
              </div>
              <CardDescription className="text-xs">
                Under Employees' Provident Funds and Miscellaneous Provisions Act, 1952.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-zinc-400">Employee Contribution:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">12.00% of Basic + DA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-zinc-400">Employer Contribution:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">3.67% EPF + 8.33% EPS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-zinc-400">Statutory EPS Ceiling:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">₹1,250 / month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-zinc-400">EDLI & Admin Charges:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">0.50% EDLI + 0.50% Admin</span>
                </div>
              </div>

              {/* Wage Ceiling Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05]">
                <div className="pr-3">
                  <div className="font-semibold text-gray-900 dark:text-white text-xs">
                    Calculate PF on Actual Basic
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-zinc-400">
                    If off, contributions are capped at statutory ₹15,000 ceiling.
                  </div>
                </div>
                <Switch checked={pfOnFullBasic} onCheckedChange={setPfOnFullBasic} />
              </div>
            </CardContent>
          </Card>

          {/* 2. Employee State Insurance (ESI) Rule Card */}
          <Card className="rounded-2xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <CardTitle className="text-sm font-semibold">Employee State Insurance (ESIC)</CardTitle>
                </div>
                <Switch checked={esiEnabled} onCheckedChange={setEsiEnabled} />
              </div>
              <CardDescription className="text-xs">
                Statutory health & social security under ESI Act, 1948.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-zinc-400">Eligibility Wage Limit:</span>
                  <Badge variant="success" className="text-[10px]">Gross Monthly ≤ ₹21,000</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-zinc-400">Employee Deduction:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">0.75% of Gross (ceil to ₹1)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-zinc-400">Employer Share:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">3.25% of Gross (ceil to ₹1)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Professional Tax (PT) & State Engine */}
          <Card className="rounded-2xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <CardTitle className="text-sm font-semibold">State-Wise Professional Tax (PT)</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Auto-computed based on employee location and state slabs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs">Default Operating State</Label>
                <Select value={ptState} onValueChange={setPtState}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES_PT.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                <span className="font-semibold">Active State Rule: </span>
                {INDIAN_STATES_PT.find((s) => s.id === ptState)?.desc}
              </div>
            </CardContent>
          </Card>

          {/* 4. Income Tax TDS Default Regime */}
          <Card className="rounded-2xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-500" />
                <CardTitle className="text-sm font-semibold">Income Tax TDS (Section 192)</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Default regime for employee tax deductions if undeclared.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs">Default Tax Regime</Label>
                <Select value={defaultTaxRegime} onValueChange={setDefaultTaxRegime}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New Tax Regime (Section 115BAC — Default FY 2024-25 / 2025-26)</SelectItem>
                    <SelectItem value="OLD">Old Tax Regime (With 80C, 80D, HRA deductions)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/[0.05] border border-purple-500/20 text-purple-900 dark:text-purple-300 text-[11px] space-y-1">
                <div className="font-semibold">Standard Deduction:</div>
                <div className="flex justify-between">
                  <span>New Tax Regime:</span>
                  <span className="font-mono font-bold">₹75,000 / year</span>
                </div>
                <div className="flex justify-between">
                  <span>Old Tax Regime:</span>
                  <span className="font-mono font-bold">₹50,000 / year</span>
                </div>
                <div className="text-[10px] text-gray-500 dark:text-zinc-400 pt-1">
                  Section 87A rebate gives 100% tax rebate for taxable income ≤ ₹7,00,000 in New Regime.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Interactive Gross-to-Net Simulator (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="rounded-2xl border-indigo-500/30 dark:border-indigo-500/30 bg-white dark:bg-[#171717] shadow-md">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-500" />
                  <div>
                    <CardTitle className="text-base font-semibold">Live Gross-to-Net Calculation Engine</CardTitle>
                    <CardDescription className="text-xs">
                      Simulate real-time take-home pay, statutory liabilities, and employer CTC cost.
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] text-indigo-500 border-indigo-500/30">
                  {isSimulating ? 'Simulating…' : 'Deterministic Engine'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-6">
              {/* Simulator Input Sliders / Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label>Monthly Basic</Label>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">₹{simBasic.toLocaleString('en-IN')}</span>
                  </div>
                  <Input
                    type="number"
                    step="1000"
                    min="5000"
                    max="500000"
                    value={simBasic}
                    onChange={(e) => setSimBasic(Math.max(0, parseInt(e.target.value) || 0))}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label>Monthly HRA</Label>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">₹{simHra.toLocaleString('en-IN')}</span>
                  </div>
                  <Input
                    type="number"
                    step="500"
                    min="0"
                    max="300000"
                    value={simHra}
                    onChange={(e) => setSimHra(Math.max(0, parseInt(e.target.value) || 0))}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <Label>Special Allowance</Label>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">₹{simSpecial.toLocaleString('en-IN')}</span>
                  </div>
                  <Input
                    type="number"
                    step="500"
                    min="0"
                    max="300000"
                    value={simSpecial}
                    onChange={(e) => setSimSpecial(Math.max(0, parseInt(e.target.value) || 0))}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              {/* Attendance & Location Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-xs">
                <div className="space-y-1">
                  <Label className="text-[11px] text-gray-500">Paid Days (LOP)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    max="31"
                    value={simPaidDays}
                    onChange={(e) => setSimPaidDays(parseFloat(e.target.value) || 30)}
                    className="text-xs h-8"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-gray-500">Work State (PT)</Label>
                  <Select value={simState} onValueChange={setSimState}>
                    <SelectTrigger className="text-xs h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES_PT.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-gray-500">Tax Regime</Label>
                  <Select value={simRegime} onValueChange={setSimRegime}>
                    <SelectTrigger className="text-xs h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New Regime</SelectItem>
                      <SelectItem value="OLD">Old Regime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="flex items-center justify-between h-8 px-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800">
                    <span className="text-[10px] text-gray-500">PF on Full</span>
                    <Switch checked={simPfFullBasic} onCheckedChange={setSimPfFullBasic} />
                  </div>
                </div>
              </div>

              {/* Old Regime Deductions (80C / 80D) */}
              {simRegime === 'OLD' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-purple-500/[0.04] border border-purple-500/20 text-xs animate-in fade-in-50">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label className="text-[11px] text-gray-500">Sec 80C Deductions (Max ₹1.5L)</Label>
                      <span className="font-mono text-purple-600 dark:text-purple-400">₹{sim80C.toLocaleString('en-IN')}</span>
                    </div>
                    <Input
                      type="number"
                      step="5000"
                      min="0"
                      max="150000"
                      value={sim80C}
                      onChange={(e) => setSim80C(Math.min(150000, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label className="text-[11px] text-gray-500">Sec 80D Mediclaim (Max ₹1L)</Label>
                      <span className="font-mono text-purple-600 dark:text-purple-400">₹{sim80D.toLocaleString('en-IN')}</span>
                    </div>
                    <Input
                      type="number"
                      step="2500"
                      min="0"
                      max="100000"
                      value={sim80D}
                      onChange={(e) => setSim80D(Math.min(100000, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Simulation Result KPI Cards */}
              {simResult && (
                <div className="space-y-5 animate-in fade-in-50">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-900 dark:text-indigo-300">
                      <p className="text-[11px] font-medium text-gray-500 dark:text-zinc-400">Earned Gross</p>
                      <p className="text-lg font-bold font-mono mt-0.5">
                        ₹{simResult.earnings.earned_gross_inr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400">Pro-rated pay</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-300">
                      <p className="text-[11px] font-medium text-gray-500 dark:text-zinc-400">Total Deductions</p>
                      <p className="text-lg font-bold font-mono mt-0.5">
                        ₹{simResult.deductions.total_deductions_inr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400">PF + ESI + PT + TDS</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                      <p className="text-[11px] font-medium text-gray-500 dark:text-zinc-400">Take-Home (Net)</p>
                      <p className="text-lg font-bold font-mono mt-0.5">
                        ₹{simResult.take_home.net_pay_inr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Bank credit amount</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-300">
                      <p className="text-[11px] font-medium text-gray-500 dark:text-zinc-400">Monthly CTC Cost</p>
                      <p className="text-lg font-bold font-mono mt-0.5">
                        ₹{simResult.employer_cost.employer_ctc_monthly_inr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400">Gross + Empr PF/ESI/Grat</span>
                    </div>
                  </div>

                  {/* Detailed Statutory Breakdown Table */}
                  <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden text-xs">
                    <div className="px-4 py-2.5 bg-gray-50/70 dark:bg-zinc-900/60 font-semibold text-gray-700 dark:text-zinc-300 flex justify-between items-center border-b border-gray-200 dark:border-zinc-800">
                      <span>Statutory Component</span>
                      <div className="flex gap-8">
                        <span>Employee Share</span>
                        <span>Employer Share</span>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                      {/* PF Row */}
                      <div className="px-4 py-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">Provident Fund (EPFO)</span>
                          <span className="text-[10px] text-gray-400 block">
                            Wage: ₹{(simResult.deductions.employee_pf.pf_wage_paise / 100).toLocaleString('en-IN')}
                            {simResult.deductions.employee_pf.wage_ceiling_applied && ' (₹15,000 ceiling)'}
                          </span>
                        </div>
                        <div className="flex gap-8 font-mono">
                          <span className="text-rose-600 dark:text-rose-400 w-24 text-right">
                            ₹{(simResult.deductions.employee_pf.employee_pf_paise / 100).toLocaleString('en-IN')}
                          </span>
                          <span className="text-gray-700 dark:text-zinc-300 w-24 text-right">
                            ₹{(simResult.employer_contributions.employer_pf_paise / 100).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* ESI Row */}
                      <div className="px-4 py-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">Employee State Insurance (ESI)</span>
                          <span className="text-[10px] text-gray-400 block">
                            {simResult.deductions.employee_esi.is_applicable
                              ? 'Applicable (Gross ≤ ₹21,000)'
                              : 'Exempt (Gross > ₹21,000)'}
                          </span>
                        </div>
                        <div className="flex gap-8 font-mono">
                          <span className="text-rose-600 dark:text-rose-400 w-24 text-right">
                            ₹{(simResult.deductions.employee_esi.employee_esi_paise / 100).toLocaleString('en-IN')}
                          </span>
                          <span className="text-gray-700 dark:text-zinc-300 w-24 text-right">
                            ₹{(simResult.employer_contributions.employer_esi_paise / 100).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* PT Row */}
                      <div className="px-4 py-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">Professional Tax (PT)</span>
                          <span className="text-[10px] text-gray-400 block">{simResult.deductions.professional_tax.state}</span>
                        </div>
                        <div className="flex gap-8 font-mono">
                          <span className="text-rose-600 dark:text-rose-400 w-24 text-right">
                            ₹{(simResult.deductions.professional_tax.pt_paise / 100).toLocaleString('en-IN')}
                          </span>
                          <span className="text-gray-400 w-24 text-right">—</span>
                        </div>
                      </div>

                      {/* LWF Row */}
                      <div className="px-4 py-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">Labour Welfare Fund (LWF)</span>
                        </div>
                        <div className="flex gap-8 font-mono">
                          <span className="text-rose-600 dark:text-rose-400 w-24 text-right">
                            ₹{(simResult.deductions.labour_welfare_fund.employee_lwf_paise / 100).toLocaleString('en-IN')}
                          </span>
                          <span className="text-gray-700 dark:text-zinc-300 w-24 text-right">
                            ₹{(simResult.deductions.labour_welfare_fund.employer_lwf_paise / 100).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* TDS Row */}
                      <div className="px-4 py-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">Income Tax TDS ({simResult.deductions.tds.tax_regime} Regime)</span>
                          <span className="text-[10px] text-gray-400 block">
                            Taxable: ₹{(simResult.deductions.tds.taxable_income_paise / 100).toLocaleString('en-IN')} · Annual: ₹{(simResult.deductions.tds.annual_tax_paise / 100).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex gap-8 font-mono">
                          <span className="text-rose-600 dark:text-rose-400 w-24 text-right">
                            ₹{(simResult.deductions.tds.monthly_tds_paise / 100).toLocaleString('en-IN')}
                          </span>
                          <span className="text-gray-400 w-24 text-right">—</span>
                        </div>
                      </div>

                      {/* Gratuity Row */}
                      <div className="px-4 py-2.5 flex items-center justify-between bg-purple-500/[0.02]">
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">Gratuity Provision (Statutory)</span>
                          <span className="text-[10px] text-gray-400 block">(15 / 26) * Basic / 12</span>
                        </div>
                        <div className="flex gap-8 font-mono">
                          <span className="text-gray-400 w-24 text-right">—</span>
                          <span className="text-purple-600 dark:text-purple-400 w-24 text-right">
                            ₹{(simResult.employer_contributions.gratuity_provision_paise / 100).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StatutoryComplianceCenter;
