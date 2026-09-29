import React from 'react';
import { useHealthData } from '../../services/health/HealthDataContext';
import { HeatRiskRadarChart } from '../../components/health/HeatRiskRadarChart';
import { DotMatrixDisplay } from '../../components/common/DotMatrixDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { GaugeArc } from '../../components/common/GaugeArc';
import { LoadingState } from '../../components/common/StateFeedback';
import { Flame, Shield, RefreshCw } from 'lucide-react';

export const UserHeatRiskPage: React.FC = () => {
  const { telemetry, riskAssessment } = useHealthData();

  if (!telemetry || !riskAssessment) {
    return <LoadingState message="Computing multi-dimensional heat risk model..." />;
  }

  const { heatRisk, riskLevel, heatReserve, heatDebt, recoveryStatus, dimensions, aiInsight, recommendation } = riskAssessment;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Row: 5D Radar Spider Chart + Heat Reserve Arch Gauge */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Radar / Spider Chart Card */}
        <div className="nura-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sage-600)', textTransform: 'uppercase' }}>
                  5D Profiling Engine
                </span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Heat Risk Profile</h2>
              </div>
              <StatusBadge status={riskLevel} />
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Multi-axis evaluation combining thermal burden, cardiovascular strain, kinetic output, environmental heat, and recovery.
            </p>

            <HeatRiskRadarChart dimensions={dimensions} size={300} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', background: 'var(--bg-app)', padding: '12px', borderRadius: 'var(--radius-md)', marginTop: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Heat Load</div>
              <strong style={{ fontSize: '14px' }}>{dimensions.heatLoad}%</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Physio Stress</div>
              <strong style={{ fontSize: '14px' }}>{dimensions.physiologicalStress}%</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Activity</div>
              <strong style={{ fontSize: '14px' }}>{dimensions.activityStress}%</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Recovery</div>
              <strong style={{ fontSize: '14px', color: 'var(--sage-600)' }}>{dimensions.recoveryCapacity}%</strong>
            </div>
          </div>
        </div>

        {/* Heat Reserve Capacity Deep Dive */}
        <div className="nura-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sage-600)', textTransform: 'uppercase' }}>
                  Physiological Buffer
                </span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Heat Reserve</h2>
              </div>
              <span className="status-chip low">{heatReserve}% Remaining</span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Heat Reserve represents your current estimated capacity to tolerate ambient thermal stress before critical core heat elevation.
            </p>

            <GaugeArc
              value={heatReserve}
              displayValue={heatReserve}
              unit="%"
              label="Remaining Heat Buffer"
              subLabel="Safe Operational Threshold"
              size={240}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
              <span>Baseline Tolerance</span>
              <strong>High (Adapted)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
              <span>Depletion Rate</span>
              <strong>~4.2% / hour under direct sun</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Heat Debt & Cumulative Thermal Burden */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {/* Heat Debt Card */}
        <div className="nura-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="var(--risk-high)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Heat Debt</h3>
            </div>
            <StatusBadge status={heatDebt} size="sm" />
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '14px' }}>
            Accumulated incomplete cooling and thermal burden accrued during active shifts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Today's Exposure:</span>
              <strong>3.8 hrs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cooling Breaks Taken:</span>
              <strong>3 intervals</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cumulative Debt:</span>
              <strong style={{ color: heatDebt === 'LOW' ? 'var(--risk-low)' : 'var(--risk-caution)' }}>{heatDebt}</strong>
            </div>
          </div>
        </div>

        {/* Real-Time Risk Score */}
        <div className="nura-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--sage-600)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Current Heat Risk</h3>
            </div>
            <StatusBadge status={riskLevel} size="sm" />
          </div>

          <div style={{ margin: '14px 0' }}>
            <DotMatrixDisplay value={heatRisk} unit="/ 100" size="xl" dotColor="#191c1a" />
          </div>

          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Calculated from optical pulse wave, epidermal thermography, and microclimate ambient humidity.
          </p>
        </div>

        {/* Recovery Capacity */}
        <div className="nura-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={18} color="var(--sage-600)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Thermal Recovery</h3>
            </div>
            <StatusBadge status={recoveryStatus} size="sm" />
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '14px' }}>
            Cardiovascular return-to-resting baseline rate following high exertion in warm ambient conditions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Recovery Efficiency:</span>
              <strong style={{ color: 'var(--sage-600)' }}>88% Optimal</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cooldown Half-Life:</span>
              <strong>8.5 mins</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Post-Break Status:</span>
              <strong>Equilibrated</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory AI Insights Card */}
      <div className="nura-card" style={{ background: 'var(--sage-50)', borderColor: 'var(--sage-200)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--sage-800)', marginBottom: '8px' }}>
          Personalized Risk Assessment Analysis
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--sage-800)', lineHeight: 1.5, marginBottom: '12px' }}>
          {aiInsight}
        </p>
        <div style={{ padding: '10px 14px', background: '#ffffff', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
          <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>Target Directive: </strong>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{recommendation}</span>
        </div>
      </div>
    </div>
  );
};
