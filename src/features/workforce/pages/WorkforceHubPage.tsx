import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Building2,
  UserCheck,
  Briefcase,
  Network,
  Search,
  ArrowRight,
  Sparkles,
  Filter,
  Plus,
  BadgeCheck,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';

interface WorkforceModuleCard {
  id: string;
  title: string;
  category: 'employees' | 'managers' | 'departments' | 'organization';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
  metric?: { label: string; value: string };
  actionText?: string;
  badge?: string;
}

const WORKFORCE_MODULES: WorkforceModuleCard[] = [
  {
    id: 'employees',
    title: 'Employees Directory & Profiles',
    category: 'employees',
    description: 'Comprehensive staff database, personnel records, employment contracts, personal contact information, and active status tracking.',
    icon: Users,
    tags: ['Directory', 'Full-time / Remote', 'Profiles', 'Employee ID'],
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    metric: { label: 'Active Staff', value: '248' },
    actionText: 'View Employees',
    badge: 'Primary',
  },
  {
    id: 'managers',
    title: 'Managers & Team Leads',
    category: 'managers',
    description: 'Team leadership hierarchy, reporting manager assignments, span-of-control ratios, and approval authority configuration.',
    icon: UserPlus,
    tags: ['Supervisors', 'Reporting Lines', 'Span of Control', 'Approvers'],
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    metric: { label: 'Assigned Leads', value: '28' },
    actionText: 'Manage Leads',
    badge: '28 Leads',
  },
  {
    id: 'departments',
    title: 'Departments & Cost Centers',
    category: 'departments',
    description: 'Corporate organizational divisions, department heads (HODs), operational budgets, cost center codes, and headcount caps.',
    icon: Building2,
    tags: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    metric: { label: 'Departments', value: '8 Units' },
    actionText: 'Explore Units',
  },
  {
    id: 'org-chart',
    title: 'Org Chart & Hierarchy Tree',
    category: 'organization',
    description: 'Visual interactive corporate hierarchy, reporting chain visualization, executive board mapping, and team relationships.',
    icon: Network,
    tags: ['Visual Hierarchy', 'Tree View', 'Matrix Structure'],
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    metric: { label: 'Levels', value: '5 Tiers' },
    actionText: 'View Tree',
  },
  {
    id: 'roles-designations',
    title: 'Designations & Career Bands',
    category: 'organization',
    description: 'Standardized job roles, seniority ladders (Junior, Mid, Senior, Staff, Director), and role qualification requirements.',
    icon: Briefcase,
    tags: ['Job Titles', 'Pay Bands', 'Career Matrix'],
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    metric: { label: 'Designations', value: '34' },
    actionText: 'Manage Roles',
  },
  {
    id: 'workforce-verification',
    title: 'Staff Verification & Status',
    category: 'employees',
    description: 'Identity verification, background check status, active probationary reviews, and contractual renewals.',
    icon: UserCheck,
    tags: ['KYC / ID', 'Probation', 'Contract Renewal'],
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    metric: { label: 'Verified', value: '98.4%' },
    actionText: 'Audit Status',
  },
];

// Sample employee directory data
const SAMPLE_EMPLOYEES = [
  { id: 'EMP-001', name: 'Aarav Sharma', role: 'Staff Software Engineer', dept: 'Engineering', manager: 'Vikram Malhotra', email: 'aarav.sharma@equinoxsphere.com', status: 'Active', avatar: 'AS' },
  { id: 'EMP-002', name: 'Priya Iyer', role: 'Lead Product Designer', dept: 'Design & UX', manager: 'Ananya Rao', email: 'priya.iyer@equinoxsphere.com', status: 'Active', avatar: 'PI' },
  { id: 'EMP-003', name: 'Rohan Verma', role: 'Senior Talent Acquisition Lead', dept: 'People & HR', manager: 'Meera Kapoor', email: 'rohan.verma@equinoxsphere.com', status: 'Active', avatar: 'RV' },
  { id: 'EMP-004', name: 'Sneha Patel', role: 'Engineering Manager - Cloud', dept: 'Engineering', manager: 'Vikram Malhotra', email: 'sneha.patel@equinoxsphere.com', status: 'Active', avatar: 'SP' },
  { id: 'EMP-005', name: 'Karan Joshi', role: 'Account Executive', dept: 'Sales & Growth', manager: 'Rajesh Nair', email: 'karan.joshi@equinoxsphere.com', status: 'Onboarding', avatar: 'KJ' },
];

