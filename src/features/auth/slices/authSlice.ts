/**
 * @file authSlice.ts
 * @description Production-grade Redux auth slice managing user session, in-memory tokens,
 * persistent storage hydration, and role states.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, UserRole, normalizeRole } from '../types/auth.types';

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

    // Check localStorage first, fallback to sessionStorage
    const storedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
    const storedRole = (localStorage.getItem(ROLE_KEY) || sessionStorage.getItem(ROLE_KEY)) as string | null;

    const parsedUser = storedUser ? (JSON.parse(storedUser) as User) : null;
    const resolvedRole = normalizeRole(storedRole || parsedUser?.activeRole || (parsedUser as any)?.role || null);

    if (parsedUser) {
      parsedUser.activeRole = resolvedRole;
      if (!parsedUser.roles || parsedUser.roles.length === 0) {
        parsedUser.roles = [resolvedRole];
      } else {
        parsedUser.roles = parsedUser.roles.map((r: string) => normalizeRole(r));
      }
    }

    return {
      user: parsedUser,
      accessToken: storedAccess || null,
      refreshToken: storedRefresh || null,
      role: parsedUser ? resolvedRole : null,
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
      if (!user || !tokens) return;

      const canonicalRole = normalizeRole(user.activeRole || (user as any).role || (user.roles && user.roles[0]) || 'EMPLOYEE');
      user.activeRole = canonicalRole;
      if (!user.roles || user.roles.length === 0) {
        user.roles = [canonicalRole];
      } else {
        user.roles = user.roles.map((r: string) => normalizeRole(r));
      }

      state.user = user;
      state.accessToken = tokens.accessToken || null;
      if (tokens.refreshToken) {
        state.refreshToken = tokens.refreshToken;
      }
      state.isAuthenticated = Boolean(tokens.accessToken);
      state.role = canonicalRole;
      state.activeRole = canonicalRole;
      state.rememberMe = rememberMe;
      state.isInitialized = true;
      state.isLoading = false;

      try {
        // ALWAYS persist tokens, user, and active role to localStorage so they are available
        // to baseQuery prepareHeaders, route rehydration, and across app reloads
        if (tokens.accessToken) {
          localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
          sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        }
        if (tokens.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
          sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        }
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        localStorage.setItem(ROLE_KEY, canonicalRole);
        sessionStorage.setItem(ROLE_KEY, canonicalRole);
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
      state.isAuthenticated = Boolean(action.payload);

      try {
        localStorage.setItem(ACCESS_TOKEN_KEY, action.payload);
        sessionStorage.setItem(ACCESS_TOKEN_KEY, action.payload);
      } catch (err) {
        console.error('Access token storage error:', err);
      }
    },

    /**
     * Switches active user role for multi-role accounts.
     */
    setRole: (state, action: PayloadAction<UserRole | string>) => {
      const newRole = normalizeRole(action.payload);
      if (state.user) {
        state.role = newRole;
        state.activeRole = newRole;
        state.user.activeRole = newRole;
        if (!state.user.roles.includes(newRole)) {
          state.user.roles.push(newRole);
        }

        try {
          localStorage.setItem(ROLE_KEY, newRole);
          sessionStorage.setItem(ROLE_KEY, newRole);
          localStorage.setItem(USER_KEY, JSON.stringify(state.user));
          sessionStorage.setItem(USER_KEY, JSON.stringify(state.user));
        } catch (err) {
          console.error('Role switch storage error:', err);
        }
      }
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      const canonicalRole = normalizeRole(action.payload.activeRole || (action.payload as any).role);
      state.role = canonicalRole;
      state.activeRole = canonicalRole;

      try {
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
        sessionStorage.setItem(USER_KEY, JSON.stringify(action.payload));
        localStorage.setItem(ROLE_KEY, canonicalRole);
        sessionStorage.setItem(ROLE_KEY, canonicalRole);
      } catch (err) {
        console.error('User update storage error:', err);
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    initializeAuth: (state) => {
      state.isInitialized = true;
      if (!state.accessToken || !state.user) {
        const reloaded = loadPersistedSession();
        if (reloaded.accessToken) {
          state.accessToken = reloaded.accessToken;
          state.refreshToken = reloaded.refreshToken;
          state.isAuthenticated = true;
          state.user = reloaded.user;
          state.role = reloaded.role;
          state.activeRole = reloaded.role;
        }
      }
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
            const r = normalizeRole(action.payload.activeRole || (action.payload as any).role);
            state.role = r;
            state.activeRole = r;
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
