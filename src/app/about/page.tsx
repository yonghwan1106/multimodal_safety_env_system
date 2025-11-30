"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Eye,
  EyeOff,
  Gauge,
  PersonStanding,
  Bell,
  Video,
  Thermometer,
  Wind,
  Brain,
  Database,
  Volume2,
  Watch,
  Box,
  Layers,
  MessageSquare,
  Clock,
  HeartPulse,
  BellOff,
  Power,
  Check,
  X,
  Leaf,
  Scale,
  Cpu,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function AboutPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-16 pb-12">
        {/* Hero Section */}
        <section className="text-center py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl" />
          <div className="relative z-10">
            <Badge className="mb-6 bg-slate-800 text-green-400 border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              2025 국정과제 혁신 아이디어 공모전
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              지능형 멀티모달<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                안전·환경 관제 시스템
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Vision AI와 생성형 AI가 결합된 차세대 발전소 안전관리 플랫폼.<br />
              24시간 잠들지 않는 AI가 발전소의 안전과 환경을 지킵니다.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={() => scrollToSection("features")}
              >
                <Zap className="w-4 h-4 mr-2" />
                자세히 보기
              </Button>
              <Button
                variant="outline"
                className="border-slate-700 hover:bg-slate-800"
                onClick={() => scrollToSection("roi")}
              >
                기대효과 확인
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "0.5", unit: "초", label: "위험 감지 시간" },
            { value: "95", unit: "%", label: "골든타임 확보율" },
            { value: "83", unit: "%", label: "오경보 감소율" },
            { value: "30", unit: "억", label: "연간 절감 효과" },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800 text-center py-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                  <span className="text-white">{stat.unit}</span>
                </div>
                <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Problems Section */}
        <section>
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-red-500/10 text-red-400 border-red-500/30">Problem</Badge>
            <h2 className="text-3xl font-bold text-white mb-3">발전소 안전관리의 현실</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              중대재해처벌법 시행에도 불구하고, 광활한 발전소 현장은 여전히 수많은 위험에 노출되어 있습니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: EyeOff, title: "CCTV 사각지대", desc: "광활한 발전소 부지 전체를 커버하기 어려우며, 기존 CCTV는 사후 확인만 가능합니다." },
              { icon: Gauge, title: "센서 한계", desc: "기존 센서는 임계값 초과 시에만 작동하여 미세 누출이나 전조 증상 감지가 불가능합니다." },
              { icon: PersonStanding, title: "인력 한계", desc: "24시간 수동 순찰은 물리적으로 불가능하며, 고위험 설비를 소수 인력으로 관리해야 합니다." },
              { icon: Bell, title: "단순 경보", desc: "기존 경보 시스템은 구체적 대응 지침 없이 단순 경보음만 제공하여 혼란을 야기합니다." },
            ].map((item, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800 hover:border-red-500/30 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Architecture Section */}
        <section>
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/30">Architecture</Badge>
            <h2 className="text-3xl font-bold text-white mb-3">3계층 AI 아키텍처</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              감지(Perception), 분석(Reasoning), 대응(Action)의 3계층 구조로 완벽한 안전 신경망을 구축합니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                num: 3,
                title: "ACTION LAYER",
                subtitle: "능동적 대응",
                color: "purple",
                items: [
                  { icon: Volume2, title: "AI 음성경보", desc: "TTS 기반 맞춤 안내" },
                  { icon: Watch, title: "스마트워치 알림", desc: "개인별 즉시 전송" },
                  { icon: Box, title: "Digital Twin", desc: "3D 관제 대시보드" },
                ],
              },
              {
                num: 2,
                title: "REASONING LAYER",
                subtitle: "지능형 분석",
                color: "blue",
                items: [
                  { icon: Eye, title: "Vision AI", desc: "ViT 모델 기반 영상 분석" },
                  { icon: Database, title: "센서 융합", desc: "IoT 멀티모달 분석" },
                  { icon: Brain, title: "생성형 AI", desc: "RAG 기반 상황 판독" },
                ],
              },
              {
                num: 1,
                title: "PERCEPTION LAYER",
                subtitle: "초정밀 감지",
                color: "green",
                items: [
                  { icon: Video, title: "엣지 AI CCTV", desc: "현장 즉시 분석" },
                  { icon: Wind, title: "가스 센서", desc: "복합 유해가스 감지" },
                  { icon: Thermometer, title: "환경 센서", desc: "온도/진동/미세먼지" },
                ],
              },
            ].map((layer, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                      layer.color === "purple" ? "from-purple-500 to-pink-500" :
                      layer.color === "blue" ? "from-blue-500 to-cyan-500" :
                      "from-green-500 to-emerald-500"
                    } flex items-center justify-center text-white font-bold`}>
                      {layer.num}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{layer.title}</h3>
                      <p className="text-slate-500 text-sm">{layer.subtitle}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {layer.items.map((item, j) => (
                      <div key={j} className="bg-slate-800 rounded-lg p-4 text-center">
                        <div className={`w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                          layer.color === "purple" ? "bg-purple-500/10" :
                          layer.color === "blue" ? "bg-blue-500/10" :
                          "bg-green-500/10"
                        }`}>
                          <item.icon className={`w-5 h-5 ${
                            layer.color === "purple" ? "text-purple-400" :
                            layer.color === "blue" ? "text-blue-400" :
                            "text-green-400"
                          }`} />
                        </div>
                        <h4 className="text-white text-sm font-medium">{item.title}</h4>
                        <p className="text-slate-500 text-xs">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/30">Features</Badge>
            <h2 className="text-3xl font-bold text-white mb-3">핵심 기능</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              기존 안전관리 시스템과 차별화된 4가지 핵심 기능을 제공합니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Featured Card */}
            <Card className="md:col-span-2 bg-gradient-to-br from-blue-900 to-purple-900 border-0">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Vision AI 실시간 위험 감지</h3>
                <p className="text-white/70 mb-6">
                  YOLOv8과 Vision Transformer를 활용하여 작업자 쓰러짐, 안전모 미착용, 화재, 가스 누출 징후를 0.5초 내에 실시간으로 감지합니다.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { item: "작업자 쓰러짐", method: "자세 추정 AI", time: "0.3초" },
                    { item: "안전모 미착용", method: "객체 탐지 AI", time: "0.5초" },
                    { item: "화재/연기 발생", method: "영상 분류 AI", time: "0.5초" },
                    { item: "가스 누출 징후", method: "증기 굴절 분석", time: "1.0초" },
                  ].map((d, i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-3">
                      <p className="text-white text-sm font-medium">{d.item}</p>
                      <p className="text-white/50 text-xs">{d.method}</p>
                      <Badge className="mt-2 bg-green-500/20 text-green-300 border-0">{d.time}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {[
              {
                icon: Layers,
                title: "멀티모달 AI 융합 분석",
                desc: "영상 데이터와 IoT 센서 데이터를 결합 분석하여 오경보율을 83% 감소시킵니다.",
                stats: [
                  { value: "83%", label: "오경보 감소" },
                  { value: "99.5%", label: "감지 정확도" },
                ],
              },
              {
                icon: MessageSquare,
                title: "생성형 AI 안전 가이드",
                desc: "RAG 기반 LLM이 KWP 안전 매뉴얼을 학습하여 상황별 맞춤 대응 지침을 제공합니다.",
                stats: [
                  { value: "즉시", label: "맞춤 지침 전달" },
                  { value: "TTS", label: "음성 안내" },
                ],
              },
              {
                icon: Box,
                title: "Digital Twin 3D 관제",
                desc: "발전소 전체를 3D로 시각화하여 위험 구역을 히트맵으로 표시합니다.",
                stats: [
                  { value: "3D", label: "실시간 모델링" },
                  { value: "히트맵", label: "위험구역 표시" },
                ],
              },
            ].map((feature, i) => (
              <Card key={i} className={`bg-slate-900 border-slate-800 ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{feature.desc}</p>
                  <div className="flex gap-6">
                    {feature.stats.map((stat, j) => (
                      <div key={j}>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-slate-500 text-xs">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Comparison Section */}
        <section>
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/30">Comparison</Badge>
            <h2 className="text-3xl font-bold text-white mb-3">기존 시스템과의 비교</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              IMSE-MS는 기존 안전관리 방식의 한계를 혁신적으로 극복합니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800 relative overflow-hidden">
              <Badge className="absolute top-4 right-4 bg-red-500/10 text-red-400 border-red-500/30">BEFORE</Badge>
              <CardContent className="p-6 pt-12">
                <h3 className="text-xl font-bold text-white mb-4">기존 시스템</h3>
                <ul className="space-y-3">
                  {[
                    "사후 확인만 가능한 CCTV 모니터링",
                    "임계값 초과 시에만 작동하는 단일 센서",
                    "구체적 지침 없는 단순 경보음",
                    "2D 모니터링 화면",
                    "수동 순찰 기반 대응",
                    "평균 5분 위험 감지 시간",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                      <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 relative overflow-hidden">
              <Badge className="absolute top-4 right-4 bg-white/10 text-white border-white/20">AFTER</Badge>
              <CardContent className="p-6 pt-12">
                <h3 className="text-xl font-bold text-white mb-4">IMSE-MS</h3>
                <ul className="space-y-3">
                  {[
                    "Vision AI 실시간 사전 예방",
                    "멀티모달 AI 융합으로 전조 증상 감지",
                    "생성형 AI 맞춤 대응 가이드",
                    "Digital Twin 3D 관제",
                    "24시간 자율 안전 신경망",
                    "0.5초 내 위험 감지",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/90 text-sm">
                      <Check className="w-4 h-4 text-white mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ROI Section */}
        <section id="roi">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/30">Expected ROI</Badge>
            <h2 className="text-3xl font-bold text-white mb-3">기대효과</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              정량적으로 입증된 투자 대비 효과를 제공합니다.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Clock, value: "99.8%", label: "위험 감지 시간 단축", sub: "5분 → 0.5초", color: "red" },
              { icon: HeartPulse, value: "95%", label: "골든타임 확보율", sub: "기존 30% → 95%", color: "green" },
              { icon: BellOff, value: "83%", label: "오경보율 감소", sub: "30% → 5%", color: "amber" },
              { icon: Power, value: "80%", label: "비계획 정지 감소", sub: "연 10회 → 2회", color: "blue" },
            ].map((item, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800 text-center">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    item.color === "red" ? "bg-red-500/10" :
                    item.color === "green" ? "bg-green-500/10" :
                    item.color === "amber" ? "bg-amber-500/10" :
                    "bg-blue-500/10"
                  }`}>
                    <item.icon className={`w-6 h-6 ${
                      item.color === "red" ? "text-red-400" :
                      item.color === "green" ? "text-green-400" :
                      item.color === "amber" ? "text-amber-400" :
                      "text-blue-400"
                    }`} />
                  </div>
                  <p className={`text-3xl font-bold ${
                    item.color === "red" ? "text-red-400" :
                    item.color === "green" ? "text-green-400" :
                    item.color === "amber" ? "text-amber-400" :
                    "text-blue-400"
                  }`}>{item.value}</p>
                  <p className="text-white text-sm mt-1">{item.label}</p>
                  <p className="text-slate-500 text-xs mt-1">{item.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">연간 비용 절감 효과</h3>
              <div className="space-y-4">
                {[
                  { name: "비계획 정지 감소 (발전손실 방지)", amount: "15억원", percent: 50 },
                  { name: "예지보전 효과 (정비비 절감)", amount: "8억원", percent: 27 },
                  { name: "인력 운영 효율화", amount: "5억원", percent: 17 },
                  { name: "탄소배출 저감 (배출권 절감)", amount: "2억원", percent: 7 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400 text-sm">{item.name}</span>
                      <span className="text-blue-400 font-semibold">{item.amount}</span>
                    </div>
                    <Progress value={item.percent} className="h-2 bg-slate-800" />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-800">
                <span className="text-white font-semibold">총 연간 절감 효과</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  약 30억원
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Policy Alignment */}
        <section>
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30">Policy Alignment</Badge>
            <h2 className="text-3xl font-bold text-white mb-3">국정과제 연계성</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              정부 핵심 정책과 100% 부합하는 솔루션입니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Cpu, title: "디지털 플랫폼 정부", desc: "AI 기반 공공서비스 혁신의 선도 사례를 창출합니다.", percent: 100 },
              { icon: ShieldCheck, title: "중대재해 제로", desc: "AI 24시간 안전 감시로 골든타임을 확보합니다.", percent: 100 },
              { icon: Leaf, title: "탄소중립 2050", desc: "실시간 환경 모니터링으로 누출을 조기 차단합니다.", percent: 80 },
              { icon: Scale, title: "ESG 경영", desc: "환경(E)·안전(S) 분야 선도적 대응으로 ESG 등급을 상향합니다.", percent: 90 },
            ].map((item, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{item.desc}</p>
                    <div className="flex items-center gap-3">
                      <Progress value={item.percent} className="h-2 bg-slate-800 flex-1" />
                      <span className="text-blue-400 font-semibold text-sm">{item.percent}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 rounded-3xl bg-gradient-to-br from-blue-900 to-purple-900">
          <h2 className="text-3xl font-bold text-white mb-4">Safety First, Smart Energy</h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            인간의 한계를 넘어선 AI가 24시간 잠들지 않고<br />
            발전소의 안전과 환경을 지킵니다.
          </p>
          <Button className="bg-white text-blue-900 hover:bg-white/90">
            <ArrowRight className="w-4 h-4 mr-2" />
            시스템 체험하기
          </Button>
        </section>
      </div>
    </DashboardLayout>
  );
}
