"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/stores/useAppStore";
import {
  Settings,
  Bell,
  Moon,
  Sun,
  Gauge,
  Volume2,
  Shield,
  Database,
  Wifi,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    isSimulationRunning,
    simulationSpeed,
    setSimulationSpeed,
    startSimulation,
    stopSimulation,
  } = useAppStore();

  const [notifications, setNotifications] = useState({
    critical: true,
    warning: true,
    info: false,
    sound: true,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">설정</h1>
          <p className="text-slate-400">시스템 설정 및 환경 구성</p>
        </div>

        {/* Demo Settings */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-400" />
              데모 시뮬레이션
            </CardTitle>
            <CardDescription className="text-slate-400">
              프로토타입 데모를 위한 시뮬레이션 설정
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">시뮬레이션 활성화</p>
                <p className="text-sm text-slate-400">실시간 센서 데이터 및 감지 이벤트 생성</p>
              </div>
              <Switch
                checked={isSimulationRunning}
                onCheckedChange={(checked) => checked ? startSimulation() : stopSimulation()}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">시뮬레이션 속도</p>
                <Badge variant="outline" className="border-slate-600">
                  {simulationSpeed}x
                </Badge>
              </div>
              <Slider
                value={[simulationSpeed]}
                onValueChange={([value]) => setSimulationSpeed(value)}
                min={0.5}
                max={3}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>느림 (0.5x)</span>
                <span>보통 (1x)</span>
                <span>빠름 (3x)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-purple-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
              화면 설정
            </CardTitle>
            <CardDescription className="text-slate-400">
              테마 및 디스플레이 옵션
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">다크 모드</p>
                <p className="text-sm text-slate-400">관제실 환경에 최적화된 어두운 테마</p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              알림 설정
            </CardTitle>
            <CardDescription className="text-slate-400">
              알림 유형별 수신 설정
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div>
                  <p className="font-medium text-white">긴급 알림</p>
                  <p className="text-sm text-slate-400">중대 위험 상황 알림</p>
                </div>
              </div>
              <Switch
                checked={notifications.critical}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, critical: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div>
                  <p className="font-medium text-white">주의 알림</p>
                  <p className="text-sm text-slate-400">경고 수준 이상 알림</p>
                </div>
              </div>
              <Switch
                checked={notifications.warning}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, warning: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <div>
                  <p className="font-medium text-white">정보 알림</p>
                  <p className="text-sm text-slate-400">일반 정보성 알림</p>
                </div>
              </div>
              <Switch
                checked={notifications.info}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, info: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-white">알림 소리</p>
                  <p className="text-sm text-slate-400">경보 발생 시 소리 알림</p>
                </div>
              </div>
              <Switch
                checked={notifications.sound}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, sound: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-green-400" />
              시스템 정보
            </CardTitle>
            <CardDescription className="text-slate-400">
              현재 시스템 상태 및 버전 정보
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-400">시스템</span>
                </div>
                <p className="font-medium text-white">IMSE-MS v1.0.0</p>
                <p className="text-xs text-slate-500">프로토타입 버전</p>
              </div>

              <div className="p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-slate-400">AI 모델</span>
                </div>
                <p className="font-medium text-white">Claude Sonnet 4.0</p>
                <p className="text-xs text-slate-500">Anthropic</p>
              </div>

              <div className="p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-400">연결 상태</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="font-medium text-white">정상 연결</p>
                </div>
              </div>

              <div className="p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-slate-400">데이터 모드</span>
                </div>
                <p className="font-medium text-white">목업 데이터</p>
                <p className="text-xs text-slate-500">시뮬레이션 모드</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version Info */}
        <div className="text-center text-slate-500 text-sm">
          <p>IMSE-MS 프로토타입 | 2025 국정과제 혁신 아이디어 공모전</p>
          <p className="mt-1">© 한국서부발전 | Powered by Next.js & Claude AI</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
