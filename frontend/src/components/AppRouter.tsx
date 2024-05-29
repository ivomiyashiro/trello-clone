import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { config } from "@/config";

import { User } from "@/types";
import { useAuth } from "@/hooks";

import { DashboardLayout, AuthLayout } from "@/components/layouts";
import * as Page from "@/pages";

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
        <Route path="/" element={<Page.Landing />} />
        <Route
          element={
            <AuthWrapper user={user} isAuthenticating={isAuthenticating} />
          }
        >
          <Route path="/auth/login" element={<Page.Login />} />
          <Route path="/auth/signup" element={<Page.Signup />} />
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
          <Route path="/onboarding" element={<Page.OnBoarding />} />
        </Route>
        <Route
          element={
            <ProtectedWrapper user={user} isAuthenticating={isAuthenticating} />
          }
        >
          <Route path="/workspace/:workspaceId" element={<Page.Workspace />} />
          <Route
            path="/workspace/:workspaceId/members"
            element={<Page.Members />}
          />
          <Route
            path="/workspace/:workspaceId/tables"
            element={<Page.Tables />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;
