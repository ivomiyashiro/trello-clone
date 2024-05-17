import { Link, useLocation } from "react-router-dom";

import { config } from "@/config";

import { AppLogo } from "@/components";
import { buttonVariants } from "@/components/ui";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const to = pathname.includes("signup") ? "/auth/login" : "/auth/signup";
  const buttonText = pathname.includes("signup")
    ? "Already have an account"
    : "Create an account";

  const GITHUB_AUTH_URL = config.URLS.AUTH_URLS.GITHUB_AUTH_URL;
  const GOOGLE_AUTH_URL = config.URLS.AUTH_URLS.GOOGLE_AUTH_URL;

  return (
    <div className="mx-auto flex h-screen w-full max-w-[30em] items-center justify-center px-4 md:px-8 lg:px-12">
      <div className="flex w-full flex-col">
        <div className="mb-12 flex justify-center">
          <AppLogo />
        </div>
        {children}
        <div className="mt-4">
          <Link
            to={to}
            className={buttonVariants({
              variant: "outline",
              className: "mb-4 w-full",
            })}
          >
            {buttonText}
          </Link>
          <div className="flex gap-4">
            <a
              href={GITHUB_AUTH_URL}
              className={buttonVariants({ variant: "outline" }) + " w-full"}
            >
              Auth with Github
            </a>
            <a
              href={GOOGLE_AUTH_URL}
              className={buttonVariants({ variant: "outline" }) + " w-full"}
            >
              Auth with Google
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
