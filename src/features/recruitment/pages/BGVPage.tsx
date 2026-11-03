import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { ShieldCheck } from 'lucide-react';

export const BGVPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="BGV Management"
    subtitle="Background Verification"
    icon={ShieldCheck}
    roles={['HR_ADMIN', 'HR_EXECUTIVE']}
    description="Manage background verification checks, track vendor status, and resolve discrepancies."
  />
);

export default BGVPage;