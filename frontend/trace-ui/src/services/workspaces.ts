import { httpRequest } from "./http";
import { getToken } from "./auth";
import type { WorkspacesType } from "@/models/Workspaces";

export const createWorkspace = async (workspaceData: WorkspacesType) => {
  const token = getToken();
  return httpRequest<{ message: string; id: string }>(
    "http://localhost:5000/api/workspaces",
    {
      method: "POST",
      token,
      body: workspaceData,
    }
  );
};

export const getWorkspaces = async () => {
  const token = getToken();
  return httpRequest<WorkspacesType[]>("http://localhost:5000/api/workspaces", {
    method: "GET",
    token,
  });
};

export const getWorkspace = async (workspaceId: string) => {
  const token = getToken();
  return httpRequest<WorkspacesType>(
    `http://localhost:5000/api/workspaces/${workspaceId}`,
    { method: "GET", token }
  );
};

export const deleteWorkspace = async (workspaceId: string) => {
  const token = getToken();
  return httpRequest<{ message: string }>(
    `http://localhost:5000/api/workspaces/${workspaceId}`,
    { method: "DELETE", token }
  );
};