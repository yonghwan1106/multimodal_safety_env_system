import { create } from 'zustand';
import { Zone, Camera, Sensor, Alert, Worker, KPIData, SystemStatus, Detection } from '@/lib/types';
import { zones as initialZones, cameras as initialCameras, sensors as initialSensors, initialAlerts, workers as initialWorkers, kpiData as initialKPI, systemStatus as initialSystem, initialDetections } from '@/lib/mock-data';

interface AppState {
  // 데이터
  zones: Zone[];
  cameras: Camera[];
  sensors: Sensor[];
  alerts: Alert[];
  workers: Worker[];
  kpiData: KPIData;
  systemStatus: SystemStatus;
  detections: Detection[];

  // 시뮬레이션 상태
  isSimulationRunning: boolean;
  simulationSpeed: number;

  // UI 상태
  selectedZone: string | null;
  selectedCamera: string | null;
  selectedSensor: string | null;
  sidebarOpen: boolean;
  theme: 'dark' | 'light';

  // 액션
  setZones: (zones: Zone[]) => void;
  updateZoneStatus: (zoneId: string, status: Zone['status'], riskLevel: number) => void;
  updateSensorValue: (sensorId: string, value: number) => void;
  addAlert: (alert: Alert) => void;
  updateAlertStatus: (alertId: string, status: Alert['status']) => void;
  addDetection: (detection: Detection) => void;
  clearOldDetections: () => void;
  updateWorkerPosition: (workerId: string, position: { x: number; y: number }) => void;

  // 시뮬레이션
  startSimulation: () => void;
  stopSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  triggerScenario: (scenarioType: string) => void;

  // UI
  setSelectedZone: (zoneId: string | null) => void;
  setSelectedCamera: (cameraId: string | null) => void;
  setSelectedSensor: (sensorId: string | null) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // 초기 데이터
  zones: initialZones,
  cameras: initialCameras,
  sensors: initialSensors,
  alerts: initialAlerts,
  workers: initialWorkers,
  kpiData: initialKPI,
  systemStatus: initialSystem,
  detections: initialDetections,

  // 시뮬레이션 초기 상태
  isSimulationRunning: true,
  simulationSpeed: 1,

  // UI 초기 상태
  selectedZone: null,
  selectedCamera: null,
  selectedSensor: null,
  sidebarOpen: true,
  theme: 'dark',

  // 액션 구현
  setZones: (zones) => set({ zones }),

  updateZoneStatus: (zoneId, status, riskLevel) => set((state) => ({
    zones: state.zones.map((zone) =>
      zone.id === zoneId
        ? { ...zone, status, riskLevel, color: status === 'normal' ? '#10B981' : status === 'caution' ? '#F59E0B' : '#EF4444' }
        : zone
    ),
  })),

