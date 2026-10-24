import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Loader2,
  Users,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Palmtree,
  Target,
  UserPlus,
  Briefcase,
  Settings,
  Bot,
  FileText,
  Activity,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useGetEmployeesQuery } from '@/features/workforce/api/workforceApi';
import { useTheme } from '@/shared/context/ThemeContext';
import { cn } from '@/shared/lib/utils';

interface SearchResultItem {
  id: string;
  category: 'pages' | 'employees' | 'actions';
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  url?: string;
  onSelect?: () => void;
}

interface StaticNavOption {
  title: string;
  subtitle: string;
  url: string;
  category: 'pages';
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
}

interface QuickActionOption {
  title: string;
  subtitle: string;
  category: 'actions';
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  url?: string;
  actionId?: string;
}

const STATIC_PAGES: StaticNavOption[] = [
  {
    title: 'Workforce & Employees',
    subtitle: 'Employee directory, profiles & organization chart',
    url: '/dashboard/workforce',
    category: 'pages',
    icon: Users,
    keywords: ['workforce', 'employee', 'staff', 'team', 'directory', 'org chart', 'department', 'designation'],
  },
  {
    title: 'Attendance & Roster',
    subtitle: 'Punch records, shifts, face attendance & rosters',
    url: '/dashboard/attendance',
    category: 'pages',
    icon: CalendarCheck,
    keywords: ['attendance', 'punch', 'clock in', 'clock out', 'shifts', 'roster', 'biometric', 'face attendance', 'regularization'],
  },
  {
    title: 'Leave Management',
    subtitle: 'Leave requests, balances, approvals & holiday calendar',
    url: '/dashboard/leave',
    category: 'pages',
    icon: Palmtree,
    keywords: ['leave', 'vacation', 'time off', 'sick leave', 'casual leave', 'balance', 'apply leave'],
  },
  {
    title: 'Payroll & Compensation',
    subtitle: 'Salary structures, pay slips, deductions & disbursements',
    url: '/dashboard/payroll',
    category: 'pages',
    icon: CreditCard,
    keywords: ['payroll', 'salary', 'payslip', 'wages', 'compensation', 'ctc', 'deductions', 'bonus'],
  },
  {
    title: 'Performance & Appraisals',
    subtitle: 'Review cycles, goals, OKRs & 360° feedback',
    url: '/dashboard/performance',
    category: 'pages',
    icon: Target,
    keywords: ['performance', 'appraisal', 'review', 'goal', 'okr', 'rating', 'feedback', 'kpi'],
  },
  {
    title: 'Recruitment & Candidates',
    subtitle: 'Job openings, applicants pipeline & interview stages',
    url: '/dashboard/recruitment',
    category: 'pages',
    icon: Briefcase,
    keywords: ['recruitment', 'jobs', 'hiring', 'candidates', 'interviews', 'applicants', 'openings'],
  },
  {
    title: 'AI Intelligence Hub',
    subtitle: 'Agentic assistants, document query & AI analytics',
    url: '/dashboard/ai-hub',
    category: 'pages',
    icon: Bot,
    keywords: ['ai', 'intelligence', 'agent', 'gemini', 'chat', 'assistant', 'smart'],
  },
  {
    title: 'Documents & Compliance',
    subtitle: 'Company policies, letters, contracts & compliance archive',
    url: '/dashboard/documents',
    category: 'pages',
    icon: FileText,
    keywords: ['documents', 'compliance', 'contracts', 'letters', 'policies', 'verification'],
  },
  {
    title: 'HR Operations',
    subtitle: 'Helpdesk tickets, asset allocation, exit management & visitors',
    url: '/dashboard/hr-ops',
    category: 'pages',
    icon: Activity,
    keywords: ['hr ops', 'operations', 'tickets', 'helpdesk', 'assets', 'visitors', 'exits'],
  },
  {
    title: 'Settings & Preferences',
    subtitle: 'Organization settings, roles, security & profile',
    url: '/dashboard/settings',
    category: 'pages',
    icon: Settings,
    keywords: ['settings', 'preferences', 'configuration', 'profile', 'security', 'password', 'theme'],
  },
  {
    title: 'Company Overview',
    subtitle: 'Executive dashboard metrics & headcounts',
    url: '/dashboard',
    category: 'pages',
    icon: LayoutDashboard,
    keywords: ['overview', 'dashboard', 'home', 'kpi', 'metrics'],
  },
];

