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
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useWorkspacesQuery } from "@/queries/workspaceQueries";
import { useUserQuery } from "@/queries/userQueries";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const {
    data: workspaces = [],
    isLoading: isWorkspacesLoading
  } = useWorkspacesQuery();

  const {
    data: currentUser,
    error: userError
  } = useUserQuery();

  if (userError) {
    toast.error(userError.message);
  }

  const navMainItems = [
    ...(isWorkspacesLoading && workspaces.length === 0
      ? [{ title: t("nav.get_started"), url: "/dashboard", icon: IconQuestionMark }]
      : []),
    { title: t("nav.identification"), url: "/identification", icon: IconFingerprint },
    { title: t("nav.api_keys"), url: "/api-keys", icon: IconKey },
    { title: t("nav.analysis"), url: "/analysis", icon: IconEye },
  ];

  const datas = {
    user: currentUser ?? { name: "", email: "", phone: "" },
    workspaces: workspaces,
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
          items={datas.navMain.map((item) => ({
            ...item,
            className:
              location.pathname === item.url
                ? "bg-primary text-primary-foreground font-medium rounded-md shadow-sm"
                : "hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors",
          }))}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={datas.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
