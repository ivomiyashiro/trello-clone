import { lazy } from "react";

export const Hero = lazy(() => import("./Hero"));
export const Login = lazy(() => import("./(auth)/Login/Login"));
export const Signup = lazy(() => import("./(auth)/Signup/Signup"));
