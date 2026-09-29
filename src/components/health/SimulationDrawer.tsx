import React, { useState } from 'react';
import { Sliders, Activity, Flame, ShieldAlert, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { useHealthData } from '../../services/health/HealthDataContext';

export const SimulationDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { simulationConfig, setSimulationMode, updateSimulationConfig, telemetry } = useHealthData();

  const presets = [
    { mode: 'NORMAL', label: 'Normal Thermal Balance', desc: 'HR ~80, Skin 36.6°C, Amb 30°C', icon: CheckCircle2, color: '#3b7b4d' },
    { mode: 'CAUTION', label: 'Mild Caution / Strain', desc: 'HR ~98, Skin 37.5°C, Amb 34°C', icon: Activity, color: '#b57a1b' },
    { mode: 'HIGH', label: 'High Heat Risk Warning', desc: 'HR ~122, Skin 38.4°C, Amb 38°C', icon: Flame, color: '#c85a17' },
    { mode: 'CRITICAL', label: 'Critical Overload Event', desc: 'HR ~142, Skin 39.3°C, Amb 42°C', icon: ShieldAlert, color: '#c53030' },
  ] as const;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}
    >
      {/* Simulation Drawer Card */}
      {isOpen && (
        <div
          className="nura-card"
          style={{
            width: '340px',
            marginBottom: '12px',
            padding: '20px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            backgroundColor: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="var(--sage-600)" />
              <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Hardware Simulation Lab</h4>
            </div>
            <span style={{ fontSize: '11px', background: 'var(--sage-100)', color: 'var(--sage-800)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>
              Virtual Edge Core
            </span>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Simulate physical sensor feeds (MAX30102, MLX90614, SHT31, MPU6050) to evaluate early warning protocols:
          </p>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {presets.map(p => {
              const Icon = p.icon;
              const isActive = simulationConfig.mode === p.mode;
              return (
                <button
                  key={p.mode}
                  onClick={() => setSimulationMode(p.mode)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isActive ? p.color : 'var(--border-subtle)'}`,
                    background: isActive ? `${p.color}12` : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} color={p.color} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: isActive ? p.color : 'var(--text-primary)' }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Auto drift toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>Continuous Drift</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Smooth biological variation</div>
            </div>
            <input
              type="checkbox"
              checked={simulationConfig.autoDrift}
              onChange={e => updateSimulationConfig({ autoDrift: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--sage-500)' }}
            />
          </div>

          {/* Live stream ticker */}
          {telemetry && (
            <div style={{ marginTop: '12px', padding: '8px 10px', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Live: <strong>{telemetry.heartRate} BPM</strong></span>
              <span>Skin: <strong>{telemetry.skinTemperature}°C</strong></span>
              <span>Amb: <strong>{telemetry.ambientTemperature}°C</strong></span>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: '#191c1a',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '13px',
          border: 'none',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <Sliders size={16} />
        <span>Hardware Simulation Mode ({simulationConfig.mode})</span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
    </div>
  );
};
