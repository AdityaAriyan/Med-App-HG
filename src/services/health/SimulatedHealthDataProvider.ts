import { db } from '../database/db';
import { evaluatePersonalHeatRisk } from './heatCalculations';
import type { IHealthDataProvider } from './IHealthDataProvider';
import type {
  HealthTelemetry,
  RiskAssessment,
  AlertRecord,
  DeviceInfo,
  SimulationConfig
} from '../../types';

class SimulatedHealthDataProviderImpl implements IHealthDataProvider {
  private activeUserId: string = 'usr-aditya';
  private subscribers: Set<(telemetry: HealthTelemetry, risk: RiskAssessment) => void> = new Set();
  private intervalId: any = null;

  private currentConfig: SimulationConfig = {
    mode: 'NORMAL',
    autoDrift: true,
    driftIntervalSeconds: 5,
    manualOverride: false
  };

  private currentTelemetry: HealthTelemetry = {
    id: 'tel-live',
    userId: 'usr-aditya',
    timestamp: new Date().toISOString(),
    heartRate: 82,
    spo2: 98,
    skinTemperature: 36.8,
    ambientTemperature: 32.0,
    humidity: 54,
    activityLevel: 'MODERATE',
    stepCountToday: 5420,
    activeMinutesToday: 84,
    restMinutesToday: 35,
    motionSleepEstimateHours: 7.4
  };

  private currentRisk: RiskAssessment;

  constructor() {
    this.currentRisk = evaluatePersonalHeatRisk(this.currentTelemetry);
    this.startSimulationLoop();
  }

  public setActiveUser(userId: string) {
    this.activeUserId = userId;
    this.currentTelemetry.userId = userId;
    this.loadLatestFromDb(userId);
  }

  private async loadLatestFromDb(userId: string) {
    try {
      const records = await db.getByIndex('health_data', 'userId', userId);
      if (records && records.length > 0) {
        records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.currentTelemetry = { ...records[0], id: `tel-live-${Date.now()}` };
        this.currentRisk = evaluatePersonalHeatRisk(this.currentTelemetry);
        this.notifySubscribers();
      }
    } catch (e) {
      console.warn('Could not load latest telemetry from DB:', e);
    }
  }

