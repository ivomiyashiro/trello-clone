import { useCallback, useState } from "react";
import {
  createWorkspaceService,
  deleteWorkspaceMemberService,
  findManyWorkspaceMembersService,
} from "@/services";
import { useAuth } from "./useAuth";

export const useWorkspace = () => {
  const [isLoading, setLoading] = useState(false);
  const { accessToken } = useAuth();

  const createWorkspace = useCallback(
    async (name: string) => {
      setLoading(true);
      const resp = await createWorkspaceService({ name }, accessToken);
      setLoading(false);

      return resp;
    },
    [accessToken],
  );

  const findManyWorkspaceMembers = useCallback(
    async (workspaceId: string) => {
      setLoading(true);
      const resp = await findManyWorkspaceMembersService(
        { workspaceId },
        accessToken,
      );
      setLoading(false);

      return resp;
    },
    [accessToken],
  );

  const deleteWorkspaceMember = useCallback(
    async (workspaceId: string, workspaceMemberId: string) => {
      setLoading(true);
      const resp = await deleteWorkspaceMemberService(
        { workspaceId, workspaceMemberId },
        accessToken,
      );
      setLoading(false);

      return resp;
    },
    [accessToken],
  );

  return {
    isLoading,
    createWorkspace,

    // Workspace Members
    findManyWorkspaceMembers,
    deleteWorkspaceMember,
  };
};
