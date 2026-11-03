import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { ClipboardList } from 'lucide-react';

export const EmployeeInterviewsPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Assigned Interviews"
    subtitle="Panel Scorecards"
    icon={ClipboardList}
    roles={['EMPLOYEE']}
    description="View your assigned interview panels, complete scorecards, and submit feedback."
  />
);

export default EmployeeInterviewsPage;