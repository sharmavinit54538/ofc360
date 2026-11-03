import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { LayoutDashboard } from 'lucide-react';

export const RecruitmentDashboardPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Recruitment Dashboard"
    subtitle="Overview Dashboard"
    icon={LayoutDashboard}
    roles={['HR_ADMIN', 'HR_EXECUTIVE']}
    description="Monitor key recruitment metrics, pipeline health, and hiring velocity at a glance."
  />
);

export default RecruitmentDashboardPage;