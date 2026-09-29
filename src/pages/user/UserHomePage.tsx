import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../../services/health/HealthDataContext';
import { DotMatrixDisplay } from '../../components/common/DotMatrixDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AIInsightCard } from '../../components/health/AIInsightCard';
import { GaugeArc } from '../../components/common/GaugeArc';
import { TrendChart } from '../../components/health/TrendChart';
import { LoadingState } from '../../components/common/StateFeedback';
import { Heart, Thermometer, Wind, Activity, Droplets, ShieldCheck, ArrowRight } from 'lucide-react';

export const UserHomePage: React.FC = () => {
  const { telemetry, riskAssessment, history } = useHealthData();
  const navigate = useNavigate();

  if (!telemetry || !riskAssessment) {
    return <LoadingState message="Connecting to HeatGuard Edge Telemetry Stream..." />;
  }

  const { heartRate, spo2, skinTemperature, ambientTemperature, humidity, activityLevel, activeMinutesToday } = telemetry;
  const { heatRisk, riskLevel, heatReserve, heatDebt, recoveryStatus } = riskAssessment;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Row: Featured Heat Summary (AI Insight) + Primary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
        {/* Featured Nura-style Sage Health Summary Card */}
        <AIInsightCard
          assessment={riskAssessment}
          onExplore={() => navigate('/app/heat-risk')}
        />

        {/* 4 Core Physiological & Environmental Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {/* Heart Rate */}
          <div className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--sage-50)', color: 'var(--sage-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Heart Rate</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MAX30102 PPG</div>
                </div>
              </div>
              <StatusBadge status={heartRate > 105 ? 'HIGH' : 'LOW'} label={heartRate > 105 ? 'Elevated' : 'Optimal'} size="sm" />
            </div>

            <div style={{ margin: '14px 0 6px' }}>
              <DotMatrixDisplay value={heartRate} unit="BPM" size="lg" dotColor="#191c1a" />
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Baseline: 72 BPM</span>
              <span>SpO2: <strong style={{ color: 'var(--text-primary)' }}>{spo2}%</strong></span>
            </div>
          </div>

          {/* Skin Temperature */}
          <div className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--sage-50)', color: 'var(--sage-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Thermometer size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Skin Temp</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MLX90614 IR</div>
                </div>
              </div>
              <StatusBadge status={skinTemperature > 37.5 ? 'CAUTION' : 'LOW'} label={skinTemperature > 37.5 ? 'Warming' : 'Normative'} size="sm" />
            </div>

            <div style={{ margin: '14px 0 6px' }}>
              <DotMatrixDisplay value={skinTemperature} unit="°C" size="lg" dotColor="#191c1a" />
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Baseline: 36.5°C</span>
              <span>Core Delta: +0.3°C</span>
            </div>
          </div>

          {/* Ambient Temperature */}
          <div className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--sage-50)', color: 'var(--sage-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wind size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Ambient Temp</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SHT31 Microclimate</div>
                </div>
              </div>
              <StatusBadge status={ambientTemperature > 35 ? 'HIGH' : (ambientTemperature > 30 ? 'CAUTION' : 'LOW')} size="sm" />
            </div>

            <div style={{ margin: '14px 0 6px' }}>
              <DotMatrixDisplay value={ambientTemperature} unit="°C" size="lg" dotColor="#191c1a" />
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Relative Humidity:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{humidity}% RH</strong>
            </div>
          </div>

          {/* Activity & Hydration Target */}
          <div className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--sage-50)', color: 'var(--sage-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Kinetic Load</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MPU6050 Motion</div>
                </div>
              </div>
              <span className="status-chip dark">{activityLevel}</span>
            </div>

            <div style={{ margin: '14px 0 6px' }}>
              <DotMatrixDisplay value={activeMinutesToday} unit="MIN" size="lg" dotColor="#191c1a" />
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Steps: {telemetry.stepCountToday}</span>
              <span>Rest: {telemetry.restMinutesToday}m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Heat Risk Arch Gauge + Heat Debt Breakdown + Actionable Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '24px' }}>
        {/* Arc Gauge for Heat Reserve */}
        <div className="nura-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sage-600)', textTransform: 'uppercase' }}>
                Thermal Tolerance
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Heat Reserve</h3>
            </div>
            <StatusBadge status={riskLevel} size="sm" />
          </div>

          <div style={{ padding: '12px 0' }}>
            <GaugeArc
              value={heatReserve}
              displayValue={heatReserve}
              unit="%"
              label="Remaining Heat Buffer"
              subLabel="Personalized capacity model"
              size={220}
            />
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', background: 'var(--bg-app)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
            Estimated physiological margin before core heat stress onset.
          </div>
        </div>

        {/* Heat Debt & Recovery Card */}
        <div className="nura-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sage-600)', textTransform: 'uppercase' }}>
                  Cumulative Strain
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Heat Debt</h3>
              </div>
              <StatusBadge status={heatDebt} size="sm" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '14px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Recovery Status</span>
                <StatusBadge status={recoveryStatus} size="sm" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Current Heat Risk</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-digital)' }}>{heatRisk}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Sleep Recovery Est.</span>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{telemetry.motionSleepEstimateHours} hrs</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/heat-risk')}
            className="btn-outline"
            style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
          >
            <span>Inspect 5D Risk Profile</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Operational Safety Recommendation Card */}
        <div className="nura-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(180deg, #ffffff 0%, #f7faf8 100%)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ShieldCheck size={20} color="var(--sage-600)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Actionable Directives</h3>
            </div>

            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: riskLevel === 'CRITICAL' ? 'var(--risk-critical-bg)' : (riskLevel === 'HIGH' ? 'var(--risk-high-bg)' : 'var(--sage-50)'),
                border: `1px solid ${riskLevel === 'CRITICAL' ? 'rgba(197, 48, 48, 0.2)' : 'rgba(111, 142, 117, 0.2)'}`,
                marginBottom: '16px'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: riskLevel === 'CRITICAL' ? 'var(--risk-critical)' : 'var(--sage-800)' }}>
                {riskAssessment.recommendation}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <Droplets size={16} color="#3b7b4d" />
                <span>Hydration target: <strong>250ml every 20 min</strong> in present zone</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <Wind size={16} color="#b57a1b" />
                <span>Next microclimate shade break: <strong>in 35 minutes</strong></span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-muted)' }}>
            <span>Auto-synced with Wearable Band</span>
            <span style={{ color: 'var(--sage-600)', fontWeight: 600 }}>Edge Core v2.4</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: 24-Hour Trend Visualizer */}
      <TrendChart data={history} title="24-Hour Continuous Telemetry Stream" />
    </div>
  );
};
