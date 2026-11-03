import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { Users } from 'lucide-react';

export const CandidatePipelinePage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Candidates & ATS"
    subtitle="Pipeline Management"
    icon={Users}
    roles={['HR_ADMIN', 'HR_EXECUTIVE']}
    description="Track candidates through every stage of the hiring funnel with drag-and-drop pipeline management."
  />
);

export default CandidatePipelinePage;