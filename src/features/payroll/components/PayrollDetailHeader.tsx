/**
 * @file PayrollDetailHeader.tsx
 * @description Completely hidden header component.
 */

import React from 'react';

export interface PayrollDetailHeaderProps {
  activeModuleId?: string;
  onBack?: () => void;
  onSelectModule?: (id: string) => void;
  actions?: React.ReactNode;
}

export const PayrollDetailHeader: React.FC<PayrollDetailHeaderProps> = () => {
  return null;
};

export default PayrollDetailHeader;
