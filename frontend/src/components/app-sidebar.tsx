import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UsageSidebar } from "@/components/usage/UsageSidebar";
import { useUserQuery } from "@/queries/userQueries";
import { useWorkspacesQuery } from "@/queries/workspaceQueries";
import { useAuthStore } from "@/store/useAuthStore";
import {
  IconCreditCard,
  IconEye,
  IconFingerprint,
  IconFlagPin,
  IconInnerShadowTop,
  IconKey,
  IconQuestionMark
} from "@tabler/icons-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    { title: t("nav.rules"), url: "/rules", icon: IconFlagPin },
    { title: t("nav.billing"), url: "/billing", icon: IconCreditCard },
  ];

  const datas = {
    user: currentUser ?? { name: "", email: "", phone: "" },
    workspaces: workspaces,
    navMain: navMainItems,
    navSecondary: [],
  };

  if (!userError) {
    useAuthStore.setState({ user: currentUser });
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link
                to={workspaces.length > 0 ? "/identification" : "/dashboard"}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                  <IconInnerShadowTop className="!size-5" />
                </div>
                <span className="text-base font-semibold">FingerTrace</span>
                <Badge variant="secondary" className="ml-2">
                  Beta
                </Badge>
              </Link>
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
        <div className="mt-auto">
          <UsageSidebar />
        </div>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={datas.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
