import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ManagerSettingsPage: React.FC = () => {
  const [hrThreshold, setHrThreshold] = useState(115);
  const [skinTempThreshold, setSkinTempThreshold] = useState(38.0);
  const [wbgtThreshold, setWbgtThreshold] = useState(30.0);
  const [heatRiskThreshold, setHeatRiskThreshold] = useState(65);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="nura-card" style={{ padding: '24px 28px' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Occupational Heat Safety Thresholds</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Calibrate automated trigger points for physiological alarms and mandatory cooling intervals
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Threshold Sliders */}
        <div className="nura-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Physiological Alarm Limits</h3>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Sustained Heart Rate Limit</label>
              <strong style={{ fontSize: '14px', fontFamily: 'var(--font-digital)' }}>{hrThreshold} BPM</strong>
            </div>
            <input
              type="range"
              min="90"
              max="150"
              value={hrThreshold}
              onChange={e => setHrThreshold(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--sage-500)' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Alarms when continuous HR exceeds value for &gt; 5 mins</span>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Epidermal Skin Temperature Limit</label>
              <strong style={{ fontSize: '14px', fontFamily: 'var(--font-digital)' }}>{skinTempThreshold.toFixed(1)} °C</strong>
            </div>
            <input
              type="range"
              min="37.0"
              max="39.5"
              step="0.1"
              value={skinTempThreshold}
              onChange={e => setSkinTempThreshold(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--sage-500)' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Triggers active cooling directive when reached</span>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Site WBGT Index Threshold</label>
              <strong style={{ fontSize: '14px', fontFamily: 'var(--font-digital)' }}>{wbgtThreshold.toFixed(1)} °C</strong>
            </div>
            <input
              type="range"
              min="26.0"
              max="34.0"
              step="0.5"
              value={wbgtThreshold}
              onChange={e => setWbgtThreshold(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--sage-500)' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Shifts entire team to mandatory 30/30 work-rest cycle</span>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Heat Risk Score Alert Cutoff</label>
              <strong style={{ fontSize: '14px', fontFamily: 'var(--font-digital)' }}>{heatRiskThreshold} / 100</strong>
            </div>
            <input
              type="range"
              min="40"
              max="85"
              value={heatRiskThreshold}
              onChange={e => setHeatRiskThreshold(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--sage-500)' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Elevates dashboard priority and alerts supervisor</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="submit" className="btn-primary">
              Save Safety Thresholds
            </button>
            {saved && (
              <span style={{ fontSize: '12px', color: '#3b7b4d', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Threshold policy saved
              </span>
            )}
          </div>
        </div>

        {/* Notification & Dispatch Settings */}
        <div className="nura-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>Automated Dispatch Protocol</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Supervisor Push Alarms</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Immediate popup on high heat spike</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--sage-500)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>On-Band Haptic Warning</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vibrate wearable when risk &gt; 65</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--sage-500)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Automated Break Countdown</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Broadcast rest reminders across team</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--sage-500)' }} />
              </div>
            </div>
          </div>

          <div style={{ padding: '14px', background: 'var(--sage-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--sage-200)', marginTop: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sage-800)' }}>Enterprise Safety Compliance</div>
            <p style={{ fontSize: '11.5px', color: 'var(--sage-800)', marginTop: '2px' }}>
              All configuration adjustments are recorded in system audit logs in accordance with occupational safety standards.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
