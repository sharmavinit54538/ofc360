import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/slices/authSlice';
import { authApi } from '../features/auth/api/authApi';
import { hrDashboardApi } from '../features/hr-dashboard/api/hrDashboardApi';
import { travelApi } from '../features/travel/api/travelApi';
import { expensesApi } from '../features/expenses/api/expensesApi';
import { settingsApi } from '../features/settings/api/settingsApi';
import { exitsApi } from '../features/exit-management/api/exitsApi';
import { onboardingApi } from '../features/employee-onboarding/api/onboardingApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [hrDashboardApi.reducerPath]: hrDashboardApi.reducer,
    [travelApi.reducerPath]: travelApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [exitsApi.reducerPath]: exitsApi.reducer,
    [onboardingApi.reducerPath]: onboardingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action paths or headers if needed
        ignoredActions: ['auth/setCredentials', 'auth/setUser'],
      },
    }).concat(
      authApi.middleware,
      hrDashboardApi.middleware,
      travelApi.middleware,
      expensesApi.middleware,
      settingsApi.middleware,
      exitsApi.middleware,
      onboardingApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
