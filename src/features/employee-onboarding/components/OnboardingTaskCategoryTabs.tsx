import React from 'react';
import {
  FileText,
  User,
  Laptop,
  ShieldAlert,
  CreditCard,
  Users,
  LayoutGrid,
} from 'lucide-react';
import type { OnboardingTaskCategory, OnboardingTask } from '../types/onboarding.types';

interface OnboardingTaskCategoryTabsProps {
  activeCategory: OnboardingTaskCategory | 'ALL';
  onSelectCategory: (category: OnboardingTaskCategory | 'ALL') => void;
  tasks: OnboardingTask[];
}

export const OnboardingTaskCategoryTabs: React.FC<OnboardingTaskCategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  tasks,
}) => {
  const categories: {
    id: OnboardingTaskCategory | 'ALL';
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: 'ALL', label: 'All Milestones', icon: LayoutGrid },
    { id: 'DOCUMENTS', label: 'Document Uploads', icon: FileText },
    { id: 'PERSONAL_INFO', label: 'Personal & Emergency', icon: User },
    { id: 'IT_SETUP', label: 'IT & Equipment', icon: Laptop },
    { id: 'COMPLIANCE', label: 'Compliance & Policies', icon: ShieldAlert },
    { id: 'PAYROLL_TAX', label: 'Payroll & Tax', icon: CreditCard },
    { id: 'ORIENTATION', label: 'Team Orientation', icon: Users },
  ];

  const getCategoryCount = (catId: OnboardingTaskCategory | 'ALL') => {
    if (catId === 'ALL') return tasks.length;
    return tasks.filter((t) => t.category === catId).length;
  };

  const getPendingCount = (catId: OnboardingTaskCategory | 'ALL') => {
    const list = catId === 'ALL' ? tasks : tasks.filter((t) => t.category === catId);
    return list.filter((t) => t.status !== 'VERIFIED' && t.status !== 'SUBMITTED').length;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;
        const totalCount = getCategoryCount(cat.id);
        const pendingCount = getPendingCount(cat.id);

        if (cat.id !== 'ALL' && totalCount === 0) return null;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`
              px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all duration-150 border
              ${
                isActive
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-600/30'
                  : 'bg-white dark:bg-[#171717] border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60'
              }
            `}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{cat.label}</span>
            <span
              className={`
                px-1.5 py-0.5 rounded-full text-[10px] font-bold
                ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : pendingCount > 0
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400'
                }
              `}
            >
              {totalCount}
            </span>
          </button>
        );
      })}
    </div>
  );
};
