import React, { useState } from 'react';
import { useHealthData } from '../../services/health/HealthDataContext';
import { DotMatrixDisplay } from '../../components/common/DotMatrixDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Cpu, Battery, RefreshCw, Bluetooth, Radio, CheckCircle2 } from 'lucide-react';

export const UserDevicePage: React.FC = () => {
  const { device, telemetry, refreshData } = useHealthData();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await refreshData();
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  const sensors = [
    {
      name: 'MAX30102 Optical PPG',
      function: 'Dual-wavelength pulse oximetry & heart rate',
      status: 'ACTIVE',
      sampleRate: '100 Hz',
      lastReading: `${telemetry?.heartRate || 82} BPM · ${telemetry?.spo2 || 98}% SpO2`
    },
    {
      name: 'MLX90614 Infrared Thermometer',
      function: 'Non-contact epidermal temperature sensing',
      status: 'ACTIVE',
      sampleRate: '10 Hz',
      lastReading: `${telemetry?.skinTemperature || 36.8} °C`
    },
    {
      name: 'SHT31 Microclimate Sensor',
      function: 'Precision ambient temperature & relative humidity',
      status: 'ACTIVE',
      sampleRate: '1 Hz',
      lastReading: `${telemetry?.ambientTemperature || 32.0} °C · ${telemetry?.humidity || 54}% RH`
    },
    {
      name: 'MPU6050 6-Axis IMU',
      function: '3-axis accelerometer + 3-axis gyroscope',
      status: 'ACTIVE',
      sampleRate: '50 Hz',
      lastReading: `${telemetry?.activityLevel || 'MODERATE'} Motion / Cadence`
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Device Overview Banner */}
      <div className="nura-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#191c1a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Cpu size={28} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                  {device?.model || 'HeatGuard Pro Band (Edge v2.4)'}
                </h2>
                <StatusBadge status={device?.connectionStatus || 'CONNECTED'} size="sm" />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Serial: <code style={{ fontFamily: 'var(--font-digital)', background: 'var(--bg-app)', padding: '2px 6px', borderRadius: '4px' }}>{device?.deviceSerial || 'HG-EDGE-v2-4821'}</code> · Firmware: {device?.firmwareVersion || 'v2.4.1-rc3'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleManualSync}
              className="btn-outline"
              disabled={isSyncing}
              style={{ fontSize: '13px' }}
            >
              <RefreshCw size={14} className={isSyncing ? 'pulse-indicator' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Sensor Buffer'}</span>
            </button>
          </div>
        </div>

        {/* Battery & Telemetry Channel Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Battery Reserve</span>
              <Battery size={16} color="#3b7b4d" />
            </div>
            <DotMatrixDisplay value={device?.batteryLevel || 78} unit="%" size="md" dotColor="#191c1a" />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Est. ~18 hours runtime</div>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Transport Protocol</span>
              <Bluetooth size={16} color="var(--sage-600)" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>BLE 5.2 GATT</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Simulated Stream Bridge</div>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>On-Device AI</span>
              <Radio size={16} color="var(--sage-600)" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>Edge Core Active</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Deterministic Estimation</div>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Last Synchronization</span>
              <CheckCircle2 size={16} color="#3b7b4d" />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>Just Now</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>0 packet drops</div>
          </div>
        </div>
      </div>

      {/* Sensor Mesh Array Table */}
      <div className="nura-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Onboard Sensor Diagnostics</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Continuous hardware diagnostics across physical transducer channels
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sensors.map((sensor, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{sensor.name}</span>
                  <StatusBadge status="ACTIVE" size="sm" />
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {sensor.function}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'var(--font-digital)' }}>
                  {sensor.lastReading}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Sample rate: {sensor.sampleRate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware Migration Architecture Section */}
      <div className="nura-card" style={{ background: 'var(--sage-50)', borderColor: 'var(--sage-200)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--sage-800)', marginBottom: '8px' }}>
          Hardware Integration Architecture (Simulated → Physical Wearable)
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--sage-800)', lineHeight: 1.5, marginBottom: '14px' }}>
          HeatGuard-Edge is engineered with a strict <code>IHealthDataProvider</code> interface abstraction.
          When physical wearable hardware (ESP32 / nRF52 with MAX30102, MLX90614, SHT31, MPU6050) is connected via Web Bluetooth (BLE GATT) or MQTT gateway, no frontend UI modifications are required.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '12px', border: '1px solid var(--sage-200)' }}>
            <strong>Step 1:</strong> Physical GATT UUID bindings in <code>EdgeDeviceHealthDataProvider</code>
          </div>
          <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '12px', border: '1px solid var(--sage-200)' }}>
            <strong>Step 2:</strong> On-device local threshold inference prior to network sync
          </div>
        </div>
      </div>
    </div>
  );
};
