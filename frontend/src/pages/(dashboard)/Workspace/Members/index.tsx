import { useParams } from "react-router-dom";
import { UserPlus } from "lucide-react";

import useMembers from "./Members.hook";

import { Button } from "@/components/ui";
import MembersSection from "./MembersSection";
import GuestsSection from "./GuestsSection";

const Members = () => {
  const { workspaceId } = useParams();
  const { isLoading, members, activeSection, setActiveSection } = useMembers({
    workspaceId: workspaceId ?? "",
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          Collaborators{" "}
          <span className="rounded bg-slate-100 p-2 text-sm font-normal dark:bg-slate-800">
            {members.length} / 5
          </span>
        </h1>
        <Button title="Invite members to workspace" className="flex gap-3">
          <UserPlus className="size-5" />
          <span>Invite members to workspace</span>
        </Button>
      </div>
      <div className="mt-8 flex w-full gap-12">
        <ul className="flex flex-col gap-4">
          <li>
            <Button
              variant={activeSection === "members" ? "secondary" : "ghost"}
              onClick={() => setActiveSection("members")}
            >
              Workspace members ({members.length})
            </Button>
          </li>
          <li>
            <Button
              variant={activeSection === "guests" ? "secondary" : "ghost"}
              onClick={() => setActiveSection("guests")}
            >
              Guests (0)
            </Button>
          </li>
        </ul>
        {activeSection === "members" && (
          <MembersSection members={members} isLoading={isLoading} />
        )}
        {activeSection === "guests" && <GuestsSection isLoading={isLoading} />}
      </div>
    </div>
  );
};

export default Members;
