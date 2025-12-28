// NavMain.tsx
import { useCallback, useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import type { Icon } from "@tabler/icons-react";
import { toast } from "sonner";

import { getWorkspaces } from "@/services/workspaces";
import type { WorkspacesType } from "@/models/Workspaces";
import { useWorkspace } from "@/hooks/useWorkspace";
import { TeamSwitcher } from "@/components/team-switcher";
import CreateWorkspaceModal from "./helpers/CreateWorkspaceModal";
import { Spinner } from "./ui/spinner";
import { useTranslation } from "react-i18next";

export function NavMain({ items }: { items: { title: string; url: string; icon?: Icon }[] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const { workspace: selectedWorkspace, setWorkspace } = useWorkspace();

  const [workspaces, setWorkspaces] = useState<WorkspacesType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getWorkspaces();
      setWorkspaces(data ?? []);
      if (data?.length && !selectedWorkspace) {
        setWorkspace(data[0]);
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Error loading workspaces");
      setWorkspaces([]);
    } finally {
      setLoading(false);
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

  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {<Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 z-50" />}
        <SidebarMenu className={`${loading ? "opacity-50 pointer-events-none" : ""}`}>
          {!loading && workspaces.length > 0 ? (
            <>
              <TeamSwitcher workspaces={workspaces} />
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => navigate(item.url)}
                      className={`flex items-center gap-2 w-full rounded-md px-2 py-1 transition-colors ${isActive
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
          ) : isExpanded ? (
            <div className="flex flex-col items-center gap-2 px-2 py-4">
              <div className="text-sm text-muted-foreground mb-2 text-center">
                {t("common.noWorkspace")}
              </div>
              <button
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={handleOpenModal}
              >
                {t("common.createWorkspace")}
              </button>
            </div>
          ) : null}
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