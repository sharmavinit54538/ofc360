/**
 * @file ManagerRequisitionsPage.tsx
 * @description Manager view for Job Requisitions. Re-exports the complete RequisitionsPage
 * with role-scoped headcount and requisition controls.
 */

import React from 'react';
import { RequisitionsPage } from './RequisitionsPage';

export const ManagerRequisitionsPage: React.FC = () => {
  return <RequisitionsPage />;
};

export default ManagerRequisitionsPage;
