import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { BarChart3 } from 'lucide-react';

export const RecruitmentReportsPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Recruitment Reports"
    subtitle="Analytics & Reporting"
    icon={BarChart3}
    roles={['HR_ADMIN', 'HR_EXECUTIVE']}
    description="Access comprehensive recruitment analytics, hiring trends, source effectiveness, and compliance reports."
  />
);

export default RecruitmentReportsPage;