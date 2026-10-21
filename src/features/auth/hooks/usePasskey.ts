/**
 * @file usePasskey.ts
 * @description Enterprise custom hook orchestrating FIDO2 / WebAuthn passkey authentication,
 * platform authenticator detection (Face Unlock / Touch ID / Windows Hello),
 * and clean user error mapping with seamless password fallback.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';
import {
  useGetPasskeyLoginOptionsMutation,
  useVerifyPasskeyLoginMutation,
  useGetPasskeyRegisterOptionsMutation,
  useVerifyPasskeyRegisterMutation,
} from '../api/passkeyApi';
import type {
  PasskeyClientError,
  PasskeyLoginVerifyResponse,
  PasskeyRegisterVerifyResponse,
} from '../types/passkey.types';

export const parseWebAuthnError = (err: unknown): PasskeyClientError => {
  if (!err) {
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected authentication error occurred. Please try your password.',
    };
  }

  // Handle WebAuthn DOMException errors
  if (err instanceof Error) {
    if (err.name === 'NotAllowedError') {
      return {
        code: 'USER_CANCELLED',
        message: 'Passkey prompt was cancelled. You can sign in using your password anytime.',
        technicalDetails: err.message,
      };
    }
    if (err.name === 'TimeoutError') {
      return {
        code: 'TIMEOUT',
        message: 'Passkey verification timed out. Please try again or use your password.',
        technicalDetails: err.message,
      };
    }
    if (err.name === 'NotSupportedError') {
      return {
        code: 'NOT_SUPPORTED',
        message: 'Passkeys are not supported on this device. Please sign in with your password.',
        technicalDetails: err.message,
      };
    }
    if (err.name === 'InvalidStateError') {
      return {
        code: 'VERIFICATION_FAILED',
        message: 'This authenticator is already registered or in an invalid state.',
        technicalDetails: err.message,
      };
    }
  }

  // Handle RTK Query / HTTP fetch error structures
  const anyErr = err as { status?: number | string; data?: { message?: string } };
  if (anyErr?.status === 429) {
    return {
      code: 'RATE_LIMITED',
      message: 'Too many authentication attempts. Please wait a moment or sign in using your password.',
    };
  }

  if (anyErr?.data?.message) {
    return {
      code: 'VERIFICATION_FAILED',
      message: anyErr.data.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: err instanceof Error ? err.message : 'Passkey verification failed. Please use your password.',
  };
};

export const usePasskey = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isPlatformAvailable, setIsPlatformAvailable] = useState<boolean>(false);
  const [isCheckingSupport, setIsCheckingSupport] = useState<boolean>(true);
  const [error, setError] = useState<PasskeyClientError | null>(null);

  const [getLoginOptions, { isLoading: isFetchingLoginOptions }] = useGetPasskeyLoginOptionsMutation();
  const [verifyLogin, { isLoading: isVerifyingLogin }] = useVerifyPasskeyLoginMutation();

  const [getRegisterOptions, { isLoading: isFetchingRegisterOptions }] = useGetPasskeyRegisterOptionsMutation();
  const [verifyRegister, { isLoading: isVerifyingRegister }] = useVerifyPasskeyRegisterMutation();

  const isAuthenticating = isFetchingLoginOptions || isVerifyingLogin;
  const isRegistering = isFetchingRegisterOptions || isVerifyingRegister;

  // Feature detection on hook initialization
  useEffect(() => {
    let isMounted = true;

    const checkSupport = async () => {
      try {
        const supported = browserSupportsWebAuthn();
        if (!supported) {
          if (isMounted) {
            setIsSupported(false);
            setIsPlatformAvailable(false);
            setIsCheckingSupport(false);
          }
          return;
        }

        const platformAvailable = await platformAuthenticatorIsAvailable();
        if (isMounted) {
          setIsSupported(supported);
          setIsPlatformAvailable(platformAvailable);
          setIsCheckingSupport(false);
        }
      } catch (err) {
        console.warn('WebAuthn detection failed:', err);
        if (isMounted) {
          setIsSupported(false);
          setIsPlatformAvailable(false);
          setIsCheckingSupport(false);
        }
      }
    };

    void checkSupport();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Orchestrates the complete passkey login flow:
   * 1. Request options (POST /auth/passkey/login/options)
   * 2. Invoke browser modal (startAuthentication)
   * 3. Submit assertion verification (POST /auth/passkey/login/verify)
   */
  const loginWithPasskey = useCallback(
    async (email?: string): Promise<PasskeyLoginVerifyResponse> => {
      setError(null);

      if (!isSupported) {
        const err: PasskeyClientError = {
          code: 'NOT_SUPPORTED',
          message: 'WebAuthn is not supported on this browser or platform.',
        };
        setError(err);
        throw err;
      }

      try {
        // Step 1: Fetch challenge and credential options from server
        const optionsResponse = await getLoginOptions(email ? { email } : undefined).unwrap();

        // Step 2: Trigger platform authenticator (Touch ID, Windows Hello, Face ID)
        const assertionResponse = await startAuthentication({
          optionsJSON: optionsResponse.options,
        });

        // Step 3: Send verification payload to server
        const verificationResponse = await verifyLogin({
          email,
          credential: assertionResponse,
        }).unwrap();

        return verificationResponse;
      } catch (rawErr) {
        const parsed = parseWebAuthnError(rawErr);
        setError(parsed);
        throw parsed;
      }
    },
    [isSupported, getLoginOptions, verifyLogin]
  );

  /**
   * Orchestrates new passkey registration:
   * 1. Request options (POST /auth/passkey/register/options)
   * 2. Invoke browser creation modal (startRegistration)
   * 3. Submit attestation verification (POST /auth/passkey/register/verify)
   */
  const registerPasskey = useCallback(
    async (deviceName: string, reauthToken?: string): Promise<PasskeyRegisterVerifyResponse> => {
      setError(null);

      if (!isSupported) {
        const err: PasskeyClientError = {
          code: 'NOT_SUPPORTED',
          message: 'WebAuthn is not supported on this browser or platform.',
        };
        setError(err);
        throw err;
      }

      try {
        // Step 1: Fetch registration challenge from server
        const optionsResponse = await getRegisterOptions({ deviceName }).unwrap();

        // Step 2: Invoke platform credential creation
        const attestationResponse = await startRegistration({
          optionsJSON: optionsResponse.options,
        });

        // Step 3: Verify and persist on backend
        const verificationResponse = await verifyRegister({
          deviceName,
          credential: attestationResponse,
          reauthToken,
        }).unwrap();

        return verificationResponse;
      } catch (rawErr) {
        const parsed = parseWebAuthnError(rawErr);
        setError(parsed);
        throw parsed;
      }
    },
    [isSupported, getRegisterOptions, verifyRegister]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSupported,
    isPlatformAvailable,
    isCheckingSupport,
    canUsePasskey: isSupported && isPlatformAvailable,
    isAuthenticating,
    isRegistering,
    error,
    clearError,
    loginWithPasskey,
    registerPasskey,
  };
};
