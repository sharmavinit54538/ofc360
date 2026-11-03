import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { UserCheck } from 'lucide-react';

export const ManagerCandidatesPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Candidate Reviews"
    subtitle="Pending Profile Reviews"
    icon={UserCheck}
    roles={['MANAGER']}
    description="Review candidate profiles assigned to your department, provide feedback, and advance pipelines."
  />
);

export default ManagerCandidatesPage;