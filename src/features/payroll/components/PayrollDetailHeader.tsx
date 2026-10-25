/**
 * @file PayrollDetailHeader.tsx
 * @description Sticky top navigation bar for drill-down Payroll module detail views.
 */

import React from 'react';

export interface PayrollDetailHeaderProps {
  activeModuleId: string;
  onBack: () => void;
  onSelectModule: (id: string) => void;
  actions?: React.ReactNode;
}

export const PayrollDetailHeader: React.FC<PayrollDetailHeaderProps> = () => {
  return null;
};
