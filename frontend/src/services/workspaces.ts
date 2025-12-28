
import { httpRequest } from "./http";
import { getToken } from "./auth";
import type { WorkspacesType } from "@/models/Workspaces";

const API_BASE_URL = import.meta.env.VITE_APP_URL;

export const createWorkspace = async (workspaceData: WorkspacesType) => {
  const token = getToken();
  return httpRequest<{ message: string; id: string }>(
  `${API_BASE_URL}/api/workspaces`,
    {
      method: "POST",
      token,
      body: workspaceData,
    }
  );
};

export const getWorkspaces = async (): Promise<WorkspacesType[]> => {
  const token = getToken();
  return httpRequest<WorkspacesType[]>(`${API_BASE_URL}/api/workspaces`, {
    method: "GET",
    token,
  });
};

export const getWorkspace = async (workspaceId: string) => {
  const token = getToken();
  return httpRequest<WorkspacesType>(
    `${API_BASE_URL}/api/workspaces/${workspaceId}`,
    { method: "GET", token }
  );
};

export const deleteWorkspace = async (workspaceId: string) => {
  const token = getToken();
  return httpRequest<{ message: string }>(
    `${API_BASE_URL}/api/workspaces/${workspaceId}`,
    { method: "DELETE", token }
  );
};