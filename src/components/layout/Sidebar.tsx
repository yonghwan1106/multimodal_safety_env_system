"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Video,
  Gauge,
  MessageSquare,
  Box,
  Bell,
  BarChart3,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: "대시보드", href: "/dashboard", icon: LayoutDashboard },
  { name: "CCTV 모니터링", href: "/monitoring", icon: Video },
  { name: "IoT 센서", href: "/sensors", icon: Gauge },
  { name: "AI 안전가이드", href: "/ai-guide", icon: MessageSquare },
  { name: "Digital Twin", href: "/digital-twin", icon: Box },
  { name: "알림 센터", href: "/alerts", icon: Bell },
  { name: "분석 리포트", href: "/analytics", icon: BarChart3 },
  { name: "설정", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, alerts, kpiData } = useAppStore();

  const pendingAlerts = alerts.filter((a) => a.status === "new").length;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-white text-lg">IMSE-MS</span>
              <span className="text-xs text-slate-400">관제 시스템</span>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          const showBadge = item.href === "/alerts" && pendingAlerts > 0;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-white")} />
              {sidebarOpen && <span className="font-medium">{item.name}</span>}
              {showBadge && (
                <Badge
                  variant="destructive"
                  className={cn(
                    "ml-auto",
                    !sidebarOpen && "absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  )}
                >
                  {pendingAlerts}
                </Badge>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Status */}
      {sidebarOpen && (
        <div className="px-4 py-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">시스템 상태</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400">정상</span>
              </span>
            </div>
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>무재해</span>
                <span className="text-white font-medium">{kpiData.accidentFreeDays}일</span>
              </div>
              <div className="flex justify-between">
                <span>AI 정확도</span>
                <span className="text-white font-medium">{kpiData.aiAccuracy}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
