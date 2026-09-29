import React from 'react';

interface HeatRiskRadarChartProps {
  dimensions: {
    heatLoad: number;
    physiologicalStress: number;
    activityStress: number;
    exposureIndex: number;
    recoveryCapacity: number;
  };
  size?: number;
  className?: string;
}

export const HeatRiskRadarChart: React.FC<HeatRiskRadarChartProps> = ({
  dimensions,
  size = 280,
  className = ''
}) => {
  const axes = [
    { key: 'heatLoad', label: 'Heat Load', value: dimensions.heatLoad },
    { key: 'physiologicalStress', label: 'Physio Stress', value: dimensions.physiologicalStress },
    { key: 'activityStress', label: 'Activity', value: dimensions.activityStress },
    { key: 'exposureIndex', label: 'Exposure', value: dimensions.exposureIndex },
    { key: 'recoveryCapacity', label: 'Recovery', value: dimensions.recoveryCapacity }
  ];

  const count = axes.length;
  const center = size / 2;
  const radius = size * 0.38;

  // Compute point on radar grid
  const getCoordinates = (value: number, index: number, maxVal = 100) => {
    const angle = (Math.PI * 2 / count) * index - Math.PI / 2;
    const r = (value / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Polygon points
  const points = axes.map((a, i) => {
    const { x, y } = getCoordinates(a.value, i);
    return `${x},${y}`;
  }).join(' ');

  // Web rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className={`flex-center flex-col ${className}`} style={{ width: '100%', position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6f8e75" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6f8e75" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Concentric Polygonal Background Rings */}
        {rings.map((ring, rIdx) => {
          const ringPoints = axes.map((_, i) => {
            const { x, y } = getCoordinates(ring * 100, i);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={rIdx}
              points={ringPoints}
              fill="none"
              stroke="#e2e8e3"
              strokeWidth={rIdx === rings.length - 1 ? '1.5' : '1'}
              strokeDasharray={rIdx < rings.length - 1 ? '2,3' : undefined}
            />
          );
        })}

        {/* Radial Axis Spokes */}
        {axes.map((a, i) => {
          const { x, y, angle } = getCoordinates(100, i);
          // Label coordinate slightly outside
          const labelDist = radius + 24;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);

          return (
            <g key={a.key}>
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#d3ded5"
                strokeWidth="1"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  fill: 'var(--text-secondary)',
                  fontFamily: 'var(--font-main)'
                }}
              >
                {a.label}
              </text>
            </g>
          );
        })}

        {/* Data Shape Polygon */}
        <polygon
          points={points}
          fill="url(#radarFill)"
          stroke="#6f8e75"
          strokeWidth="2.5"
          style={{ transition: 'all 0.4s ease' }}
        />

        {/* Point Markers */}
        {axes.map((a, i) => {
          const { x, y } = getCoordinates(a.value, i);
          return (
            <g key={`marker-${a.key}`}>
              <circle cx={x} cy={y} r="5" fill="#191c1a" stroke="#ffffff" strokeWidth="2" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
