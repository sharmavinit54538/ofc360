import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { Compass } from 'lucide-react';

export const EmployeeCareersPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Internal Careers (IJP)"
    subtitle="Internal Job Postings"
    icon={Compass}
    roles={['EMPLOYEE']}
    description="Browse and apply for internal job opportunities across departments and locations."
  />
);

export default EmployeeCareersPage;