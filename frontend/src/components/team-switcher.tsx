// TeamSwitcher.tsx
import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { IconSitemap } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import type { WorkspacesType } from "@/models/Workspaces";
import CreateWorkspaceModal from "./helpers/CreateWorkspaceModal";
import { toast } from "sonner";
import { getWorkspaces } from "@/services/workspaces";
import { useWorkspace } from "@/hooks/useWorkspace";

export function TeamSwitcher({ workspaces: initialWorkspaces }: { workspaces: WorkspacesType[] }) {
  const { isMobile } = useSidebar();
  const { workspace: selectedWorkspace, setWorkspace } = useWorkspace();
  const [workspaces, setWorkspaces] = React.useState(initialWorkspaces);
  const [activeWorkspace, setActiveWorkspace] = React.useState<WorkspacesType | undefined>(selectedWorkspace ?? initialWorkspaces[0]);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  React.useEffect(() => {
    if (workspaces.length && !activeWorkspace) {
      setActiveWorkspace(workspaces[0]);
    }
  }, [workspaces, activeWorkspace]);

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  const refreshWorkspaces = async () => {
    // try {
    //   const data = await getWorkspaces();
    //   setWorkspaces(data ?? []);
    //   if (data?.length) {
    //     setActiveWorkspace(data[0]);
    //     setWorkspace(data[0]);
    //   }
    // } catch (err: unknown) {
    //   console.error(err);
    //   toast.error(err instanceof Error ? err.message : "Failed to refresh workspaces");
    // }
  };

  return (
    <>
      {showCreateModal && (
        <CreateWorkspaceModal
          open={showCreateModal}
          onClose={closeCreateModal}
          onCreated={async () => {
            closeCreateModal();
            await refreshWorkspaces();
            toast.success("Workspace created!");
          }}
        />
      )}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <IconSitemap className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeWorkspace?.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">Workspaces</DropdownMenuLabel>
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => {
                  setActiveWorkspace(workspace);
                  setWorkspace(workspace);
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <IconSitemap className="size-3.5 shrink-0" />
                </div>
                {workspace.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={openCreateModal}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add workspace</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}