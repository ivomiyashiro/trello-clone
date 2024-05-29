import { Trash } from "lucide-react";
import type { WorkspaceMember } from "@/types";
import { Button } from "@/components/ui";

const Member = ({ member }: { member: WorkspaceMember }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img />
        <div>
          <h3 className="font-semibold">{member.user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {member.user.email}
          </p>
        </div>
      </div>
      {member.role !== "admin" ? (
        <Button variant="outline" className="flex gap-2">
          <Trash className="size-5 text-gray-600 dark:text-gray-300" />
          <span>Remove member</span>
        </Button>
      ) : (
        <span>{member.role}</span>
      )}
    </div>
  );
};

export default Member;
