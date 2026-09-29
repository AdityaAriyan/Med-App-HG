import React, { useState } from 'react';
import type { HealthTelemetry } from '../../types';
import { Activity, Heart, Thermometer, Wind } from 'lucide-react';

interface HumanBodyVisualizationProps {
  telemetry: HealthTelemetry | null;
  className?: string;
}

export const HumanBodyVisualization: React.FC<HumanBodyVisualizationProps> = ({
  telemetry,
  className = ''
}) => {
  const [selectedSensor, setSelectedSensor] = useState<'heart' | 'skin' | 'ambient' | 'motion' | null>('heart');

  const hr = telemetry?.heartRate || 82;
  const skinTemp = telemetry?.skinTemperature || 36.8;
  const ambientTemp = telemetry?.ambientTemperature || 32.0;
  const humidity = telemetry?.humidity || 54;
  const activity = telemetry?.activityLevel || 'MODERATE';

  // Sensor node definitions positioned on anatomical coordinate grid
  const sensors = [
    {
      id: 'skin',
      label: 'Skin Temperature',
      device: 'MLX90614 IR',
      value: `${skinTemp} °C`,
      status: skinTemp > 38.0 ? 'ELEVATED' : 'OPTIMAL',
      icon: Thermometer,
      x: 50,
      y: 13,
      color: skinTemp > 38.0 ? '#c53030' : (skinTemp > 37.3 ? '#c85a17' : '#6f8e75'),
      details: 'Measures continuous epidermal temperature at forehead & temporal region.'
    },
    {
      id: 'heart',
      label: 'Heart Rate & SpO2',
      device: 'MAX30102 PPG',
      value: `${hr} BPM · ${telemetry?.spo2 || 98}%`,
      status: hr > 110 ? 'HIGH' : (hr > 90 ? 'CAUTION' : 'NORMAL'),
      icon: Heart,
      x: 46,
      y: 30,
      color: hr > 110 ? '#c85a17' : '#6f8e75',
      details: 'Dual-wavelength optical pulse oximetry and cardiovascular rate.'
    },
    {
      id: 'ambient',
      label: 'Ambient & Humidity',
      device: 'SHT31 Sensor',
      value: `${ambientTemp} °C · ${humidity}% RH`,
      status: ambientTemp > 35 ? 'HIGH HEAT' : 'MODERATE',
      icon: Wind,
      x: 23,
      y: 46,
      color: ambientTemp > 35 ? '#b57a1b' : '#6f8e75',
      details: 'Microclimate environmental sensor embedded on outer wrist band casing.'
    },
    {
      id: 'motion',
      label: 'Motion / Activity',
      device: 'MPU6050 6-Axis IMU',
      value: activity,
      status: 'ACTIVE',
      icon: Activity,
      x: 77,
      y: 46,
      color: '#6f8e75',
      details: 'Motion-derived kinematics and cadence tracking for metabolic heat modeling.'
    }
  ];

  const activeSensorObj = sensors.find(s => s.id === selectedSensor);

  return (
    <div className={`nura-card ${className}`} style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sage-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Biological Signal Nodes
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>Body Status & Sensor Mesh</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time multi-point telemetry mapped across physiological checkpoints
          </p>
        </div>
        <span className="status-chip low">Edge Stream Active</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', alignItems: 'center' }}>
        {/* Anatomical Silhouette Graphic with Interactivity */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(180deg, #f7f9f7 0%, #edf2ee 100%)',
            borderRadius: '20px',
            padding: '24px 12px',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '380px',
            border: '1px solid rgba(0,0,0,0.04)'
          }}
        >
          <svg
            viewBox="0 0 200 360"
            style={{ width: '100%', maxHeight: '350px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.04))' }}
          >
            {/* Minimalist Vector Human Silhouette */}
            <g fill="#d3ded5" stroke="#b8c8bc" strokeWidth="1.2">
              {/* Head */}
              <ellipse cx="100" cy="40" rx="19" ry="24" />
              {/* Neck */}
              <path d="M92 62 L92 74 L108 74 L108 62 Z" />
              {/* Torso & Shoulders */}
              <path d="M68 76 C76 72, 124 72, 132 76 C144 82, 148 100, 142 145 C140 162, 136 180, 132 205 L68 205 C64 180, 60 162, 58 145 C52 100, 56 82, 68 76 Z" />
              {/* Left Arm */}
              <path d="M57 88 C46 112, 38 145, 34 185 C32 195, 29 208, 26 215 C24 220, 20 224, 18 220 C16 215, 22 195, 26 180 C32 140, 42 105, 52 82 Z" />
              {/* Right Arm */}
              <path d="M143 88 C154 112, 162 145, 166 185 C168 195, 171 208, 174 215 C176 220, 180 224, 182 220 C184 215, 178 195, 174 180 C168 140, 158 105, 148 82 Z" />
              {/* Left Leg */}
              <path d="M72 205 L68 280 C66 300, 64 330, 62 350 C61 354, 57 356, 52 355 C48 354, 50 348, 52 335 C56 300, 60 270, 64 215 Z" />
              {/* Right Leg */}
              <path d="M128 205 L132 280 C134 300, 136 330, 138 350 C139 354, 143 356, 148 355 C152 354, 150 348, 148 335 C144 300, 140 270, 136 215 Z" />
            </g>

            {/* Subtle thermal radiating wave rings */}
            <circle cx="100" cy="110" r="45" fill="none" stroke="rgba(111, 142, 117, 0.2)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="100" cy="110" r="70" fill="none" stroke="rgba(111, 142, 117, 0.1)" strokeWidth="1" strokeDasharray="4,4" />

            {/* Interactive Sensor Nodes */}
            {sensors.map(s => {
              const cx = (s.x / 100) * 200;
              const cy = (s.y / 100) * 360;
              const isSelected = selectedSensor === s.id;

              return (
                <g
                  key={s.id}
                  onClick={() => setSelectedSensor(s.id as 'heart' | 'skin' | 'ambient' | 'motion')}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer pulse ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 14 : 10}
                    fill={s.color}
                    fillOpacity={isSelected ? 0.25 : 0.15}
                    className="pulse-indicator"
                  />
                  {/* Center node */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6 : 4.5}
                    fill={s.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Sensor Telemetry Card */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            {sensors.map(s => {
              const isSelected = selectedSensor === s.id;
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSensor(s.id as 'heart' | 'skin' | 'ambient' | 'motion')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--sage-50)' : '#ffffff',
                    border: `1px solid ${isSelected ? 'var(--sage-400)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? 'var(--sage-500)' : '#f0f3f0',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>{s.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.device}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'var(--font-digital)' }}>{s.value}</div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: s.color }}>{s.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {activeSensorObj && (
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#fafbfa',
                border: '1px dashed var(--border-subtle)'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Hardware Interface Note
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                {activeSensorObj.details}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
