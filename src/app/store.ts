import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/slices/authSlice';
import { authApi } from '../features/auth/api/authApi';
import { hrDashboardApi } from '../features/hr-dashboard/api/hrDashboardApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [hrDashboardApi.reducerPath]: hrDashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action paths or headers if needed
        ignoredActions: ['auth/setCredentials', 'auth/setUser'],
      },
    }).concat(authApi.middleware, hrDashboardApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
