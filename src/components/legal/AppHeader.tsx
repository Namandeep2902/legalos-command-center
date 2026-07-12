import { Bell, Search, HelpCircle, Command, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { demo, demoOk } from "@/lib/demo-actions";
import { getUser, getInitials, logout } from "@/lib/auth";

export function AppHeader() {
  const user = getUser() || { name: "Anita Nair", company: "Nova Insurance" };
  const initials = getInitials(user.name);

  const [q, setQ] = useState("");
  const [theme, setTheme] = useState("light");

  // Load theme on mount only to prevent hydration mismatch
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    // Dispatch custom event to notify other components (like sidebar logo)
    window.dispatchEvent(new CustomEvent("theme-change", { detail: theme }));
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const submitSearch = () => {
    if (!q.trim()) return;
    window.location.href = `/cases?q=${encodeURIComponent(q.trim())}`;
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-6" />

      <div className="relative flex flex-1 min-w-0 max-w-2xl items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitSearch()}
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
        <button
          onClick={toggleTheme}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          onClick={() => demo("Help & Support", "Docs, keyboard shortcuts, and contact options.")}
          className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <button
          onClick={() => demoOk("3 new notifications", "Hearing reminder · Evidence uploaded · Approval pending.")}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </button>

        <button
          onClick={() => {
            if (window.confirm("Do you want to sign out?")) {
              logout();
            }
          }}
          className="flex items-center gap-2.5 rounded-lg px-1 py-1 hover:bg-secondary transition-colors"
        >
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block leading-tight text-left">
            <div className="text-sm font-semibold text-foreground">{user.name}</div>
            <div className="text-[11px] text-muted-foreground">{user.company || "Legal Ops Manager"}</div>
          </div>
        </button>
      </div>
    </header>
  );
}