const SAMPLE_MANAGERS = [
  { id: 'MGR-01', name: 'Vikram Malhotra', title: 'VP of Engineering', dept: 'Engineering', directReports: 42, email: 'vikram.m@equinoxsphere.com' },
  { id: 'MGR-02', name: 'Ananya Rao', title: 'Director of Product Design', dept: 'Design & UX', directReports: 14, email: 'ananya.r@equinoxsphere.com' },
  { id: 'MGR-03', name: 'Meera Kapoor', title: 'Chief People Officer', dept: 'People & HR', directReports: 18, email: 'meera.k@equinoxsphere.com' },
  { id: 'MGR-04', name: 'Rajesh Nair', title: 'Head of Global Sales', dept: 'Sales & Growth', directReports: 26, email: 'rajesh.n@equinoxsphere.com' },
];

const SAMPLE_DEPARTMENTS = [
  { id: 'DEP-ENG', name: 'Engineering & Technology', head: 'Vikram Malhotra', staffCount: 112, budget: '$1.4M', location: 'Floor 4, Block B' },
  { id: 'DEP-HR', name: 'People, Culture & HR', head: 'Meera Kapoor', staffCount: 22, budget: '$320K', location: 'Floor 2, Block A' },
  { id: 'DEP-SALES', name: 'Sales & Business Expansion', head: 'Rajesh Nair', staffCount: 48, budget: '$850K', location: 'Floor 3, Block B' },
  { id: 'DEP-DES', name: 'Design & Creative Systems', head: 'Ananya Rao', staffCount: 24, budget: '$410K', location: 'Floor 4, Block A' },
];

