import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/slices/authSlice';
import { authApi } from '../features/auth/api/authApi';
import { hrDashboardApi } from '../features/hr-dashboard/api/hrDashboardApi';
import { travelApi } from '../features/travel/api/travelApi';
import { expensesApi } from '../features/expenses/api/expensesApi';
import { settingsApi } from '../features/settings/api/settingsApi';
import { leaveApi } from '../features/leave/api/leaveApi';
import { attendanceApi } from '../features/attendance/api/attendanceApi';
import { performanceApi } from '../features/performance/api/performanceApi';
import { workforceApi } from '../features/workforce/api/workforceApi';
import { exitsApi } from '../features/exit-management/api/exitsApi';
import { onboardingApi } from '../features/employee-onboarding/api/onboardingApi';
import { visitorsApi } from '../services/visitorsApi';
import { assetsApi } from '../services/assetsApi';
import { timelineApi } from '../services/timelineApi';
import { hrOpsApi } from '../services/hrOpsApi';
import { analyticsApi } from '../services/analytics.api';
import { chatAssistantApi } from '../services/chatAssistantApi';
import { meetingIntelligenceApi } from '../services/meetingIntelligenceApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [hrDashboardApi.reducerPath]: hrDashboardApi.reducer,
    [travelApi.reducerPath]: travelApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [performanceApi.reducerPath]: performanceApi.reducer,
    [workforceApi.reducerPath]: workforceApi.reducer,
    [exitsApi.reducerPath]: exitsApi.reducer,
    [onboardingApi.reducerPath]: onboardingApi.reducer,
    [visitorsApi.reducerPath]: visitorsApi.reducer,
    [assetsApi.reducerPath]: assetsApi.reducer,
    [timelineApi.reducerPath]: timelineApi.reducer,
    [hrOpsApi.reducerPath]: hrOpsApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [chatAssistantApi.reducerPath]: chatAssistantApi.reducer,
    [meetingIntelligenceApi.reducerPath]: meetingIntelligenceApi.reducer,
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
      leaveApi.middleware,
      attendanceApi.middleware,
      performanceApi.middleware,
      workforceApi.middleware,
      exitsApi.middleware,
      onboardingApi.middleware,
      visitorsApi.middleware,
      assetsApi.middleware,
      timelineApi.middleware,
      hrOpsApi.middleware,
      analyticsApi.middleware,
      chatAssistantApi.middleware,
      meetingIntelligenceApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
