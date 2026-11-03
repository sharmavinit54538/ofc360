import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { Gift } from 'lucide-react';

export const EmployeeReferralsPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="My Referrals"
    subtitle="Referral Tracking & Rewards"
    icon={Gift}
    roles={['EMPLOYEE']}
    description="Submit referrals, track their progress, and view earned referral rewards."
  />
);

export default EmployeeReferralsPage;