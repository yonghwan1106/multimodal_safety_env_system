"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/stores/useAppStore";
import { roiData, dailyStats } from "@/lib/mock-data";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AnalyticsPage() {
  const { kpiData, alerts } = useAppStore();

  // 일별 통계 데이터 변환
  const chartData = dailyStats.map((stat) => ({
    ...stat,
    date: stat.date.slice(5), // MM-DD 형식
  }));

  // 알림 유형별 통계
  const alertsByType = [
    { name: "안전", value: alerts.filter((a) => a.type === "safety").length },
    { name: "환경", value: alerts.filter((a) => a.type === "environment").length },
    { name: "설비", value: alerts.filter((a) => a.type === "equipment").length },
  ];

  // 출처별 통계
  const alertsBySource = [
    { name: "Vision AI", value: alerts.filter((a) => a.source === "vision_ai").length },
    { name: "센서", value: alerts.filter((a) => a.source === "sensor").length },
    { name: "수동", value: alerts.filter((a) => a.source === "manual").length },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">분석 리포트</h1>
            <p className="text-slate-400">시스템 성능 및 ROI 분석</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              <BarChart3 className="w-4 h-4 mr-2" />
              실시간 분석
            </Badge>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">AI 정확도</p>
                  <p className="text-3xl font-bold text-white">{kpiData.aiAccuracy}%</p>
                </div>
                <Target className="w-12 h-12 text-green-300 opacity-80" />
              </div>
              <div className="mt-4 flex items-center gap-1 text-green-100 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>목표 99% 대비 달성</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">평균 대응시간</p>
                  <p className="text-3xl font-bold text-white">{kpiData.responseTime}초</p>
                </div>
                <Clock className="w-12 h-12 text-blue-300 opacity-80" />
              </div>
              <div className="mt-4 flex items-center gap-1 text-blue-100 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>기존 5분 → 0.5초 (99.8% 단축)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-violet-600 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">오경보율</p>
                  <p className="text-3xl font-bold text-white">{kpiData.falseAlarmRate}%</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-purple-300 opacity-80" />
              </div>
              <div className="mt-4 flex items-center gap-1 text-purple-100 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>기존 30% → 4.2% (83% 감소)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">연간 절감액</p>
                  <p className="text-3xl font-bold text-white">{roiData.annualSavings}억원</p>
                </div>
                <DollarSign className="w-12 h-12 text-amber-300 opacity-80" />
              </div>
              <div className="mt-4 flex items-center gap-1 text-amber-100 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>ROI 200% (1.5년 회수)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-slate-800">
            <TabsTrigger value="trends" className="data-[state=active]:bg-slate-700">
              트렌드 분석
            </TabsTrigger>
            <TabsTrigger value="roi" className="data-[state=active]:bg-slate-700">
              ROI 분석
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-slate-700">
              도입 전후 비교
            </TabsTrigger>
          </TabsList>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Detections */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">일별 감지 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="detections"
                          stroke="#3B82F6"
                          fillOpacity={1}
                          fill="url(#colorDetections)"
                          name="감지 건수"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Alert Trends */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">알림 처리 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.slice(-14)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="alerts" fill="#F59E0B" name="발생" />
                        <Bar dataKey="resolved" fill="#10B981" name="해결" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts by Type */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">알림 유형별 분포</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={alertsByType}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {alertsByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts by Source */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">감지 출처별 분포</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={alertsBySource}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {alertsBySource.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ROI Tab */}
          <TabsContent value="roi" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost Savings Breakdown */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">연간 비용 절감 내역</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roiData.breakdowns.map((item, index) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{item.name}</span>
                        <span className="text-sm font-bold text-white">{item.amount}억원</span>
                      </div>
                      <Progress
                        value={item.percentage}
                        className="h-3"
                        style={{
                          // @ts-ignore
                          "--progress-background": COLORS[index],
                        }}
                      />
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-lg font-medium text-white">총 절감액</span>
                    <span className="text-2xl font-bold text-green-400">{roiData.annualSavings}억원</span>
                  </div>
                </CardContent>
              </Card>

              {/* ROI Chart */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">투자 대비 수익률 (ROI)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "투자비용", value: roiData.investment },
                          { name: "연간 절감", value: roiData.annualSavings },
                          { name: "3년 누적", value: roiData.annualSavings * 3 - roiData.investment },
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis type="number" stroke="#64748b" fontSize={12} />
                        <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} width={80} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                          formatter={(value) => [`${value}억원`]}
                        />
                        <Bar dataKey="value" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-center">
                    <p className="text-green-400 font-bold text-2xl">ROI 200%</p>
                    <p className="text-slate-400 text-sm">투자금 회수 기간: 1.5년</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">IMSE-MS 도입 전후 비교</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      metric: "위험 감지 시간",
                      before: "5분",
                      after: "0.5초",
                      improvement: "99.8%",
                      icon: Clock,
                      positive: true,
                    },
                    {
                      metric: "골든타임 확보율",
                      before: "30%",
                      after: "95%",
                      improvement: "217%",
                      icon: Zap,
                      positive: true,
                    },
                    {
                      metric: "오경보율",
                      before: "30%",
                      after: "5%",
                      improvement: "83%",
                      icon: AlertTriangle,
                      positive: true,
                    },
                    {
                      metric: "비계획 정지",
                      before: "연 10회",
                      after: "연 2회",
                      improvement: "80%",
                      icon: Shield,
                      positive: true,
                    },
                  ].map((item) => (
                    <div
                      key={item.metric}
                      className="p-4 bg-slate-800 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <item.icon className="w-5 h-5 text-blue-400" />
                        <span className="font-medium text-white">{item.metric}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">도입 전</span>
                          <span className="text-lg text-red-400 font-medium">{item.before}</span>
                        </div>
                        <div className="flex justify-center">
                          <TrendingDown className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">도입 후</span>
                          <span className="text-lg text-green-400 font-medium">{item.after}</span>
                        </div>
                        <div className="pt-3 border-t border-slate-700 text-center">
                          <Badge className="bg-green-500">
                            {item.positive ? "↓" : "↑"} {item.improvement} 개선
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
              <CardContent className="py-8">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-white">
                    IMSE-MS 도입 효과 요약
                  </h3>
                  <p className="text-blue-100 max-w-2xl mx-auto">
                    지능형 멀티모달 안전·환경 관제 시스템 도입으로 안전사고 예방 능력이 획기적으로 향상되었으며,
                    연간 30억원의 비용 절감 효과를 달성했습니다.
                  </p>
                  <div className="flex justify-center gap-8 pt-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{kpiData.accidentFreeDays}</p>
                      <p className="text-blue-200 text-sm">무재해 일수</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{roiData.annualSavings}억</p>
                      <p className="text-blue-200 text-sm">연간 절감</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">{kpiData.aiAccuracy}%</p>
                      <p className="text-blue-200 text-sm">AI 정확도</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
