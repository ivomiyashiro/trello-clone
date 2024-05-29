import type { WorkspaceMember } from "@/types";

import { Loader } from "@/components/ui";
import Member from "./Member";

const MembersSection = ({
  members,
  isLoading,
}: {
  members: WorkspaceMember[];
  isLoading: boolean;
}) => {
  return (
    <div className="w-full">
      <div className="border-b pb-6">
        <h2 className="text-xl font-semibold">Workspace members</h2>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Workspace members can view all boards visible to the Workspace, join
          them, and create new boards in the Workspace.
        </p>
      </div>
      <div className="border-b py-3">
        {isLoading ? (
          <Loader />
        ) : (
          <ul>
            {members.map((member) => (
              <li key={member.id}>
                <Member member={member} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MembersSection;
