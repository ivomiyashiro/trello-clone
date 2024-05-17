import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { config } from "@/config";

import { User } from "@/types";
import { useAuth } from "@/hooks";

import { Landing, Login, Signup, Dashboard } from "@/pages";

const AuthRoutes = ({ user }: { user: User | null }) => {
  if (user) {
    return <Navigate to={config.ALREADY_AUTH_REDIRECT} replace />;
  }

  return <Outlet />;
};

const ProtectedRoutes = ({ user }: { user: User | null }) => {
  if (!user) {
    return <Navigate to={config.UNAUTHORIZED_REDIRECT} replace />;
  }

  return <Outlet />;
};

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AuthRoutes user={user} />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Route>
        <Route element={<ProtectedRoutes user={user} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;
