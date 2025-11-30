"use client";

import { Bell, Search, User, Moon, Sun, Play, Pause, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useEffect, useState } from "react";

export function Header() {
  const {
    theme,
    setTheme,
    alerts,
    isSimulationRunning,
    startSimulation,
    stopSimulation,
    sidebarOpen,
  } = useAppStore();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const newAlerts = alerts.filter((a) => a.status === "new");
  const criticalAlerts = newAlerts.filter((a) => a.severity === "critical");

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-slate-900/95 backdrop-blur border-b border-slate-800 transition-all duration-300",
        sidebarOpen ? "left-64" : "left-20"
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left - Search & Time */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="search"
              placeholder="검색..."
              className="w-64 pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-sm">
              {format(currentTime, "yyyy년 M월 d일 (EEE)", { locale: ko })}
            </span>
            <span className="text-lg font-mono text-white">
              {format(currentTime, "HH:mm:ss")}
            </span>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Critical Alert Banner */}
          {criticalAlerts.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-lg animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">
                긴급 알림 {criticalAlerts.length}건
              </span>
            </div>
          )}

          {/* Simulation Control */}
          <Button
            variant="outline"
            size="sm"
            onClick={isSimulationRunning ? stopSimulation : startSimulation}
            className={cn(
              "border-slate-700",
              isSimulationRunning
                ? "text-green-400 hover:text-green-300"
                : "text-slate-400 hover:text-white"
            )}
          >
            {isSimulationRunning ? (
              <>
                <Pause className="w-4 h-4 mr-1" />
                시뮬레이션 중
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                시뮬레이션 시작
              </>
            )}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Bell className="w-5 h-5" />
                {newAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {newAlerts.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-slate-800">
              <DropdownMenuLabel className="text-white">최근 알림</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              {newAlerts.slice(0, 5).map((alert) => (
                <DropdownMenuItem
                  key={alert.id}
                  className="flex flex-col items-start gap-1 py-3 cursor-pointer hover:bg-slate-800"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Badge
                      variant={
                        alert.severity === "critical"
                          ? "destructive"
                          : alert.severity === "warning"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {alert.severity === "critical"
                        ? "긴급"
                        : alert.severity === "warning"
                        ? "주의"
                        : "정보"}
                    </Badge>
                    <span className="text-sm text-white font-medium truncate flex-1">
                      {alert.title}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {format(alert.timestamp, "HH:mm:ss")}
                  </span>
                </DropdownMenuItem>
              ))}
              {newAlerts.length === 0 && (
                <div className="py-4 text-center text-slate-400 text-sm">
                  새로운 알림이 없습니다
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
              <DropdownMenuLabel className="text-white">관제사</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-800">
                프로필
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-800">
                설정
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="text-slate-300 hover:bg-slate-800">
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
