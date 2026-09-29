import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/database/db';
import { DotMatrixDisplay } from '../../components/common/DotMatrixDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { calculateWBGT, calculateHeatIndex } from '../../services/health/heatCalculations';
import { Users, AlertTriangle, ShieldAlert, ArrowRight, Sun } from 'lucide-react';
import type { UserProfile, HealthTelemetry, RiskAssessment, AlertRecord } from '../../types';

interface WorkerStatusSummary {
  user: UserProfile;
  latestTelemetry?: HealthTelemetry;
  latestAssessment?: RiskAssessment;
}

export const ManagerOverviewPage: React.FC = () => {
  const [workers, setWorkers] = useState<WorkerStatusSummary[]>([]);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const users = await db.getAll('users');
        const regularUsers = users.filter(u => u.role === 'USER');

        const workerSummaries: WorkerStatusSummary[] = await Promise.all(
          regularUsers.map(async (u) => {
            const telemetryList = await db.getByIndex('health_data', 'userId', u.id);
            const riskList = await db.getByIndex('risk_assessments', 'userId', u.id);
            
            telemetryList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            riskList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            return {
              user: u,
              latestTelemetry: telemetryList[0],
              latestAssessment: riskList[0]
            };
          })
        );

        const allAlerts = await db.getAll('alerts');
        allAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setWorkers(workerSummaries);
        setAlerts(allAlerts);
      } catch (e) {
        console.error('Error loading manager overview:', e);
      }
    }

    loadData();
  }, []);

  // Risk Distribution Counts
  const total = workers.length;
  const critical = workers.filter(w => w.latestAssessment?.riskLevel === 'CRITICAL').length;
  const high = workers.filter(w => w.latestAssessment?.riskLevel === 'HIGH').length;
  const caution = workers.filter(w => w.latestAssessment?.riskLevel === 'CAUTION').length;
  const low = workers.filter(w => w.latestAssessment?.riskLevel === 'LOW' || !w.latestAssessment).length;

  // Environmental conditions
  const ambTemp = 33.5;
  const humidity = 58;
  const wbgt = calculateWBGT(ambTemp, humidity);
  const heatIdx = calculateHeatIndex(ambTemp, humidity);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top 4 Fleet Overview Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--sage-50)', color: 'var(--sage-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Monitored Workers</span>
            </div>
            <span className="status-chip low">Active Fleet</span>
          </div>
          <div style={{ margin: '14px 0 6px' }}>
            <DotMatrixDisplay value={total} size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{low} low risk, {caution} caution</span>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--risk-critical-bg)', color: 'var(--risk-critical)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldAlert size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Critical / High Risk</span>
            </div>
            <StatusBadge status={critical > 0 ? 'CRITICAL' : (high > 0 ? 'HIGH' : 'LOW')} size="sm" />
          </div>
          <div style={{ margin: '14px 0 6px' }}>
            <DotMatrixDisplay value={critical + high} size="lg" dotColor={critical > 0 ? '#c53030' : (high > 0 ? '#c85a17' : '#191c1a')} />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{critical} critical, {high} high strain</span>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--sage-50)', color: 'var(--sage-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sun size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Site WBGT Index</span>
            </div>
            <StatusBadge status={wbgt > 30 ? 'HIGH' : 'CAUTION'} label={`${wbgt} °C`} size="sm" />
          </div>
          <div style={{ margin: '14px 0 6px' }}>
            <DotMatrixDisplay value={wbgt} unit="°C" size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Heat Index: {heatIdx}°C</span>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--risk-caution-bg)', color: 'var(--risk-caution)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Active Fleet Alerts</span>
            </div>
            <span className="status-chip dark">{alerts.filter(a => !a.read).length} Unread</span>
          </div>
          <div style={{ margin: '14px 0 6px' }}>
            <DotMatrixDisplay value={alerts.length} size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Across all work zones</span>
        </div>
      </div>

      {/* Middle Row: Live Worker Risk Roster + Microclimate Zone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
        {/* Live Worker Fleet Roster */}
        <div className="nura-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sage-600)', textTransform: 'uppercase' }}>
                Assigned Personnel Telemetry
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>Live Worker Status Roster</h3>
            </div>
            <button onClick={() => navigate('/manager/workers')} className="btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>
              View Full Table <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {workers.map(w => {
              const risk = w.latestAssessment;
              const telem = w.latestTelemetry;
              const riskScore = risk?.heatRisk || 22;
              const riskLvl = risk?.riskLevel || 'LOW';

              return (
                <div
                  key={w.user.id}
                  onClick={() => navigate(`/manager/workers/${w.user.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#191c1a',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '13px'
                      }}
                    >
                      {w.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{w.user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{w.user.department}</div>
                    </div>
                  </div>

                  {/* Telemetry Pills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Heart Rate</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-digital)' }}>
                        {telem?.heartRate || 80} BPM
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Skin Temp</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-digital)' }}>
                        {telem?.skinTemperature || 36.8} °C
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Heat Risk</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'var(--font-digital)' }}>
                        {riskScore} / 100
                      </div>
                    </div>

                    <StatusBadge status={riskLvl} size="sm" />
                    <ArrowRight size={16} color="var(--text-muted)" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Microclimate Environmental Station */}
        <div className="nura-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sage-600)', textTransform: 'uppercase' }}>
                  Microclimate Station
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Worksite Weather</h3>
              </div>
              <span className="status-chip caution">Caution Zone</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '14px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Ambient Temperature</span>
                <strong style={{ fontSize: '14px' }}>{ambTemp} °C</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Relative Humidity</span>
                <strong style={{ fontSize: '14px' }}>{humidity}% RH</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Calculated WBGT</span>
                <strong style={{ fontSize: '14px', color: 'var(--risk-caution)' }}>{wbgt} °C</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Recommended Policy</span>
                <strong style={{ fontSize: '13px' }}>45m work / 15m shade</strong>
              </div>
            </div>
          </div>

          <button onClick={() => navigate('/manager/environment')} className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
            <span>Inspect Microclimate Zones</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
