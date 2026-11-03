import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { FileText } from 'lucide-react';

export const RequisitionsPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Job Requisitions"
    subtitle="Requisition Management"
    icon={FileText}
    roles={['HR_ADMIN', 'HR_EXECUTIVE']}
    description="Create, approve, and track job requisitions across departments with budget controls."
  />
);

export default RequisitionsPage;