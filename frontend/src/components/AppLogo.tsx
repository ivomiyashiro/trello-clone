import { Link } from "react-router-dom";

const AppLogo = () => {
  return (
    <Link
      aria-label="This link goes to hero page"
      to="/"
      className="cursor-pointer"
    >
      <p className="relative left-0 z-10 text-5xl font-bold">
        <span className="mr-[5px] text-blue-500">.</span>dev
      </p>
    </Link>
  );
};

export default AppLogo;
