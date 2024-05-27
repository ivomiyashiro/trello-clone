import { User } from "@/types";

export type AuthActionType =
  | { type: "LOGIN"; payload: { user: User; accessToken: string } }
  | { type: "LOGOUT" }
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
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        accessToken: null,
      };

    case "IS AUTHENTICATING":
      return {
        ...state,
        isAuthenticating: action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
