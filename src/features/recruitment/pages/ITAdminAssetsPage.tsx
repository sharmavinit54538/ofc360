import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { HardDrive } from 'lucide-react';

export const ITAdminAssetsPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Asset Allocation"
    subtitle="Hardware & Software Assets"
    icon={HardDrive}
    roles={['IT_ADMIN']}
    description="Track and manage asset assignments, returns, and inventory for onboarding and offboarding."
  />
);

export default ITAdminAssetsPage;