const QUICK_ACTIONS: QuickActionOption[] = [
  {
    title: 'Add New Employee',
    subtitle: 'Onboard a new employee to workforce',
    category: 'actions',
    icon: UserPlus,
    url: '/dashboard/workforce',
    keywords: ['add employee', 'new employee', 'create employee', 'hire', 'onboard'],
  },
  {
    title: 'Punch In / Out',
    subtitle: 'Record instant biometric attendance',
    category: 'actions',
    icon: CalendarCheck,
    url: '/dashboard/attendance',
    keywords: ['punch in', 'punch out', 'check in', 'check out', 'clock in'],
  },
  {
    title: 'Apply for Leave',
    subtitle: 'Submit leave or time-off request',
    category: 'actions',
    icon: Palmtree,
    url: '/dashboard/leave',
    keywords: ['apply leave', 'request leave', 'take time off', 'sick leave'],
  },
  {
    title: 'Create Goal / OKR',
    subtitle: 'Define a measurable performance objective',
    category: 'actions',
    icon: Target,
    url: '/dashboard/performance',
    keywords: ['create goal', 'new goal', 'add okr', 'target'],
  },
  {
    title: 'Toggle Color Theme',
    subtitle: 'Switch between Dark and Light mode',
    category: 'actions',
    icon: Sparkles,
    actionId: 'toggle-theme',
    keywords: ['theme', 'dark mode', 'light mode', 'switch theme', 'toggle dark'],
  },
];

