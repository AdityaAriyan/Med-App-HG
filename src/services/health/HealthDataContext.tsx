import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { healthDataProvider } from './SimulatedHealthDataProvider';
import { useAuth } from '../auth/AuthContext';
import type {
  HealthTelemetry,
  RiskAssessment,
  AlertRecord,
  DeviceInfo,
  SimulationConfig
} from '../../types';

interface HealthDataContextType {
  telemetry: HealthTelemetry | null;
  riskAssessment: RiskAssessment | null;
  alerts: AlertRecord[];
  unreadAlertCount: number;
  device: DeviceInfo | null;
  history: HealthTelemetry[];
  simulationConfig: SimulationConfig;
  setSimulationMode: (mode: 'NORMAL' | 'CAUTION' | 'HIGH' | 'CRITICAL') => Promise<void>;
  updateSimulationConfig: (config: Partial<SimulationConfig>) => void;
  markAlertAsRead: (alertId: string) => Promise<void>;
  triggerEmergencyAlert: (notes?: string) => Promise<AlertRecord>;
  refreshData: () => Promise<void>;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [telemetry, setTelemetry] = useState<HealthTelemetry | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [history, setHistory] = useState<HealthTelemetry[]>([]);
  const [simulationConfig, setSimulationConfigState] = useState<SimulationConfig>(
    healthDataProvider.getSimulationConfig()
  );

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    try {
      const [dev, userAlerts, hist] = await Promise.all([
        healthDataProvider.getDeviceStatus(user.id),
        healthDataProvider.getAlerts(user.id),
        healthDataProvider.getHealthHistory(user.id, 24)
      ]);
      setDevice(dev);
      setAlerts(userAlerts);
      setHistory(hist);
    } catch (e) {
      console.error('Error fetching health data:', e);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchUserData();

    // Subscribe to real-time live telemetry stream
    const unsubscribe = healthDataProvider.subscribe((liveTelem, liveRisk) => {
      setTelemetry(liveTelem);
      setRiskAssessment(liveRisk);
    });

    return () => {
      unsubscribe();
    };
  }, [user, fetchUserData]);

  const setSimulationMode = async (mode: 'NORMAL' | 'CAUTION' | 'HIGH' | 'CRITICAL') => {
    await healthDataProvider.triggerPreset(mode);
    setSimulationConfigState(healthDataProvider.getSimulationConfig());
    if (user) {
      const updatedAlerts = await healthDataProvider.getAlerts(user.id);
      setAlerts(updatedAlerts);
    }
  };

  const updateSimulationConfig = (config: Partial<SimulationConfig>) => {
    healthDataProvider.setSimulationConfig(config);
    setSimulationConfigState(healthDataProvider.getSimulationConfig());
  };

  const markAlertAsRead = async (alertId: string) => {
    await healthDataProvider.markAlertRead(alertId);
    if (user) {
      const updatedAlerts = await healthDataProvider.getAlerts(user.id);
      setAlerts(updatedAlerts);
    }
  };

  const triggerEmergencyAlert = async (notes?: string) => {
    if (!user) throw new Error('Not logged in');
    const newAlert = await healthDataProvider.createAlert({
      userId: user.id,
      userName: user.name,
      type: 'HIGH_HEAT_RISK',
      severity: 'CRITICAL',
      title: 'EMERGENCY SOS ALERT ACTIVATED',
      message: notes || `User activated manual emergency SOS distress protocol. High thermal risk intervention required.`,
      read: false,
      actionRequired: 'Dispatch immediate medical & cooling assistance'
    });
    const updatedAlerts = await healthDataProvider.getAlerts(user.id);
    setAlerts(updatedAlerts);
    return newAlert;
  };

  const unreadAlertCount = alerts.filter(a => !a.read).length;

  return (
    <HealthDataContext.Provider
      value={{
        telemetry,
        riskAssessment,
        alerts,
        unreadAlertCount,
        device,
        history,
        simulationConfig,
        setSimulationMode,
        updateSimulationConfig,
        markAlertAsRead,
        triggerEmergencyAlert,
        refreshData: fetchUserData
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = (): HealthDataContextType => {
  const ctx = useContext(HealthDataContext);
  if (!ctx) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return ctx;
};
