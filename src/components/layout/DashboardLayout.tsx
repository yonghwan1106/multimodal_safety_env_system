"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import { Award, Building2 } from "lucide-react";

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

        {/* 공모전 정보 푸터 */}
        <footer className="border-t border-slate-800 bg-slate-900/50 p-4 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="font-medium text-white">2025년도 국민과 함께 만드는 국정과제 혁신 아이디어 공모전</span>
            </div>
            <div className="hidden md:block text-slate-600">|</div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>한국서부발전 (Korea Western Power Co., Ltd.)</span>
            </div>
          </div>
          <div className="text-center mt-2 text-xs text-slate-500">
            AI·디지털 기술을 활용한 발전소 안전·환경 관제 혁신 아이디어
          </div>
        </footer>
      </main>
    </div>
  );
}
