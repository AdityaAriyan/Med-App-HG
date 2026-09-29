import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../services/auth/AuthContext';
import { AlertCircle, ArrowRight } from 'lucide-react';
import type { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Field Operations');
  const [role, setRole] = useState<UserRole>('USER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await register({
      name,
      email,
      password,
      role,
      department
    });

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
      setError(res.error || 'Registration failed.');
    }
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
      <div style={{ maxWidth: '460px', width: '100%' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
              marginBottom: '10px'
            }}
          >
            HG
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#191c1a' }}>Create HeatGuard Account</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Register to initialize continuous edge wearable telemetry
          </p>
        </div>

        {/* Register Card */}
        <div className="nura-card" style={{ padding: '32px' }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--risk-critical-bg)',
                color: 'var(--risk-critical)',
                fontSize: '13px',
                marginBottom: '16px'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="input-field"
                style={{ marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="john.doe@company.com"
                className="input-field"
                style={{ marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Password (min 6 chars)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-field"
                style={{ marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="e.g. Logistics & Assembly"
                className="input-field"
                style={{ marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Account Role
              </label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                {(['USER', 'MANAGER'] as const).map(r => (
                  <label
                    key={r}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${role === r ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                      background: role === r ? '#191c1a' : '#ffffff',
                      color: role === r ? '#ffffff' : 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      checked={role === r}
                      onChange={() => setRole(r)}
                      style={{ display: 'none' }}
                    />
                    {r === 'USER' ? 'Field Worker' : 'Safety Manager'}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-dark"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px', marginTop: '8px' }}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--sage-600)', fontWeight: 700, textDecoration: 'none' }}>Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
