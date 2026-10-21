import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { ToastProvider } from '@/components/ui/Toast';
import { AppRoutes } from '@/routes/AppRoutes';
import { initializeAuth } from '@/features/auth/slices/authSlice';

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppInitializer>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AppInitializer>
    </Provider>
  );
};

export default App;
