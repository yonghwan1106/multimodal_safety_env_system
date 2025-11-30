import { Zone, Camera, Sensor, Alert, Worker, KPIData, SystemStatus, Scenario, Detection } from "./types";

// 발전소 구역 데이터
export const zones: Zone[] = [
  {
    id: "zone-a",
    name: "A구역",
    description: "보일러동",
    status: "normal",
    riskLevel: 15,
    position: { x: 10, y: 10 },
    color: "#10B981",
  },
  {
    id: "zone-b",
    name: "B구역",
    description: "터빈동",
    status: "caution",
    riskLevel: 45,
    position: { x: 40, y: 10 },
    color: "#F59E0B",
  },
  {
    id: "zone-c",
    name: "C구역",
    description: "변전설비",
    status: "normal",
    riskLevel: 20,
    position: { x: 70, y: 10 },
    color: "#10B981",
  },
  {
    id: "zone-d",
    name: "D구역",
    description: "연료저장",
    status: "danger",
    riskLevel: 78,
    position: { x: 10, y: 50 },
    color: "#EF4444",
  },
  {
    id: "zone-e",
    name: "E구역",
    description: "냉각탑",
    status: "normal",
    riskLevel: 12,
    position: { x: 40, y: 50 },
    color: "#10B981",
  },
  {
    id: "zone-f",
    name: "F구역",
    description: "관리동",
    status: "normal",
    riskLevel: 5,
    position: { x: 70, y: 50 },
    color: "#10B981",
  },
];

// CCTV 카메라 데이터
export const cameras: Camera[] = [
  { id: "cam-001", name: "CAM-A01", zone: "zone-a", status: "online", location: "보일러동 1층 입구" },
  { id: "cam-002", name: "CAM-A02", zone: "zone-a", status: "online", location: "보일러동 2층 메인홀" },
  { id: "cam-003", name: "CAM-B01", zone: "zone-b", status: "online", location: "터빈동 메인 터빈실" },
  { id: "cam-004", name: "CAM-B02", zone: "zone-b", status: "online", location: "터빈동 제어실" },
  { id: "cam-005", name: "CAM-C01", zone: "zone-c", status: "online", location: "변전설비 주변전실" },
  { id: "cam-006", name: "CAM-D01", zone: "zone-d", status: "online", location: "연료저장 탱크A" },
  { id: "cam-007", name: "CAM-D02", zone: "zone-d", status: "online", location: "연료저장 탱크B" },
  { id: "cam-008", name: "CAM-E01", zone: "zone-e", status: "online", location: "냉각탑 외부" },
  { id: "cam-009", name: "CAM-F01", zone: "zone-f", status: "offline", location: "관리동 로비" },
];

// IoT 센서 데이터
export const sensors: Sensor[] = [
  {
    id: "sensor-001",
    name: "가스센서-A01",
    type: "gas",
    zone: "zone-a",
    position: { x: 15, y: 15 },
    currentValue: 12,
    unit: "ppm",
    thresholds: { normal: 25, caution: 50, danger: 100 },
    status: "normal",
  },
  {
    id: "sensor-002",
    name: "온도센서-A02",
    type: "temperature",
    zone: "zone-a",
    position: { x: 20, y: 20 },
    currentValue: 42,
    unit: "°C",
    thresholds: { normal: 60, caution: 80, danger: 100 },
    status: "normal",
  },
  {
    id: "sensor-003",
    name: "진동센서-B01",
    type: "vibration",
    zone: "zone-b",
    position: { x: 45, y: 15 },
    currentValue: 3.2,
    unit: "mm/s",
    thresholds: { normal: 4.5, caution: 7.0, danger: 10 },
    status: "normal",
  },
  {
    id: "sensor-004",
    name: "가스센서-D01",
    type: "gas",
    zone: "zone-d",
    position: { x: 15, y: 55 },
    currentValue: 68,
    unit: "ppm",
    thresholds: { normal: 25, caution: 50, danger: 100 },
    status: "caution",
  },
  {
    id: "sensor-005",
    name: "온도센서-D02",
    type: "temperature",
    zone: "zone-d",
    position: { x: 20, y: 60 },
    currentValue: 85,
    unit: "°C",
    thresholds: { normal: 60, caution: 80, danger: 100 },
    status: "caution",
  },
  {
    id: "sensor-006",
    name: "미세먼지-E01",
    type: "dust",
    zone: "zone-e",
    position: { x: 45, y: 55 },
    currentValue: 35,
    unit: "μg/m³",
    thresholds: { normal: 50, caution: 100, danger: 150 },
    status: "normal",
  },
  {
    id: "sensor-007",
    name: "습도센서-C01",
    type: "humidity",
    zone: "zone-c",
    position: { x: 75, y: 15 },
    currentValue: 45,
    unit: "%",
    thresholds: { normal: 70, caution: 85, danger: 95 },
    status: "normal",
  },
  {
    id: "sensor-008",
    name: "가스센서-D03",
    type: "gas",
    zone: "zone-d",
    position: { x: 25, y: 55 },
    currentValue: 92,
    unit: "ppm",
    thresholds: { normal: 25, caution: 50, danger: 100 },
    status: "danger",
  },
];

