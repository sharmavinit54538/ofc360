/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AUTH_COOKIE_DOMAIN?: string;
  readonly VITE_AUTH_TOKEN_HEADER?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_ENABLE_MOCK_FALLBACK?: string;
  readonly VITE_AI_INTERVIEW_ENABLED?: string;
  readonly VITE_PUBLIC_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
