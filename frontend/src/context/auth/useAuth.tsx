import { useContext } from "react";
import { AuthContext } from "@/context";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

export default useAuth;
