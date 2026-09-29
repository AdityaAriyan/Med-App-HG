import React from 'react';
import { useHealthData } from '../../services/health/HealthDataContext';
import { DotMatrixDisplay } from '../../components/common/DotMatrixDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TrendChart } from '../../components/health/TrendChart';
import { LoadingState } from '../../components/common/StateFeedback';
import { Activity, Footprints, Moon, Clock, Flame } from 'lucide-react';

export const UserActivityPage: React.FC = () => {
  const { telemetry, riskAssessment, history } = useHealthData();

  if (!telemetry || !riskAssessment) {
    return <LoadingState message="Loading kinetic and exposure telemetry..." />;
  }

  const { activityLevel, stepCountToday, activeMinutesToday, restMinutesToday, motionSleepEstimateHours } = telemetry;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top 4 Activity Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--sage-50)', color: 'var(--sage-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Footprints size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Step Count</span>
            </div>
            <span className="status-chip low">Daily</span>
          </div>
          <div style={{ margin: '14px 0 6px' }}>
            <DotMatrixDisplay value={stepCountToday} size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target: 8,000 steps</span>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--sage-50)', color: 'var(--sage-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Active Time</span>
            </div>
            <StatusBadge status="LOW" label={activityLevel} size="sm" />
          </div>
          <div style={{ margin: '14px 0 6px' }}>
            <DotMatrixDisplay value={activeMinutesToday} unit="MIN" size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Work-to-Rest ratio: 4:1</span>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--sage-50)', color: 'var(--sage-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Rest / Shade Time</span>
            </div>
            <StatusBadge status="EXCELLENT" label="On Track" size="sm" />
          </div>
          <div style={{ margin: '14px 0 6px' }}>
            <DotMatrixDisplay value={restMinutesToday} unit="MIN" size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Required: 45 min / shift</span>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--sage-50)', color: 'var(--sage-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Moon size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Motion Sleep Est.</span>
            </div>
            <StatusBadge status="GOOD" size="sm" />
          </div>
          <div style={{ margin: '14px 0 6px' }}>
            <DotMatrixDisplay value={motionSleepEstimateHours} unit="HRS" size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Motion-derived estimate</span>
        </div>
      </div>

      {/* Metabolic Heat Production vs Thermal Dissipation Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        <div className="nura-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sage-600)', textTransform: 'uppercase' }}>
                Work-Rest Cycle
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>Thermal Exposure Timeline</h3>
            </div>
            <span className="status-chip low">Shift Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { time: '08:00 - 09:30', title: 'Preparation & Morning Work', zone: 'Warehouse A', load: 'Light', status: 'LOW' },
              { time: '09:30 - 09:45', title: 'Scheduled Hydration & Cooling Break', zone: 'Rest Zone', load: 'Rest', status: 'EXCELLENT' },
              { time: '09:45 - 12:00', title: 'Field Operations & Material Transport', zone: 'Outer Yard (32°C)', load: 'Moderate', status: 'CAUTION' },
              { time: '12:00 - 13:00', title: 'Mid-Shift Recovery & Lunch', zone: 'AC Cafeteria', load: 'Rest', status: 'LOW' },
              { time: '13:00 - Present', title: 'High Ambient Exposure Inspection', zone: 'Loading Bay', load: 'Active', status: 'CAUTION' },
            ].map((slot, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>{slot.time} · {slot.zone}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>{slot.title}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={slot.status as any} label={slot.load} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IMU Motion Kinematics Card */}
        <div className="nura-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Flame size={20} color="var(--sage-600)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Metabolic Heat Rate</h3>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              The 6-axis MPU6050 IMU captures acceleration velocity to derive instantaneous metabolic heat production rates.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Kinetic State</span>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{activityLevel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Est. Metabolic Output</span>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>240 W / m²</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Cooling Rate</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--sage-600)' }}>1.8 °C / hr</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            Sensor hardware: MPU6050 Motion Tracking Core
          </div>
        </div>
      </div>

      <TrendChart data={history} title="Kinetic Intensity & Active Cadence" defaultMetric="heartRate" />
    </div>
  );
};
