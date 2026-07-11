import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Zap,
  ShieldCheck,
  FileSearch,
  BarChart3,
  Settings,
  Scale,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const workspaceItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Smart Inbox", url: "/inbox", icon: Inbox, badge: "3" },
  { title: "Cases", url: "/cases", icon: FolderKanban },
  { title: "Action Center", url: "/actions", icon: Zap, badge: "8" },
];

const intelItems = [
  { title: "Evidence Tracker", url: "/evidence", icon: FileSearch },
  { title: "Risk Intelligence", url: "/risk", icon: ShieldCheck },
  { title: "Reports", url: "/reports", icon: BarChart3, soon: true },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg accent-gradient shadow-md">
            <Scale className="h-5 w-5 text-sidebar-primary-foreground" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-bold text-base tracking-tight text-sidebar-foreground">
                LegalOS
              </div>
              <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
                Legal Intelligence
              </div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.badge && !collapsed && (
                        <span className="ml-auto rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {intelItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.soon && !collapsed && (
                        <span className="ml-auto rounded border border-sidebar-border px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-sidebar-foreground/50">
                          Soon
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")} tooltip="Settings">
                  <Link to="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed ? (
          <div className="rounded-lg bg-sidebar-accent/60 p-3">
            <div className="flex items-center gap-2 text-[11px] font-medium text-sidebar-foreground/80">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              AI Engine Online
            </div>
            <div className="mt-1 text-[10px] text-sidebar-foreground/50">
              Gemma-2 · Fireworks AI
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
