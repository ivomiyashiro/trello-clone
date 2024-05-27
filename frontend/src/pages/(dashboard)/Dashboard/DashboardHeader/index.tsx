import { LogOut, Moon, Sun } from "lucide-react";

import { useAuth, useTheme } from "@/hooks";

import { Button } from "@/components/ui";
import { AppLogo } from "@/components";

const DashboardHeader = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between border-b px-4 py-2">
      <div>
        <AppLogo href="/dashboard" className="text-4xl" />
      </div>
      <ul className="flex gap-4">
        <li>
          <Button variant="outline" className="px-3" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="size-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="size-5 text-gray-600 dark:text-gray-300" />
            )}
          </Button>
        </li>
        <li>
          <Button variant="outline" className="px-3" onClick={logout}>
            <LogOut className="size-5 text-gray-600 dark:text-gray-300" />
          </Button>
        </li>
      </ul>
    </header>
  );
};

export default DashboardHeader;
