import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, ShieldAlert, Cpu } from 'lucide-react';
import { useAuth } from '../../services/auth/AuthContext';
import { useHealthData } from '../../services/health/HealthDataContext';

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title, subtitle }) => {
  const { user } = useAuth();
  const { unreadAlertCount, device } = useHealthData();
  const navigate = useNavigate();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '24px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}
    >
      {/* Title / Greetings */}
      <div>
        {title ? (
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h1>
            {subtitle && <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>{subtitle}</p>}
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {formattedDate}
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              Good {new Date().getHours() < 12 ? 'morning' : (new Date().getHours() < 17 ? 'afternoon' : 'evening')}, {user?.name?.split(' ')[0] || 'User'}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Here's your real-time heat health overview for today.
            </p>
          </div>
        )}
      </div>

      {/* Right Action Icons & Hardware Sync Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Device connectivity status pill */}
        <div
          onClick={() => navigate('/app/device')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
          }}
        >
          <Cpu size={14} color="var(--sage-600)" />
          <span>{device?.model || 'HeatGuard Band'}</span>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b7b4d' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{device?.batteryLevel || 78}%</span>
        </div>

        {/* Quick Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search biomarkers..."
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '130px', fontFamily: 'var(--font-main)' }}
          />
        </div>

        {/* Alert Bell */}
        <button
          onClick={() => navigate(user?.role === 'MANAGER' ? '/manager/alerts' : '/app/alerts')}
          style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Bell size={18} color="var(--text-primary)" />
          {unreadAlertCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--risk-critical)',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff'
              }}
            >
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* Quick Emergency SOS button */}
        {user?.role === 'USER' && (
          <button
            onClick={() => navigate('/app/emergency')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--risk-critical-bg)',
              color: 'var(--risk-critical)',
              border: '1px solid rgba(197, 48, 48, 0.2)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <ShieldAlert size={14} />
            <span>SOS</span>
          </button>
        )}

        {/* User Avatar */}
        <div
          onClick={() => navigate('/app/profile')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#191c1a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
        </div>
      </div>
    </header>
  );
};
