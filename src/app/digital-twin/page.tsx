"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/stores/useAppStore";
import {
  Box,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Users,
  Video,
  Thermometer,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Html, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useState, useRef } from "react";
import * as THREE from "three";

// 발전소 건물 컴포넌트
function Building({
  position,
  size,
  color,
  name,
  status,
  onClick,
  isSelected,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  name: string;
  status: "normal" | "caution" | "danger";
  onClick: () => void;
  isSelected: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const statusColor = status === "normal" ? "#10B981" : status === "caution" ? "#F59E0B" : "#EF4444";
  const emissiveIntensity = status === "danger" ? 0.5 : status === "caution" ? 0.3 : 0;

  return (
    <group position={position}>
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={hovered || isSelected ? statusColor : color}
          emissive={statusColor}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* 건물 테두리 */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial color={isSelected ? "#3B82F6" : "#64748b"} linewidth={2} />
      </lineSegments>
      {/* 건물 이름 */}
      <Text
        position={[0, size[1] / 2 + 0.5, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="bottom"
      >
        {name}
      </Text>
      {/* 상태 표시 */}
      {(status === "caution" || status === "danger") && (
        <Html position={[0, size[1] / 2 + 1.2, 0]} center>
          <div
            className={cn(
              "px-2 py-1 rounded text-xs font-bold text-white animate-pulse",
              status === "danger" ? "bg-red-500" : "bg-amber-500"
            )}
          >
            {status === "danger" ? "위험" : "주의"}
          </div>
        </Html>
      )}
    </group>
  );
}

// 센서 마커
function SensorMarker({
  position,
  value,
  unit,
  status,
}: {
  position: [number, number, number];
  value: number;
  unit: string;
  status: "normal" | "caution" | "danger";
}) {
  const color = status === "normal" ? "#10B981" : status === "caution" ? "#F59E0B" : "#EF4444";

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <Html center>
        <div className="bg-slate-900/90 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
          {value} {unit}
        </div>
      </Html>
    </group>
  );
}

// 작업자 마커
function WorkerMarker({
  position,
  name,
  hasHelmet,
}: {
  position: [number, number, number];
  name: string;
  hasHelmet: boolean;
}) {
  return (
    <group position={position}>
      <mesh>
        <capsuleGeometry args={[0.15, 0.3, 4, 8]} />
        <meshStandardMaterial color={hasHelmet ? "#3B82F6" : "#EF4444"} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={hasHelmet ? "#F59E0B" : "#DC2626"} />
      </mesh>
    </group>
  );
}

// 바닥
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[30, 20]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
  );
}

// 그리드
function Grid() {
  return (
    <gridHelper args={[30, 30, "#334155", "#334155"]} position={[0, 0, 0]} />
  );
}

