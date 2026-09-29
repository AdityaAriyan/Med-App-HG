import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';
import { DEMO_PASSWORD } from '../../services/database/seed';
import { ArrowRight, AlertCircle, User, Users, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      if (res.user.role === 'ADMIN') {
        navigate('/admin/overview');
      } else if (res.user.role === 'MANAGER') {
        navigate('/manager/overview');
      } else {
        navigate('/app/home');
      }
    } else {
      setError(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-app)',
        padding: '24px'
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Brand Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: '#191c1a',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '20px',
              marginBottom: '12px'
            }}
          >
            HG
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#191c1a' }}>
            HEATGUARD-EDGE
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Privacy-Preserving Personal Heat-Risk Monitoring Platform
          </p>
        </div>

        {/* Login Form Card */}
        <div className="nura-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>Sign in to your account</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Access continuous physiological and thermal telemetry
          </p>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--risk-critical-bg)',
                border: '1px solid rgba(197, 48, 48, 0.2)',
                color: 'var(--risk-critical)',
                fontSize: '13px',
                marginBottom: '20px'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="input-field"
                style={{ marginTop: '4px' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-field"
                style={{ marginTop: '4px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-dark"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', marginTop: '8px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Demo Account Quick Switcher */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
              Quick Demo Accounts (Password: HeatGuardDemo2026!)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('user@heatguard.demo')}
                className="btn-outline"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
              >
                <User size={14} color="var(--sage-600)" />
                <span>Worker Demo: <strong>user@heatguard.demo</strong></span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('manager@heatguard.demo')}
                className="btn-outline"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
              >
                <Users size={14} color="#b57a1b" />
                <span>Manager Demo: <strong>manager@heatguard.demo</strong></span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('admin@heatguard.demo')}
                className="btn-outline"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
              >
                <Shield size={14} color="#191c1a" />
                <span>Admin Demo: <strong>admin@heatguard.demo</strong></span>
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Need a new account? <Link to="/register" style={{ color: 'var(--sage-600)', fontWeight: 700, textDecoration: 'none' }}>Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
