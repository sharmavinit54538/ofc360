import React from 'react';
import { AppProviders } from '@/app/providers/AppProviders';
import { AppRoutes } from '@/app/router/AppRoutes';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { AppUpdateDetector } from '@/shared/layout/AppUpdateDetector';

export const App: React.FC = () => {
  return (
    <ErrorBoundary title="Application Error" message="An error occurred while running the application.">
      <AppProviders>
        <AppUpdateDetector checkInterval={5 * 60 * 1000} versionEndpoint="/version.json">
          <AppRoutes />
        </AppUpdateDetector>
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;