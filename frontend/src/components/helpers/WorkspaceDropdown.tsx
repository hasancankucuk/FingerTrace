/* eslint-disable @typescript-eslint/no-explicit-any */
import type { WorkspacesType } from "@/models/Workspaces";

interface WorkspaceDropdownProps {
  open: boolean;
  onClose: () => void;
  workspaces?: WorkspacesType[]; // make optional to be defensive
  handleSelectWorkspace: (workspace: WorkspacesType) => void;
  loadingWorkspaces?: boolean;
}

export const WorkspaceDropdown = ({
  open,
  workspaces = [],
  handleSelectWorkspace,
  loadingWorkspaces = false,
  onClose,
}: WorkspaceDropdownProps) => {
  if (!open) return null;

  const list = Array.isArray(workspaces) ? workspaces : [];

  return (
    <div
      role="menu"
      aria-hidden={!open}
      className="mt-1 w-full bg-background border border-border rounded shadow-lg z-50 p-2 flex flex-col gap-1"
    >
      {loadingWorkspaces ? (
        <div className="text-sm text-muted-foreground px-2 py-1">Loading...</div>
      ) : list.length > 0 ? (
        list.map((workspace, idx) => {
          const idKey = (workspace as any)?.id ?? (workspace as any)?._id ?? (workspace as any)?.workspace_id ?? `${idx}`;
          const label =
            (workspace as any)?.name ??
            (workspace as any)?.title ??
            (workspace as any)?.workspace ??
            String((workspace as any)?.id ?? (workspace as any)?._id ?? idx);

          return (
            <button
              key={idKey}
              type="button"
              role="menuitem"
              className="text-sm text-foreground text-left truncate hover:bg-primary/10 rounded px-2 py-1 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleSelectWorkspace(workspace);
                onClose();
              }}
            >
              {label}
            </button>
          );
        })
      ) : (
        <div className="text-sm text-muted-foreground px-2 py-1">No projects</div>
      )}
    </div>
  );
};