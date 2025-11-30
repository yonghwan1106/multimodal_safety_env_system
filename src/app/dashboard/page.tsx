"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/stores/useAppStore";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Cpu,
  Wifi,
  TrendingUp,
  TrendingDown,
  Users,
  Video,
  Thermometer,
  Wind,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const {
    zones,
    alerts,
    sensors,
    workers,
    kpiData,
    systemStatus,
    cameras,
    isSimulationRunning,
    updateSensorValue,
    addDetection,
  } = useAppStore();

  // 실시간 센서 시뮬레이션
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      sensors.forEach((sensor) => {
        const variation = (Math.random() - 0.5) * 5;
        const newValue = Math.max(0, sensor.currentValue + variation);
        updateSensorValue(sensor.id, Math.round(newValue * 10) / 10);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulationRunning, sensors, updateSensorValue]);

  const newAlerts = alerts.filter((a) => a.status === "new");
  const criticalAlerts = alerts.filter((a) => a.severity === "critical" && a.status !== "resolved");
  const activeWorkers = workers.filter((w) => w.status === "active");
  const onlineCameras = cameras.filter((c) => c.status === "online");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">실시간 관제 대시보드</h1>
            <p className="text-slate-400">발전소 안전 현황을 한눈에 확인하세요</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              시스템 정상
            </Badge>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">무재해 연속</p>
                  <p className="text-3xl font-bold text-white">{kpiData.accidentFreeDays}일</p>
                </div>
                <Shield className="w-12 h-12 text-blue-300 opacity-80" />
              </div>
              <div className="mt-4 flex items-center gap-1 text-blue-100 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>목표 500일까지 {500 - kpiData.accidentFreeDays}일</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">오늘 감지</p>
                  <p className="text-3xl font-bold text-white">{kpiData.todayDetections}건</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-amber-300 opacity-80" />
              </div>
              <div className="mt-4 flex items-center gap-1 text-amber-100 text-sm">
                <Activity className="w-4 h-4" />
                <span>대기 중 {kpiData.pendingAlerts}건</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">조치 완료</p>
                  <p className="text-3xl font-bold text-white">{kpiData.resolvedAlerts}건</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-300 opacity-80" />
              </div>
              <div className="mt-4 flex items-center gap-1 text-green-100 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>처리율 {Math.round((kpiData.resolvedAlerts / (kpiData.resolvedAlerts + kpiData.pendingAlerts)) * 100)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-violet-600 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">평균 대응시간</p>
                  <p className="text-3xl font-bold text-white">{kpiData.responseTime}초</p>
                </div>
                <Clock className="w-12 h-12 text-purple-300 opacity-80" />
              </div>
              <div className="mt-4 flex items-center gap-1 text-purple-100 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>목표 1초 이내 달성</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plant Map */}
          <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">발전소 구역 현황</CardTitle>
              <Link href="/digital-twin">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white">
                  3D 뷰 보기
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="relative bg-slate-800 rounded-lg p-4 h-[400px]">
                {/* Grid Lines */}
                <div className="absolute inset-4 grid grid-cols-3 grid-rows-2 gap-4">
                  {zones.map((zone) => (
                    <Link key={zone.id} href={`/monitoring?zone=${zone.id}`}>
                      <div
                        className={cn(
                          "relative h-full rounded-lg border-2 transition-all cursor-pointer hover:scale-[1.02]",
                          zone.status === "normal" && "border-green-500/50 bg-green-500/10",
                          zone.status === "caution" && "border-amber-500/50 bg-amber-500/10 animate-pulse",
                          zone.status === "danger" && "border-red-500/50 bg-red-500/20 animate-pulse"
                        )}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-bold text-white">{zone.name}</span>
                          <span className="text-sm text-slate-400">{zone.description}</span>
                          <Badge
                            className={cn(
                              "mt-2",
                              zone.status === "normal" && "bg-green-500",
                              zone.status === "caution" && "bg-amber-500",
                              zone.status === "danger" && "bg-red-500"
                            )}
                          >
                            {zone.status === "normal" ? "정상" : zone.status === "caution" ? "주의" : "위험"}
                          </Badge>
                          <div className="mt-2 text-xs text-slate-400">
                            위험도: {zone.riskLevel}%
                          </div>
                        </div>
                        {/* Workers indicator */}
                        {workers.filter((w) => w.zone === zone.id && w.status === "active").length > 0 && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900/80 rounded-full px-2 py-1">
                            <Users className="w-3 h-3 text-blue-400" />
                            <span className="text-xs text-blue-400">
                              {workers.filter((w) => w.zone === zone.id && w.status === "active").length}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Feed */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                실시간 알림
              </CardTitle>
              <Link href="/alerts">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  전체보기
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {alerts.slice(0, 10).map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        alert.severity === "critical" && "border-red-500/50 bg-red-500/10",
                        alert.severity === "warning" && "border-amber-500/50 bg-amber-500/10",
                        alert.severity === "info" && "border-slate-700 bg-slate-800"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              className={cn(
                                "text-xs",
                                alert.severity === "critical" && "bg-red-500",
                                alert.severity === "warning" && "bg-amber-500",
                                alert.severity === "info" && "bg-slate-600"
                              )}
                            >
                              {alert.severity === "critical" ? "긴급" : alert.severity === "warning" ? "주의" : "정보"}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {zones.find((z) => z.id === alert.zone)?.name}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-white truncate">{alert.title}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {format(alert.timestamp, "HH:mm:ss")}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs shrink-0",
                            alert.status === "new" && "border-blue-500 text-blue-400",
                            alert.status === "acknowledged" && "border-amber-500 text-amber-400",
                            alert.status === "resolved" && "border-green-500 text-green-400"
                          )}
                        >
                          {alert.status === "new" ? "신규" : alert.status === "acknowledged" ? "확인" : "완료"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Status */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                시스템 상태
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Vision AI</p>
                    <p className="text-xs text-slate-400">{systemStatus.visionAI.processedFrames.toLocaleString()} 프레임</p>
                  </div>
                </div>
                <Badge className="bg-green-500">정상</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">센서 AI</p>
                    <p className="text-xs text-slate-400">{systemStatus.sensorAI.activeSensors}/{systemStatus.sensorAI.totalSensors} 활성</p>
                  </div>
                </div>
                <Badge className="bg-green-500">정상</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">네트워크</p>
                    <p className="text-xs text-slate-400">{systemStatus.network.latency}ms 지연</p>
                  </div>
                </div>
                <Badge className="bg-green-500">정상</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Sensor Overview */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Wind className="w-5 h-5 text-cyan-400" />
                센서 현황
              </CardTitle>
              <Link href="/sensors">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  상세보기
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {sensors.slice(0, 4).map((sensor) => (
                <div key={sensor.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{sensor.name}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      sensor.status === "normal" && "text-green-400",
                      sensor.status === "caution" && "text-amber-400",
                      sensor.status === "danger" && "text-red-400"
                    )}>
                      {sensor.currentValue} {sensor.unit}
                    </span>
                  </div>
                  <Progress
                    value={(sensor.currentValue / sensor.thresholds.danger) * 100}
                    className={cn(
                      "h-2",
                      sensor.status === "normal" && "[&>div]:bg-green-500",
                      sensor.status === "caution" && "[&>div]:bg-amber-500",
                      sensor.status === "danger" && "[&>div]:bg-red-500"
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                데모 시나리오
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                onClick={() => useAppStore.getState().triggerScenario("gas_leak")}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                가스 누출 시뮬레이션
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-orange-500/50 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300"
                onClick={() => useAppStore.getState().triggerScenario("fire")}
              >
                <Flame className="w-4 h-4 mr-2" />
                화재 발생 시뮬레이션
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-purple-500/50 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
                onClick={() => useAppStore.getState().triggerScenario("fallen_worker")}
              >
                <Users className="w-4 h-4 mr-2" />
                작업자 쓰러짐 시뮬레이션
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-amber-500/50 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
                onClick={() => useAppStore.getState().triggerScenario("no_helmet")}
              >
                <Shield className="w-4 h-4 mr-2" />
                안전모 미착용 시뮬레이션
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
