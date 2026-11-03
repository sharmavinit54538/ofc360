import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { CheckSquare } from 'lucide-react';

export const ManagerInterviewsPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Panel Interviews"
    subtitle="Overdue Scorecards"
    icon={CheckSquare}
    roles={['MANAGER']}
    description="Manage interview panel assignments, submit scorecards, and track overdue feedback."
  />
);

export default ManagerInterviewsPage;