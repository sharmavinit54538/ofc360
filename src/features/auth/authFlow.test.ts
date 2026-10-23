import { describe, it, expect, beforeEach } from 'vitest';
import {
  normalizeAuthResponse,
  normalizeRole,
  normalizeUser,
  ROLE_DASHBOARD_ROUTES,
} from './types/auth.types';
import authReducer, { setCredentials, logout } from './slices/authSlice';

describe('Auth Flow & Normalization', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('normalizeAuthResponse', () => {
    it('correctly extracts access token from data.token format', () => {
      const response = {
        success: true,
        data: {
          token: 'jwt_from_data_token',
          user: {
            id: 'u1',
            email: 'admin@ofc360.com',
            role: 'super_admin',
            fullName: 'Super Admin',
          },
        },
      };

      const normalized = normalizeAuthResponse(response);
      expect(normalized.tokens.accessToken).toBe('jwt_from_data_token');
      expect(normalized.user.email).toBe('admin@ofc360.com');
      expect(normalized.user.activeRole).toBe('SUPER_ADMIN');
    });

    it('correctly extracts access token from top-level token and access_token', () => {
      const res1 = normalizeAuthResponse({ token: 'jwt_top_level' });
      expect(res1.tokens.accessToken).toBe('jwt_top_level');

      const res2 = normalizeAuthResponse({ access_token: 'jwt_snake_case' });
      expect(res2.tokens.accessToken).toBe('jwt_snake_case');

      const res3 = normalizeAuthResponse({ data: { accessToken: 'jwt_camel_case' } });
      expect(res3.tokens.accessToken).toBe('jwt_camel_case');
    });

    it('correctly normalizes flattened user in data envelope', () => {
      const response = {
        success: true,
        data: {
          token: 'jwt_flattened',
          id: 'u2',
          email: 'hr@ofc360.com',
          name: 'HR Lead',
          role: 'hr_admin',
        },
      };

      const normalized = normalizeAuthResponse(response);
      expect(normalized.tokens.accessToken).toBe('jwt_flattened');
      expect(normalized.user.id).toBe('u2');
      expect(normalized.user.email).toBe('hr@ofc360.com');
      expect(normalized.user.fullName).toBe('HR Lead');
      expect(normalized.user.activeRole).toBe('HR_ADMIN');
    });

    it('generates a valid non-null user from fallback email when response only contains a token', () => {
      // Mock JWT payload: { "sub": "usr_99", "email": "superadmin@ofc360.com", "role": "super_admin" }
      // Base64url of {"sub":"usr_99","email":"superadmin@ofc360.com","role":"super_admin"}
      const payloadBase64 = btoa(JSON.stringify({ sub: 'usr_99', email: 'superadmin@ofc360.com', role: 'super_admin' }));
      const jwtToken = `header.${payloadBase64}.signature`;

      const response = {
        success: true,
        data: {
          token: jwtToken,
        },
      };

      const normalized = normalizeAuthResponse(response, 'superadmin@ofc360.com');
      expect(normalized.tokens.accessToken).toBe(jwtToken);
      expect(normalized.user).toBeTruthy();
      expect(normalized.user.id).toBe('usr_99');
      expect(normalized.user.email).toBe('superadmin@ofc360.com');
      expect(normalized.user.activeRole).toBe('SUPER_ADMIN');
    });
  });

  describe('normalizeRole and ROLE_DASHBOARD_ROUTES', () => {
    it('normalizes various role casings and aliases to canonical uppercase', () => {
      expect(normalizeRole('super_admin')).toBe('SUPER_ADMIN');
      expect(normalizeRole('SUPER_ADMIN')).toBe('SUPER_ADMIN');
      expect(normalizeRole('superadmin')).toBe('SUPER_ADMIN');
      expect(normalizeRole('hr_admin')).toBe('HR_ADMIN');
      expect(normalizeRole('admin')).toBe('HR_ADMIN');
      expect(normalizeRole('it_admin')).toBe('IT_ADMIN');
      expect(normalizeRole('it')).toBe('IT_ADMIN');
      expect(normalizeRole('manager')).toBe('MANAGER');
      expect(normalizeRole('employee')).toBe('EMPLOYEE');
      expect(normalizeRole(null)).toBe('EMPLOYEE');
    });

    it('maps canonical roles to correct dashboard route destinations', () => {
      expect(ROLE_DASHBOARD_ROUTES['SUPER_ADMIN']).toBe('/dashboard/super-admin');
      expect(ROLE_DASHBOARD_ROUTES['HR_ADMIN']).toBe('/dashboard/hr-admin');
      expect(ROLE_DASHBOARD_ROUTES['MANAGER']).toBe('/dashboard/manager');
      expect(ROLE_DASHBOARD_ROUTES['EMPLOYEE']).toBe('/dashboard/employee');
      expect(ROLE_DASHBOARD_ROUTES['IT_ADMIN']).toBe('/dashboard/it-admin');
    });
  });

  describe('authSlice Redux and Storage persistence', () => {
    it('properly updates isAuthenticated, user, and stores token in localStorage on setCredentials', () => {
      const initial = {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
        activeRole: null,
        isInitialized: true,
        rememberMe: false,
      };

      const user = normalizeUser({
        id: 'u100',
        email: 'superadmin@ofc360.com',
        role: 'SUPER_ADMIN',
        fullName: 'Enterprise Admin',
      });

      const nextState = authReducer(
        initial,
        setCredentials({
          user,
          tokens: { accessToken: 'valid_access_token', refreshToken: 'valid_refresh_token' },
          rememberMe: false,
        })
      );

      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.user?.email).toBe('superadmin@ofc360.com');
      expect(nextState.accessToken).toBe('valid_access_token');
      expect(nextState.activeRole).toBe('SUPER_ADMIN');

      // Verify persistent storage
      expect(localStorage.getItem('ofc360_access_token')).toBe('valid_access_token');
      expect(localStorage.getItem('ofc360_user_session')).toBeTruthy();
      expect(localStorage.getItem('ofc360_active_role')).toBe('SUPER_ADMIN');
    });

    it('clears storage on logout', () => {
      localStorage.setItem('ofc360_access_token', 'temp_tok');
      const cleared = authReducer(undefined, logout());
      expect(cleared.isAuthenticated).toBe(false);
      expect(cleared.user).toBeNull();
      expect(localStorage.getItem('ofc360_access_token')).toBeNull();
    });
  });
});
