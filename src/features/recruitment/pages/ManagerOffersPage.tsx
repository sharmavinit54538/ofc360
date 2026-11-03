import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { FileCheck } from 'lucide-react';

export const ManagerOffersPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Offer Approvals"
    subtitle="Pending My Approvals"
    icon={FileCheck}
    roles={['MANAGER']}
    description="Review and approve offer letters for candidates in your department before dispatch."
  />
);

export default ManagerOffersPage;