  updateSensorValue: (sensorId, value) => set((state) => {
    const sensor = state.sensors.find(s => s.id === sensorId);
    if (!sensor) return state;

    let status: Sensor['status'] = 'normal';
    if (value >= sensor.thresholds.danger) status = 'danger';
    else if (value >= sensor.thresholds.caution) status = 'caution';

    return {
      sensors: state.sensors.map((s) =>
        s.id === sensorId ? { ...s, currentValue: value, status } : s
      ),
    };
  }),

  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts],
    kpiData: {
      ...state.kpiData,
      todayDetections: state.kpiData.todayDetections + 1,
      pendingAlerts: state.kpiData.pendingAlerts + 1,
    },
  })),

  updateAlertStatus: (alertId, status) => set((state) => ({
    alerts: state.alerts.map((a) =>
      a.id === alertId ? { ...a, status } : a
    ),
    kpiData: {
      ...state.kpiData,
      resolvedAlerts: status === 'resolved' ? state.kpiData.resolvedAlerts + 1 : state.kpiData.resolvedAlerts,
      pendingAlerts: status === 'resolved' ? state.kpiData.pendingAlerts - 1 : state.kpiData.pendingAlerts,
    },
  })),

  addDetection: (detection) => set((state) => ({
    detections: [detection, ...state.detections.slice(0, 49)], // 최대 50개 유지
  })),

  clearOldDetections: () => set((state) => ({
    detections: state.detections.filter(
      (d) => Date.now() - d.timestamp.getTime() < 60000 // 1분 이내 것만 유지
    ),
  })),

  updateWorkerPosition: (workerId, position) => set((state) => ({
    workers: state.workers.map((w) =>
      w.id === workerId ? { ...w, position } : w
    ),
  })),

  // 시뮬레이션
  startSimulation: () => set({ isSimulationRunning: true }),
  stopSimulation: () => set({ isSimulationRunning: false }),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

  triggerScenario: (scenarioType) => {
    const state = get();
    const now = new Date();
    const alertId = `alert-${Date.now()}`;

    switch (scenarioType) {
      case 'gas_leak':
        // D구역 가스 누출 시나리오
        set((state) => ({
          zones: state.zones.map((z) =>
            z.id === 'zone-d' ? { ...z, status: 'danger', riskLevel: 95, color: '#EF4444' } : z
          ),
          sensors: state.sensors.map((s) =>
            s.id === 'sensor-008' ? { ...s, currentValue: 150, status: 'danger' } : s
          ),
        }));
        get().addAlert({
          id: alertId,
          type: 'safety',
          severity: 'critical',
          title: '긴급: D구역 가스 누출 감지!',
          description: 'D구역 연료저장 탱크에서 심각한 가스 누출이 감지되었습니다. 즉시 대피가 필요합니다.',
          zone: 'zone-d',
          source: 'sensor',
          timestamp: now,
          status: 'new',
          aiRecommendation: '🚨 긴급 대피 안내\n\n1. D구역 모든 작업자 즉시 대피\n2. 풍향: 북서풍 - 3번 게이트로 대피\n3. 방독면 착용 필수\n4. 가스 차단 밸브 긴급 폐쇄\n5. 환기 시스템 최대 가동',
        });
        break;

      case 'fire':
        set((state) => ({
          zones: state.zones.map((z) =>
            z.id === 'zone-b' ? { ...z, status: 'danger', riskLevel: 90, color: '#EF4444' } : z
          ),
        }));
        get().addAlert({
          id: alertId,
          type: 'safety',
          severity: 'critical',
          title: '긴급: B구역 화재 감지!',
          description: 'B구역 터빈동에서 연기 및 화재가 감지되었습니다.',
          zone: 'zone-b',
          source: 'vision_ai',
          timestamp: now,
          status: 'new',
          aiRecommendation: '🔥 화재 대응 지침\n\n1. 화재 경보 발령\n2. B구역 전원 차단\n3. 자동 소화설비 작동 확인\n4. 대피 경로: 동쪽 비상구 이용\n5. 소방서 신고 (119)',
        });
        get().addDetection({
          id: `det-${Date.now()}`,
          cameraId: 'cam-003',
          type: 'smoke',
          label: '연기 감지',
          confidence: 0.94,
          bbox: { x: 150, y: 50, width: 100, height: 80 },
          timestamp: now,
          isAnomaly: true,
        });
        break;

      case 'fallen_worker':
        get().addAlert({
          id: alertId,
          type: 'safety',
          severity: 'critical',
          title: '긴급: C구역 작업자 쓰러짐 감지!',
          description: 'C구역 변전설비에서 작업자가 쓰러진 것으로 감지되었습니다. 즉시 확인이 필요합니다.',
          zone: 'zone-c',
          source: 'vision_ai',
          timestamp: now,
          status: 'new',
          aiRecommendation: '🏥 응급 대응 지침\n\n1. 가장 가까운 작업자 현장 확인\n2. 의식/호흡 확인\n3. 응급의료팀 호출\n4. AED 위치: C구역 입구 (20m)\n5. 119 신고 및 구급차 요청',
        });
        get().addDetection({
          id: `det-${Date.now()}`,
          cameraId: 'cam-005',
          type: 'fallen_person',
          label: '쓰러진 작업자',
          confidence: 0.91,
          bbox: { x: 180, y: 200, width: 80, height: 40 },
          timestamp: now,
          isAnomaly: true,
        });
        break;

      case 'no_helmet':
        get().addAlert({
          id: alertId,
          type: 'safety',
          severity: 'warning',
          title: 'A구역 안전모 미착용 감지',
          description: 'A구역 보일러동에서 안전모를 착용하지 않은 작업자가 감지되었습니다.',
          zone: 'zone-a',
          source: 'vision_ai',
          timestamp: now,
          status: 'new',
          aiRecommendation: '⛑️ 안전모 미착용 조치\n\n1. 해당 작업자에게 즉시 안내 방송\n2. 현장 안전관리자 파견\n3. 안전모 지급 및 착용 확인\n4. 반복 위반 시 안전 교육 이수',
        });
        get().addDetection({
          id: `det-${Date.now()}`,
          cameraId: 'cam-001',
          type: 'no_helmet',
          label: '안전모 미착용',
          confidence: 0.89,
          bbox: { x: 100, y: 90, width: 45, height: 45 },
          timestamp: now,
          isAnomaly: true,
        });
        break;
    }
  },

  // UI
  setSelectedZone: (zoneId) => set({ selectedZone: zoneId }),
  setSelectedCamera: (cameraId) => set({ selectedCamera: cameraId }),
  setSelectedSensor: (sensorId) => set({ selectedSensor: sensorId }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
}));
