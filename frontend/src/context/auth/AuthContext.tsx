import { createContext } from "react";
import { User } from "@/types";
import { AuthState } from "./authReducer";

const AuthContext = createContext(
  {} as AuthState & {
    // Methods
    login: ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => Promise<User | undefined>;
    signup: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => Promise<User | undefined>;
    logout: () => Promise<void>;
  },
);

export default AuthContext;
