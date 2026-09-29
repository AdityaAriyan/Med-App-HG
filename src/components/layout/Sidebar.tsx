import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Activity,
  Flame,
  Bell,
  Cpu,
  User,
  ShieldAlert,
  Users,
  BarChart3,
  Globe,
  Settings,
  LogOut,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../services/auth/AuthContext';
import { useHealthData } from '../../services/health/HealthDataContext';

interface SidebarProps {
  mode?: 'user' | 'manager' | 'admin';
}

interface NavItem {
  to: string;
  label: string;
  icon: any;
  badge?: number;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ mode = 'user' }) => {
  const { user, logout } = useAuth();
  const { unreadAlertCount } = useHealthData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userNavItems: NavItem[] = [
    { to: '/app/home', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/app/health', label: 'Health Signals', icon: Heart },
    { to: '/app/activity', label: 'Activity & Rest', icon: Activity },
    { to: '/app/heat-risk', label: 'Heat Risk Profile', icon: Flame },
    { to: '/app/alerts', label: 'Alerts', icon: Bell, badge: unreadAlertCount > 0 ? unreadAlertCount : undefined },
    { to: '/app/device', label: 'HeatGuard Band', icon: Cpu },
    { to: '/app/profile', label: 'Profile & Safety', icon: User },
    { to: '/app/emergency', label: 'Emergency SOS', icon: ShieldAlert, highlight: true },
  ];

  const managerNavItems: NavItem[] = [
    { to: '/manager/overview', label: 'Overview', icon: LayoutDashboard },
    { to: '/manager/workers', label: 'Worker Fleet', icon: Users },
    { to: '/manager/alerts', label: 'Triage Alerts', icon: Bell, badge: unreadAlertCount > 0 ? unreadAlertCount : undefined },
    { to: '/manager/reports', label: 'Heat Reports', icon: BarChart3 },
    { to: '/manager/environment', label: 'Microclimate', icon: Globe },
    { to: '/manager/settings', label: 'Safety Thresholds', icon: Settings },
  ];

  const adminNavItems: NavItem[] = [
    { to: '/admin/overview', label: 'System Admin', icon: ShieldCheck },
    { to: '/manager/overview', label: 'Manager Workspace', icon: Users },
    { to: '/app/home', label: 'Worker App View', icon: LayoutDashboard },
  ];

  const items = mode === 'admin' ? adminNavItems : (mode === 'manager' ? managerNavItems : userNavItems);

  return (
    <aside
      style={{
        width: '260px',
        padding: '24px 16px 24px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        backgroundColor: 'var(--bg-sidebar)'
      }}
    >
      <div>
        {/* Brand Header */}
        <div style={{ padding: '0 8px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: '#191c1a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '16px',
              letterSpacing: '-0.02em'
            }}
          >
            HG
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', color: '#191c1a' }}>
              HEATGUARD
            </div>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--sage-600)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Edge Telemetry
            </div>
          </div>
        </div>

        {/* Navigation Pills */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''} ${item.highlight ? 'emergency-pill' : ''}`}
                style={({ isActive }) => ({
                  borderColor: item.highlight && !isActive ? 'rgba(197, 48, 48, 0.3)' : undefined,
                  color: item.highlight && !isActive ? 'var(--risk-critical)' : undefined
                })}
              >
                <div className="icon-wrap">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.badge && (
                    <span
                      style={{
                        background: 'var(--risk-critical)',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '10px',
                        minWidth: '18px',
                        textAlign: 'center'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  <div className="arrow-indicator">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card & Role Switcher */}
      <div style={{ marginTop: '24px' }}>
        {user && (
          <div
            className="nura-card"
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#ffffff',
              marginBottom: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--sage-100)',
                  color: 'var(--sage-800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {user.role} · {user.jobTitle || 'User'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="btn-outline"
          style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '8px 12px' }}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
