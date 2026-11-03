import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { Briefcase } from 'lucide-react';

export const JobOpeningsPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Job Openings"
    subtitle="Open Positions"
    icon={Briefcase}
    roles={['HR_ADMIN', 'HR_EXECUTIVE']}
    description="Manage active job postings, track applications, and monitor vacancy fill rates."
  />
);

export default JobOpeningsPage;