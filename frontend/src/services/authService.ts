import { baseService } from "./_baseService";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await baseService("/auth/local/login", {
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
  return await baseService("/auth/local/signup", {
    method: "POST",
    data: {
      name,
      email,
      password,
    },
  });
};

export const logout = async (userId: string, token?: string) => {
  return await baseService("/auth/logout", {
    method: "POST",
    token,
    data: {
      userId,
    },
  });
};

export const generateToken = async (token: string) => {
  return await baseService("/auth/generateToken", {
    method: "POST",
    token,
  });
};
