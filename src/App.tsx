import React from 'react';
import { AppProviders } from '@/app/providers/AppProviders';
import { AppRoutes } from '@/app/router/AppRoutes';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary title="Application Error" message="An error occurred while running the application.">
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
