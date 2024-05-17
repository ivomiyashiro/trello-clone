import { Link } from "react-router-dom";
import { useTheme } from "@/hooks";
import { Button, buttonVariants } from "@/components/ui";

const Landing = () => {
  const { toggleTheme } = useTheme();

  return (
    <div className="flex h-screen items-center justify-center gap-10">
      <Button onClick={toggleTheme}>theme</Button>
      <Link
        to={"/auth/login"}
        className={buttonVariants({ variant: "default" })}
      >
        Login
      </Link>
      <Link
        to={"/dashboard"}
        className={buttonVariants({ variant: "default" })}
      >
        Dashboard
      </Link>
    </div>
  );
};

export default Landing;
