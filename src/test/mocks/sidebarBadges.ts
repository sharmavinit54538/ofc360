import { http, HttpResponse } from 'msw';

export const sidebarBadgesHandlers = [
  // Default handler - returns empty badges
  http.get('*/sidebar/badges', () => {
    return HttpResponse.json({
      success: true,
      data: {},
    });
  }),

  // HR_ADMIN handler - returns all HR badges
  http.get('*/sidebar/badges', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    // In real tests, we'd check the JWT role, but for MSW we can use a custom header
    const role = request.headers.get('X-Test-Role') || 'EMPLOYEE';

    const badgeData: Record<string, Record<string, number>> = {
      HR_ADMIN: {
        pending_req_approvals_count: 3,
        active_openings_count: 12,
        new_applications_count: 25,
        today_interviews_count: 4,
        pending_offer_approvals_count: 2,
        bgv_discrepancy_alerts_count: 1,
      },
      HR_EXECUTIVE: {
        active_openings_count: 12,
        new_applications_count: 25,
        today_interviews_count: 4,
        pending_offer_approvals_count: 2,
        bgv_discrepancy_alerts_count: 1,
      },
      MANAGER: {
        my_open_vacancies_count: 5,
        pending_profile_reviews_count: 8,
        overdue_scorecards_count: 3,
        pending_my_offer_approvals_count: 1,
      },
      IT_ADMIN: {
        pending_it_provisioning_count: 7,
      },
      EMPLOYEE: {
        active_referral_updates_count: 2,
        pending_scorecards_count: 1,
      },
      SUPER_ADMIN: {
        pending_req_approvals_count: 3,
        active_openings_count: 12,
        new_applications_count: 25,
        today_interviews_count: 4,
        pending_offer_approvals_count: 2,
        bgv_discrepancy_alerts_count: 1,
        my_open_vacancies_count: 5,
        pending_profile_reviews_count: 8,
        overdue_scorecards_count: 3,
        pending_my_offer_approvals_count: 1,
        pending_it_provisioning_count: 7,
        active_referral_updates_count: 2,
        pending_scorecards_count: 1,
      },
    };

    const data = badgeData[role] || {};
    return HttpResponse.json({
      success: true,
      data,
    });
  }),
];

export const emptyBadgesHandler = http.get('*/sidebar/badges', () => {
  return HttpResponse.json({
    success: true,
    data: {},
  });
});

export const loadingBadgesHandler = http.get('*/sidebar/badges', () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        HttpResponse.json({
          success: true,
          data: {
            new_applications_count: 5,
            today_interviews_count: 3,
          },
        })
      );
    }, 1000);
  });
});