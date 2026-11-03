import React from 'react';
import { Navigate } from 'react-router-dom';

export const DashboardRecruitmentRoute: React.FC = () => {
  return <Navigate to="/dashboard/talent" replace />;
};

export default DashboardRecruitmentRoute;