export const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Debounce query by 250ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  // 2. Query workforce employees only when debounced query has at least 2 chars
  const shouldSearchEmployees = debouncedQuery.length >= 2;
  const { data: employeeData, isFetching: isSearchingEmployees } = useGetEmployeesQuery(
    { search: debouncedQuery, limit: 5 },
    { skip: !shouldSearchEmployees }
  );

  // 3. Compute matching pages and actions
  const matchedPages = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return STATIC_PAGES.filter(
      (page) =>
        page.title.toLowerCase().includes(q) ||
        page.subtitle.toLowerCase().includes(q) ||
        page.keywords.some((k) => k.includes(q))
    ).slice(0, 4);
  }, [debouncedQuery]);

  const matchedActions = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return QUICK_ACTIONS.filter(
      (act) =>
        act.title.toLowerCase().includes(q) ||
        act.subtitle.toLowerCase().includes(q) ||
        act.keywords.some((k) => k.includes(q))
    ).slice(0, 3);
  }, [debouncedQuery]);

  const matchedEmployees = useMemo(() => {
    if (!shouldSearchEmployees || !employeeData?.items) return [];
    return employeeData.items.slice(0, 4);
  }, [shouldSearchEmployees, employeeData]);

  // Combine into a flat list of result items
  const allResults: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // Pages
    matchedPages.forEach((p) => {
      items.push({
        id: `page-${p.url}`,
        category: 'pages',
        title: p.title,
        subtitle: p.subtitle,
        icon: p.icon,
        url: p.url,
      });
    });

    // Employees
    matchedEmployees.forEach((emp) => {
      items.push({
        id: `emp-${emp.id}`,
        category: 'employees',
        title: emp.fullName || `${emp.firstName} ${emp.lastName}`.trim() || 'Employee',
        subtitle: [emp.employeeCode, emp.designation, emp.departmentName].filter(Boolean).join(' • '),
        icon: Users,
        badge: emp.status || undefined,
        url: `/dashboard/workforce`,
      });
    });

    // Actions
    matchedActions.forEach((act) => {
      items.push({
        id: `action-${act.title}`,
        category: 'actions',
        title: act.title,
        subtitle: act.subtitle,
        icon: act.icon,
        url: act.url,
        onSelect: act.actionId === 'toggle-theme' ? toggleTheme : undefined,
      });
    });

    return items;
  }, [matchedPages, matchedEmployees, matchedActions, toggleTheme]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [allResults]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle selection
  const handleSelectItem = useCallback(
    (item: SearchResultItem) => {
      setIsOpen(false);
      setQuery('');
      setDebouncedQuery('');

      if (item.onSelect) {
        item.onSelect();
        return;
      }
      if (item.url) {
        navigate(item.url);
      }
    },
    [navigate]
  );

  // Keyboard navigation within results
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || allResults.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allResults.length) % allResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = allResults[selectedIndex];
      if (item) {
        handleSelectItem(item);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const isDebouncing = query.trim() !== debouncedQuery;
  const isLoading = isDebouncing || isSearchingEmployees;
  const hasQuery = query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-56 md:w-80 flex-shrink-0">
      {/* Search Bar Input Container */}
      <div
        className={cn(
          'relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 border',
          isOpen
            ? 'bg-white dark:bg-[#1a1a1a] border-brand-500 shadow-md ring-2 ring-brand-500/20'
            : 'bg-gray-100 hover:bg-gray-150 dark:bg-[#282828] dark:hover:bg-[#303030] border-gray-200 dark:border-zinc-800'
        )}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 text-brand-500 animate-spin shrink-0" />
        ) : (
          <Search className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400 shrink-0" />
        )}

        <input
          ref={inputRef}
          type="text"
          id="ofc360-global-search"
          name="ofc360_global_search"
          placeholder="Search employees, modules..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            // Only open if there is a query, so NO history dropdown ever appears on focus!
            if (query.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleInputKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="w-full bg-transparent text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none text-xs"
        />

        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-0.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors shrink-0"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-gray-200/70 dark:bg-zinc-700/60 border border-gray-300 dark:border-zinc-600 text-[10px] font-semibold text-gray-500 dark:text-zinc-400 select-none shrink-0">
            Ctrl K
          </kbd>
        )}
      </div>

      {/* Results Dropdown Panel (Only renders when user has entered a query - NO history or past search list is EVER rendered) */}
      {isOpen && hasQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 max-h-[440px] flex flex-col">
          {isLoading && allResults.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500 dark:text-zinc-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
              <span>Searching OFC360...</span>
            </div>
          ) : allResults.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 mb-2.5">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                No results found for "{query}"
              </p>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
                Try searching for an employee name, code, department, or module name.
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto py-2 divide-y divide-gray-100 dark:divide-zinc-800/60">
              {/* Category: Pages */}
              {matchedPages.length > 0 && (
                <div className="py-1">
                  <div className="px-3.5 py-1 text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-zinc-500">
                    Pages & Modules
                  </div>
                  {allResults
                    .filter((r) => r.category === 'pages')
                    .map((item) => {
                      const idx = allResults.indexOf(item);
                      const isSelected = idx === selectedIndex;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectItem(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={cn(
                            'w-full text-left px-3.5 py-2 flex items-center justify-between gap-3 text-xs transition-colors',
                            isSelected
                              ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100'
                              : 'text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-900/60'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                                isSelected
                                  ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400'
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{item.title}</p>
                              {item.subtitle && (
                                <p className="text-[11px] text-gray-400 dark:text-zinc-500 truncate">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                          <ArrowRight
                            className={cn(
                              'w-3.5 h-3.5 shrink-0 transition-transform',
                              isSelected ? 'text-brand-500 translate-x-0.5' : 'text-gray-300 dark:text-zinc-600'
                            )}
                          />
                        </button>
                      );
                    })}
                </div>
              )}

              {/* Category: Employees */}
              {matchedEmployees.length > 0 && (
                <div className="py-1">
                  <div className="px-3.5 py-1 text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-zinc-500">
                    Employees
                  </div>
                  {allResults
                    .filter((r) => r.category === 'employees')
                    .map((item) => {
                      const idx = allResults.indexOf(item);
                      const isSelected = idx === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectItem(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={cn(
                            'w-full text-left px-3.5 py-2 flex items-center justify-between gap-3 text-xs transition-colors',
                            isSelected
                              ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100'
                              : 'text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-900/60'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                              {item.title.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{item.title}</p>
                              {item.subtitle && (
                                <p className="text-[11px] text-gray-400 dark:text-zinc-500 truncate">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 uppercase shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              )}

              {/* Category: Quick Actions */}
              {matchedActions.length > 0 && (
                <div className="py-1">
                  <div className="px-3.5 py-1 text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-zinc-500">
                    Quick Actions
                  </div>
                  {allResults
                    .filter((r) => r.category === 'actions')
                    .map((item) => {
                      const idx = allResults.indexOf(item);
                      const isSelected = idx === selectedIndex;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectItem(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={cn(
                            'w-full text-left px-3.5 py-2 flex items-center justify-between gap-3 text-xs transition-colors',
                            isSelected
                              ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100'
                              : 'text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-900/60'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={cn(
                                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                                isSelected
                                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400'
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{item.title}</p>
                              {item.subtitle && (
                                <p className="text-[11px] text-gray-400 dark:text-zinc-500 truncate">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] font-medium text-gray-400 dark:text-zinc-500 shrink-0">
                            Action
                          </span>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Footer Guide */}
          <div className="px-3.5 py-2 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-gray-400 dark:text-zinc-500 select-none">
            <div className="flex items-center gap-2">
              <span>Navigate <kbd className="font-mono text-[10px]">↑↓</kbd></span>
              <span>Select <kbd className="font-mono text-[10px]">↵</kbd></span>
              <span>Close <kbd className="font-mono text-[10px]">Esc</kbd></span>
            </div>
            <span className="text-[10px] font-medium text-gray-400">OFC360 Search</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
