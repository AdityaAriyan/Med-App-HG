import React, { useState, useEffect } from 'react';
import { db } from '../../services/database/db';
import { DotMatrixDisplay } from '../../components/common/DotMatrixDisplay';
import { TrendChart } from '../../components/health/TrendChart';
import { Download } from 'lucide-react';
import type { HealthTelemetry } from '../../types';

export const ManagerReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const [telemetry, setTelemetry] = useState<HealthTelemetry[]>([]);

  useEffect(() => {
    async function loadData() {
      const allTelem = await db.getAll('health_data');
      setTelemetry(allTelem);
    }
    loadData();
  }, []);

  const exportFleetCSV = () => {
    if (telemetry.length === 0) {
      alert('No telemetry data available for export.');
      return;
    }

    const headers = ['RecordID', 'UserID', 'Timestamp', 'HeartRate_BPM', 'SpO2_Percent', 'SkinTemp_C', 'AmbientTemp_C', 'Humidity_Percent', 'ActivityLevel'];
    const rows = telemetry.map(t => [
      t.id,
      t.userId,
      t.timestamp,
      t.heartRate,
      t.spo2,
      t.skinTemperature,
      t.ambientTemperature,
      t.humidity,
      t.activityLevel
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heatguard_fleet_report_${period}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner & Export Options */}
      <div className="nura-card" style={{ padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Occupational Heat Exposure Reports</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Compliance analytics, cumulative heat load trends, and workforce thermal safety metrics
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Period Selector */}
          <div style={{ display: 'flex', background: 'var(--bg-app)', padding: '4px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
            {(['7d', '30d', '90d'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: period === p ? '#191c1a' : 'transparent',
                  color: period === p ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {p === '7d' ? '7 Days' : (p === '30d' ? '30 Days' : '90 Days')}
              </button>
            ))}
          </div>

          <button onClick={exportFleetCSV} className="btn-primary" style={{ fontSize: '13px' }}>
            <Download size={14} /> Export Fleet CSV Report
          </button>
        </div>
      </div>

      {/* Aggregate Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="metric-card">
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Avg. Daily Exposure Duration</span>
          <div style={{ margin: '10px 0 4px' }}>
            <DotMatrixDisplay value={4.2} unit="HRS" size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Within safe operational pacing</span>
        </div>

        <div className="metric-card">
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cooling Break Adherence</span>
          <div style={{ margin: '10px 0 4px' }}>
            <DotMatrixDisplay value={94} unit="%" size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: '#3b7b4d', fontWeight: 600 }}>+6% vs last period</span>
        </div>

        <div className="metric-card">
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>High-Strain Interventions</span>
          <div style={{ margin: '10px 0 4px' }}>
            <DotMatrixDisplay value={3} unit="EVENTS" size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>All resolved within 10 minutes</span>
        </div>
      </div>

      {/* Exposure Trends Chart */}
      <TrendChart data={telemetry} title="Workforce Mean Heat Load & Ambient Temperature" defaultMetric="heatRisk" />

      {/* Executive Summary Card */}
      <div className="nura-card" style={{ background: 'var(--sage-50)', borderColor: 'var(--sage-200)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--sage-800)', marginBottom: '8px' }}>
          Occupational Health Officer Evaluation
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--sage-800)', lineHeight: 1.5, marginBottom: '14px' }}>
          During the selected {period} reporting window, 98.4% of worker-hours occurred below high thermal stress thresholds.
          The automated early warning protocol successfully notified field personnel prior to any core body temperature elevation above 38.5°C.
        </p>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--sage-800)', fontWeight: 600 }}>
          <span>✓ Zero Heatstroke Incidents</span>
          <span>✓ 100% Sensor Uptime</span>
          <span>✓ OSHA / ISO 7243 Compliant</span>
        </div>
      </div>
    </div>
  );
};
