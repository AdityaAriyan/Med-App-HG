import type {
  HealthTelemetry,
  RiskAssessment,
  AlertRecord,
  DeviceInfo,
  SimulationConfig
} from '../../types';

export interface IHealthDataProvider {
  getCurrentHealth(userId: string): Promise<HealthTelemetry | null>;
  getHealthHistory(userId: string, hours?: number): Promise<HealthTelemetry[]>;
  getRiskAssessment(userId: string): Promise<RiskAssessment | null>;
  getAlerts(userId: string): Promise<AlertRecord[]>;
  getDeviceStatus(userId: string): Promise<DeviceInfo | null>;
  markAlertRead(alertId: string): Promise<void>;
  createAlert(alert: Omit<AlertRecord, 'id' | 'timestamp'>): Promise<AlertRecord>;
  setSimulationConfig(config: Partial<SimulationConfig>): void;
  getSimulationConfig(): SimulationConfig;
  triggerPreset(preset: 'NORMAL' | 'CAUTION' | 'HIGH' | 'CRITICAL'): Promise<void>;
  subscribe(callback: (telemetry: HealthTelemetry, risk: RiskAssessment) => void): () => void;
}
