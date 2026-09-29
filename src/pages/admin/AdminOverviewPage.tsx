import React, { useState, useEffect } from 'react';
import { db } from '../../services/database/db';
import { DotMatrixDisplay } from '../../components/common/DotMatrixDisplay';
import { Users, Shield, Cpu, Database, Plus, Trash2 } from 'lucide-react';
import type { UserProfile, DeviceInfo, UserRole } from '../../types';

export const AdminOverviewPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('USER');
  const [newDept, setNewDept] = useState('');

  const loadData = async () => {
    const allUsers = await db.getAll('users');
    const allDevs = await db.getAll('devices');
    setUsers(allUsers);
    setDevices(allDevs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    const id = `usr-${Date.now()}`;
    const now = new Date().toISOString();

    await db.put('users', {
      id,
      email: newEmail.trim().toLowerCase(),
      name: newName.trim(),
      role: newRole,
      department: newDept.trim() || 'Operations',
      jobTitle: 'Field Specialist',
      createdAt: now,
      updatedAt: now,
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' // 'admin' default hash or demo password
    });

    await db.put('devices', {
      id: `dev-${id}`,
      userId: id,
      deviceSerial: `HG-EDGE-v2-${Math.floor(1000 + Math.random() * 9000)}`,
      model: 'HeatGuard Pro Band',
      firmwareVersion: 'v2.4.1',
      batteryLevel: 90,
      connectionStatus: 'CONNECTED',
      lastSyncTime: now,
      sensors: {
        max30102: { name: 'Photoplethysmography', status: 'ACTIVE', lastReading: '80 BPM / 98% SpO2' },
        mlx90614: { name: 'Infrared Thermometer', status: 'ACTIVE', lastReading: '36.6 °C' },
        sht31: { name: 'Ambient Temp & RH', status: 'ACTIVE', lastReading: '31.0 °C / 50% RH' },
        mpu6050: { name: '6-Axis IMU', status: 'ACTIVE', lastReading: 'Low Motion' }
      }
    });

    setNewEmail('');
    setNewName('');
    setNewDept('');
    setShowAddUser(false);
    loadData();
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to remove this user account?')) {
      await db.delete('users', userId);
      loadData();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Total Accounts</span>
            <Users size={16} color="var(--sage-600)" />
          </div>
          <div style={{ margin: '12px 0 4px' }}>
            <DotMatrixDisplay value={users.length} size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{users.filter(u => u.role === 'USER').length} field workers</span>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Active Wearable Bands</span>
            <Cpu size={16} color="var(--sage-600)" />
          </div>
          <div style={{ margin: '12px 0 4px' }}>
            <DotMatrixDisplay value={devices.length} size="lg" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hardware provisioned</span>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Database Storage</span>
            <Database size={16} color="var(--sage-600)" />
          </div>
          <div style={{ margin: '12px 0 4px' }}>
            <DotMatrixDisplay value="IndexedDB" size="sm" dotColor="#191c1a" />
          </div>
          <span style={{ fontSize: '12px', color: '#3b7b4d', fontWeight: 600 }}>Relational Schema Active</span>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Security Status</span>
            <Shield size={16} color="#3b7b4d" />
          </div>
          <div style={{ margin: '12px 0 4px' }}>
            <DotMatrixDisplay value="RBAC OK" size="sm" dotColor="#3b7b4d" />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Role-based isolation</span>
        </div>
      </div>

      {/* Users & Roles Management */}
      <div className="nura-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>User Accounts & Roles</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Manage access privileges, role delegations, and hardware device assignments
            </p>
          </div>

          <button onClick={() => setShowAddUser(!showAddUser)} className="btn-primary" style={{ fontSize: '13px' }}>
            <Plus size={14} /> Provision User
          </button>
        </div>

        {/* Add User Form */}
        {showAddUser && (
          <form onSubmit={handleCreateUser} style={{ padding: '20px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Provision New Account</h4>
            <div className="grid-3">
              <input type="text" placeholder="Full Name" value={newName} onChange={e => setNewName(e.target.value)} required className="input-field" />
              <input type="email" placeholder="Work Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required className="input-field" />
              <input type="text" placeholder="Department" value={newDept} onChange={e => setNewDept(e.target.value)} className="input-field" />
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Role Assignment:</label>
              {(['USER', 'MANAGER', 'ADMIN'] as const).map(r => (
                <label key={r} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input type="radio" name="role" checked={newRole === r} onChange={() => setNewRole(r)} />
                  {r}
                </label>
              ))}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowAddUser(false)} className="btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }}>
                  Create Account
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Users Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>NAME</th>
              <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>EMAIL</th>
              <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>ROLE</th>
              <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>DEPARTMENT</th>
              <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, fontSize: '14px' }}>{u.name}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{u.email}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span className={`status-chip ${u.role === 'ADMIN' ? 'dark' : (u.role === 'MANAGER' ? 'caution' : 'low')}`}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px' }}>{u.department || 'Operations'}</td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  {u.email !== 'admin@heatguard.demo' && (
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      style={{ border: 'none', background: 'transparent', color: 'var(--risk-critical)', cursor: 'pointer', padding: '6px' }}
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