export const WorkforceHubPage: React.FC = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'modules' | 'employees' | 'managers' | 'departments'>('modules');

  const filteredModules = useMemo(() => {
    return WORKFORCE_MODULES.filter((mod) => {
      const matchesSearch =
        mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || mod.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleAction = (moduleId: string) => {
    if (moduleId === 'employees') {
      setActiveTab('employees');
      toast.success('Opened Employees Directory');
    } else if (moduleId === 'managers') {
      setActiveTab('managers');
      toast.success('Opened Managers Overview');
    } else if (moduleId === 'departments') {
      setActiveTab('departments');
      toast.success('Opened Departments List');
    } else {
      toast.info(`Accessing ${moduleId.toUpperCase()} module...`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-blue-500/10 via-slate-50 to-indigo-500/5 dark:from-blue-950/20 dark:via-zinc-900 dark:to-indigo-950/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide">
              <Users className="w-3.5 h-3.5" />
              Workforce Operations Hub
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Workforce Management
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-2xl">
              Centralized command center for managing Employees, Team Managers, Departments, Organizational Hierarchy, and Staff Directory records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTab('employees');
                toast.info('Filter applied: Employees Directory');
              }}
              className="gap-2 text-xs"
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              Employees
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTab('managers');
                toast.info('Filter applied: Managers');
              }}
              className="gap-2 text-xs"
            >
              <UserPlus className="w-3.5 h-3.5 text-violet-600" />
              Managers
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTab('departments');
                toast.info('Filter applied: Departments');
              }}
              className="gap-2 text-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              Departments
            </Button>
            <Button
              size="sm"
              onClick={() => toast.success('Add Employee workflow initialized')}
              className="gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-zinc-800/80">
          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
              <span>Total Headcount</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">248</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
              <TrendingUp className="w-3 h-3" /> +12 this month
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
              <span>Team Leads</span>
              <UserPlus className="w-4 h-4 text-violet-600" />
            </div>
            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">28</div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              1:8.8 avg ratio
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
              <span>Departments</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">8 Units</div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
              100% staffed HODs
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-medium">
              <span>Profile Health</span>
              <BadgeCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">98.4%</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
              Fully compliant
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Views */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('modules')}
          className={cn(
            'px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
            activeTab === 'modules'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
          )}
        >
          <Sparkles className="w-4 h-4" />
          Hub Overview
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={cn(
            'px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
            activeTab === 'employees'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
          )}
        >
          <Users className="w-4 h-4" />
          Employees Directory
        </button>
        <button
          onClick={() => setActiveTab('managers')}
          className={cn(
            'px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
            activeTab === 'managers'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
          )}
        >
          <UserPlus className="w-4 h-4" />
          Managers & Hierarchy
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={cn(
            'px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
            activeTab === 'departments'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
          )}
        >
          <Building2 className="w-4 h-4" />
          Departments
        </button>
      </div>

      {/* Main View: Hub Cards */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search workforce modules, staff, designations, departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs md:text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-500 dark:text-zinc-400 mr-1 flex items-center gap-1 font-medium">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All Modules' },
                { id: 'employees', label: 'Employees' },
                { id: 'managers', label: 'Managers' },
                { id: 'departments', label: 'Departments' },
                { id: 'organization', label: 'Structure' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                    selectedCategory === cat.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Workforce Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModules.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 md:p-6 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-400/50 dark:hover:border-blue-500/30 overflow-hidden"
                >
                  <div className={cn('absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl transition-all duration-300 opacity-60 group-hover:opacity-100 bg-gradient-to-br', module.gradient)} />

                  <div className="relative space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className={cn('p-3 rounded-xl', module.iconBg)}>
                        <Icon className={cn('w-6 h-6', module.iconColor)} />
                      </div>
                      {module.badge && (
                        <Badge variant="brand" className="text-[11px] font-semibold border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40">
                          {module.badge}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {module.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                        {module.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {module.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800/80 text-[10px] font-medium text-slate-600 dark:text-zinc-400 border border-slate-200/50 dark:border-zinc-700/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                    {module.metric ? (
                      <div>
                        <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                          {module.metric.label}
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {module.metric.value}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Ready to configure</span>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAction(module.id)}
                      className="gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:translate-x-0.5 transition-all p-0 h-auto"
                    >
                      <span>{module.actionText || 'Manage'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Employees Directory Tab */}
      {activeTab === 'employees' && (
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <div className="p-4 md:p-6 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Employee Directory
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Showing 5 of 248 registered staff members across all departments
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => toast.info('Exporting workforce directory to CSV...')}
                variant="outline"
                className="text-xs"
              >
                Export CSV
              </Button>
              <Button
                size="sm"
                onClick={() => toast.success('Add Employee wizard ready')}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Employee
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-slate-50 dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Reporting Manager</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {SAMPLE_EMPLOYEES.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          {emp.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{emp.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                            <span>{emp.id}</span>
                            <span>•</span>
                            <span>{emp.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-zinc-300">
                      {emp.role}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-zinc-400">
                      {emp.dept}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-zinc-400 font-medium">
                      {emp.manager}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-[11px] font-semibold',
                        emp.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      )}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast.info(`Viewing profile for ${emp.name}`)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        View Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Managers & Hierarchy Tab */}
      {activeTab === 'managers' && (
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <div className="p-4 md:p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-violet-600" />
                Managers & Team Leads
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Reporting leaders, team allocation and span-of-control
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => toast.info('Assign Manager drawer opened')}
              className="text-xs bg-violet-600 hover:bg-violet-700 text-white"
            >
              <UserPlus className="w-3.5 h-3.5 mr-1" />
              Assign Lead
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
            {SAMPLE_MANAGERS.map((mgr) => (
              <div
                key={mgr.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {mgr.name}
                    <Badge variant="slate" className="text-[10px] text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800">
                      {mgr.dept}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">{mgr.title}</div>
                  <div className="text-[11px] text-slate-400 dark:text-zinc-500">{mgr.email}</div>
                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{mgr.directReports} Direct & Indirect Reports</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info(`Viewing team hierarchy for ${mgr.name}`)}
                  className="text-xs"
                >
                  View Team
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          <div className="p-4 md:p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Departments & Business Units
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Organizational units, department heads, and budgets
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => toast.success('Create Department modal ready')}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Department
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
            {SAMPLE_DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900 dark:text-white">{dept.name}</div>
                  <Badge variant="success" className="text-[10px] text-emerald-600 border-emerald-200 dark:border-emerald-800">
                    {dept.id}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Head of Dept (HOD)</span>
                    <span className="font-medium text-slate-800 dark:text-zinc-200">{dept.head}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Total Staff</span>
                    <span className="font-medium text-slate-800 dark:text-zinc-200">{dept.staffCount} Members</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Annual Budget</span>
                    <span className="font-medium text-slate-800 dark:text-zinc-200">{dept.budget}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Location</span>
                    <span className="font-medium text-slate-800 dark:text-zinc-200">{dept.location}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-700/50 flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast.info(`Viewing department details for ${dept.name}`)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 p-0 h-auto font-medium"
                  >
                    Manage Department →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkforceHubPage;
