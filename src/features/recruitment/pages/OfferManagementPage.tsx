import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { Award } from 'lucide-react';

export const OfferManagementPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Offer Management"
    subtitle="Offer Letters & Approvals"
    icon={Award}
    roles={['HR_ADMIN', 'HR_EXECUTIVE']}
    description="Generate, approve, and track offer letters with e-signature integration and version control."
  />
);

export default OfferManagementPage;