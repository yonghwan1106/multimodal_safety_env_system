// 발전소 구역
export interface Zone {
  id: string;
  name: string;
  description: string;
  status: "normal" | "caution" | "danger";
  riskLevel: number; // 0-100
  position: { x: number; y: number };
  color: string;
}

// CCTV 카메라
export interface Camera {
  id: string;
  name: string;
  zone: string;
  status: "online" | "offline";
  location: string;
  streamUrl?: string;
}

// AI 감지 결과
export interface Detection {
  id: string;
  cameraId: string;
  type: "person" | "helmet" | "no_helmet" | "fire" | "smoke" | "gas_leak" | "fallen_person";
  label: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  timestamp: Date;
  isAnomaly: boolean;
}

// IoT 센서
export interface Sensor {
  id: string;
  name: string;
  type: "gas" | "temperature" | "vibration" | "dust" | "humidity";
  zone: string;
  position: { x: number; y: number };
  currentValue: number;
  unit: string;
  thresholds: {
    normal: number;
    caution: number;
    danger: number;
  };
  status: "normal" | "caution" | "danger";
}

// 센서 히스토리
export interface SensorHistory {
  sensorId: string;
  timestamp: Date;
  value: number;
}

// 알림
export interface Alert {
  id: string;
  type: "safety" | "environment" | "equipment";
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  zone: string;
  source: "vision_ai" | "sensor" | "manual";
  timestamp: Date;
  status: "new" | "acknowledged" | "resolved";
  aiRecommendation?: string;
}

// 작업자
export interface Worker {
  id: string;
  name: string;
  role: string;
  zone: string;
  status: "active" | "break" | "offline";
  position: { x: number; y: number };
  safetyGear: {
    helmet: boolean;
    vest: boolean;
    gloves: boolean;
  };
}

// KPI 데이터
export interface KPIData {
  accidentFreeDays: number;
  todayDetections: number;
  resolvedAlerts: number;
  pendingAlerts: number;
  overallRiskLevel: number;
  aiAccuracy: number;
  responseTime: number; // seconds
  falseAlarmRate: number; // percentage
}

// 시스템 상태
export interface SystemStatus {
  visionAI: {
    status: "online" | "offline";
    processedFrames: number;
    detectionCount: number;
  };
  sensorAI: {
    status: "online" | "offline";
    activeSensors: number;
    totalSensors: number;
  };
  network: {
    status: "online" | "degraded" | "offline";
    latency: number;
  };
}

// AI 채팅 메시지
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  scenario?: string;
}

// 데모 시나리오
export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "gas_leak" | "fire" | "fallen_worker" | "no_helmet";
}
