;

import { useCallback, useEffect, useState } from "react";
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { getWorkspaces } from "@/services/workspaces";
import type { WorkspacesType } from "@/models/Workspaces";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CreateWorkspaceModal from "./helpers/CreateWorkspaceModal";
import { WorkspaceDropdown } from "./helpers/WorkspaceDropdown";

export function NavMain({
  items,
}: {
  items: { title: string; url: string; icon?: Icon }[];
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspace: selectedWorkspace, setWorkspace } = useWorkspace();

  const [workspaces, setWorkspaces] = useState<WorkspacesType[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadWorkspaces = useCallback(async () => {
    setLoadingWorkspaces(true);
    try {
      const data = await getWorkspaces();
      setWorkspaces(data ?? []);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to load workspaces");
      setWorkspaces([]);
    } finally {
      setLoadingWorkspaces(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleSelectWorkspace = (ws: WorkspacesType) => {
    setWorkspace(ws);
    setShowWorkspaceDropdown(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Workspaces"
              className="bg-primary justify-center text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={() => setShowWorkspaceDropdown((v) => !v)}
              aria-expanded={showWorkspaceDropdown}
            >
              <span>{selectedWorkspace ? selectedWorkspace.name : "Workspaces"}</span>
            </SidebarMenuButton>

            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              onClick={openCreateModal}
              aria-label="Create workspace"
              title="Create workspace"
            >
              <IconCirclePlusFilled />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        <WorkspaceDropdown
          open={showWorkspaceDropdown}
          onClose={() => setShowWorkspaceDropdown(false)}
          workspaces={workspaces}
          handleSelectWorkspace={handleSelectWorkspace}
          loadingWorkspaces={loadingWorkspaces}
        />
        <CreateWorkspaceModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            loadWorkspaces();
            setShowCreateModal(false);
          }}
        />

        <SidebarMenu>
          {workspaces.length > 0 || selectedWorkspace ? (
            items.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => navigate(item.url)}
                    className={`flex items-center gap-2 w-full ${
                      isActive ? "bg-blue-500 text-white" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.icon && <item.icon className="!size-5" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })
          ) : (
            <div className="px-2 py-1 text-sm text-muted-foreground">
              Please select or create a workspace to see options.
            </div>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
