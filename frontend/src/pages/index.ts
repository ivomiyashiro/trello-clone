import { lazy } from "react";

export const Landing = lazy(() => import("./Landing"));
export const Login = lazy(() => import("./(auth)/Login/Login"));
export const Signup = lazy(() => import("./(auth)/Signup/Signup"));
export const Dashboard = lazy(() => import("./(dashboard)/Dashboard"));
