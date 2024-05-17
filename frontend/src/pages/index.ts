import { lazy } from "react";

export const Landing = lazy(() => import("./Landing"));
export const Login = lazy(() => import("./(auth)/Login"));
export const Signup = lazy(() => import("./(auth)/Signup"));
export const Dashboard = lazy(() => import("./(dashboard)/Dashboard"));
