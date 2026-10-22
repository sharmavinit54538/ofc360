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
    const storage = rememberMe ? localStorage : sessionStorage;

    const storedUser = storage.getItem(USER_KEY);
    const storedAccess = storage.getItem(ACCESS_TOKEN_KEY);
    const storedRefresh = storage.getItem(REFRESH_TOKEN_KEY);
    const storedRole = storage.getItem(ROLE_KEY) as string | null;

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
        const storage = rememberMe ? localStorage : sessionStorage;
        const otherStorage = rememberMe ? sessionStorage : localStorage;

        // Clean alternate storage
        otherStorage.removeItem(ACCESS_TOKEN_KEY);
        otherStorage.removeItem(REFRESH_TOKEN_KEY);
        otherStorage.removeItem(USER_KEY);
        otherStorage.removeItem(ROLE_KEY);

        if (tokens.accessToken) {
          storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        }
        if (tokens.refreshToken) {
          storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        }
        storage.setItem(USER_KEY, JSON.stringify(user));
        storage.setItem(ROLE_KEY, canonicalRole);
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
        const storage = state.rememberMe ? localStorage : sessionStorage;
        storage.setItem(ACCESS_TOKEN_KEY, action.payload);
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
      const canonicalRole = normalizeRole(action.payload.activeRole || (action.payload as any).role);
      state.role = canonicalRole;
      state.activeRole = canonicalRole;
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
