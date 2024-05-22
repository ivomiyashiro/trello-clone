import { z } from "zod";

const communScheme = {
  email: z.string().email({ message: "Invalid email address" }),
};

export const signupScheme = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(32, { message: "Password length must be less than 32 characters" }),
  ...communScheme,
});

export const loginScheme = z.object({
  ...communScheme,
});
