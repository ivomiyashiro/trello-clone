import { apiService } from "./_apiService";

export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await apiService("/auth/local/login", {
    method: "POST",
    data: {
      email,
      password,
    },
  });
};

export const signupService = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  return await apiService("/auth/local/signup", {
    method: "POST",
    data: {
      name,
      email,
      password,
    },
  });
};

export const logoutService = async (userId: string, token?: string) => {
  return await apiService("/auth/logout", {
    method: "POST",
    token,
    data: {
      userId,
    },
  });
};

export const generateTokenService = async (token: string) => {
  return await apiService("/auth/generateToken", {
    method: "POST",
    token,
  });
};
