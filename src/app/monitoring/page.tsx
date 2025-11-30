"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/stores/useAppStore";
import {
  Video,
  VideoOff,
  Maximize2,
  AlertTriangle,
  User,
  HardHat,
  Flame,
  Wind,
  Activity,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState, useCallback } from "react";
import { Detection } from "@/lib/types";

// 시뮬레이션용 랜덤 감지 생성
const detectionTypes = [
  { type: "person", label: "작업자 감지", icon: User, color: "text-blue-400" },
  { type: "helmet", label: "안전모 착용", icon: HardHat, color: "text-green-400" },
  { type: "no_helmet", label: "안전모 미착용", icon: HardHat, color: "text-red-400", isAnomaly: true },
  { type: "smoke", label: "연기 감지", icon: Wind, color: "text-orange-400", isAnomaly: true },
] as const;

export default function MonitoringPage() {
  const { cameras, zones, detections, addDetection, isSimulationRunning } = useAppStore();
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [eventLog, setEventLog] = useState<Array<{ id: string; camera: string; type: string; label: string; time: Date; isAnomaly: boolean }>>([]);

  // 감지 시뮬레이션
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      const randomCamera = cameras[Math.floor(Math.random() * cameras.length)];
      const randomDetection = detectionTypes[Math.floor(Math.random() * detectionTypes.length)];

      const newEvent = {
        id: `event-${Date.now()}`,
        camera: randomCamera.name,
        type: randomDetection.type,
        label: randomDetection.label,
        time: new Date(),
        isAnomaly: randomDetection.isAnomaly || false,
      };

      setEventLog((prev) => [newEvent, ...prev.slice(0, 49)]);

      // 이상 감지인 경우 스토어에도 추가
      if (randomDetection.isAnomaly) {
        addDetection({
          id: newEvent.id,
          cameraId: randomCamera.id,
          type: randomDetection.type as Detection["type"],
          label: randomDetection.label,
          confidence: 0.85 + Math.random() * 0.14,
          bbox: {
            x: Math.random() * 200,
            y: Math.random() * 150,
            width: 40 + Math.random() * 40,
            height: 60 + Math.random() * 60,
          },
          timestamp: new Date(),
          isAnomaly: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulationRunning, cameras, addDetection]);

  const selectedCameraData = cameras.find((c) => c.id === selectedCamera);
  const onlineCameras = cameras.filter((c) => c.status === "online");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">CCTV 모니터링</h1>
            <p className="text-slate-400">Vision AI 실시간 위험 감지</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Video className="w-4 h-4 mr-2" />
              {onlineCameras.length}/{cameras.length} 온라인
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Eye className="w-4 h-4 mr-2" />
              AI 분석 활성
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Camera Grid */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">카메라 그리드</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {cameras.map((camera) => {
                    const zone = zones.find((z) => z.id === camera.zone);
                    const cameraDetections = detections.filter((d) => d.cameraId === camera.id);
                    const hasAnomaly = cameraDetections.some((d) => d.isAnomaly);

                    return (
                      <div
                        key={camera.id}
                        className={cn(
                          "relative aspect-video bg-slate-800 rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-blue-500",
                          selectedCamera === camera.id && "ring-2 ring-blue-500",
                          hasAnomaly && "ring-2 ring-red-500 animate-pulse"
                        )}
                        onClick={() => setSelectedCamera(camera.id)}
                      >
                        {/* Camera Feed Simulation */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800">
                          {camera.status === "online" ? (
                            <>
                              {/* Simulated video noise effect */}
                              <div className="absolute inset-0 opacity-20">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
                              </div>

                              {/* Detection Overlays */}
                              {cameraDetections.slice(0, 3).map((det, i) => (
                                <div
                                  key={det.id}
                                  className={cn(
                                    "absolute border-2 rounded",
                                    det.isAnomaly ? "border-red-500" : "border-green-500"
                                  )}
                                  style={{
                                    left: `${20 + i * 25}%`,
                                    top: `${30 + i * 10}%`,
                                    width: "60px",
                                    height: "80px",
                                  }}
                                >
                                  <div
                                    className={cn(
                                      "absolute -top-5 left-0 text-xs px-1 rounded",
                                      det.isAnomaly ? "bg-red-500" : "bg-green-500"
                                    )}
                                  >
                                    {det.label}
                                  </div>
                                </div>
                              ))}

                              {/* Scan line effect */}
                              <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute w-full h-[2px] bg-green-500/30 animate-scan" />
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <VideoOff className="w-12 h-12 text-slate-600" />
                            </div>
                          )}
                        </div>

                        {/* Camera Info Overlay */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                          <Badge
                            className={cn(
                              "text-xs",
                              camera.status === "online" ? "bg-green-500" : "bg-red-500"
                            )}
                          >
                            {camera.name}
                          </Badge>
                          {hasAnomaly && (
                            <Badge className="bg-red-500 animate-pulse">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              이상 감지
                            </Badge>
                          )}
                        </div>

                        {/* Zone & Location */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 bg-slate-900/80 px-2 py-1 rounded">
                              {zone?.name} - {camera.location}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6 bg-slate-900/80 hover:bg-slate-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCamera(camera.id);
                              }}
                            >
                              <Maximize2 className="w-3 h-3 text-white" />
                            </Button>
                          </div>
                        </div>

                        {/* Recording indicator */}
                        {camera.status === "online" && (
                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs text-red-400">REC</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Log */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900 border-slate-800 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  감지 이벤트 로그
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {eventLog.map((event) => {
                      const DetectionIcon = detectionTypes.find((d) => d.type === event.type)?.icon || User;
                      const iconColor = detectionTypes.find((d) => d.type === event.type)?.color || "text-blue-400";

                      return (
                        <div
                          key={event.id}
                          className={cn(
                            "p-3 rounded-lg border transition-all",
                            event.isAnomaly
                              ? "border-red-500/50 bg-red-500/10"
                              : "border-slate-700 bg-slate-800"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                event.isAnomaly ? "bg-red-500/20" : "bg-slate-700"
                              )}
                            >
                              <DetectionIcon className={cn("w-4 h-4", iconColor)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-white">{event.label}</span>
                                {event.isAnomaly && (
                                  <Badge className="bg-red-500 text-xs">이상</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  {event.camera}
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  {format(event.time, "HH:mm:ss")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {eventLog.length === 0 && (
                      <div className="text-center text-slate-500 py-8">
                        이벤트 대기 중...
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Selected Camera Detail */}
        {selectedCameraData && (
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">
                {selectedCameraData.name} - {selectedCameraData.location}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCamera(null)}
                className="text-slate-400 hover:text-white"
              >
                닫기
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Large Camera View */}
                <div className="aspect-video bg-slate-800 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
                    </div>

                    {/* Sample detection boxes */}
                    <div className="absolute border-2 border-green-500 rounded" style={{ left: '20%', top: '30%', width: '80px', height: '120px' }}>
                      <div className="absolute -top-6 left-0 bg-green-500 text-xs px-2 py-0.5 rounded">작업자 (95%)</div>
                    </div>
                    <div className="absolute border-2 border-green-500 rounded" style={{ left: '24%', top: '30%', width: '50px', height: '50px' }}>
                      <div className="absolute -top-6 left-0 bg-green-500 text-xs px-2 py-0.5 rounded">안전모 (92%)</div>
                    </div>

                    {/* Timestamp overlay */}
                    <div className="absolute bottom-4 left-4 bg-slate-900/80 px-3 py-1 rounded text-sm text-white font-mono">
                      {format(new Date(), "yyyy-MM-dd HH:mm:ss")}
                    </div>

                    {/* AI Analysis indicator */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded">
                      <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                      <span className="text-sm text-green-400">AI 분석 중</span>
                    </div>
                  </div>
                </div>

                {/* Camera Info */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 rounded-lg p-4">
                      <p className="text-sm text-slate-400">카메라 ID</p>
                      <p className="text-lg font-medium text-white">{selectedCameraData.id}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <p className="text-sm text-slate-400">상태</p>
                      <Badge className={selectedCameraData.status === "online" ? "bg-green-500" : "bg-red-500"}>
                        {selectedCameraData.status === "online" ? "온라인" : "오프라인"}
                      </Badge>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <p className="text-sm text-slate-400">구역</p>
                      <p className="text-lg font-medium text-white">
                        {zones.find((z) => z.id === selectedCameraData.zone)?.name}
                      </p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <p className="text-sm text-slate-400">위치</p>
                      <p className="text-lg font-medium text-white">{selectedCameraData.location}</p>
                    </div>
                  </div>

                  {/* Recent Detections */}
                  <div className="bg-slate-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-white mb-3">최근 감지 이력</h4>
                    <div className="space-y-2">
                      {detections
                        .filter((d) => d.cameraId === selectedCameraData.id)
                        .slice(0, 5)
                        .map((det) => (
                          <div
                            key={det.id}
                            className={cn(
                              "flex items-center justify-between p-2 rounded",
                              det.isAnomaly ? "bg-red-500/20" : "bg-slate-700"
                            )}
                          >
                            <span className="text-sm text-white">{det.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">
                                {Math.round(det.confidence * 100)}%
                              </span>
                              <span className="text-xs text-slate-500">
                                {format(det.timestamp, "HH:mm:ss")}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          100% {
            top: 100%;
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </DashboardLayout>
  );
}
