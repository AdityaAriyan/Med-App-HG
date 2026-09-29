import React, { useState } from 'react';
import { useHealthData } from '../../services/health/HealthDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/StateFeedback';
import { Check, AlertTriangle, ShieldCheck, Flame, Info } from 'lucide-react';
import type { AlertRecord } from '../../types';

export const UserAlertsPage: React.FC = () => {
  const { alerts, markAlertAsRead } = useHealthData();
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'LOW' | 'CAUTION' | 'HIGH' | 'CRITICAL'>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<AlertRecord | null>(null);

  const filtered = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const getAlertIcon = (type: string) => {
    if (type.includes('HEAT') || type.includes('SPIKE')) return Flame;
    if (type.includes('EMERGENCY') || type.includes('CRITICAL')) return AlertTriangle;
    if (type.includes('NORMALIZED')) return ShieldCheck;
    return Info;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Bar with Filter Pills */}
      <div className="nura-card" style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Thermal Alert Log</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time notifications triggered by biological telemetry and microclimate heat thresholds
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-app)', padding: '4px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
          {(['ALL', 'CRITICAL', 'HIGH', 'CAUTION', 'LOW'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              style={{
                padding: '5px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: filterSeverity === sev ? '#191c1a' : 'transparent',
                color: filterSeverity === sev ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No alerts in this category"
          description="Your physiological parameters are currently within normal baseline thresholds."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(alert => {
            const Icon = getAlertIcon(alert.type);
            return (
              <div
                key={alert.id}
                className="nura-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '18px 24px',
                  backgroundColor: alert.read ? '#ffffff' : (alert.severity === 'CRITICAL' ? 'var(--risk-critical-bg)' : '#fdfdfb'),
                  borderColor: !alert.read ? (alert.severity === 'CRITICAL' ? 'rgba(197, 48, 48, 0.4)' : 'var(--sage-400)') : 'var(--border-subtle)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedAlert(alert)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: alert.severity === 'CRITICAL' ? '#c53030' : (alert.severity === 'HIGH' ? '#c85a17' : (alert.severity === 'CAUTION' ? '#b57a1b' : 'var(--sage-500)')),
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {alert.title}
                      </span>
                      <StatusBadge status={alert.severity} size="sm" />
                      {!alert.read && (
                        <span style={{ fontSize: '10px', background: '#191c1a', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '650px' }}>
                      {alert.message}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </div>
                  </div>

                  {!alert.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAlertAsRead(alert.id);
                      }}
                      className="btn-outline"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      title="Mark as read"
                    >
                      <Check size={14} />
                      <span>Acknowledge</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
          onClick={() => setSelectedAlert(null)}
        >
          <div
            className="nura-card"
            style={{ maxWidth: '520px', width: '100%', padding: '28px', backgroundColor: '#ffffff' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <StatusBadge status={selectedAlert.severity} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {new Date(selectedAlert.timestamp).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>{selectedAlert.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              {selectedAlert.message}
            </p>

            {selectedAlert.actionRequired && (
              <div style={{ padding: '12px 16px', background: 'var(--sage-50)', borderRadius: 'var(--radius-md)', marginBottom: '24px', border: '1px solid var(--sage-200)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--sage-800)', textTransform: 'uppercase' }}>
                  Recommended Safety Action
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--sage-800)', marginTop: '2px' }}>
                  {selectedAlert.actionRequired}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              {!selectedAlert.read && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    markAlertAsRead(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                >
                  <Check size={14} /> Mark as Acknowledged
                </button>
              )}
              <button className="btn-outline" onClick={() => setSelectedAlert(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
