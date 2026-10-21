/**
 * @file authSlice.ts
 * @description Production-grade Redux auth slice managing user session, in-memory tokens,
 * persistent storage hydration, and role states.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, UserRole } from '../types/auth.types';

const ACCESS_TOKEN_KEY = 'ofc360_access_token';
const REFRESH_TOKEN_KEY = 'ofc360_refresh_token';
const USER_KEY = 'ofc360_user_session';
const ROLE_KEY = 'ofc360_active_role';
const REMEMBER_ME_KEY = 'ofc360_remember_session';

/**
 * Hydrates authentication state from client storage on application boot.
 */
const loadPersistedSession = (): {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  rememberMe: boolean;
} => {
  try {
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    const storage = rememberMe ? localStorage : sessionStorage;

    const storedUser = storage.getItem(USER_KEY);
    const storedAccess = storage.getItem(ACCESS_TOKEN_KEY);
    const storedRefresh = storage.getItem(REFRESH_TOKEN_KEY);
    const storedRole = storage.getItem(ROLE_KEY) as UserRole | null;

    const parsedUser = storedUser ? (JSON.parse(storedUser) as User) : null;
    const resolvedRole = storedRole || parsedUser?.activeRole || null;

    return {
      user: parsedUser,
      accessToken: storedAccess || null,
      refreshToken: storedRefresh || null,
      role: resolvedRole,
      rememberMe,
    };
  } catch (err) {
    console.error('Session hydration error:', err);
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      role: null,
      rememberMe: false,
    };
  }
};

const persisted = loadPersistedSession();

const initialState: AuthState = {
  user: persisted.user,
  accessToken: persisted.accessToken,
  refreshToken: persisted.refreshToken,
  isAuthenticated: Boolean(persisted.accessToken),
  isLoading: false,
  role: persisted.role,
  activeRole: persisted.role,
  isInitialized: false,
  rememberMe: persisted.rememberMe,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Stores user session and tokens upon successful login or registration.
     */
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        tokens: { accessToken: string; refreshToken?: string };
        rememberMe?: boolean;
      }>
    ) => {
      const { user, tokens, rememberMe = state.rememberMe } = action.payload;
      state.user = user;
      state.accessToken = tokens.accessToken;
      if (tokens.refreshToken) {
        state.refreshToken = tokens.refreshToken;
      }
      state.isAuthenticated = true;
      state.role = user.activeRole || user.roles[0] || 'EMPLOYEE';
      state.activeRole = state.role;
      state.rememberMe = rememberMe;
      state.isInitialized = true;
      state.isLoading = false;

      try {
        const storage = rememberMe ? localStorage : sessionStorage;
        const otherStorage = rememberMe ? sessionStorage : localStorage;

        // Clean alternate storage
        otherStorage.removeItem(ACCESS_TOKEN_KEY);
        otherStorage.removeItem(REFRESH_TOKEN_KEY);
        otherStorage.removeItem(USER_KEY);
        otherStorage.removeItem(ROLE_KEY);

        storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        if (tokens.refreshToken) {
          storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        }
        storage.setItem(USER_KEY, JSON.stringify(user));
        storage.setItem(ROLE_KEY, state.role);
        localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));
      } catch (err) {
        console.error('Session persistence failed:', err);
      }
    },

    /**
     * Updates in-memory access token during silent refresh.
     */
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;

      try {
        const storage = state.rememberMe ? localStorage : sessionStorage;
        storage.setItem(ACCESS_TOKEN_KEY, action.payload);
      } catch (err) {
        console.error('Access token storage error:', err);
      }
    },

    /**
     * Switches active user role for multi-role accounts.
     */
    setRole: (state, action: PayloadAction<UserRole>) => {
      const newRole = action.payload;
      if (state.user && state.user.roles.includes(newRole)) {
        state.role = newRole;
        state.activeRole = newRole;
        state.user.activeRole = newRole;

        try {
          const storage = state.rememberMe ? localStorage : sessionStorage;
          storage.setItem(ROLE_KEY, newRole);
          storage.setItem(USER_KEY, JSON.stringify(state.user));
        } catch (err) {
          console.error('Role switch storage error:', err);
        }
      }
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (!state.role) {
        state.role = action.payload.activeRole;
        state.activeRole = action.payload.activeRole;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    initializeAuth: (state) => {
      state.isInitialized = true;
    },

    /**
     * Clears all session states and client tokens securely.
     */
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.role = null;
      state.activeRole = null;
      state.isLoading = false;
      state.isInitialized = true;

      try {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(ROLE_KEY);
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(ROLE_KEY);
      } catch (err) {
        console.error('Logout cleanup error:', err);
      }
    },
  },
  extraReducers: (builder) => {
    // Intercept RTK Query actions to synchronize slice loading & user state
    builder
      .addMatcher(
        (action) =>
          typeof action.type === 'string' &&
          action.type.startsWith('authApi/') &&
          action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) =>
          typeof action.type === 'string' &&
          action.type.startsWith('authApi/') &&
          (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        (action: any) =>
          action.type === 'authApi/executeQuery/fulfilled' &&
          action.meta?.arg?.endpointName === 'getCurrentUser',
        (state, action: any) => {
          if (action.payload) {
            state.user = action.payload;
            state.role = action.payload.activeRole;
            state.activeRole = action.payload.activeRole;
          }
        }
      );
  },
});

export const {
  setCredentials,
  setAccessToken,
  setRole,
  setUser,
  setLoading,
  initializeAuth,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

// Root state helper types
interface StateWithAuth {
  auth: AuthState;
}

export const selectCurrentUser = (state: StateWithAuth) => state.auth.user;
export const selectAccessToken = (state: StateWithAuth) => state.auth.accessToken;
export const selectIsAuthenticated = (state: StateWithAuth) => state.auth.isAuthenticated;
export const selectAuthRole = (state: StateWithAuth) => state.auth.role;
export const selectActiveRole = (state: StateWithAuth) => state.auth.activeRole || state.auth.role;
export const selectUserPermissions = (state: StateWithAuth) => state.auth.user?.permissions ?? [];
export const selectIsAuthLoading = (state: StateWithAuth) => state.auth.isLoading;
export const selectIsAuthInitialized = (state: StateWithAuth) => state.auth.isInitialized;
