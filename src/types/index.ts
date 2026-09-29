export type UserRole = 'USER' | 'MANAGER' | 'ADMIN';

export type RiskLevel = 'LOW' | 'CAUTION' | 'HIGH' | 'CRITICAL';

export type HeatDebtLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';

export type RecoveryStatus = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

export type ActivityLevel = 'REST' | 'LIGHT' | 'MODERATE' | 'HIGH' | 'INTENSE';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  jobTitle?: string;
  assignedManagerId?: string;
  phone?: string;
  dateOfBirth?: string;
  emergencyContacts?: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface EmergencyEvent {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  riskLevel: RiskLevel;
  heatRiskScore: number;
  heartRate: number;
  skinTemperature: number;
  ambientTemperature: number;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  status: 'TRIGGERED' | 'ACKNOWLEDGED' | 'RESOLVED' | 'CANCELLED';
  notes?: string;
}

export interface DeviceInfo {
  id: string;
  userId: string;
  deviceSerial: string;
  model: string;
  firmwareVersion: string;
  batteryLevel: number;
  connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING';
  lastSyncTime: string;
  sensors: {
    max30102: { name: string; status: 'ACTIVE' | 'CALIBRATING' | 'OFFLINE'; lastReading: string };
    mlx90614: { name: string; status: 'ACTIVE' | 'CALIBRATING' | 'OFFLINE'; lastReading: string };
    sht31: { name: string; status: 'ACTIVE' | 'CALIBRATING' | 'OFFLINE'; lastReading: string };
    mpu6050: { name: string; status: 'ACTIVE' | 'CALIBRATING' | 'OFFLINE'; lastReading: string };
  };
}

export interface HealthTelemetry {
  id: string;
  userId: string;
  timestamp: string;
  heartRate: number;         // BPM (70 - 160)
  spo2: number;              // % (90 - 100)
  skinTemperature: number;   // °C (35.0 - 40.0)
  ambientTemperature: number;// °C (20.0 - 45.0)
  humidity: number;          // % (20 - 95)
  activityLevel: ActivityLevel;
  stepCountToday: number;
  activeMinutesToday: number;
  restMinutesToday: number;
  motionSleepEstimateHours: number;
}

export interface RiskAssessment {
  id: string;
  userId: string;
  timestamp: string;
  heatRisk: number;          // 0 to 100 index
  riskLevel: RiskLevel;
  heatReserve: number;       // 0 to 100 % capacity
  heatDebt: HeatDebtLevel;
  recoveryStatus: RecoveryStatus;
  
  // 5D Radar Dimensions (0-100 scale)
  dimensions: {
    heatLoad: number;
    physiologicalStress: number;
    activityStress: number;
    exposureIndex: number;
    recoveryCapacity: number;
  };

  aiInsight: string;
  recommendation: string;
  improvements: { label: string; value: string; positive: boolean }[];
  focusAreas: { title: string; subtitle: string }[];
}

export interface AlertRecord {
  id: string;
  userId: string;
  userName?: string;
  timestamp: string;
  type: 'HEAT_SPIKE' | 'ELEVATED_SKIN_TEMP' | 'LOW_RECOVERY' | 'HYDRATION_REMINDER' | 'HIGH_HEAT_RISK' | 'RISK_NORMALIZED' | 'DEVICE_LOW_BATTERY';
  severity: 'LOW' | 'CAUTION' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  read: boolean;
  acknowledgedAt?: string;
  actionRequired?: string;
}

export interface ManagerUserAssignment {
  id: string;
  managerId: string;
  userId: string;
  assignedAt: string;
}

export interface EnvironmentalConditions {
  ambientTemperature: number; // °C
  relativeHumidity: number;   // %
  wetBulbGlobeTemp: number;   // WBGT °C
  heatIndex: number;          // °C
  uvIndex: number;
  airQualityIndex: number;
  zone: 'OUTDOOR_WORKSITE_A' | 'WAREHOUSE_B' | 'LOADING_BAY' | 'SHADED_REST';
  lastUpdated: string;
}

export interface SimulationConfig {
  mode: 'NORMAL' | 'CAUTION' | 'HIGH' | 'CRITICAL';
  autoDrift: boolean;
  driftIntervalSeconds: number;
  manualOverride: boolean;
  overrideValues?: Partial<HealthTelemetry>;
}
