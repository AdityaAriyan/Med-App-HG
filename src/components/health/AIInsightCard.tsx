import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { DotMatrixDisplay } from '../common/DotMatrixDisplay';
import type { RiskAssessment } from '../../types';

interface AIInsightCardProps {
  assessment: RiskAssessment | null;
  className?: string;
  onExplore?: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  assessment,
  className = '',
  onExplore
}) => {
  const score = assessment ? assessment.heatReserve : 76;
  const statusLabel = assessment ? assessment.recoveryStatus : 'EXCELLENT';
  const insight = assessment?.aiInsight ||
    'Your heat risk remains within safe thermal equilibrium. Physiological markers indicate excellent recovery capacity and strong cardiovascular buffering.';
  const improvements = assessment?.improvements || [
    { label: 'Cardiovascular recovery', value: '-4 bpm', positive: true },
    { label: 'Skin temp stability', value: 'Optimal', positive: true },
    { label: 'Hydration adherence', value: '+14%', positive: true }
  ];
  const focusAreas = assessment?.focusAreas || [
    { title: 'Afternoon Heat Peak', subtitle: 'Highest solar radiation expected at 14:00' },
    { title: 'Cooling break pacing', subtitle: 'Target 10 min rest per 50 min active work' }
  ];

  return (
    <div
      className={`nura-card-sage ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      {/* Top Bar with Title & Arrow */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ opacity: 0.9 }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em', color: '#ffffff' }}>
              Heat Health Summary
            </h2>
          </div>
          <button
            onClick={onExplore}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.18)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, background 0.2s ease'
            }}
          >
            <ArrowUpRight size={18} />
          </button>
        </div>

        {/* Status Chip & Large Dot-Matrix Score */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85, fontWeight: 700 }}>
              Physiological Buffer
            </div>
            <div style={{ marginTop: '6px' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: '#191c1a',
                  color: '#ffffff',
                  padding: '4px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.02em'
                }}
              >
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Authentic Dot-Matrix Score Presentation like Nura screenshot */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '6px' }}>
              <DotMatrixDisplay
                value={score}
                size="xl"
                dotColor="#ffffff"
                showOffDots={false}
              />
              <span style={{ fontSize: '16px', fontWeight: 600, opacity: 0.85 }}>/ 100</span>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, opacity: 0.85, marginTop: '4px' }}>
              Heat Reserve Capacity
            </div>
          </div>
        </div>

        {/* AI Insight Paragraph */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9, marginBottom: '6px' }}>
            Personalized Heat Risk Estimation
          </div>
          <p style={{ fontSize: '13.5px', lineHeight: 1.5, opacity: 0.95, color: '#f7faf8' }}>
            {insight}
          </p>
        </div>
      </div>

      {/* Improvements & Focus Areas Grid */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          {/* Improvements Column */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.85, marginBottom: '10px' }}>
              Physiological Markers
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {improvements.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-digital)',
                      fontWeight: 700,
                      background: 'rgba(255, 255, 255, 0.2)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      minWidth: '54px',
                      textAlign: 'center'
                    }}
                  >
                    {item.value}
                  </span>
                  <span style={{ opacity: 0.92, fontSize: '12px' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Areas Column */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.85, marginBottom: '10px' }}>
              Operational Directives
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {focusAreas.map((area, i) => (
                <div key={i} style={{ fontSize: '12px' }}>
                  <div style={{ fontWeight: 700, opacity: 0.95 }}>{area.title}</div>
                  <div style={{ opacity: 0.75, fontSize: '11px', marginTop: '1px' }}>{area.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', opacity: 0.65 }}>
          <span>Deterministic Edge Inference Core</span>
          <span>Non-clinical estimation</span>
        </div>
      </div>
    </div>
  );
};
