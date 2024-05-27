import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { useAuth } from "@/hooks";

const WorkspaceButton = () => {
  const { logout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    setDropdownOpen((prev) => !prev);
    dropdownRef?.current?.focus();
  };

  const handleDropdownBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget !== buttonRef.current) {
      setDropdownOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        tabIndex={0}
        className="w-full"
        onClick={handleButtonClick}
      >
        <div className="flex justify-center rounded-lg p-4 hover:bg-slate-100 hover:dark:bg-slate-800 md:justify-between">
          <div className="flex justify-center gap-2 md:justify-start">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-white  dark:text-slate-950">
              W
            </span>
            <h2 className="hidden font-semibold md:block">Workspace</h2>
          </div>
          <ChevronDown className="mt-px hidden size-5 text-gray-500 md:block" />
        </div>
      </button>
      <div
        ref={dropdownRef}
        tabIndex={1}
        className={`
            absolute top-20 w-[325px] cursor-auto rounded border bg-white text-left shadow-lg transition-opacity dark:bg-slate-900
            ${isDropdownOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
        onBlur={handleDropdownBlur}
      >
        <p className="px-4 pt-2 text-xs text-gray-600 dark:text-gray-500">
          ivo.miyashiro1@gmail.com
        </p>
        <ul className="border-b py-2">
          <li className="px-4 py-2 hover:bg-gray-100 hover:dark:bg-slate-800">
            <Link className="block" to={"/dashboard/pepe"}>
              <div className="flex gap-2">
                <div className="flex justify-center gap-2 md:justify-start">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-white dark:text-slate-950">
                    W
                  </span>
                </div>
                <div className="leading-4">
                  <p className="text-sm">Workspace</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    1 member
                  </span>
                </div>
              </div>
            </Link>
          </li>
        </ul>
        <ul className="bg-gray-100 p-2 text-xs dark:bg-slate-900">
          <li className="w-full cursor-pointer rounded px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 hover:dark:bg-slate-800">
            Create workspace
          </li>
          <li
            className="w-full cursor-pointer rounded px-3 py-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 hover:dark:bg-slate-800"
            onClick={logout}
          >
            Log out
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WorkspaceButton;
