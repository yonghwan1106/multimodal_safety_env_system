"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <Header />
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          sidebarOpen ? "pl-64" : "pl-20"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