  private startSimulationLoop() {
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      if (!this.currentConfig.autoDrift) return;
      this.stepDrift();
    }, this.currentConfig.driftIntervalSeconds * 1000);
  }

  private stepDrift() {
    // Generate gentle realistic physiological drift based on current mode
    const mode = this.currentConfig.mode;
    let targetHR = 80;
    let targetSkin = 36.7;
    let targetAmb = 31.0;
    let targetHum = 52;
    let targetSpo2 = 98;

    if (mode === 'CAUTION') {
      targetHR = 96;
      targetSkin = 37.4;
      targetAmb = 34.5;
      targetHum = 64;
      targetSpo2 = 97;
    } else if (mode === 'HIGH') {
      targetHR = 118;
      targetSkin = 38.2;
      targetAmb = 38.0;
      targetHum = 72;
      targetSpo2 = 96;
    } else if (mode === 'CRITICAL') {
      targetHR = 136;
      targetSkin = 39.1;
      targetAmb = 41.5;
      targetHum = 78;
      targetSpo2 = 94;
    }

    // Smooth convergence with tiny noise
    const hrDelta = (targetHR - this.currentTelemetry.heartRate) * 0.15 + (Math.random() * 2 - 1);
    const skinDelta = (targetSkin - this.currentTelemetry.skinTemperature) * 0.12 + (Math.random() * 0.08 - 0.04);
    const ambDelta = (targetAmb - this.currentTelemetry.ambientTemperature) * 0.1 + (Math.random() * 0.2 - 0.1);
    const humDelta = (targetHum - this.currentTelemetry.humidity) * 0.1 + (Math.random() * 1.5 - 0.75);

    const newHR = Math.round(Math.max(55, Math.min(170, this.currentTelemetry.heartRate + hrDelta)));
    const newSkin = parseFloat(Math.max(35.0, Math.min(41.0, this.currentTelemetry.skinTemperature + skinDelta)).toFixed(1));
    const newAmb = parseFloat(Math.max(20.0, Math.min(48.0, this.currentTelemetry.ambientTemperature + ambDelta)).toFixed(1));
    const newHum = Math.round(Math.max(20, Math.min(98, this.currentTelemetry.humidity + humDelta)));
    const newSpo2 = Math.min(100, Math.max(90, Math.round(targetSpo2 + (Math.random() * 1.2 - 0.6))));

    this.currentTelemetry = {
      ...this.currentTelemetry,
      timestamp: new Date().toISOString(),
      heartRate: newHR,
      skinTemperature: newSkin,
      ambientTemperature: newAmb,
      humidity: newHum,
      spo2: newSpo2,
      stepCountToday: this.currentTelemetry.stepCountToday + Math.floor(Math.random() * 6),
      activeMinutesToday: this.currentTelemetry.activeMinutesToday + (Math.random() > 0.7 ? 1 : 0)
    };

    this.currentRisk = evaluatePersonalHeatRisk(this.currentTelemetry);

    // Save snapshot to DB periodically
    db.put('health_data', {
      ...this.currentTelemetry,
      id: `tel-${this.activeUserId}-${Date.now()}`
    }).catch(console.warn);

    this.notifySubscribers();
  }

  private notifySubscribers() {
    this.subscribers.forEach(cb => {
      try {
        cb(this.currentTelemetry, this.currentRisk);
      } catch (err) {
        console.error('Subscriber callback error:', err);
      }
    });
  }

  // --- Public Provider Methods ---

  public async getCurrentHealth(userId: string): Promise<HealthTelemetry | null> {
    if (userId === this.activeUserId) {
      return { ...this.currentTelemetry };
    }
    const history = await db.getByIndex('health_data', 'userId', userId);
    if (history && history.length > 0) {
      history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return history[0];
    }
    return null;
  }

  public async getHealthHistory(userId: string, hours: number = 24): Promise<HealthTelemetry[]> {
    const history = await db.getByIndex('health_data', 'userId', userId);
    const cutoff = Date.now() - hours * 3600000;
    return history
      .filter(h => new Date(h.timestamp).getTime() >= cutoff)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public async getRiskAssessment(userId: string): Promise<RiskAssessment | null> {
    if (userId === this.activeUserId) {
      return { ...this.currentRisk };
    }
    const telemetry = await this.getCurrentHealth(userId);
    if (!telemetry) return null;
    return evaluatePersonalHeatRisk(telemetry);
  }

  public async getAlerts(userId: string): Promise<AlertRecord[]> {
    const userAlerts = await db.getByIndex('alerts', 'userId', userId);
    return userAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public async getDeviceStatus(userId: string): Promise<DeviceInfo | null> {
    const dev = await db.getByIndex('devices', 'userId', userId);
    return dev && dev.length > 0 ? dev[0] : null;
  }

  public async markAlertRead(alertId: string): Promise<void> {
    const alert = await db.getById('alerts', alertId);
    if (alert) {
      alert.read = true;
      alert.acknowledgedAt = new Date().toISOString();
      await db.put('alerts', alert);
    }
  }

  public async createAlert(alert: Omit<AlertRecord, 'id' | 'timestamp'>): Promise<AlertRecord> {
    const record: AlertRecord = {
      ...alert,
      id: `alt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    await db.put('alerts', record);
    return record;
  }

  public setSimulationConfig(config: Partial<SimulationConfig>): void {
    this.currentConfig = { ...this.currentConfig, ...config };
    if (config.driftIntervalSeconds) {
      this.startSimulationLoop();
    }
    if (config.overrideValues) {
      this.currentTelemetry = {
        ...this.currentTelemetry,
        ...config.overrideValues,
        timestamp: new Date().toISOString()
      };
      this.currentRisk = evaluatePersonalHeatRisk(this.currentTelemetry);
      this.notifySubscribers();
    }
  }

  public getSimulationConfig(): SimulationConfig {
    return { ...this.currentConfig };
  }

  public async triggerPreset(preset: 'NORMAL' | 'CAUTION' | 'HIGH' | 'CRITICAL'): Promise<void> {
    this.currentConfig.mode = preset;
    let hr = 80;
    let skin = 36.6;
    let amb = 31.0;
    let hum = 50;
    let spo2 = 98;

    if (preset === 'CAUTION') {
      hr = 98;
      skin = 37.5;
      amb = 34.5;
      hum = 65;
      spo2 = 97;
    } else if (preset === 'HIGH') {
      hr = 122;
      skin = 38.4;
      amb = 38.5;
      hum = 74;
      spo2 = 95;
    } else if (preset === 'CRITICAL') {
      hr = 142;
      skin = 39.3;
      amb = 42.0;
      hum = 82;
      spo2 = 93;
    }

    this.currentTelemetry = {
      ...this.currentTelemetry,
      heartRate: hr,
      skinTemperature: skin,
      ambientTemperature: amb,
      humidity: hum,
      spo2: spo2,
      timestamp: new Date().toISOString()
    };

    this.currentRisk = evaluatePersonalHeatRisk(this.currentTelemetry);

    // Auto-create alert on critical or high trigger
    if (preset === 'CRITICAL' || preset === 'HIGH') {
      await this.createAlert({
        userId: this.activeUserId,
        type: preset === 'CRITICAL' ? 'HIGH_HEAT_RISK' : 'ELEVATED_SKIN_TEMP',
        severity: preset === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        title: preset === 'CRITICAL' ? 'Critical Thermal Overload Alarm' : 'Elevated Heat Stress Warning',
        message: `Simulated trigger: Skin temperature reached ${skin}°C with HR ${hr} BPM under ${amb}°C ambient heat.`,
        read: false,
        actionRequired: 'Move to cooling recovery shelter'
      });
    }

    this.notifySubscribers();
  }

  public subscribe(callback: (telemetry: HealthTelemetry, risk: RiskAssessment) => void): () => void {
    this.subscribers.add(callback);
    callback(this.currentTelemetry, this.currentRisk);
    return () => {
      this.subscribers.delete(callback);
    };
  }
}

export const simulatedHealthDataProvider = new SimulatedHealthDataProviderImpl();

/**
 * ARCHITECTURAL NOTE FOR FUTURE HARDWARE INTEGRATION:
 * When wearable hardware (MAX30102, MLX90614, SHT31, MPU6050 via BLE GATT or WiFi edge bridge)
 * becomes available, implement `EdgeDeviceHealthDataProvider implements IHealthDataProvider`
 * and switch export to:
 * `export const activeHealthDataProvider = isHardwareMode ? edgeDeviceProvider : simulatedHealthDataProvider;`
 */
export const healthDataProvider: IHealthDataProvider = simulatedHealthDataProvider;
