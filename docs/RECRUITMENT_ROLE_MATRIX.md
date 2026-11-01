# Recruitment Role Matrix

Role UI checks are convenience only. Always display server 401/403/409/422 errors from confirmed APIs.

| Area | SUPER_ADMIN | HR_ADMIN | MANAGER | IT_ADMIN | EMPLOYEE | Public |
|---|---|---|---|---|---|---|
| Recruitment admin screens (default) | Full | Full | None unless explicitly listed below | None | None | None |
| Hiring Manager Hub | Full | Full | Access | None | None | None |
| Interviews and Interview Calendar | Full | Full | Access | None | None | None |
| Candidates, Pipeline, Candidate Profile | Full | Full | Read-only | None | None | None |
| Offers, Compensation, Compliance, BGV | Full | Full | None | None | None | None |
| Onboarding IT tasks | Full | Full | None | Only if API returns IT department tasks | None | None |
| Employee Referrals submit | Full | Full | Not specified | Not specified | Only if backend allows | None |
| Job application, interview booking, candidate AI interview | None | None | None | None | None | Unauthenticated |

Manager access to candidate-related routes must not expose offer/salary editing, BGV, or compliance actions. Public routes must remain outside ProtectedRoute.

