"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/stores/useAppStore";
import { generateSensorHistory } from "@/lib/mock-data";
import {
  Thermometer,
  Wind,
  Waves,
  CloudRain,
  Droplets,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";

const sensorIcons: Record<string, typeof Thermometer> = {
  temperature: Thermometer,
  gas: Wind,
  vibration: Waves,
  dust: CloudRain,
  humidity: Droplets,
};

const sensorColors: Record<string, string> = {
  temperature: "#EF4444",
  gas: "#F59E0B",
  vibration: "#8B5CF6",
  dust: "#6366F1",
  humidity: "#06B6D4",
};

export default function SensorsPage() {
  const { sensors, zones, updateSensorValue, isSimulationRunning } = useAppStore();
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [sensorHistory, setSensorHistory] = useState<{ timestamp: Date; value: number }[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  // 실시간 센서 시뮬레이션
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      sensors.forEach((sensor) => {
        const variation = (Math.random() - 0.5) * 3;
        const newValue = Math.max(0, sensor.currentValue + variation);
        updateSensorValue(sensor.id, Math.round(newValue * 10) / 10);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulationRunning, sensors, updateSensorValue]);

  // 선택된 센서 히스토리 로드
  useEffect(() => {
    if (selectedSensor) {
      const history = generateSensorHistory(selectedSensor, 2);
      setSensorHistory(history);
    }
  }, [selectedSensor]);

  const filteredSensors = activeTab === "all"
    ? sensors
    : sensors.filter((s) => s.type === activeTab);

  const dangerSensors = sensors.filter((s) => s.status === "danger");
  const cautionSensors = sensors.filter((s) => s.status === "caution");
  const selectedSensorData = sensors.find((s) => s.id === selectedSensor);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">IoT 센서 대시보드</h1>
            <p className="text-slate-400">멀티모달 센서 데이터 실시간 모니터링</p>
          </div>
          <div className="flex items-center gap-4">
            {dangerSensors.length > 0 && (
              <Badge className="bg-red-500 animate-pulse">
                <AlertTriangle className="w-4 h-4 mr-2" />
                위험 {dangerSensors.length}건
              </Badge>
            )}
            {cautionSensors.length > 0 && (
              <Badge className="bg-amber-500">
                <AlertTriangle className="w-4 h-4 mr-2" />
                주의 {cautionSensors.length}건
              </Badge>
            )}
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Activity className="w-4 h-4 mr-2" />
              {sensors.length}개 센서 활성
            </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { type: "temperature", label: "온도 센서", count: sensors.filter((s) => s.type === "temperature").length },
            { type: "gas", label: "가스 센서", count: sensors.filter((s) => s.type === "gas").length },
            { type: "vibration", label: "진동 센서", count: sensors.filter((s) => s.type === "vibration").length },
            { type: "dust", label: "미세먼지", count: sensors.filter((s) => s.type === "dust").length },
            { type: "humidity", label: "습도 센서", count: sensors.filter((s) => s.type === "humidity").length },
          ].map((item) => {
            const Icon = sensorIcons[item.type];
            const avgValue = sensors
              .filter((s) => s.type === item.type)
              .reduce((acc, s) => acc + s.currentValue, 0) / (sensors.filter((s) => s.type === item.type).length || 1);
            const hasAlert = sensors.some((s) => s.type === item.type && s.status !== "normal");

            return (
              <Card
                key={item.type}
                className={cn(
                  "bg-slate-900 border-slate-800 cursor-pointer transition-all hover:border-slate-600",
                  activeTab === item.type && "border-blue-500"
                )}
                onClick={() => setActiveTab(item.type === activeTab ? "all" : item.type)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${sensorColors[item.type]}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: sensorColors[item.type] }} />
                    </div>
                    {hasAlert && (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="text-xl font-bold text-white">
                    {Math.round(avgValue * 10) / 10}
                    <span className="text-sm font-normal text-slate-400 ml-1">
                      {sensors.find((s) => s.type === item.type)?.unit}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{item.count}개 센서</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sensor Grid */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">센서 목록</CardTitle>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-slate-800">
                      <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">
                        전체
                      </TabsTrigger>
                      <TabsTrigger value="gas" className="data-[state=active]:bg-slate-700">
                        가스
                      </TabsTrigger>
                      <TabsTrigger value="temperature" className="data-[state=active]:bg-slate-700">
                        온도
                      </TabsTrigger>
                      <TabsTrigger value="vibration" className="data-[state=active]:bg-slate-700">
                        진동
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSensors.map((sensor) => {
                    const Icon = sensorIcons[sensor.type];
                    const zone = zones.find((z) => z.id === sensor.zone);
                    const percentage = (sensor.currentValue / sensor.thresholds.danger) * 100;

                    return (
                      <div
                        key={sensor.id}
                        className={cn(
                          "p-4 rounded-lg border transition-all cursor-pointer",
                          sensor.status === "danger" && "border-red-500/50 bg-red-500/10 animate-pulse",
                          sensor.status === "caution" && "border-amber-500/50 bg-amber-500/10",
                          sensor.status === "normal" && "border-slate-700 bg-slate-800 hover:border-slate-600",
                          selectedSensor === sensor.id && "ring-2 ring-blue-500"
                        )}
                        onClick={() => setSelectedSensor(sensor.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${sensorColors[sensor.type]}20` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: sensorColors[sensor.type] }} />
                            </div>
                            <div>
                              <p className="font-medium text-white">{sensor.name}</p>
                              <p className="text-xs text-slate-400">{zone?.name}</p>
                            </div>
                          </div>
                          <Badge
                            className={cn(
                              sensor.status === "normal" && "bg-green-500",
                              sensor.status === "caution" && "bg-amber-500",
                              sensor.status === "danger" && "bg-red-500"
                            )}
                          >
                            {sensor.status === "normal" ? "정상" : sensor.status === "caution" ? "주의" : "위험"}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-white">
                              {sensor.currentValue}
                              <span className="text-sm font-normal text-slate-400 ml-1">{sensor.unit}</span>
                            </span>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              {percentage > 80 ? (
                                <TrendingUp className="w-4 h-4 text-red-400" />
                              ) : percentage > 50 ? (
                                <TrendingUp className="w-4 h-4 text-amber-400" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-green-400" />
                              )}
                              {Math.round(percentage)}%
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Progress
                              value={percentage}
                              className={cn(
                                "h-2",
                                sensor.status === "normal" && "[&>div]:bg-green-500",
                                sensor.status === "caution" && "[&>div]:bg-amber-500",
                                sensor.status === "danger" && "[&>div]:bg-red-500"
                              )}
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>0</span>
                              <span className="text-amber-400">{sensor.thresholds.caution}</span>
                              <span className="text-red-400">{sensor.thresholds.danger}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sensor Detail */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900 border-slate-800 h-full">
              <CardHeader>
                <CardTitle className="text-white">
                  {selectedSensorData ? selectedSensorData.name : "센서 선택"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSensorData ? (
                  <div className="space-y-6">
                    {/* Current Value */}
                    <div className="text-center p-6 bg-slate-800 rounded-lg">
                      <p className="text-sm text-slate-400 mb-2">현재 값</p>
                      <p
                        className={cn(
                          "text-5xl font-bold",
                          selectedSensorData.status === "normal" && "text-green-400",
                          selectedSensorData.status === "caution" && "text-amber-400",
                          selectedSensorData.status === "danger" && "text-red-400"
                        )}
                      >
                        {selectedSensorData.currentValue}
                        <span className="text-lg font-normal text-slate-400 ml-2">
                          {selectedSensorData.unit}
                        </span>
                      </p>
                    </div>

                    {/* Chart */}
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sensorHistory.slice(-30)}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="5%"
                                stopColor={sensorColors[selectedSensorData.type]}
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor={sensorColors[selectedSensorData.type]}
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis
                            dataKey="timestamp"
                            tickFormatter={(val) => format(new Date(val), "HH:mm")}
                            stroke="#64748b"
                            fontSize={10}
                          />
                          <YAxis stroke="#64748b" fontSize={10} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #334155",
                              borderRadius: "8px",
                            }}
                            labelFormatter={(val) => format(new Date(val), "HH:mm:ss")}
                          />
                          <ReferenceLine
                            y={selectedSensorData.thresholds.caution}
                            stroke="#F59E0B"
                            strokeDasharray="5 5"
                          />
                          <ReferenceLine
                            y={selectedSensorData.thresholds.danger}
                            stroke="#EF4444"
                            strokeDasharray="5 5"
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={sensorColors[selectedSensorData.type]}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Thresholds */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-white">임계값 설정</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-500/10 rounded">
                          <span className="text-sm text-green-400">정상</span>
                          <span className="text-sm text-white">
                            0 ~ {selectedSensorData.thresholds.normal} {selectedSensorData.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-amber-500/10 rounded">
                          <span className="text-sm text-amber-400">주의</span>
                          <span className="text-sm text-white">
                            {selectedSensorData.thresholds.normal} ~ {selectedSensorData.thresholds.caution}{" "}
                            {selectedSensorData.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-500/10 rounded">
                          <span className="text-sm text-red-400">위험</span>
                          <span className="text-sm text-white">
                            {selectedSensorData.thresholds.caution}+ {selectedSensorData.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">센서 ID</span>
                        <span className="text-white">{selectedSensorData.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">유형</span>
                        <span className="text-white">{selectedSensorData.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">구역</span>
                        <span className="text-white">
                          {zones.find((z) => z.id === selectedSensorData.zone)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <Activity className="w-12 h-12 mb-4" />
                    <p>센서를 선택하면 상세 정보가 표시됩니다</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
