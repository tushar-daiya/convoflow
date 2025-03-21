import { GoogleIcon, DropboxIcon } from "@/components/Icons";
import { ChartBar } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import AppSidebarFooter from "./AppSidebarFooter";
const sidebarItems = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: ChartBar,
  },
  {
    name: "Google",
    url: "/dashboard/google",
    icon: GoogleIcon,
  },
  {
    name: "Dropbox",
    url: "/dashboard/dropbox",
    icon: DropboxIcon,
  },
];
export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <h1 className="text-3xl font-bold text-center">A</h1>
      </SidebarHeader>
      <SidebarContent className="mt-5">
        <SidebarGroup>
          <SidebarMenu>
            <ul>
              {sidebarItems.map((item) => (
                <SidebarMenuItem
                  key={item.url}
                  className="hover:bg-blue-200 mb-2 rounded-lg"
                >
                  <SidebarMenuButton>
                    <Link
                      href={item.url}
                      className="flex items-center gap-2 py-2"
                    >
                      <item.icon className="h-6 w-6 mr-2" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </ul>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
