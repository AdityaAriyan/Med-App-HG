import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../services/database/db';
import { DotMatrixDisplay } from '../../components/common/DotMatrixDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { HeatRiskRadarChart } from '../../components/health/HeatRiskRadarChart';
import { HumanBodyVisualization } from '../../components/health/HumanBodyVisualization';
import { TrendChart } from '../../components/health/TrendChart';
import { LoadingState, ErrorState } from '../../components/common/StateFeedback';
import { ArrowLeft, Heart, Thermometer, Wind, ShieldAlert } from 'lucide-react';
import type { UserProfile, HealthTelemetry, RiskAssessment, DeviceInfo } from '../../types';

export const ManagerWorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [worker, setWorker] = useState<UserProfile | null>(null);
  const [telemetry, setTelemetry] = useState<HealthTelemetry | null>(null);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [history, setHistory] = useState<HealthTelemetry[]>([]);
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkerTelemetry() {
      if (!id) return;
      try {
        const user = await db.getById('users', id);
        if (!user) {
          setLoading(false);
          return;
        }
        setWorker(user);

        const [telemList, riskList, devList] = await Promise.all([
          db.getByIndex('health_data', 'userId', id),
          db.getByIndex('risk_assessments', 'userId', id),
          db.getByIndex('devices', 'userId', id)
        ]);

        telemList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        riskList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setTelemetry(telemList[0] || null);
        setAssessment(riskList[0] || null);
        setHistory(telemList);
        setDevice(devList[0] || null);
      } catch (err) {
        console.error('Failed to load worker details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadWorkerTelemetry();
  }, [id]);

  if (loading) return <LoadingState message="Connecting to worker telemetry stream..." />;
  if (!worker) return <ErrorState title="Worker Not Found" message="The requested worker profile could not be located." onRetry={() => navigate('/manager/workers')} />;

  const hr = telemetry?.heartRate || 80;
  const spo2 = telemetry?.spo2 || 98;
  const skinTemp = telemetry?.skinTemperature || 36.8;
  const ambTemp = telemetry?.ambientTemperature || 32.0;
  const humidity = telemetry?.humidity || 52;
  const risk = assessment?.heatRisk || 24;
  const riskLvl = assessment?.riskLevel || 'LOW';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back Button & Worker Profile Header */}
      <div className="nura-card" style={{ padding: '24px 28px' }}>
        <button
          onClick={() => navigate('/manager/workers')}
          className="btn-outline"
          style={{ marginBottom: '16px', padding: '6px 12px', fontSize: '12px' }}
        >
          <ArrowLeft size={14} /> Back to Fleet Roster
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#191c1a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '20px'
              }}
            >
              {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{worker.name}</h2>
                <StatusBadge status={riskLvl} />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {worker.department} · {worker.jobTitle || 'Field Specialist'} · Band: <code style={{ fontFamily: 'var(--font-digital)' }}>{device?.deviceSerial || 'HG-EDGE-v2-4821'}</code>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last Synchronization</div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{telemetry ? new Date(telemetry.timestamp).toLocaleTimeString() : 'Live'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Large Digital Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={16} color="var(--sage-600)" />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Heart Rate</span>
            </div>
            <StatusBadge status={hr > 105 ? 'HIGH' : 'LOW'} size="sm" />
          </div>
          <div style={{ margin: '12px 0 4px' }}>
            <DotMatrixDisplay value={hr} unit="BPM" size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SpO2: <strong>{spo2}%</strong></span>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Thermometer size={16} color="var(--sage-600)" />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Skin Temp</span>
            </div>
            <StatusBadge status={skinTemp > 37.5 ? 'CAUTION' : 'LOW'} size="sm" />
          </div>
          <div style={{ margin: '12px 0 4px' }}>
            <DotMatrixDisplay value={skinTemp} unit="°C" size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Epidermal IR channel</span>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wind size={16} color="var(--sage-600)" />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Microclimate</span>
            </div>
            <StatusBadge status={ambTemp > 35 ? 'HIGH' : 'LOW'} size="sm" />
          </div>
          <div style={{ margin: '12px 0 4px' }}>
            <DotMatrixDisplay value={ambTemp} unit="°C" size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>RH: <strong>{humidity}%</strong></span>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} color={riskLvl === 'CRITICAL' ? '#c53030' : 'var(--sage-600)'} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Heat Risk Index</span>
            </div>
            <StatusBadge status={riskLvl} size="sm" />
          </div>
          <div style={{ margin: '12px 0 4px' }}>
            <DotMatrixDisplay value={risk} unit="/ 100" size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Reserve: <strong>{assessment?.heatReserve || 76}%</strong></span>
        </div>
      </div>

      {/* Visual Models: Human Body Mesh + 5D Radar Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        <HumanBodyVisualization telemetry={telemetry} />

        <div className="nura-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Worker 5D Heat Strain Radar</h3>
              <StatusBadge status={riskLvl} size="sm" />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Multi-axis physiological and environmental burden assessment
            </p>
            {assessment && <HeatRiskRadarChart dimensions={assessment.dimensions} size={280} />}
          </div>

          {assessment && (
            <div style={{ padding: '12px 16px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', marginTop: '16px', fontSize: '13px' }}>
              <strong>AI Recommendation: </strong> {assessment.recommendation}
            </div>
          )}
        </div>
      </div>

      {/* Continuous History Waveform */}
      <TrendChart data={history} title={`24-Hour Telemetry Record — ${worker.name}`} />
    </div>
  );
};
