import { useReducer, useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";

import { User } from "@/types";
import { config } from "@/config";

import {
  generateToken,
  login as loginService,
  logout as logoutService,
  signup as signupService,
} from "@/services";

import { AuthContext, authReducer } from "./";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
    isAuthenticating: true,
  });
  const queryParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [],
  );
  const [keepRenewing, setKeepRenewing] = useState(true);

  const isAuthenticatingTo = (value: boolean) => {
    dispatch({
      type: "IS AUTHENTICATING",
      payload: value,
    });
  };

  const saveTokensAndLoginUser = (
    user: User,
    tokens: { access_token: string; refresh_token: string },
  ) => {
    Cookies.set("REFRESH_TOKEN", tokens.refresh_token, {
      sameSite: "strict",
      expires: config.REFRESH_TOKEN_EXP,
    });

    dispatch({
      type: "LOGIN",
      payload: user,
    });
  };

  const removeTokensAndLogout = () => {
    Cookies.remove("REFRESH_TOKEN");
    dispatch({ type: "LOGOUT" });
  };

  // Check if REFRESH_TOKEN is valid and login user
  useEffect(() => {
    let refreshToken = Cookies.get("REFRESH_TOKEN") as string;

    // Gets "rt" in searchParams when user use providers authtentications
    if (queryParams.get("rt")) {
      refreshToken = queryParams.get("rt") as string;
      window.history.replaceState(null, "", "/");
    }

    if (!refreshToken) return isAuthenticatingTo(false);

    isAuthenticatingTo(true);
    generateToken(refreshToken)
      .then((resp) => console.log(resp))
      .catch(() => {
        removeTokensAndLogout();
        setKeepRenewing(false);
      })
      .finally(() => isAuthenticatingTo(false));
  }, [queryParams]);

  // Renews token
  useEffect(() => {
    const REFRESH_TOKEN = Cookies.get("REFRESH_TOKEN") as string;

    if (!keepRenewing) return;

    const renewInterval = setInterval(async () => {
      try {
        const { user, tokens } = await generateToken(REFRESH_TOKEN);

        saveTokensAndLoginUser(user, tokens);
      } catch (error) {
        setKeepRenewing(false);
        removeTokensAndLogout();
      }
    }, config.ACCESS_TOKEN_EXP);

    return () => clearInterval(renewInterval);
  }, [state.user, keepRenewing]);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { user, tokens } = await loginService({ email, password });

      saveTokensAndLoginUser(user, tokens);

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const signup = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const { user } = await signupService({ name, email, password });

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  const logout = async () => {
    try {
      if (state.accessToken) {
        await logoutService(state.accessToken);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    } finally {
      removeTokensAndLogout();
      window.location.replace("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,

        // Methods
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
