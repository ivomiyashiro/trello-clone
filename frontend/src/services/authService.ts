import { apiService } from "./_apiService";

export const login = async ({
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

export const signup = async ({
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

export const logout = async (userId: string, token?: string) => {
  return await apiService("/auth/logout", {
    method: "POST",
    token,
    data: {
      userId,
    },
  });
};

export const generateToken = async (token: string) => {
  return await apiService("/auth/generateToken", {
    method: "POST",
    token,
  });
};
