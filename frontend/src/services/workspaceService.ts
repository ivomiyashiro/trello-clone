import { apiService } from "./_apiService";

export const createWorkspaceService = async (
  { name }: { name: string },
  token: string | null,
) => {
  return await apiService("/workspaces", {
    method: "POST",
    token,
    data: {
      name,
    },
  });
};

export const findManyWorkspaceService = async (token: string | null) => {
  return await apiService("/workspaces", {
    method: "GET",
    token,
  });
};

export const findOneWorkspaceService = async (
  { workspaceId }: { workspaceId: string },
  token: string | null,
) => {
  return await apiService(`/workspaces/${workspaceId}`, {
    method: "GET",
    token,
  });
};

export const updateWorkspaceService = async (
  { workspaceId, name }: { workspaceId: string; name: string },
  token: string | null,
) => {
  return await apiService(`/workspaces/${workspaceId}`, {
    method: "PUT",
    token,
    data: {
      name,
    },
  });
};

export const deleteWorkspaceService = async (
  { workspaceId }: { workspaceId: string },
  token: string | null,
) => {
  return await apiService(`/workspaces/${workspaceId}`, {
    method: "DELETE",
    token,
  });
};
