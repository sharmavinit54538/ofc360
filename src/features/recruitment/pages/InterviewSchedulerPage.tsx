import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { CalendarDays } from 'lucide-react';

export const InterviewSchedulerPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Interview Scheduler"
    subtitle="Interview Management"
    icon={CalendarDays}
    roles={['HR_ADMIN', 'HR_EXECUTIVE', 'MANAGER']}
    description="Schedule, coordinate, and manage interview rounds with automated reminders and calendar sync."
  />
);

export default InterviewSchedulerPage;