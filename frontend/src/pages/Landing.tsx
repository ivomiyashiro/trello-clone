import { Link } from "react-router-dom";
import { useAuth, useTheme } from "@/hooks";
import { Button, buttonVariants } from "@/components/ui";

const Landing = () => {
  const { toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="flex h-screen items-center justify-center gap-10">
      <Button onClick={toggleTheme}>theme</Button>
      {user ? (
        <Link
          to={"/dashboard"}
          className={buttonVariants({ variant: "default" })}
        >
          Dashboard
        </Link>
      ) : (
        <Link
          to={"/auth/login"}
          className={buttonVariants({ variant: "default" })}
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default Landing;
