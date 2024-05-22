export const config = {
  // API URLS
  URLS: {
    BASE_API_URL: import.meta.env.VITE_BASE_API_URL,
    BASE_URL: import.meta.env.VITE_BASE_URL,
    AUTH_URLS: {
      GITHUB_AUTH_URL: import.meta.env.VITE_GITHUB_AUTH_URL_DEVELOPMENT,
      GOOGLE_AUTH_URL: import.meta.env.VITE_GOOGLE_AUTH_URL_DEVELOPMENT,
    },
  },

  // Providers Auth Url
  AUTH: {
    JWT: {
      // JWT Exp Time
      REFRESH_TOKEN_EXP: new Date(
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
      ), // 1 week
      ACCESS_TOKEN_EXP: 60 * 1000 * 14, // 14 minutes
    },
  },

  // Redirections
  REDIRECTIONS: {
    ALREADY_AUTH_REDIRECT: "/dashboard",
    UNAUTHORIZED_REDIRECT: "/auth/login",
  },

  // Cookies
  COOKIES: {
    REFRESH_TOKEN: "REFRESH_TOKEN",
  },
};
