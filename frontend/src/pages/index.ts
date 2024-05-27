import { lazy } from "react";

export const Landing = lazy(() => import("./Landing"));
export const Login = lazy(() => import("./(auth)/Login"));
export const Signup = lazy(() => import("./(auth)/Signup"));
export const OnBoarding = lazy(() => import("./(dashboard)/OnBoarding"));
export const Workspace = lazy(() => import("./(dashboard)/Workspace"));
export const Members = lazy(() => import("./(dashboard)/Workspace/Members"));
export const Tables = lazy(() => import("./(dashboard)/Workspace/Tables"));
