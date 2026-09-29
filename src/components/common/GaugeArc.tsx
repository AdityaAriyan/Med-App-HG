import React from 'react';

interface GaugeArcProps {
  value: number; // 0 to 100
  label?: string;
  subLabel?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  displayValue?: string | number;
  unit?: string;
}

export const GaugeArc: React.FC<GaugeArcProps> = ({
  value,
  label,
  subLabel,
  size = 240,
  strokeWidth = 14,
  trackColor = '#e3e8e2',
  displayValue,
  unit
}) => {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2 + 10;

  // Arc angles (180 degree semi-circle from 180 to 0 deg)
  const clamped = Math.max(0, Math.min(100, value));
  const angle = (clamped / 100) * 180;

  // Calculate needle/progress end coordinate
  const rad = ((180 - angle) * Math.PI) / 180;
  const needleX = cx + (radius - 12) * Math.cos(rad);
  const needleY = cy - (radius - 12) * Math.sin(rad);

  // SVG Arc paths
  const startX = cx - radius;
  const endX = cx + radius;
  const trackPath = `M ${startX} ${cy} A ${radius} ${radius} 0 0 1 ${endX} ${cy}`;

  // Progress arc
  const pRad = ((180 - angle) * Math.PI) / 180;
  const pEndX = cx + radius * Math.cos(pRad);
  const pEndY = cy - radius * Math.sin(pRad);
  const progressPath = `M ${startX} ${cy} A ${radius} ${radius} 0 0 1 ${pEndX} ${pEndY}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.7}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8ea890" />
            <stop offset="70%" stopColor="#6f8e75" />
            <stop offset="100%" stopColor="#4e6d54" />
          </linearGradient>
          <linearGradient id="needleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#191c1a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#191c1a" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress */}
        {clamped > 0 && (
          <path
            d={progressPath}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ transition: 'all 0.5s ease' }}
          />
        )}

        {/* Subtle radial spokes / indicator lines */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const tRad = ((180 - (tick / 100) * 180) * Math.PI) / 180;
          const x1 = cx + (radius - 22) * Math.cos(tRad);
          const y1 = cy - (radius - 22) * Math.sin(tRad);
          const x2 = cx + (radius - 28) * Math.cos(tRad);
          const y2 = cy - (radius - 28) * Math.sin(tRad);
          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#b5c0b6"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}

        {/* Center needle line */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#191c1a"
          strokeWidth="2"
          strokeDasharray="3,3"
          style={{ transition: 'all 0.5s ease' }}
        />
        <circle cx={cx} cy={cy} r="5" fill="#191c1a" />
        <circle cx={needleX} cy={needleY} r="4" fill="#6f8e75" />
      </svg>

      {/* Numerical overlay inside gauge */}
      <div
        style={{
          marginTop: '-42px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#191c1a', lineHeight: 1 }}>
            {displayValue !== undefined ? displayValue : value}
          </span>
          {unit && <span style={{ fontSize: '14px', fontWeight: 600, color: '#68726b' }}>{unit}</span>}
        </div>
        {label && <span style={{ fontSize: '13px', fontWeight: 600, color: '#191c1a', marginTop: '2px' }}>{label}</span>}
        {subLabel && <span style={{ fontSize: '12px', color: '#8d9790' }}>{subLabel}</span>}
      </div>
    </div>
  );
};
