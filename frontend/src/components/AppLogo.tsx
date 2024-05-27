import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const AppLogo = ({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) => {
  return (
    <Link
      aria-label="This link goes to hero page"
      to={href}
      className="cursor-pointer"
    >
      <p className={cn("relative left-0 z-10 text-5xl font-bold", className)}>
        <span className="mr-[5px] text-blue-500">.</span>dev
      </p>
    </Link>
  );
};

export default AppLogo;
