import { RecruitmentPlaceholderPage } from '../components/RecruitmentPlaceholderPage';
import { FilePlus } from 'lucide-react';

export const ManagerRequisitionsPage: React.FC = () => (
  <RecruitmentPlaceholderPage
    title="Team Requisitions"
    subtitle="My Open Vacancies"
    icon={FilePlus}
    roles={['MANAGER']}
    description="View and manage requisitions for your department, track approval status and headcount."
  />
);

export default ManagerRequisitionsPage;