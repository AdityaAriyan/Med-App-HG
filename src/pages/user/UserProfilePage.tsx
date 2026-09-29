import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import { db } from '../../services/database/db';
import { AuthService } from '../../services/auth/authService';
import { Download, LogOut, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import type { EmergencyContact } from '../../types';

export const UserProfilePage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit personal info state
  const [phone, setPhone] = useState(user?.phone || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || '');

  useEffect(() => {
    if (!user) return;
    setPhone(user.phone || '');
    setDepartment(user.department || '');
    setJobTitle(user.jobTitle || '');

    db.getByIndex('emergency_contacts', 'userId', user.id).then(res => {
      setContacts(res || []);
    });
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await AuthService.updateUserProfile({
        id: user.id,
        phone,
        department,
        jobTitle
      });
      await refreshUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleAddContact = async () => {
    if (!user || !newContactName.trim() || !newContactPhone.trim()) return;
    const newContact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      userId: user.id,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRelation.trim() || 'Emergency Contact',
      isPrimary: contacts.length === 0
    };
    await db.put('emergency_contacts', newContact);
    setContacts([...contacts, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelation('');
    setShowAddContact(false);
  };

  const handleDeleteContact = async (contactId: string) => {
    await db.delete('emergency_contacts', contactId);
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  const exportTelemetryCSV = async () => {
    if (!user) return;
    const history = await db.getByIndex('health_data', 'userId', user.id);
    if (!history || history.length === 0) {
      alert('No telemetry recorded yet to export.');
      return;
    }

    const headers = ['Timestamp', 'HeartRate_BPM', 'SpO2_Percent', 'SkinTemp_C', 'AmbientTemp_C', 'Humidity_Percent', 'ActivityLevel'];
    const rows = history.map(h => [
      h.timestamp,
      h.heartRate,
      h.spo2,
      h.skinTemperature,
      h.ambientTemperature,
      h.humidity,
      h.activityLevel
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heatguard_telemetry_${user.name.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Profile Header Card */}
      <div className="nura-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#191c1a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '22px'
              }}
            >
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{user.name}</h2>
                <span className="status-chip dark">{user.role}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {user.email} · ID: <code style={{ fontFamily: 'var(--font-digital)' }}>{user.id}</code>
              </p>
            </div>
          </div>

          <button onClick={logout} className="btn-outline" style={{ fontSize: '13px' }}>
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Personal & Occupational Information */}
        <div className="nura-card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Personal & Occupational Information</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Workplace assignment and contact details for heat stress safety rosters
          </p>

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Full Name
              </label>
              <input type="text" value={user.name} disabled className="input-field" style={{ backgroundColor: 'var(--bg-app)', marginTop: '4px' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Work Email
              </label>
              <input type="email" value={user.email} disabled className="input-field" style={{ backgroundColor: 'var(--bg-app)', marginTop: '4px' }} />
            </div>

            <div className="grid-2">
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Job Role
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="input-field"
                style={{ marginTop: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <button type="submit" className="btn-primary">
                Save Profile Changes
              </button>
              {saveSuccess && (
                <span style={{ fontSize: '12px', color: '#3b7b4d', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Profile updated
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Emergency Contacts Management */}
        <div className="nura-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Emergency Contacts</h3>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="btn-outline"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Designated individuals alerted during critical heat emergency distress protocols
            </p>

            {/* Add Contact Inline Form */}
            {showAddContact && (
              <div style={{ padding: '14px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  className="input-field"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newContactPhone}
                  onChange={e => setNewContactPhone(e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Spouse, Site Medic)"
                  value={newContactRelation}
                  onChange={e => setNewContactRelation(e.target.value)}
                  className="input-field"
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowAddContact(false)} className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleAddContact} className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                    Save Contact
                  </button>
                </div>
              </div>
            )}

            {/* Existing contacts list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {contacts.map(c => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700 }}>
                      {c.name} {c.isPrimary && <span className="status-chip low" style={{ fontSize: '10px', padding: '1px 6px', marginLeft: '6px' }}>Primary</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {c.relationship} · {c.phone}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteContact(c.id)}
                    style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
                    title="Delete contact"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Export telemetry data */}
          <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', marginTop: '20px' }}>
            <button onClick={exportTelemetryCSV} className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              <Download size={14} />
              <span>Export Personal Health History (CSV)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
