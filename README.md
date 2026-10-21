# OFC360 Enterprise Web Frontend

Production-grade enterprise authentication, RBAC authorization, and workforce management portal built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Redux Toolkit / RTK Query**.

---

## Architecture Overview

The codebase is organized into domain-driven modular features and shared enterprise infrastructure:

```
src/
├── app/                      # Application core and wiring
│   ├── store.ts              # Redux store configuration & root reducer
│   ├── hooks.ts              # Typed useAppDispatch & useAppSelector hooks
│   ├── providers/            # Top-level context providers (Store, Router, Toast)
│   └── router/               # Route declarations & RBAC protection matrices
├── features/                 # Domain-driven features
│   ├── auth/                 # Authentication & authorization subsystem
│   │   ├── api/              # RTK Query authApi endpoints
│   │   ├── components/       # Auth guards (ProtectedRoute, RoleGuard, OtpInput)
│   │   ├── hooks/            # useAuth, useRBAC session hooks
│   │   ├── pages/            # Login, Register, Forgot Password, Reset, Verify
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── slices/           # authSlice (in-memory access tokens, session flags)
│   │   └── types/            # Auth domain contracts, roles, permissions
│   └── dashboard/            # Workspaces per clearance tier
│       ├── components/       # Shared dashboard components (StatCard)
│       └── pages/            # Role portals (SuperAdmin, HR, IT, Manager, Employee)
└── shared/                   # Cross-cutting primitives & layouts
    ├── api/                  # Base RTK Query with Mutex concurrency & re-auth
    ├── layout/               # App shell wrappers (AuthShell, DashboardShell)
    ├── lib/                  # Shared utilities (class name merging, formatters)
    ├── pages/                # Universal error screens (NotFound 404, Unauthorized 403)
    └── ui/                   # Design system atoms (Button, Input, Badge, Toast)
```

---

## Security Model

1. **Token Lifecycle**:
   - Short-lived JWT `accessToken` lives **strictly in memory** (Redux state). No `localStorage` or `sessionStorage` token persistence.
   - Long-lived `refreshToken` is managed as an `httpOnly`, `Secure`, `SameSite=Strict` cookie transmitted automatically by the browser to `https://api.ofc360.com`.
2. **Concurrency & Re-authentication**:
   - `baseQueryWithReauth` utilizes an `async-mutex` lock to queue concurrent requests on 401 Unauthorized, dispatching a single refresh handshake and retrying queued requests with the renewed token.
3. **Role-Based Access Control (RBAC)**:
   - High-clearance dashboards are shielded by `ProtectedRoute` verifying JWT roles and granular permission sets against the target route before component mounting.

---

## Environment Variables

Copy `.env.example` to `.env` to configure the application:

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_APP_NAME` | Yes | `OFC360` | Application brand name |
| `VITE_APP_ENV` | Yes | `development` | Deployment environment (`development`, `staging`, `production`) |
| `VITE_APP_VERSION` | Yes | `1.0.0` | Semantic version string |
| `VITE_API_BASE_URL` | Yes | `https://api.ofc360.com` | Base URL for the enterprise backend API |
| `VITE_AUTH_COOKIE_DOMAIN` | No | `.ofc360.com` | Cookie domain for cross-subdomain authentication |
| `VITE_AUTH_TOKEN_HEADER` | No | `Authorization` | Authorization header name |
| `VITE_ENABLE_MOCK_FALLBACK` | No | `false` | Fallback mock responses when backend is unreachable |

> **Security Note**: Never commit `.env` or production credentials to source control. `.env` is ignored by `.gitignore`.

---

## Available Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite --port 8080 --host` | Starts Vite local development server on port 8080 |
| `npm run build` | `tsc -b && vite build` | Performs type check and compiles production bundle to `dist/` |
| `npm run typecheck` | `tsc -b` | Runs TypeScript project references compiler check without emitting |
| `npm run lint` | `echo ...` | Static analysis and code style check (ESLint suite in Phase 4) |
| `npm test` | `echo ...` | Unit & integration test runner (Vitest + RTL in Phase 4) |
| `npm run preview` | `vite preview` | Previews the compiled `dist/` production bundle locally |

---

## Deployment & Production Build

### Building the Bundle
```bash
npm run typecheck
npm run build
```

The compiled output is located in the `dist/` directory.

### Production Hardening Guidelines
- **Reverse Proxy**: Serve static assets behind Nginx, Cloudflare, or an AWS CloudFront CDN.
- **SPA Fallback**: Ensure all unhandled routes rewrite to `/index.html` with HTTP 200.
- **Security Headers**: Enforce strict CSP, HSTS, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`.