// 알림 데이터
export const initialAlerts: Alert[] = [
  {
    id: "alert-001",
    type: "safety",
    severity: "critical",
    title: "D구역 가스 누출 의심",
    description: "D구역 연료저장 탱크 주변 가스 농도가 위험 수준에 도달했습니다. 즉시 확인이 필요합니다.",
    zone: "zone-d",
    source: "sensor",
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2분 전
    status: "new",
    aiRecommendation: "1. D구역 작업자 즉시 대피\n2. 가스 차단 밸브 확인\n3. 환기 시스템 가동\n4. 방독면 착용 후 점검",
  },
  {
    id: "alert-002",
    type: "safety",
    severity: "warning",
    title: "B구역 작업자 안전모 미착용",
    description: "CAM-B01에서 안전모 미착용 작업자가 감지되었습니다.",
    zone: "zone-b",
    source: "vision_ai",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
    status: "acknowledged",
    aiRecommendation: "해당 작업자에게 안전모 착용을 안내하고, 반복 위반 시 안전 교육을 권장합니다.",
  },
  {
    id: "alert-003",
    type: "environment",
    severity: "warning",
    title: "D구역 온도 상승",
    description: "D구역 온도가 주의 수준(80°C)을 초과했습니다. 현재 85°C입니다.",
    zone: "zone-d",
    source: "sensor",
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10분 전
    status: "acknowledged",
  },
  {
    id: "alert-004",
    type: "equipment",
    severity: "info",
    title: "CAM-F01 오프라인",
    description: "관리동 로비 카메라가 오프라인 상태입니다. 네트워크 연결을 확인해주세요.",
    zone: "zone-f",
    source: "manual",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    status: "resolved",
  },
];

// 작업자 데이터
export const workers: Worker[] = [
  {
    id: "worker-001",
    name: "김철수",
    role: "설비 점검원",
    zone: "zone-a",
    status: "active",
    position: { x: 18, y: 18 },
    safetyGear: { helmet: true, vest: true, gloves: true },
  },
  {
    id: "worker-002",
    name: "이영희",
    role: "터빈 운전원",
    zone: "zone-b",
    status: "active",
    position: { x: 45, y: 20 },
    safetyGear: { helmet: false, vest: true, gloves: true },
  },
  {
    id: "worker-003",
    name: "박민수",
    role: "안전 관리자",
    zone: "zone-d",
    status: "active",
    position: { x: 15, y: 58 },
    safetyGear: { helmet: true, vest: true, gloves: true },
  },
  {
    id: "worker-004",
    name: "정수진",
    role: "전기 기술자",
    zone: "zone-c",
    status: "break",
    position: { x: 72, y: 18 },
    safetyGear: { helmet: true, vest: true, gloves: false },
  },
  {
    id: "worker-005",
    name: "최동훈",
    role: "보일러 기사",
    zone: "zone-a",
    status: "active",
    position: { x: 22, y: 15 },
    safetyGear: { helmet: true, vest: true, gloves: true },
  },
];

