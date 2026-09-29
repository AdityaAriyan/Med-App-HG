import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/database/db';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, Eye } from 'lucide-react';
import type { UserProfile, HealthTelemetry, RiskAssessment } from '../../types';

interface WorkerRow {
  user: UserProfile;
  latestTelemetry?: HealthTelemetry;
  latestAssessment?: RiskAssessment;
}

export const ManagerWorkersPage: React.FC = () => {
  const [workers, setWorkers] = useState<WorkerRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'LOW' | 'CAUTION' | 'HIGH' | 'CRITICAL'>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadWorkers() {
      const users = await db.getAll('users');
      const regular = users.filter(u => u.role === 'USER');

      const rows: WorkerRow[] = await Promise.all(
        regular.map(async u => {
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
      setWorkers(rows);
    }
    loadWorkers();
  }, []);

  const filtered = workers.filter(w => {
    const matchesSearch =
      w.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.user.department && w.user.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (w.user.jobTitle && w.user.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const currentRisk = w.latestAssessment?.riskLevel || 'LOW';
    const matchesRisk = riskFilter === 'ALL' || currentRisk === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Filter & Search Bar */}
      <div className="nura-card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Monitored Worker Fleet</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time heat risk index and physiological status across assigned field workforce
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by worker name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '180px', fontFamily: 'var(--font-main)' }}
            />
          </div>

          {/* Risk Level Filter */}
          <div style={{ display: 'flex', background: 'var(--bg-app)', padding: '4px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
            {(['ALL', 'CRITICAL', 'HIGH', 'CAUTION', 'LOW'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: riskFilter === lvl ? '#191c1a' : 'transparent',
                  color: riskFilter === lvl ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workers Roster Table */}
      <div className="nura-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Worker</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Heat Risk</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Heart Rate</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>SpO2</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Skin Temp</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Last Sync</th>
              <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(w => {
              const risk = w.latestAssessment;
              const telem = w.latestTelemetry;
              const riskLvl = risk?.riskLevel || 'LOW';

              return (
                <tr
                  key={w.user.id}
                  onClick={() => navigate(`/manager/workers/${w.user.id}`)}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-app)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
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
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{w.user.department || 'Operations'}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusBadge status={riskLvl} size="sm" />
                      <span style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'var(--font-digital)' }}>
                        {risk?.heatRisk || 22}
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: '16px 16px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, fontFamily: 'var(--font-digital)' }}>
                      {telem?.heartRate || 80} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-main)' }}>BPM</span>
                    </span>
                  </td>

                  <td style={{ padding: '16px 16px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, fontFamily: 'var(--font-digital)' }}>
                      {telem?.spo2 || 98}%
                    </span>
                  </td>

                  <td style={{ padding: '16px 16px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, fontFamily: 'var(--font-digital)' }}>
                      {telem?.skinTemperature || 36.8} °C
                    </span>
                  </td>

                  <td style={{ padding: '16px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {telem ? new Date(telem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                  </td>

                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      className="btn-outline"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/manager/workers/${w.user.id}`);
                      }}
                    >
                      <Eye size={14} /> Telemetry
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
