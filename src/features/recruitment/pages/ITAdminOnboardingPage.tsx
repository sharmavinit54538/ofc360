import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { Laptop } from 'lucide-react';

export const ITAdminOnboardingPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Onboarding IT Queue"
    subtitle="Pending IT Provisioning"
    icon={Laptop}
    roles={['IT_ADMIN']}
    description="Manage IT provisioning tasks for new hires: laptop allocation, email setup, and tool access."
  />
);

export default ITAdminOnboardingPage;