import { useReducer, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

import { User } from "@/types";
import { config } from "@/config";

import {
  generateTokenService,
  loginService,
  logoutService,
  signupService,
} from "@/services";

import { AuthContext, authReducer } from "./";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    accessToken: null,
    isAuthenticating: true,
  });
  const [searchParams] = useSearchParams();
  const [keepRenewing, setKeepRenewing] = useState(true);

  const isAuthenticatingTo = (value: boolean) => {
    dispatch({
      type: "IS AUTHENTICATING",
      payload: value,
    });
  };

  const saveTokensAndLoginUser = (
    user: User,
    tokens: { accessToken: string; refreshToken: string },
  ) => {
    Cookies.set("REFRESH_TOKEN", tokens.refreshToken, {
      sameSite: "strict",
      expires: config.AUTH.JWT.REFRESH_TOKEN_EXP,
    });

    dispatch({
      type: "LOGIN",
      payload: {
        user,
        accessToken: tokens.accessToken,
      },
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
    if (searchParams.get("rt")) {
      refreshToken = searchParams.get("rt") as string;
      window.history.replaceState(null, "", "/");
    }

    if (!refreshToken) return isAuthenticatingTo(false);

    isAuthenticatingTo(true);
    generateTokenService(refreshToken)
      .then(({ user, tokens }) => {
        saveTokensAndLoginUser(user, tokens);
      })
      .catch(() => {
        removeTokensAndLogout();
        setKeepRenewing(false);
      })
      .finally(() => isAuthenticatingTo(false));
  }, [searchParams]);

  // Renews token
  useEffect(() => {
    const REFRESH_TOKEN = Cookies.get("REFRESH_TOKEN") as string;

    if (!keepRenewing) return;

    const renewInterval = setInterval(async () => {
      try {
        const { user, tokens } = await generateTokenService(REFRESH_TOKEN);
        saveTokensAndLoginUser(user, tokens);
      } catch (error) {
        setKeepRenewing(false);
        removeTokensAndLogout();
      }
    }, config.AUTH.JWT.ACCESS_TOKEN_EXP);

    return () => clearInterval(renewInterval);
  }, [state.user, keepRenewing]);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { user, tokens } = await loginService({ email, password });
    saveTokensAndLoginUser(user, tokens);

    return user;
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
    const { user } = await signupService({ name, email, password });
    return user;
  };

  const logout = async () => {
    if (state.accessToken) {
      await logoutService(state.accessToken);
    }

    removeTokensAndLogout();
    window.location.replace("/");
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
