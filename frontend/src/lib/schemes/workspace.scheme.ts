import { z } from "zod";

export const createWorkspaceScheme = z
  .string()
  .min(5, "Workspace name must be at least 5 characters long");
