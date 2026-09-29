import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import { useHealthData } from '../../services/health/HealthDataContext';
import { db } from '../../services/database/db';
import { ShieldAlert, Phone, MapPin, RefreshCw } from 'lucide-react';
import type { EmergencyContact, EmergencyEvent } from '../../types';

export const UserEmergencyPage: React.FC = () => {
  const { user } = useAuth();
  const { telemetry, riskAssessment, triggerEmergencyAlert } = useHealthData();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [recentEvents, setRecentEvents] = useState<EmergencyEvent[]>([]);
  
  // Hold-to-confirm state
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [sosActivated, setSosActivated] = useState<boolean>(false);
  const holdIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;
    db.getByIndex('emergency_contacts', 'userId', user.id).then(res => setContacts(res || []));
    db.getByIndex('emergency_events', 'userId', user.id).then(res => {
      res.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentEvents(res || []);
    });
  }, [user, sosActivated]);

  const startHolding = () => {
    if (sosActivated) return;
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current!);
        setIsHolding(false);
        triggerSOS();
      }
    }, 50);
  };

  const stopHolding = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const triggerSOS = async () => {
    if (!user || !telemetry || !riskAssessment) return;
    setSosActivated(true);

    const event: EmergencyEvent = {
      id: `sos-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      timestamp: new Date().toISOString(),
      riskLevel: riskAssessment.riskLevel,
      heatRiskScore: riskAssessment.heatRisk,
      heartRate: telemetry.heartRate,
      skinTemperature: telemetry.skinTemperature,
      ambientTemperature: telemetry.ambientTemperature,
      latitude: 37.7749,
      longitude: -122.4194,
      locationName: 'Worksite Alpha — Heavy Assembly Sector 4',
      status: 'TRIGGERED',
      notes: 'User initiated high-priority hold-to-confirm SOS beacon.'
    };

    await db.put('emergency_events', event);
    await triggerEmergencyAlert('MANUAL EMERGENCY SOS TRIGGERED BY WORKER. High priority thermal distress response activated.');
    
    const updated = await db.getByIndex('emergency_events', 'userId', user.id);
    updated.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setRecentEvents(updated);
  };

  const resetSOS = () => {
    setSosActivated(false);
    setHoldProgress(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Warning */}
      <div
        className="nura-card"
        style={{
          background: 'var(--risk-critical-bg)',
          borderColor: 'rgba(197, 48, 48, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px 24px'
        }}
      >
        <ShieldAlert size={28} color="var(--risk-critical)" style={{ flexShrink: 0 }} />
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--risk-critical)' }}>
            Heat Emergency & Distress Beacon
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--risk-critical)', opacity: 0.9, marginTop: '2px' }}>
            Prototype SOS Protocol. Initiates immediate simulated telemetry broadcast to your assigned safety supervisor and emergency contacts.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Main SOS Trigger Console */}
        <div
          className="nura-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 32px',
            textAlign: 'center',
            backgroundColor: '#ffffff'
          }}
        >
          {sosActivated ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--risk-critical)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulseGlow 1.5s infinite ease-in-out'
                }}
              >
                <ShieldAlert size={48} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--risk-critical)' }}>
                  EMERGENCY SOS BROADCAST ACTIVE
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '420px', marginTop: '6px' }}>
                  Distress signal dispatched to Manager Roster and designated emergency contacts. Live GPS coordinates and physiological telemetry are broadcasting.
                </p>
              </div>

              <div style={{ padding: '12px 20px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', fontSize: '13px', textAlign: 'left', width: '100%', maxWidth: '380px' }}>
                <div><strong>Location:</strong> Worksite Alpha — Heavy Assembly Sector 4</div>
                <div><strong>Current Heart Rate:</strong> {telemetry?.heartRate} BPM</div>
                <div><strong>Skin Temperature:</strong> {telemetry?.skinTemperature} °C</div>
                <div><strong>Heat Risk Index:</strong> {riskAssessment?.heatRisk} / 100 (CRITICAL)</div>
              </div>

              <button onClick={resetSOS} className="btn-outline" style={{ marginTop: '12px' }}>
                <RefreshCw size={14} /> Reset SOS Beacon
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
                Hold to Trigger Distress Protocol
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '360px', marginBottom: '32px' }}>
                Press and hold the button for <strong>3 seconds</strong> to prevent accidental activation.
              </p>

              {/* Hold-to-Confirm Circular Button */}
              <div
                style={{
                  position: 'relative',
                  width: '180px',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none'
                }}
              >
                {/* SVG Progress Ring */}
                <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                  <circle cx="90" cy="90" r="82" fill="none" stroke="#f0ede6" strokeWidth="8" />
                  <circle
                    cx="90"
                    cy="90"
                    r="82"
                    fill="none"
                    stroke="#c53030"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 82}
                    strokeDashoffset={2 * Math.PI * 82 * (1 - holdProgress / 100)}
                    strokeLinecap="round"
                    style={{ transition: isHolding ? 'stroke-dashoffset 0.05s linear' : 'stroke-dashoffset 0.2s ease' }}
                  />
                </svg>

                {/* Interactive Button */}
                <button
                  onMouseDown={startHolding}
                  onMouseUp={stopHolding}
                  onMouseLeave={stopHolding}
                  onTouchStart={startHolding}
                  onTouchEnd={stopHolding}
                  style={{
                    width: '144px',
                    height: '144px',
                    borderRadius: '50%',
                    backgroundColor: isHolding ? '#a82323' : '#c53030',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(197, 48, 48, 0.4)',
                    transition: 'transform 0.1s ease, background-color 0.2s ease',
                    transform: isHolding ? 'scale(0.96)' : 'scale(1)'
                  }}
                >
                  <ShieldAlert size={36} />
                  <span style={{ fontSize: '15px', fontWeight: 800, marginTop: '4px', letterSpacing: '0.05em' }}>
                    SOS
                  </span>
                  <span style={{ fontSize: '10px', opacity: 0.85 }}>
                    {isHolding ? `${Math.round(holdProgress)}%` : 'HOLD 3s'}
                  </span>
                </button>
              </div>

              <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <MapPin size={14} />
                <span>Auto-attaches current site GPS coordinates</span>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Dispatch Info & Registered Contacts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Dispatch Info */}
          <div className="nura-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>Designated Responders</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Personnel immediately notified upon SOS event:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#191c1a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                  RK
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Dr. Rachel Kim (Assigned Manager)</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Occupational Health & Safety Lead · +1 (555) 890-1234</div>
                </div>
              </div>

              {contacts.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                  <Phone size={16} color="var(--sage-600)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{c.name} ({c.relationship})</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Emergency Event Records */}
          <div className="nura-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>Emergency Event Log</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Audit trail of distress protocols triggered by this user:
            </p>

            {recentEvents.length === 0 ? (
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No prior emergency SOS activations recorded.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentEvents.slice(0, 3).map(ev => (
                  <div key={ev.id} style={{ padding: '10px 12px', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span style={{ color: 'var(--risk-critical)' }}>SOS Triggered</span>
                      <span>{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{ev.locationName}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
