/**
 * @file passkey.types.ts
 * @description Strongly-typed enterprise WebAuthn / Passkey definitions for OFC360.
 * Adheres to FIDO2 / W3C WebAuthn standards with zero-biometric transmission.
 */

import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/browser';
import type { User, AuthTokens } from './auth.types';

export interface PasskeyItem {
  id: string;
  credentialId: string;
  deviceName: string;
  transports?: string[];
  createdAt: string;
  lastUsedAt?: string | null;
  signCount: number;
}

export interface PasskeyLoginOptionsRequest {
  email?: string;
}

export interface PasskeyLoginOptionsResponse {
  options: PublicKeyCredentialRequestOptionsJSON;
}

export interface PasskeyLoginVerifyRequest {
  email?: string;
  credential: AuthenticationResponseJSON;
}

export interface PasskeyLoginVerifyResponse {
  user: User;
  tokens: AuthTokens;
  message?: string;
}

export interface PasskeyRegisterOptionsRequest {
  deviceName?: string;
}

export interface PasskeyRegisterOptionsResponse {
  options: PublicKeyCredentialCreationOptionsJSON;
}

export interface PasskeyRegisterVerifyRequest {
  deviceName: string;
  credential: RegistrationResponseJSON;
  reauthToken?: string;
}

export interface PasskeyRegisterVerifyResponse {
  success: boolean;
  passkey: PasskeyItem;
  message: string;
}

export interface PasskeyListResponse {
  passkeys: PasskeyItem[];
  canDeletePasskey: boolean;
  hasPasswordSet: boolean;
}

export interface PasskeyRenameRequest {
  id: string;
  deviceName: string;
}

export interface PasskeyRenameResponse {
  success: boolean;
  passkey: PasskeyItem;
  message: string;
}

export interface PasskeyDeleteRequest {
  id: string;
  reauthToken?: string;
  password?: string;
}

export interface PasskeyDeleteResponse {
  success: boolean;
  message: string;
}

export interface PasskeyReauthRequest {
  password: string;
}

export interface PasskeyReauthResponse {
  verified: boolean;
  reauthToken: string;
  expiresInSeconds: number;
}

export type PasskeyErrorCode =
  | 'NOT_SUPPORTED'
  | 'USER_CANCELLED'
  | 'TIMEOUT'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'INVALID_REAUTH'
  | 'LAST_METHOD_PREVENTED'
  | 'VERIFICATION_FAILED'
  | 'UNKNOWN_ERROR';

export interface PasskeyClientError {
  code: PasskeyErrorCode;
  message: string;
  technicalDetails?: string;
}
