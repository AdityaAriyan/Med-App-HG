import React, { useState } from 'react';
import type { HealthTelemetry } from '../../types';

interface TrendChartProps {
  data: HealthTelemetry[];
  defaultMetric?: 'heatRisk' | 'heartRate' | 'skinTemperature' | 'ambientTemperature' | 'spo2';
  title?: string;
  className?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  defaultMetric = 'heatRisk',
  title = 'Health & Heat Risk Trend',
  className = ''
}) => {
  const [selectedMetric, setSelectedMetric] = useState(defaultMetric);
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('today');

  const metricConfigs = {
    heatRisk: { label: 'Heat Risk Index', unit: 'Risk', color: '#c85a17', min: 0, max: 100 },
    heartRate: { label: 'Heart Rate', unit: 'BPM', color: '#3b7b4d', min: 50, max: 160 },
    skinTemperature: { label: 'Skin Temperature', unit: '°C', color: '#6f8e75', min: 35.0, max: 40.0 },
    ambientTemperature: { label: 'Ambient Temp', unit: '°C', color: '#b57a1b', min: 20.0, max: 45.0 },
    spo2: { label: 'SpO2 Saturation', unit: '%', color: '#2d6a4f', min: 90, max: 100 }
  };

  const currentCfg = metricConfigs[selectedMetric];

  // Extract points based on range and metric
  let displayPoints = [...data];
  if (displayPoints.length === 0) {
    // Generate fallback smooth points if history is initializing
    const now = Date.now();
    displayPoints = Array.from({ length: 12 }).map((_, i) => ({
      id: `fallback-${i}`,
      userId: 'usr-demo',
      timestamp: new Date(now - (12 - i) * 3600000).toISOString(),
      heartRate: 78 + Math.round(Math.sin(i * 0.5) * 8),
      spo2: 98,
      skinTemperature: 36.6 + parseFloat((Math.sin(i * 0.4) * 0.4).toFixed(1)),
      ambientTemperature: 30 + Math.round(Math.sin(i * 0.3) * 4),
      humidity: 50,
      activityLevel: 'MODERATE',
      stepCountToday: 3000,
      activeMinutesToday: 40,
      restMinutesToday: 120,
      motionSleepEstimateHours: 7.2
    }));
  }

  const values: number[] = displayPoints.map(p => {
    if (selectedMetric === 'heatRisk') {
      // Estimated risk score
      const hrScore = Math.max(0, (p.heartRate - 70) * 0.6);
      const stScore = Math.max(0, (p.skinTemperature - 36.5) * 18);
      const atScore = Math.max(0, (p.ambientTemperature - 26) * 1.8);
      return Math.round(Math.min(95, Math.max(10, hrScore + stScore + atScore + 10)));
    }
    return p[selectedMetric];
  });

  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const minVal = currentCfg.min;
  const maxVal = currentCfg.max;

  // Convert array of values to SVG coordinates
  const coords = values.map((val, idx) => {
    const x = paddingX + (idx / (values.length - 1 || 1)) * (width - paddingX * 2);
    const normalizedY = (val - minVal) / (maxVal - minVal || 1);
    const y = height - paddingY - normalizedY * (height - paddingY * 2);
    return { x, y, val, time: displayPoints[idx].timestamp };
  });

  // Build SVG path
  let pathD = '';
  if (coords.length > 0) {
    pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = (prev.x + curr.x) / 2;
      pathD += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
  }

  const areaD = coords.length > 0
    ? `${pathD} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`
    : '';

  const latestVal = values[values.length - 1] ?? 0;

  return (
    <div className={`nura-card ${className}`}>
      {/* Top Header & Metric Selectors */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--sage-600)', textTransform: 'uppercase' }}>
            Historical Telemetry
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>{title}</h3>
        </div>

        {/* Time range toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-app)', padding: '4px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-subtle)' }}>
          {(['today', '7d', '30d'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: timeRange === t ? '#191c1a' : 'transparent',
                color: timeRange === t ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              {t === 'today' ? 'Today' : (t === '7d' ? '7 Days' : '30 Days')}
            </button>
          ))}
        </div>
      </div>

      {/* Metric selection pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px' }}>
        {(Object.keys(metricConfigs) as (keyof typeof metricConfigs)[]).map(key => {
          const cfg = metricConfigs[key];
          const isSelected = selectedMetric === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                fontWeight: 600,
                border: isSelected ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                background: isSelected ? '#191c1a' : '#ffffff',
                color: isSelected ? '#ffffff' : 'var(--text-primary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Chart Canvas */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={`trendGrad-${selectedMetric}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={currentCfg.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={currentCfg.color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = paddingY + ratio * (height - paddingY * 2);
            const valLabel = Math.round(maxVal - ratio * (maxVal - minVal));
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#e8ece8"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fontWeight="500"
                  fill="var(--text-muted)"
                  fontFamily="var(--font-main)"
                >
                  {valLabel}
                </text>
              </g>
            );
          })}

          {/* Gradient Area */}
          {areaD && (
            <path
              d={areaD}
              fill={`url(#trendGrad-${selectedMetric})`}
              style={{ transition: 'all 0.4s ease' }}
            />
          )}

          {/* Curve Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={currentCfg.color}
              strokeWidth="3"
              strokeLinecap="round"
              style={{ transition: 'all 0.4s ease' }}
            />
          )}

          {/* Points */}
          {coords.map((c, i) => {
            const isLast = i === coords.length - 1;
            return (
              <g key={i}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={isLast ? 6 : 3.5}
                  fill={isLast ? currentCfg.color : '#ffffff'}
                  stroke={currentCfg.color}
                  strokeWidth="2"
                />
                {/* Time Axis Labels */}
                {(i === 0 || i === Math.floor(coords.length / 2) || isLast) && (
                  <text
                    x={c.x}
                    y={height - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="500"
                    fill="var(--text-muted)"
                    fontFamily="var(--font-main)"
                  >
                    {new Date(c.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Current Live Reading Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Latest Observation: <strong style={{ color: 'var(--text-primary)' }}>{latestVal} {currentCfg.unit}</strong>
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Updated: Just now · Hardware Simulation Sync
          </span>
        </div>
      </div>
    </div>
  );
};
