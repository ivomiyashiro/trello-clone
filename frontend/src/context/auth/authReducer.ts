import { User } from "@/types";

export type AuthActionType =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "ACCESS TOKEN"; payload: string }
  | { type: "IS AUTHENTICATING"; payload: boolean };

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticating: boolean;
}

const authReducer = (state: AuthState, action: AuthActionType): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
      };

    case "IS AUTHENTICATING":
      return {
        ...state,
        isAuthenticating: action.payload,
      };

    case "ACCESS TOKEN":
      return {
        ...state,
        accessToken: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
