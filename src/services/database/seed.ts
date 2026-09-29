import { db } from './db';
import type {
  UserProfile,
  DeviceInfo,
  HealthTelemetry,
  RiskAssessment,
  AlertRecord,
  EmergencyContact,
  ManagerUserAssignment
} from '../../types';

export const DEMO_PASSWORD = 'HeatGuardDemo2026!';

// Helper SHA-256 hash
export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function seedDatabaseIfEmpty(): Promise<void> {
  try {
    const existingUsers = await db.getAll('users');
    if (existingUsers && existingUsers.length > 0) {
      // Already seeded
      return;
    }

    console.log('Seeding HeatGuard-Edge database with initial realistic health data...');
    const defaultPasswordHash = await hashPassword(DEMO_PASSWORD);
    const now = new Date();

    // 1. Create Users
    const users: (UserProfile & { passwordHash: string })[] = [
      {
        id: 'usr-aditya',
        email: 'user@heatguard.demo',
        name: 'Aditya Ariyan',
        role: 'USER',
        department: 'Field Engineering & Logistics',
        jobTitle: 'Field Operations Specialist',
        phone: '+1 (555) 234-8901',
        dateOfBirth: '1996-05-14',
        createdAt: new Date(now.getTime() - 90 * 86400000).toISOString(),
        updatedAt: now.toISOString(),
        passwordHash: defaultPasswordHash
      },
      {
        id: 'usr-sarah',
        email: 'sarah.chen@heatguard.demo',
        name: 'Sarah Chen',
        role: 'USER',
        department: 'Solar Array Assembly',
        jobTitle: 'Senior Technician',
        phone: '+1 (555) 345-6789',
        dateOfBirth: '1993-11-20',
        createdAt: new Date(now.getTime() - 60 * 86400000).toISOString(),
        updatedAt: now.toISOString(),
        passwordHash: defaultPasswordHash
      },
      {
        id: 'usr-marcus',
        email: 'marcus.vance@heatguard.demo',
        name: 'Marcus Vance',
        role: 'USER',
        department: 'Foundry & Heavy Fabrication',
        jobTitle: 'Materials Handler',
        phone: '+1 (555) 456-7890',
        dateOfBirth: '1988-03-08',
        createdAt: new Date(now.getTime() - 45 * 86400000).toISOString(),
        updatedAt: now.toISOString(),
        passwordHash: defaultPasswordHash
      },
      {
        id: 'usr-elena',
        email: 'elena.rostova@heatguard.demo',
        name: 'Elena Rostova',
        role: 'USER',
        department: 'Agricultural Operations',
        jobTitle: 'Agronomy Field Lead',
        phone: '+1 (555) 567-8901',
        dateOfBirth: '1995-08-12',
        createdAt: new Date(now.getTime() - 30 * 86400000).toISOString(),
        updatedAt: now.toISOString(),
        passwordHash: defaultPasswordHash
      },
      {
        id: 'mgr-rachel',
        email: 'manager@heatguard.demo',
        name: 'Dr. Rachel Kim',
        role: 'MANAGER',
        department: 'Occupational Health & Safety',
        jobTitle: 'Director of Environmental Health',
        phone: '+1 (555) 890-1234',
        dateOfBirth: '1982-01-19',
        createdAt: new Date(now.getTime() - 120 * 86400000).toISOString(),
        updatedAt: now.toISOString(),
        passwordHash: defaultPasswordHash
      },
      {
        id: 'adm-system',
        email: 'admin@heatguard.demo',
        name: 'System Administrator',
        role: 'ADMIN',
        department: 'Enterprise IT & Telemetry',
        jobTitle: 'Lead Infrastructure Engineer',
        phone: '+1 (555) 999-0000',
        dateOfBirth: '1985-06-30',
        createdAt: new Date(now.getTime() - 200 * 86400000).toISOString(),
        updatedAt: now.toISOString(),
        passwordHash: defaultPasswordHash
      }
    ];

    for (const u of users) {
      await db.put('users', u);
    }

    // 2. Manager Assignments
    const assignments: ManagerUserAssignment[] = [
      { id: 'mua-1', managerId: 'mgr-rachel', userId: 'usr-aditya', assignedAt: now.toISOString() },
      { id: 'mua-2', managerId: 'mgr-rachel', userId: 'usr-sarah', assignedAt: now.toISOString() },
      { id: 'mua-3', managerId: 'mgr-rachel', userId: 'usr-marcus', assignedAt: now.toISOString() },
      { id: 'mua-4', managerId: 'mgr-rachel', userId: 'usr-elena', assignedAt: now.toISOString() },
    ];
    for (const a of assignments) {
      await db.put('manager_user_assignments', a);
    }

    // 3. Devices
    const devices: DeviceInfo[] = [
      {
        id: 'dev-001',
        userId: 'usr-aditya',
        deviceSerial: 'HG-EDGE-v2-4821',
        model: 'HeatGuard Pro Band (Edge v2.4)',
        firmwareVersion: 'v2.4.1-rc3 (Edge AI Core)',
        batteryLevel: 78,
        connectionStatus: 'CONNECTED',
        lastSyncTime: new Date(now.getTime() - 120000).toISOString(),
        sensors: {
          max30102: { name: 'Photoplethysmography (MAX30102)', status: 'ACTIVE', lastReading: '82 BPM / 98% SpO2' },
          mlx90614: { name: 'Infrared Thermometer (MLX90614)', status: 'ACTIVE', lastReading: '36.8 °C' },
          sht31: { name: 'Ambient Temp & RH (SHT31)', status: 'ACTIVE', lastReading: '32.4 °C / 54% RH' },
          mpu6050: { name: '6-Axis IMU (MPU6050)', status: 'ACTIVE', lastReading: 'Moderate Motion' },
        }
      },
      {
        id: 'dev-002',
        userId: 'usr-sarah',
        deviceSerial: 'HG-EDGE-v2-7719',
        model: 'HeatGuard Pro Band (Edge v2.4)',
        firmwareVersion: 'v2.4.1-rc3',
        batteryLevel: 91,
        connectionStatus: 'CONNECTED',
        lastSyncTime: new Date(now.getTime() - 60000).toISOString(),
        sensors: {
          max30102: { name: 'Photoplethysmography (MAX30102)', status: 'ACTIVE', lastReading: '76 BPM / 99% SpO2' },
          mlx90614: { name: 'Infrared Thermometer (MLX90614)', status: 'ACTIVE', lastReading: '36.4 °C' },
          sht31: { name: 'Ambient Temp & RH (SHT31)', status: 'ACTIVE', lastReading: '30.1 °C / 48% RH' },
          mpu6050: { name: '6-Axis IMU (MPU6050)', status: 'ACTIVE', lastReading: 'Low Motion' },
        }
      },
      {
        id: 'dev-003',
        userId: 'usr-marcus',
        deviceSerial: 'HG-EDGE-v2-9102',
        model: 'HeatGuard Industrial Band',
        firmwareVersion: 'v2.4.0',
        batteryLevel: 42,
        connectionStatus: 'CONNECTED',
        lastSyncTime: new Date(now.getTime() - 180000).toISOString(),
        sensors: {
          max30102: { name: 'Photoplethysmography (MAX30102)', status: 'ACTIVE', lastReading: '104 BPM / 96% SpO2' },
          mlx90614: { name: 'Infrared Thermometer (MLX90614)', status: 'ACTIVE', lastReading: '38.1 °C' },
          sht31: { name: 'Ambient Temp & RH (SHT31)', status: 'ACTIVE', lastReading: '37.8 °C / 68% RH' },
          mpu6050: { name: '6-Axis IMU (MPU6050)', status: 'ACTIVE', lastReading: 'High Motion' },
        }
      },
      {
        id: 'dev-004',
        userId: 'usr-elena',
        deviceSerial: 'HG-EDGE-v2-3341',
        model: 'HeatGuard Pro Band',
        firmwareVersion: 'v2.4.1',
        batteryLevel: 65,
        connectionStatus: 'CONNECTED',
        lastSyncTime: new Date(now.getTime() - 300000).toISOString(),
        sensors: {
          max30102: { name: 'Photoplethysmography (MAX30102)', status: 'ACTIVE', lastReading: '88 BPM / 97% SpO2' },
          mlx90614: { name: 'Infrared Thermometer (MLX90614)', status: 'ACTIVE', lastReading: '37.2 °C' },
          sht31: { name: 'Ambient Temp & RH (SHT31)', status: 'ACTIVE', lastReading: '33.9 °C / 59% RH' },
          mpu6050: { name: '6-Axis IMU (MPU6050)', status: 'ACTIVE', lastReading: 'Moderate Motion' },
        }
      }
    ];

    for (const d of devices) {
      await db.put('devices', d);
    }

    // 4. Emergency Contacts for Aditya
    const contacts: EmergencyContact[] = [
      {
        id: 'ec-1',
        userId: 'usr-aditya',
        name: 'Priya Ariyan',
        relationship: 'Spouse',
        phone: '+1 (555) 234-9912',
        isPrimary: true
      },
      {
        id: 'ec-2',
        userId: 'usr-aditya',
        name: 'Dr. Robert Torres',
        relationship: 'Primary Physician',
        phone: '+1 (555) 887-3200',
        isPrimary: false
      }
    ];
    for (const c of contacts) {
      await db.put('emergency_contacts', c);
    }

    // 5. Generate 24-hour Telemetry history for Aditya & others
    const userIds = ['usr-aditya', 'usr-sarah', 'usr-marcus', 'usr-elena'];
    
    for (const uid of userIds) {
      const isMarcus = uid === 'usr-marcus';
      const isSarah = uid === 'usr-sarah';

      // 24 telemetry points over past 24 hours (1 per hour)
      for (let i = 24; i >= 0; i--) {
        const pointTime = new Date(now.getTime() - i * 3600000);
        const hourOfDay = pointTime.getHours();
        
        // Base curves based on time of day
        const isWorkHour = hourOfDay >= 8 && hourOfDay <= 17;
        const heatWaveBonus = isWorkHour ? (hourOfDay >= 12 && hourOfDay <= 15 ? 4 : 2) : -2;

        let hr = isMarcus ? 92 + Math.sin(i * 0.5) * 14 : 76 + Math.sin(i * 0.4) * 8;
        if (isWorkHour) hr += 10;
        let spo2 = 98 - (isMarcus ? 2 : 0) + (Math.sin(i) > 0.5 ? 1 : 0);
        let skinTemp = 36.5 + (isMarcus ? 1.1 : 0.2) + (isWorkHour ? 0.4 : 0);
        let ambientTemp = 28 + heatWaveBonus + Math.sin(i * 0.3) * 3;
        let humidity = 50 + Math.cos(i * 0.4) * 15;

        // Clamp values to realistic ranges
        hr = Math.round(Math.max(68, Math.min(135, hr)));
        spo2 = Math.min(100, Math.max(94, spo2));
        skinTemp = parseFloat(skinTemp.toFixed(1));
        ambientTemp = parseFloat(ambientTemp.toFixed(1));
        humidity = Math.round(humidity);

        const telemetryRecord: HealthTelemetry = {
          id: `tel-${uid}-${i}`,
          userId: uid,
          timestamp: pointTime.toISOString(),
          heartRate: hr,
          spo2: spo2,
          skinTemperature: skinTemp,
          ambientTemperature: ambientTemp,
          humidity: humidity,
          activityLevel: isWorkHour ? (isMarcus ? 'HIGH' : 'MODERATE') : 'LIGHT',
          stepCountToday: isWorkHour ? (24 - i) * 650 : 2100,
          activeMinutesToday: isWorkHour ? (24 - i) * 22 : 45,
          restMinutesToday: isWorkHour ? (24 - i) * 8 : 180,
          motionSleepEstimateHours: 7.4
        };

        await db.put('health_data', telemetryRecord);

        // Compute Risk Assessment for the hour
        let heatRisk = 22;
        if (isMarcus) heatRisk = 68;
        else if (isSarah) heatRisk = 18;
        else heatRisk = isWorkHour ? 28 : 16;

        let riskLevel: 'LOW' | 'CAUTION' | 'HIGH' | 'CRITICAL' = 'LOW';
        if (heatRisk > 70) riskLevel = 'CRITICAL';
        else if (heatRisk > 50) riskLevel = 'HIGH';
        else if (heatRisk > 30) riskLevel = 'CAUTION';

        const heatReserve = Math.max(20, Math.min(95, Math.round(100 - heatRisk * 0.85)));
        const heatDebt = isMarcus ? 'ELEVATED' : (heatRisk > 30 ? 'MODERATE' : 'LOW');
        const recoveryStatus = isMarcus ? 'FAIR' : 'GOOD';

        const riskRecord: RiskAssessment = {
          id: `risk-${uid}-${i}`,
          userId: uid,
          timestamp: pointTime.toISOString(),
          heatRisk,
          riskLevel,
          heatReserve,
          heatDebt,
          recoveryStatus,
          dimensions: {
            heatLoad: Math.round(heatRisk * 0.9),
            physiologicalStress: Math.round((hr - 60) * 0.8),
            activityStress: isWorkHour ? 55 : 25,
            exposureIndex: isWorkHour ? 60 : 20,
            recoveryCapacity: recoveryStatus === 'GOOD' ? 82 : 55
          },
          aiInsight: isMarcus 
            ? 'Physiological heat stress elevated due to high ambient temperature in Foundry Bay. Core cooling break advised.'
            : 'Your heat risk remains within safe thermal equilibrium. Physiological markers indicate excellent recovery capacity.',
          recommendation: isMarcus
            ? 'Relocate to active cooling zone. Consume 350ml electrolyte solution.'
            : 'Stay hydrated and maintain current hydration intervals.',
          improvements: [
            { label: 'Cardiovascular recovery', value: '-4 bpm', positive: true },
            { label: 'Skin temp stability', value: 'Optimal', positive: true },
            { label: 'Hydration adherence', value: '+14%', positive: true }
          ],
          focusAreas: [
            { title: 'Afternoon Heat Index', subtitle: 'Peak ambient temp expected at 14:30' },
            { title: 'Cooling break pacing', subtitle: 'Target 10 min shade every 50 min active' }
          ]
        };

        await db.put('risk_assessments', riskRecord);
      }
    }

    // 6. Realistic Alerts
    const alerts: AlertRecord[] = [
      {
        id: 'alt-001',
        userId: 'usr-aditya',
        userName: 'Aditya Ariyan',
        timestamp: new Date(now.getTime() - 25 * 60000).toISOString(),
        type: 'HYDRATION_REMINDER',
        severity: 'LOW',
        title: 'Scheduled Hydration Interval',
        message: 'High ambient temperature (32.4°C) detected. Target 250ml water intake to preserve heat reserve.',
        read: false,
        actionRequired: 'Drink 250ml water'
      },
      {
        id: 'alt-002',
        userId: 'usr-aditya',
        userName: 'Aditya Ariyan',
        timestamp: new Date(now.getTime() - 140 * 60000).toISOString(),
        type: 'HEAT_SPIKE',
        severity: 'CAUTION',
        title: 'Mild Heat Exposure Transition',
        message: 'Ambient heat index shifted from 29°C to 33°C as you moved to the exterior yard.',
        read: true,
        actionRequired: 'Monitor skin temperature'
      },
      {
        id: 'alt-003',
        userId: 'usr-aditya',
        userName: 'Aditya Ariyan',
        timestamp: new Date(now.getTime() - 360 * 60000).toISOString(),
        type: 'RISK_NORMALIZED',
        severity: 'LOW',
        title: 'Thermal Equilibrium Restored',
        message: 'Heart rate and skin temperature returned to resting baseline following morning break.',
        read: true
      },
      {
        id: 'alt-004',
        userId: 'usr-marcus',
        userName: 'Marcus Vance',
        timestamp: new Date(now.getTime() - 10 * 60000).toISOString(),
        type: 'HIGH_HEAT_RISK',
        severity: 'HIGH',
        title: 'High Heat Strain Warning',
        message: 'Sustained heart rate > 105 BPM and skin temperature 38.1°C in Foundry Zone.',
        read: false,
        actionRequired: 'Immediate cooling rest required'
      },
      {
        id: 'alt-005',
        userId: 'usr-marcus',
        userName: 'Marcus Vance',
        timestamp: new Date(now.getTime() - 40 * 60000).toISOString(),
        type: 'ELEVATED_SKIN_TEMP',
        severity: 'CAUTION',
        title: 'Skin Temperature Spike',
        message: 'Skin temp rose by 1.2°C over the past 20 minutes.',
        read: true
      }
    ];

    for (const a of alerts) {
      await db.put('alerts', a);
    }

    console.log('Database seeded successfully with users, devices, telemetry, and alerts!');
  } catch (err) {
    console.error('Failed to seed database:', err);
  }
}
