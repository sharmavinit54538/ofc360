import React from 'react';
import { Users, ChevronDown } from 'lucide-react';
import type { NewHireListItem } from '../types/onboarding.types';

interface NewHireSelectorProps {
  newHires: NewHireListItem[];
  selectedEmployeeId?: string;
  onSelectEmployee: (id: string) => void;
  isLoading?: boolean;
}

export const NewHireSelector: React.FC<NewHireSelectorProps> = ({
  newHires,
  selectedEmployeeId,
  onSelectEmployee,
  isLoading,
}) => {
  if (newHires.length === 0 && !isLoading) return null;

  return (
    <div className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center gap-2 px-2 text-xs font-semibold text-gray-500 dark:text-zinc-400">
        <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        <span className="hidden sm:inline">Select New Hire:</span>
      </div>

      <div className="relative flex-1 max-w-xs">
        <select
          value={selectedEmployeeId || ''}
          onChange={(e) => onSelectEmployee(e.target.value)}
          disabled={isLoading}
          className="w-full pl-3 pr-8 py-1.5 text-xs font-semibold rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer truncate"
        >
          {newHires.map((hire) => (
            <option key={hire.employeeId} value={hire.employeeId}>
              {hire.name} &bull; {hire.department} ({hire.percentage}%)
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
