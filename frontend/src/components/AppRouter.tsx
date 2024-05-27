import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { config } from "@/config";

import { User } from "@/types";
import { useAuth } from "@/hooks";

import AuthLayout from "@/pages/(auth)/AuthLayout";
import DashboardLayout from "@/pages/(dashboard)/DashboardLayout";
import { Landing, Login, Signup, OnBoarding, Workspace } from "@/pages";

interface WrapperProps {
  user: User | null;
  isAuthenticating: boolean;
  withLayout?: boolean;
}

const AuthWrapper = ({
  user,
  isAuthenticating,
  withLayout = true,
}: WrapperProps) => {
  if (isAuthenticating) {
    return <></>;
  }

  if (user) {
    return <Navigate to={config.REDIRECTIONS.ALREADY_AUTH_REDIRECT} replace />;
  }

  if (withLayout) {
    return (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    );
  }

  return <Outlet />;
};

const ProtectedWrapper = ({
  user,
  isAuthenticating,
  withLayout = true,
}: WrapperProps) => {
  if (isAuthenticating) {
    return <></>;
  }

  if (!user) {
    return <Navigate to={config.REDIRECTIONS.UNAUTHORIZED_REDIRECT} replace />;
  }

  if (withLayout) {
    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    );
  }

  return <Outlet />;
};

const AppRouter = () => {
  const { user, isAuthenticating } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          element={
            <AuthWrapper user={user} isAuthenticating={isAuthenticating} />
          }
        >
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Route>
        <Route
          element={
            <ProtectedWrapper
              user={user}
              isAuthenticating={isAuthenticating}
              withLayout={false}
            />
          }
        >
          <Route path="/onboarding" element={<OnBoarding />} />
        </Route>
        <Route
          element={
            <ProtectedWrapper user={user} isAuthenticating={isAuthenticating} />
          }
        >
          <Route path="/workspace/:id" element={<Workspace />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;