export default function DigitalTwinPage() {
  const { zones, sensors, workers, alerts } = useAppStore();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const buildingConfigs = [
    { id: "zone-a", position: [-8, 1.5, -5] as [number, number, number], size: [5, 3, 4] as [number, number, number], color: "#475569" },
    { id: "zone-b", position: [0, 2, -5] as [number, number, number], size: [6, 4, 5] as [number, number, number], color: "#475569" },
    { id: "zone-c", position: [8, 1, -5] as [number, number, number], size: [4, 2, 3] as [number, number, number], color: "#475569" },
    { id: "zone-d", position: [-8, 1.5, 5] as [number, number, number], size: [5, 3, 4] as [number, number, number], color: "#475569" },
    { id: "zone-e", position: [0, 2.5, 5] as [number, number, number], size: [4, 5, 4] as [number, number, number], color: "#475569" },
    { id: "zone-f", position: [8, 1, 5] as [number, number, number], size: [4, 2, 4] as [number, number, number], color: "#475569" },
  ];

  const selectedZoneData = zones.find((z) => z.id === selectedZone);
  const zoneSensors = selectedZone ? sensors.filter((s) => s.zone === selectedZone) : [];
  const zoneWorkers = selectedZone ? workers.filter((w) => w.zone === selectedZone) : [];

  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Digital Twin 3D</h1>
            <p className="text-slate-400">발전소 3D 모델 실시간 시각화</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <Box className="w-4 h-4 mr-2" />
              실시간 동기화
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-4rem)]">
          {/* 3D View */}
          <Card className="lg:col-span-3 bg-slate-900 border-slate-800 overflow-hidden">
            <CardHeader className="border-b border-slate-800 flex flex-row items-center justify-between py-3">
              <CardTitle className="text-white text-sm">3D 관제 뷰</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white">
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[500px]">
              <Canvas shadows>
                <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={50} />
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={5}
                  maxDistance={40}
                />
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
                <pointLight position={[-10, 10, -10]} intensity={0.5} />

                <Suspense fallback={null}>
                  <Ground />
                  <Grid />

                  {/* Buildings */}
                  {buildingConfigs.map((config) => {
                    const zone = zones.find((z) => z.id === config.id);
                    if (!zone) return null;

                    return (
                      <Building
                        key={config.id}
                        position={config.position}
                        size={config.size}
                        color={config.color}
                        name={zone.name}
                        status={zone.status}
                        onClick={() => setSelectedZone(zone.id === selectedZone ? null : zone.id)}
                        isSelected={selectedZone === zone.id}
                      />
                    );
                  })}

                  {/* Sensors */}
                  {sensors.slice(0, 6).map((sensor, i) => {
                    const config = buildingConfigs.find((b) => b.id === sensor.zone);
                    if (!config) return null;

                    return (
                      <SensorMarker
                        key={sensor.id}
                        position={[
                          config.position[0] + (i % 2) * 2 - 1,
                          0.3,
                          config.position[2] + Math.floor(i / 2) * 2 - 1,
                        ]}
                        value={sensor.currentValue}
                        unit={sensor.unit}
                        status={sensor.status}
                      />
                    );
                  })}

                  {/* Workers */}
                  {workers.filter((w) => w.status === "active").map((worker, i) => {
                    const config = buildingConfigs.find((b) => b.id === worker.zone);
                    if (!config) return null;

                    return (
                      <WorkerMarker
                        key={worker.id}
                        position={[
                          config.position[0] + (i % 3) - 1,
                          0.3,
                          config.position[2] + 3,
                        ]}
                        name={worker.name}
                        hasHelmet={worker.safetyGear.helmet}
                      />
                    );
                  })}
                </Suspense>
              </Canvas>
            </CardContent>
          </Card>

          {/* Info Panel */}
          <div className="space-y-4">
            {/* Legend */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="py-3">
                <CardTitle className="text-white text-sm">범례</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span className="text-sm text-slate-300">정상</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-500" />
                  <span className="text-sm text-slate-300">주의</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span className="text-sm text-slate-300">위험</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="text-sm text-slate-300">작업자 (안전모 착용)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-sm text-slate-300">작업자 (안전모 미착용)</span>
                </div>
              </CardContent>
            </Card>

            {/* Zone Info */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="py-3">
                <CardTitle className="text-white text-sm">
                  {selectedZoneData ? selectedZoneData.name : "구역 선택"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedZoneData ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">상태</span>
                      <Badge
                        className={cn(
                          selectedZoneData.status === "normal" && "bg-green-500",
                          selectedZoneData.status === "caution" && "bg-amber-500",
                          selectedZoneData.status === "danger" && "bg-red-500"
                        )}
                      >
                        {selectedZoneData.status === "normal" ? "정상" : selectedZoneData.status === "caution" ? "주의" : "위험"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">위험도</span>
                      <span className="text-sm text-white">{selectedZoneData.riskLevel}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">설명</span>
                      <span className="text-sm text-white">{selectedZoneData.description}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-slate-300">작업자: {zoneWorkers.length}명</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-slate-300">센서: {zoneSensors.length}개</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-300">
                          CCTV: {zones.find((z) => z.id === selectedZone) ? 2 : 0}대
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    <Eye className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm">3D 모델에서 건물을 클릭하여 상세 정보를 확인하세요</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Zone List */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="py-3">
                <CardTitle className="text-white text-sm">구역 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {zones.map((zone) => (
                      <div
                        key={zone.id}
                        className={cn(
                          "p-2 rounded-lg cursor-pointer transition-all",
                          selectedZone === zone.id
                            ? "bg-blue-500/20 border border-blue-500"
                            : "bg-slate-800 hover:bg-slate-700",
                          zone.status === "danger" && "border-l-4 border-l-red-500",
                          zone.status === "caution" && "border-l-4 border-l-amber-500"
                        )}
                        onClick={() => setSelectedZone(zone.id === selectedZone ? null : zone.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">{zone.name}</span>
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              zone.status === "normal" && "bg-green-500",
                              zone.status === "caution" && "bg-amber-500 animate-pulse",
                              zone.status === "danger" && "bg-red-500 animate-pulse"
                            )}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{zone.description}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
