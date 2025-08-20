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
import { NavSecondary } from "@/components/nav-secondary";
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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Get Started", url: "/", icon: IconQuestionMark },
    { title: "Analysis", url: "/analysis", icon: IconEye },
    { title: "API Keys", url: "/api-keys", icon: IconKey },
    { title: "Health", url: "/health", icon: IconActivityHeartbeat },
    { title: "Identification", url: "/identification", icon: IconFingerprint },
    // { title: "Integration", url: "/integration", icon: IconFileDescription },
  ],
  navSecondary: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();

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
              <a href="#">
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

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}