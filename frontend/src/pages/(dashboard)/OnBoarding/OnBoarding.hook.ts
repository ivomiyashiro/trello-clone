import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useWorkspace } from "@/hooks";

import { createWorkspaceScheme } from "@/lib/schemes";
import { handleError } from "@/helpers";

const useOnBoarding = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const { isLoading, createWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      createWorkspaceScheme.parse(workspaceName);
      const data = await createWorkspace(workspaceName);
      navigate(`/workspace/${data.workspace.id}/members`);
    } catch (error) {
      handleError(error);
    }
  };

  return {
    isLoading,
    handleSubmit,
    setWorkspaceName,
  };
};

export default useOnBoarding;
