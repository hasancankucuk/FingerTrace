import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconKey,
  IconInnerShadowTop,
  IconActivityHeartbeat,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();
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
        const message = err instanceof Error ? err.message : "Error fetching workspaces";
        toast.error(message);
      }
    };

    fetchData();
  }, []);
  
  const data = {
    user,
    workspaces,
    navMain: [
      { title: "Get Started", url: "/dashboard", icon: IconQuestionMark },
      { title: "API Keys", url: "/api-keys", icon: IconKey },
      { title: "Identification", url: "/identification", icon: IconFingerprint },
      { title: "Analysis", url: "/analysis", icon: IconEye },
    ],
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
              <a href="/">
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
                ? "bg-blue-500 text-white rounded-md"
                : "hover:bg-gray-100 text-gray-700",
          }))}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
