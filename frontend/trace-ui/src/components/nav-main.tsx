// NavMain.tsx
import { useCallback, useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import type { Icon } from "@tabler/icons-react";
import { toast } from "sonner";

import { getWorkspaces } from "@/services/workspaces";
import type { WorkspacesType } from "@/models/Workspaces";
import { useWorkspace } from "@/hooks/useWorkspace";
import { TeamSwitcher } from "@/components/team-switcher";
import CreateWorkspaceModal from "./helpers/CreateWorkspaceModal";

export function NavMain({ items }: { items: { title: string; url: string; icon?: Icon }[] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspace: selectedWorkspace, setWorkspace } = useWorkspace();

  const [workspaces, setWorkspaces] = useState<WorkspacesType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadWorkspaces = useCallback(async () => {
    try {
      const data = await getWorkspaces();
      setWorkspaces(data ?? []);
      // Eğer selectedWorkspace yoksa ilk workspace’i seç
      if (data?.length && !selectedWorkspace) {
        setWorkspace(data[0]);
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Error loading workspaces");
      setWorkspaces([]);
    }
  }, [setWorkspace, selectedWorkspace]);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleWorkspaceCreated = async () => {
    handleCloseModal();
    await loadWorkspaces();
    toast.success("Workspace created!");
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {workspaces.length > 0 ? (
            <>
              <TeamSwitcher workspaces={workspaces} />
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => navigate(item.url)}
                      className={`flex items-center gap-2 w-full rounded-md px-2 py-1 transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground text-foreground"
                      }`}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 px-2 py-4">
              <div className="text-sm text-muted-foreground mb-2 text-center">
                No workspace found. Please create a workspace to continue.
              </div>
              <button
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={handleOpenModal}
              >
                + Create Workspace
              </button>
            </div>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
      <CreateWorkspaceModal
        open={modalOpen}
        onClose={handleCloseModal}
        onCreated={handleWorkspaceCreated}
      />
    </SidebarGroup>
  );
}