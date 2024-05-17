export const config = {
  // API URLS
  BASE_API_URL:
    import.meta.env.NODE_ENV === "dev"
      ? (import.meta.env.BASE_API_URL_DEV as string)
      : (import.meta.env.BASE_API_URL_PROD as string),
  BASE_URL:
    import.meta.env.NODE_ENV === "dev"
      ? (import.meta.env.BASE_URL_DEV as string)
      : (import.meta.env.BASE_URL_PROD as string),

  // JWT Exp time
  REFRESH_TOKEN_EXP: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week
  ACCESS_TOKEN_EXP: 60 * 1000 * 14, // 14 minutes

  // Redirections
  ALREADY_AUTH_REDIRECT: "/dashboard",
  UNAUTHORIZED_REDIRECT: "/auth/login",
};
