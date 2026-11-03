/**
 * @file ManagerCandidatesPage.tsx
 * @description Manager view for Candidate Applications & ATS.
 * Re-exports the complete CandidatePipelinePage with department-scoped candidate reviews.
 */

import React from 'react';
import { CandidatePipelinePage } from './CandidatePipelinePage';

export const ManagerCandidatesPage: React.FC = () => {
  return <CandidatePipelinePage />;
};

export default ManagerCandidatesPage;
