"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/stores/useAppStore";
import {
  Bell,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  MapPin,
  Eye,
  Video,
  Thermometer,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";

export default function AlertsPage() {
  const { alerts, zones, updateAlertStatus } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const selectedAlertData = alerts.find((a) => a.id === selectedAlert);

  const criticalCount = alerts.filter((a) => a.severity === "critical" && a.status !== "resolved").length;
  const warningCount = alerts.filter((a) => a.severity === "warning" && a.status !== "resolved").length;
  const infoCount = alerts.filter((a) => a.severity === "info" && a.status !== "resolved").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">알림 센터</h1>
            <p className="text-slate-400">모든 알림 및 경보 관리</p>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge className="bg-red-500 animate-pulse">
                <AlertTriangle className="w-4 h-4 mr-1" />
                긴급 {criticalCount}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge className="bg-amber-500">
                주의 {warningCount}
              </Badge>
            )}
            <Badge variant="outline" className="border-slate-600 text-slate-400">
              총 {alerts.length}건
            </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-red-500/10 border-red-500/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-400">긴급</p>
                  <p className="text-2xl font-bold text-white">{criticalCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/10 border-amber-500/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-400">주의</p>
                  <p className="text-2xl font-bold text-white">{warningCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-400">정보</p>
                  <p className="text-2xl font-bold text-white">{infoCount}</p>
                </div>
                <Info className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-400">해결됨</p>
                  <p className="text-2xl font-bold text-white">
                    {alerts.filter((a) => a.status === "resolved").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alert List */}
          <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-white">알림 목록</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="검색..."
                      className="pl-9 w-48 bg-slate-800 border-slate-700"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-28 bg-slate-800 border-slate-700">
                      <SelectValue placeholder="심각도" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="critical">긴급</SelectItem>
                      <SelectItem value="warning">주의</SelectItem>
                      <SelectItem value="info">정보</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-28 bg-slate-800 border-slate-700">
                      <SelectValue placeholder="상태" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="new">신규</SelectItem>
                      <SelectItem value="acknowledged">확인</SelectItem>
                      <SelectItem value="resolved">해결</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800">
                      <TableHead className="text-slate-400">심각도</TableHead>
                      <TableHead className="text-slate-400">제목</TableHead>
                      <TableHead className="text-slate-400">구역</TableHead>
                      <TableHead className="text-slate-400">출처</TableHead>
                      <TableHead className="text-slate-400">시간</TableHead>
                      <TableHead className="text-slate-400">상태</TableHead>
                      <TableHead className="text-slate-400">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.map((alert) => {
                      const zone = zones.find((z) => z.id === alert.zone);

                      return (
                        <TableRow
                          key={alert.id}
                          className={cn(
                            "border-slate-800 cursor-pointer hover:bg-slate-800/50",
                            selectedAlert === alert.id && "bg-slate-800"
                          )}
                          onClick={() => setSelectedAlert(alert.id)}
                        >
                          <TableCell>
                            <Badge
                              className={cn(
                                alert.severity === "critical" && "bg-red-500",
                                alert.severity === "warning" && "bg-amber-500",
                                alert.severity === "info" && "bg-blue-500"
                              )}
                            >
                              {alert.severity === "critical" ? "긴급" : alert.severity === "warning" ? "주의" : "정보"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white font-medium max-w-[200px] truncate">
                            {alert.title}
                          </TableCell>
                          <TableCell className="text-slate-300">{zone?.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-slate-600 text-slate-400">
                              {alert.source === "vision_ai" ? "Vision AI" : alert.source === "sensor" ? "센서" : "수동"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">
                            {format(alert.timestamp, "HH:mm:ss")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                alert.status === "new" && "border-blue-500 text-blue-400",
                                alert.status === "acknowledged" && "border-amber-500 text-amber-400",
                                alert.status === "resolved" && "border-green-500 text-green-400"
                              )}
                            >
                              {alert.status === "new" ? "신규" : alert.status === "acknowledged" ? "확인" : "해결"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-slate-400 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAlert(alert.id);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Alert Detail */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">알림 상세</CardTitle>
              {selectedAlertData && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedAlert(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {selectedAlertData ? (
                <div className="space-y-4">
                  {/* Severity Badge */}
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-sm",
                        selectedAlertData.severity === "critical" && "bg-red-500",
                        selectedAlertData.severity === "warning" && "bg-amber-500",
                        selectedAlertData.severity === "info" && "bg-blue-500"
                      )}
                    >
                      {selectedAlertData.severity === "critical" ? "긴급" : selectedAlertData.severity === "warning" ? "주의" : "정보"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        selectedAlertData.status === "new" && "border-blue-500 text-blue-400",
                        selectedAlertData.status === "acknowledged" && "border-amber-500 text-amber-400",
                        selectedAlertData.status === "resolved" && "border-green-500 text-green-400"
                      )}
                    >
                      {selectedAlertData.status === "new" ? "신규" : selectedAlertData.status === "acknowledged" ? "확인" : "해결"}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white">{selectedAlertData.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300">{selectedAlertData.description}</p>

                  {/* Meta Info */}
                  <div className="space-y-2 pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400">구역:</span>
                      <span className="text-white">{zones.find((z) => z.id === selectedAlertData.zone)?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {selectedAlertData.source === "vision_ai" ? (
                        <Video className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Thermometer className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-slate-400">출처:</span>
                      <span className="text-white">
                        {selectedAlertData.source === "vision_ai" ? "Vision AI" : selectedAlertData.source === "sensor" ? "센서" : "수동"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400">발생 시간:</span>
                      <span className="text-white">
                        {format(selectedAlertData.timestamp, "yyyy년 M월 d일 HH:mm:ss", { locale: ko })}
                      </span>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  {selectedAlertData.aiRecommendation && (
                    <div className="p-4 bg-purple-500/10 border border-purple-500/50 rounded-lg">
                      <h4 className="text-sm font-medium text-purple-400 mb-2">AI 권장 조치</h4>
                      <p className="text-sm text-white whitespace-pre-line">
                        {selectedAlertData.aiRecommendation}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    {selectedAlertData.status === "new" && (
                      <Button
                        className="flex-1 bg-amber-500 hover:bg-amber-600"
                        onClick={() => updateAlertStatus(selectedAlertData.id, "acknowledged")}
                      >
                        확인 처리
                      </Button>
                    )}
                    {selectedAlertData.status !== "resolved" && (
                      <Button
                        className="flex-1 bg-green-500 hover:bg-green-600"
                        onClick={() => updateAlertStatus(selectedAlertData.id, "resolved")}
                      >
                        해결 완료
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <Bell className="w-12 h-12 mb-4 text-slate-600" />
                  <p className="text-sm">알림을 선택하면 상세 정보가 표시됩니다</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
