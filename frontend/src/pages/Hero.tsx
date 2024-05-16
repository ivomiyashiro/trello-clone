import { Link } from "react-router-dom";
import { useTheme } from "@/hooks";
import { Button, buttonVariants } from "@/components/ui";

const Hero = () => {
  const { toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-10">
      <Button onClick={toggleTheme}>theme</Button>
      <Link
        to={"/auth/login"}
        className={buttonVariants({ variant: "default" })}
      >
        Login
      </Link>
    </div>
  );
};

export default Hero;
