import { useEffect, useState } from "react";

import type { WorkspaceMember } from "@/types";
import { useWorkspace } from "@/hooks";

import { handleError } from "@/helpers";

const useMembers = ({ workspaceId }: { workspaceId: string }) => {
  const { findManyWorkspaceMembers, isLoading } = useWorkspace();

  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [activeSection, setActiveSection] = useState<"members" | "guests">(
    "members",
  );

  useEffect(() => {
    findManyWorkspaceMembers(workspaceId)
      .then((resp) => setMembers(resp.workspaceMembers))
      .catch((error) => handleError(error));
  }, [workspaceId, findManyWorkspaceMembers]);

  return {
    isLoading,
    members,
    activeSection,
    setActiveSection,
  };
};

export default useMembers;