// KPI 데이터
export const kpiData: KPIData = {
  accidentFreeDays: 365,
  todayDetections: 12,
  resolvedAlerts: 8,
  pendingAlerts: 4,
  overallRiskLevel: 32,
  aiAccuracy: 98.5,
  responseTime: 0.5,
  falseAlarmRate: 4.2,
};

// 시스템 상태
export const systemStatus: SystemStatus = {
  visionAI: {
    status: "online",
    processedFrames: 1247832,
    detectionCount: 3421,
  },
  sensorAI: {
    status: "online",
    activeSensors: 7,
    totalSensors: 8,
  },
  network: {
    status: "online",
    latency: 12,
  },
};

// 데모 시나리오
export const scenarios: Scenario[] = [
  {
    id: "scenario-gas",
    name: "가스 누출",
    description: "D구역 연료저장 탱크에서
가스 누출이 감지되었습니다",
    icon: "🔥",
    type: "gas_leak",
  },
  {
    id: "scenario-fire",
    name: "화재 발생",
    description: "B구역 터빈동에서
연기가 감지되었습니다",
    icon: "🚨",
    type: "fire",
  },
  {
    id: "scenario-fallen",
    name: "작업자 쓰러짐",
    description: "C구역 변전설비에서
작업자가 쓰러졌습니다",
    icon: "🏥",
    type: "fallen_worker",
  },
  {
    id: "scenario-helmet",
    name: "안전모 미착용",
    description: "A구역 보일러동에서
안전모 미착용 감지",
    icon: "⛑️",
    type: "no_helmet",
  },
];

// 초기 감지 데이터
export const initialDetections: Detection[] = [
  {
    id: "det-001",
    cameraId: "cam-003",
    type: "person",
    label: "작업자",
    confidence: 0.95,
    bbox: { x: 120, y: 80, width: 60, height: 150 },
    timestamp: new Date(),
    isAnomaly: false,
  },
  {
    id: "det-002",
    cameraId: "cam-003",
    type: "helmet",
    label: "안전모 착용",
    confidence: 0.92,
    bbox: { x: 130, y: 80, width: 40, height: 40 },
    timestamp: new Date(),
    isAnomaly: false,
  },
  {
    id: "det-003",
    cameraId: "cam-004",
    type: "no_helmet",
    label: "안전모 미착용",
    confidence: 0.88,
    bbox: { x: 200, y: 100, width: 50, height: 40 },
    timestamp: new Date(),
    isAnomaly: true,
  },
];

// 센서 히스토리 생성 함수
export function generateSensorHistory(sensorId: string, hours: number = 24): { timestamp: Date; value: number }[] {
  const sensor = sensors.find(s => s.id === sensorId);
  if (!sensor) return [];

  const history: { timestamp: Date; value: number }[] = [];
  const now = new Date();
  const baseValue = sensor.currentValue * 0.7;
  const variance = sensor.currentValue * 0.5;

  for (let i = hours * 12; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000); // 5분 간격
    const randomVariation = (Math.random() - 0.5) * variance;
    const trendVariation = (hours * 12 - i) / (hours * 12) * variance * 0.3;
    const value = Math.max(0, baseValue + randomVariation + trendVariation);
    history.push({ timestamp, value: Math.round(value * 10) / 10 });
  }

  return history;
}

// ROI 데이터
export const roiData = {
  investment: 15, // 억원
  annualSavings: 30, // 억원
  breakdowns: [
    { name: "비계획 정지 감소", amount: 15, percentage: 50 },
    { name: "예지보전 효과", amount: 8, percentage: 27 },
    { name: "인력 운영 효율화", amount: 5, percentage: 17 },
    { name: "탄소배출 저감", amount: 2, percentage: 6 },
  ],
  metrics: {
    detectionTimeReduction: 99.8,
    goldenTimeSecured: 95,
    falseAlarmReduction: 83,
    unplannedStopReduction: 80,
  },
};

// 일별 통계 데이터
export const dailyStats = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    detections: Math.floor(Math.random() * 20) + 5,
    alerts: Math.floor(Math.random() * 8) + 1,
    resolved: Math.floor(Math.random() * 6) + 1,
    falseAlarms: Math.floor(Math.random() * 3),
  };
});
