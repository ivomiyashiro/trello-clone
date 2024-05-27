import { useState } from "react";
import { createWorkspaceService } from "@/services";
import { useAuth } from "./useAuth";

export const useWorkspace = () => {
  const { accessToken } = useAuth();
  const [isLoading, setLoading] = useState(false);

  const createWorkspace = async (name: string) => {
    setLoading(true);
    const resp = await createWorkspaceService({ name }, accessToken);
    setLoading(false);

    return resp;
  };

  return {
    isLoading,
    createWorkspace,
  };
};
