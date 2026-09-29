import React from 'react';
import type { RiskLevel, HeatDebtLevel, RecoveryStatus } from '../../types';

interface StatusBadgeProps {
  status: RiskLevel | HeatDebtLevel | RecoveryStatus | 'EXCELLENT' | 'GOOD' | 'INCOMPLETE' | 'CONNECTED' | 'DISCONNECTED' | 'SYNCING' | 'OFFLINE' | 'ACTIVE';
  label?: string;
  size?: 'sm' | 'md';
  variant?: 'pill' | 'dot' | 'filled';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  variant = 'pill'
}) => {
  const normalized = status.toUpperCase();

  let chipClass = 'neutral';
  let dotColor = '#68726b';

  if (normalized === 'LOW' || normalized === 'EXCELLENT' || normalized === 'CONNECTED' || normalized === 'ACTIVE') {
    chipClass = 'low';
    dotColor = '#3b7b4d';
  } else if (normalized === 'CAUTION' || normalized === 'MODERATE' || normalized === 'GOOD' || normalized === 'SYNCING') {
    chipClass = 'caution';
    dotColor = '#b57a1b';
  } else if (normalized === 'HIGH' || normalized === 'ELEVATED' || normalized === 'FAIR') {
    chipClass = 'high';
    dotColor = '#c85a17';
  } else if (normalized === 'CRITICAL' || normalized === 'POOR' || normalized === 'OFFLINE') {
    chipClass = 'critical';
    dotColor = '#c53030';
  }

  const displayText = label || status;

  if (variant === 'dot') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: size === 'sm' ? '12px' : '13px', fontWeight: 600 }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor }} />
        {displayText}
      </span>
    );
  }

  return (
    <span
      className={`status-chip ${chipClass}`}
      style={{
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        fontSize: size === 'sm' ? '11px' : '12px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      <span
        style={{
          width: size === 'sm' ? '5px' : '6px',
          height: size === 'sm' ? '5px' : '6px',
          borderRadius: '50%',
          backgroundColor: dotColor
        }}
      />
      {displayText}
    </span>
  );
};
