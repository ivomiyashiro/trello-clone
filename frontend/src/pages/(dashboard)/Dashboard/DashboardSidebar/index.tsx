import { Link } from "react-router-dom";
import { Plus, Code2, Table2, Users } from "lucide-react";

import { Button } from "@/components/ui";
import WorkspaceButton from "./WorkspaceButton";

const SIDEBAR_ITEMS = [
  {
    icon: <Table2 className="size-5 md:size-4" />,
    text: "Tables",
    to: "/dashboard/tables",
  },
  {
    icon: <Users className="size-5 md:size-4" />,
    text: "Members",
    to: "/dashboard/",
  },
  {
    icon: <Code2 className="size-5 md:size-4" />,
    text: "Projects",
  },
];

const DashboardSidebar = () => {
  return (
    <aside className="fixed left-0 grid h-screen w-[90px] grid-rows-[auto_1fr] border-r md:w-[250px]">
      <div className="border-b p-2">
        <WorkspaceButton />
      </div>
      <ul className="flex h-full flex-col items-center gap-2 p-2 py-4 md:mt-0 md:items-start">
        {SIDEBAR_ITEMS.map((sidebarItem, index) => (
          <li key={index} className="md:w-full">
            <Link
              to={"/dashboard/tables"}
              className="flex w-full items-center gap-2 rounded-lg p-3 hover:bg-slate-100 hover:dark:bg-slate-800 md:rounded"
            >
              {sidebarItem.icon}
              <span className="hidden md:block">{sidebarItem.text}</span>
            </Link>
          </li>
        ))}
        <li className="mt-auto w-full">
          <Button className="flex w-full gap-2">
            <Plus className="size-6 md:size-4" />
            <span className="hidden md:block">Add new</span>
          </Button>
        </li>
      </ul>
    </aside>
  );
};

export default DashboardSidebar;
