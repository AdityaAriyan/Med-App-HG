import React, { useState, useEffect } from 'react';
import { db } from '../../services/database/db';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/StateFeedback';
import { Check, ShieldAlert, Flame, CheckCircle2 } from 'lucide-react';
import type { AlertRecord } from '../../types';

export const ManagerAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'CAUTION' | 'LOW'>('ALL');

  const loadAlerts = async () => {
    const all = await db.getAll('alerts');
    all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setAlerts(all);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAcknowledge = async (alertId: string) => {
    const alert = await db.getById('alerts', alertId);
    if (alert) {
      alert.read = true;
      alert.acknowledgedAt = new Date().toISOString();
      await db.put('alerts', alert);
      loadAlerts();
    }
  };

  const filtered = alerts.filter(a => {
    if (severityFilter === 'ALL') return true;
    return a.severity === severityFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner with Filter Tabs */}
      <div className="nura-card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Fleet Safety Alert Triage</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time critical events and automated early warnings triggered across assigned field workforce
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-app)', padding: '4px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
          {(['ALL', 'CRITICAL', 'HIGH', 'CAUTION', 'LOW'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              style={{
                padding: '5px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: severityFilter === s ? '#191c1a' : 'transparent',
                color: severityFilter === s ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Table / List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No alerts in triage"
          description="All assigned workers are currently maintaining thermal equilibrium within safety limits."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(alert => (
            <div
              key={alert.id}
              className="nura-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 24px',
                backgroundColor: alert.read ? '#ffffff' : (alert.severity === 'CRITICAL' ? 'var(--risk-critical-bg)' : '#fdfdfb'),
                borderColor: !alert.read ? (alert.severity === 'CRITICAL' ? 'rgba(197, 48, 48, 0.4)' : 'var(--sage-400)') : 'var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: alert.severity === 'CRITICAL' ? '#c53030' : (alert.severity === 'HIGH' ? '#c85a17' : (alert.severity === 'CAUTION' ? '#b57a1b' : 'var(--sage-500)')),
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {alert.severity === 'CRITICAL' ? <ShieldAlert size={22} /> : <Flame size={22} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {alert.userName || 'Assigned Worker'}: {alert.title}
                    </span>
                    <StatusBadge status={alert.severity} size="sm" />
                    {!alert.read && (
                      <span style={{ fontSize: '10px', background: '#191c1a', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        PENDING ACTION
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '700px' }}>
                    {alert.message}
                  </p>
                  {alert.actionRequired && (
                    <div style={{ fontSize: '12px', color: 'var(--sage-800)', fontWeight: 600, marginTop: '4px' }}>
                      Directive: {alert.actionRequired}
                    </div>
                  )}
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

                {!alert.read ? (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="btn-primary"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                  >
                    <Check size={14} /> Dispatch Action
                  </button>
                ) : (
                  <span style={{ fontSize: '12px', color: '#3b7b4d', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <CheckCircle2 size={14} /> Resolved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
