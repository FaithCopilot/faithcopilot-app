export const ResourceTypeConstants = Object.freeze({
  ACCOUNT: "account",
  DATASET: "dataset"
});

export const AppRouteConstants = Object.freeze({
  DOCS: "/docs",
  DATASETS: "/datasets",
  CONSOLE: "/console",
});

export const RouteConstants = Object.freeze({
  HOME: '/',
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT: "/forgot",
  RESET: "/reset",
  ACCOUNT: "/account",
  NOTIFICATIONS: "/notifications",
  SUPPORT: "/support",
  ONBOARDING: "/onboarding",
});

export const AccountRouteConstants = Object.freeze({
  ACCOUNT: "/account",
  ANALYTICS: "/account/analytics",
  BILLING: "/account/billing",
  CHANGE_PLAN: "/account/billing/change-plan",
  PAYMENT_METHODS: "/account/billing/payment-methods",
  BILLING_HISTORY: "/account/billing/history",
  USAGE_LIMITS: "/account/billing/usage-limits",
  SETTINGS: "/account/settings",
  APPEARANCE: "/account/settings/appearance",
  DEFAULTS: "/account/settings/defaults",
  NOTIFICATIONS: "/account/settings/notifications",
  PROFILE: "/account/settings/profile",
  PRIVACY: "/account/settings/privacy",
  SECURITY: "/account/settings/security",
  DEVELOPERS: "/account/developers",
  APIKEYS: "/account/developers/api-keys",
  APPS: "/account/developers/apps",
  WEBHOOKS: "/account/developers/webhooks",
});

export const OnboardingRouteConstants = Object.freeze({
  VERIFY: "/onboarding/verify",
  PRICING: "/onboarding/pricing",
  WELCOME: "/onboarding/welcome",
});

export const StatusConstants = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  UNKNOWN: "unknown"
});

export const PlanConstants = Object.freeze({
  FREE: "free",
  PRO: "pro",
  FLEX: "flex"
});

export const ErrorConstants = Object.freeze({
  GENERIC: "Something went wrong. Please try again later",
});