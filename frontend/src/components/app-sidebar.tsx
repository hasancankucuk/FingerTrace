import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconKey,
  IconInnerShadowTop,
  IconEye,
  IconQuestionMark,
  IconFingerprint,
} from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/services/auth";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getWorkspaces } from "@/services/workspaces";
import type { User } from "@/models/UserInterface";
import type { WorkspacesType } from "@/models/Workspaces";
import { useTranslation } from "react-i18next";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [user, setUser] = useState<User>({ name: "", email: "", phone: "" });
  const [workspaces, setWorkspaces] = useState<WorkspacesType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser({
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone ?? "",
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error fetching user data";
        toast.error(message);
      }

      try {
        const ws = await getWorkspaces();
        setWorkspaces(ws);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : t("common.error_workspaces");
        toast.error(message);
      }
    };

    fetchData();
  }, []);

  const navMainItems = [
    ...(workspaces.length <= 0 ? [{ title: t("nav.get_started"), url: "/dashboard", icon: IconQuestionMark }] : []),
    { title: t("nav.identification"), url: "/identification", icon: IconFingerprint },
    { title: t("nav.api_keys"), url: "/api-keys", icon: IconKey },
    { title: t("nav.analysis"), url: "/analysis", icon: IconEye },
  ];

  const data = {
    user,
    workspaces,
    navMain: navMainItems,
    navSecondary: [],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              onClick={() => navigate("/")}
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Finger Trace</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            className:
              location.pathname === item.url
                ? "bg-primary text-primary-foreground font-medium rounded-md shadow-sm"
                : "hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors",
          }))}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
