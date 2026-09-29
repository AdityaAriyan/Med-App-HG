import React from 'react';
import { AlertTriangle, RefreshCw, Inbox } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading health telemetry...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          border: '3px solid #e2ebe4',
          borderTopColor: '#6f8e75',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '16px'
        }}
      />
      <p style={{ fontSize: '14px', fontWeight: 500 }}>{message}</p>
    </div>
  );
};

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({
  title = 'No records available',
  description = 'No telemetry or assessment records found for this period.',
  actionText,
  onAction
}) => {
  return (
    <div
      className="nura-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--sage-50)',
          color: 'var(--sage-600)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}
      >
        <Inbox size={24} />
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>{title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '380px', marginBottom: actionText ? '20px' : 0 }}>
        {description}
      </p>
      {actionText && onAction && (
        <button className="btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Unable to load health stream',
  message = 'We encountered an issue syncing with the telemetry engine. Please try again.',
  onRetry
}) => {
  return (
    <div
      className="nura-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        borderColor: 'rgba(197, 48, 48, 0.2)'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--risk-critical-bg)',
          color: 'var(--risk-critical)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}
      >
        <AlertTriangle size={24} />
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', color: 'var(--risk-critical)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: onRetry ? '20px' : 0 }}>
        {message}
      </p>
      {onRetry && (
        <button className="btn-outline" onClick={onRetry}>
          <RefreshCw size={14} /> Retry Sync
        </button>
      )}
    </div>
  );
};
