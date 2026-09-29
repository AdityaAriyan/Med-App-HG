import React from 'react';
import { useHealthData } from '../../services/health/HealthDataContext';
import { HumanBodyVisualization } from '../../components/health/HumanBodyVisualization';
import { TrendChart } from '../../components/health/TrendChart';
import { LoadingState } from '../../components/common/StateFeedback';
import { DotMatrixDisplay } from '../../components/common/DotMatrixDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Info } from 'lucide-react';

export const UserHealthPage: React.FC = () => {
  const { telemetry, riskAssessment, history } = useHealthData();

  if (!telemetry || !riskAssessment) {
    return <LoadingState message="Loading biological signal channels..." />;
  }

  const { heartRate, spo2, skinTemperature, ambientTemperature } = telemetry;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Human Body Signal Visualization */}
      <HumanBodyVisualization telemetry={telemetry} />

      {/* Health Signals Cards Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="nura-card">
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Optical PPG
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px', marginBottom: '10px' }}>
            Heart Rate
          </div>
          <DotMatrixDisplay value={heartRate} unit="BPM" size="md" dotColor="#191c1a" />
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Continuous</span>
            <StatusBadge status="LOW" label="Stable" size="sm" />
          </div>
        </div>

        <div className="nura-card">
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Pulse Oximetry
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px', marginBottom: '10px' }}>
            Blood Oxygen (SpO2)
          </div>
          <DotMatrixDisplay value={spo2} unit="%" size="md" dotColor="#191c1a" />
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Oxygenation</span>
            <StatusBadge status="EXCELLENT" label="Optimal" size="sm" />
          </div>
        </div>

        <div className="nura-card">
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            IR Epidermal
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px', marginBottom: '10px' }}>
            Skin Temperature
          </div>
          <DotMatrixDisplay value={skinTemperature} unit="°C" size="md" dotColor="#191c1a" />
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Contactless IR</span>
            <StatusBadge status={skinTemperature > 37.5 ? 'CAUTION' : 'LOW'} size="sm" />
          </div>
        </div>

        <div className="nura-card">
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Ambient Exposure
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px', marginBottom: '10px' }}>
            Ambient Temp
          </div>
          <DotMatrixDisplay value={ambientTemperature} unit="°C" size="md" dotColor="#191c1a" />
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Microclimate</span>
            <StatusBadge status={ambientTemperature > 35 ? 'HIGH' : 'LOW'} size="sm" />
          </div>
        </div>
      </div>

      {/* Health Signals Trend Chart */}
      <TrendChart data={history} title="Cardiovascular & Thermal Signal Waveforms" defaultMetric="heartRate" />

      {/* Healthcare Disclaimer Card */}
      <div
        className="nura-card"
        style={{
          background: 'var(--sage-50)',
          borderColor: 'var(--sage-200)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px'
        }}
      >
        <Info size={20} color="var(--sage-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--sage-800)' }}>
            Personalized Early Warning Telemetry Notice
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--sage-800)', marginTop: '4px', opacity: 0.9 }}>
            HeatGuard-Edge provides non-diagnostic physiological monitoring and occupational heat-stress early alerts.
            It does not provide medical diagnosis or replace standard occupational health protocols.
          </p>
        </div>
      </div>
    </div>
  );
};
