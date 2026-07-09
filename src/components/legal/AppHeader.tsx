import { Bell, Search, HelpCircle, Command } from "lucide-react";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { demo, demoOk } from "@/lib/demo-actions";

export function AppHeader() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-6" />

      <div className="relative flex flex-1 min-w-0 max-w-2xl items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search cases, documents, parties…"
          className="h-10 w-full min-w-0 rounded-lg border border-border bg-secondary/50 pl-10 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring/20 transition-colors"
        />
        <kbd className="pointer-events-none absolute right-3 hidden items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
          <Command className="h-3 w-3" />K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden lg:flex flex-col items-end">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Today
          </div>
          <div className="text-xs font-semibold text-foreground">{today}</div>
        </div>
        <Separator orientation="vertical" className="hidden lg:block h-6" />

        <button
          className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <button
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </button>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              AN
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block leading-tight">
            <div className="text-sm font-semibold text-foreground">Anita Nair</div>
            <div className="text-[11px] text-muted-foreground">Legal Ops Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
}
