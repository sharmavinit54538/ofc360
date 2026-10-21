/**
 * @file passkeyApi.ts
 * @description Enterprise RTK Query endpoints for FIDO2 WebAuthn Passkeys.
 * Implements discoverable login, security key/platform registration, credential renaming,
 * and deletion with strict Zod parsing and zero `any`.
 */

import { authApi } from './authApi';
import { setCredentials } from '../slices/authSlice';
import type {
  PasskeyLoginOptionsRequest,
  PasskeyLoginOptionsResponse,
  PasskeyLoginVerifyRequest,
  PasskeyLoginVerifyResponse,
  PasskeyRegisterOptionsRequest,
  PasskeyRegisterOptionsResponse,
  PasskeyRegisterVerifyRequest,
  PasskeyRegisterVerifyResponse,
  PasskeyListResponse,
  PasskeyRenameRequest,
  PasskeyRenameResponse,
  PasskeyDeleteRequest,
  PasskeyDeleteResponse,
  PasskeyReauthRequest,
  PasskeyReauthResponse,
} from '../types/passkey.types';
import {
  passkeyLoginOptionsResponseSchema,
  passkeyLoginVerifyResponseSchema,
  passkeyRegisterOptionsResponseSchema,
  passkeyRegisterVerifyResponseSchema,
  passkeyListResponseSchema,
  passkeyReauthResponseSchema,
} from '../schemas/passkey.schemas';

export const passkeyApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Request authentication options / challenge from server.
     * Email is optional: if omitted, server generates challenge for discoverable credentials.
     */
    getPasskeyLoginOptions: builder.mutation<PasskeyLoginOptionsResponse, PasskeyLoginOptionsRequest | void>({
      query: (body) => ({
        url: '/auth/passkey/login/options',
        method: 'POST',
        body: body || {},
      }),
      transformResponse: (response: unknown): PasskeyLoginOptionsResponse => {
        return passkeyLoginOptionsResponseSchema.parse(response);
      },
    }),

    /**
     * Verifies WebAuthn assertion with server and establishes corporate session.
     */
    verifyPasskeyLogin: builder.mutation<PasskeyLoginVerifyResponse, PasskeyLoginVerifyRequest>({
      query: (body) => ({
        url: '/auth/passkey/login/verify',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown): PasskeyLoginVerifyResponse => {
        return passkeyLoginVerifyResponseSchema.parse(response);
      },
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.user,
              tokens: data.tokens,
            })
          );
        } catch {
          // Handled at component error boundary
        }
      },
    }),

    /**
     * Request registration options / challenge for current authenticated user.
     */
    getPasskeyRegisterOptions: builder.mutation<PasskeyRegisterOptionsResponse, PasskeyRegisterOptionsRequest | void>({
      query: (body) => ({
        url: '/auth/passkey/register/options',
        method: 'POST',
        body: body || {},
      }),
      transformResponse: (response: unknown): PasskeyRegisterOptionsResponse => {
        return passkeyRegisterOptionsResponseSchema.parse(response);
      },
    }),

    /**
     * Verify attestation response and persist credential public key on server.
     */
    verifyPasskeyRegister: builder.mutation<PasskeyRegisterVerifyResponse, PasskeyRegisterVerifyRequest>({
      query: (body) => ({
        url: '/auth/passkey/register/verify',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown): PasskeyRegisterVerifyResponse => {
        return passkeyRegisterVerifyResponseSchema.parse(response);
      },
      invalidatesTags: ['Passkey'],
    }),

    /**
     * Fetches all registered passkeys for current account.
     */
    listPasskeys: builder.query<PasskeyListResponse, void>({
      query: () => '/auth/passkey/list',
      transformResponse: (response: unknown): PasskeyListResponse => {
        return passkeyListResponseSchema.parse(response);
      },
      providesTags: ['Passkey'],
    }),

    /**
     * Rename an existing passkey device label.
     */
    renamePasskey: builder.mutation<PasskeyRenameResponse, PasskeyRenameRequest>({
      query: ({ id, deviceName }) => ({
        url: `/auth/passkey/${id}`,
        method: 'PATCH',
        body: { deviceName },
      }),
      invalidatesTags: ['Passkey'],
    }),

    /**
     * Delete an existing passkey credential.
     */
    deletePasskey: builder.mutation<PasskeyDeleteResponse, PasskeyDeleteRequest>({
      query: ({ id, reauthToken, password }) => ({
        url: `/auth/passkey/${id}`,
        method: 'DELETE',
        body: { reauthToken, password },
      }),
      invalidatesTags: ['Passkey'],
    }),

    /**
     * Step-up password re-authentication before sensitive passkey modification.
     */
    verifyPasswordForReauth: builder.mutation<PasskeyReauthResponse, PasskeyReauthRequest>({
      query: (body) => ({
        url: '/auth/reauth',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown): PasskeyReauthResponse => {
        return passkeyReauthResponseSchema.parse(response);
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPasskeyLoginOptionsMutation,
  useVerifyPasskeyLoginMutation,
  useGetPasskeyRegisterOptionsMutation,
  useVerifyPasskeyRegisterMutation,
  useListPasskeysQuery,
  useLazyListPasskeysQuery,
  useRenamePasskeyMutation,
  useDeletePasskeyMutation,
  useVerifyPasswordForReauthMutation,
} = passkeyApi;
