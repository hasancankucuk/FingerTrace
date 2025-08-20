interface WorkspaceData {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
}

export const createWorkspace = async (workspaceData: WorkspaceData) => {
  try {
    const response = await fetch("http://localhost:5000/api/workspaces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workspaceData),
    });
    if (!response.ok) {
      throw new Error("Failed to create workspace");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating workspace:", error);
    throw error;
  }
};

export const getWorkspaces = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/workspaces", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch workspaces");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    throw error;
  }
};


export const deleteWorkspace = async (workspaceId: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/workspaces/${workspaceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete workspace");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting workspace:", error);
    throw error;
  }
};