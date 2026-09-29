import React from 'react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { calculateWBGT, calculateHeatIndex } from '../../services/health/heatCalculations';
import { MapPin } from 'lucide-react';

export const ManagerEnvironmentPage: React.FC = () => {
  const zones = [
    { name: 'Outdoor Assembly Yard (Zone A)', temp: 34.2, hum: 58, solar: 'Direct Sunlight', status: 'CAUTION', workers: 2 },
    { name: 'Foundry & Heavy Fabrication (Zone B)', temp: 37.8, hum: 68, solar: 'High Radiant Heat', status: 'HIGH', workers: 1 },
    { name: 'Covered Loading Bay (Zone C)', temp: 31.5, hum: 52, solar: 'Partial Shade', status: 'LOW', workers: 1 },
    { name: 'Air-Conditioned Cooling Shelter', temp: 23.0, hum: 45, solar: 'Indoor Cooled', status: 'LOW', workers: 0 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="nura-card" style={{ padding: '24px 28px' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Microclimate & Environmental Stations</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Real-time Wet Bulb Globe Temperature (WBGT), ambient dry-bulb thermometry, and relative humidity across worksite zones
        </p>
      </div>

      {/* Zone Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {zones.map((zone, idx) => {
          const wbgt = calculateWBGT(zone.temp, zone.hum);
          const heatIndex = calculateHeatIndex(zone.temp, zone.hum);

          return (
            <div key={idx} className="nura-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--sage-50)', color: 'var(--sage-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{zone.name}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{zone.solar} · {zone.workers} worker(s) present</div>
                  </div>
                </div>
                <StatusBadge status={zone.status as any} size="sm" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', margin: '16px 0' }}>
                <div style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ambient Temp</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-digital)', marginTop: '2px' }}>
                    {zone.temp} °C
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rel. Humidity</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-digital)', marginTop: '2px' }}>
                    {zone.hum} %
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WBGT Index</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-digital)', color: zone.status === 'HIGH' ? '#c85a17' : '#191c1a', marginTop: '2px' }}>
                    {wbgt} °C
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <span>Calculated Heat Index: <strong>{heatIndex}°C</strong></span>
                <span>Work/Rest: <strong>{zone.temp > 35 ? '30m / 30m' : '50m / 10m'}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* WBGT Standard Reference Table */}
      <div className="nura-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>ISO 7243 / OSHA Work-to-Rest Guidance</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Automated threshold transitions calibrated for moderate to heavy industrial physical labor
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ padding: '14px', background: 'var(--risk-low-bg)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 123, 77, 0.2)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--risk-low)' }}>LOW RISK (WBGT &lt; 26°C)</div>
            <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>Continuous Work Permitted</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Normal hydration pacing</div>
          </div>

          <div style={{ padding: '14px', background: 'var(--risk-caution-bg)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(181, 122, 27, 0.2)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--risk-caution)' }}>CAUTION (WBGT 26 - 29°C)</div>
            <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>45 min Work / 15 min Rest</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Target 250ml water / 20 min</div>
          </div>

          <div style={{ padding: '14px', background: 'var(--risk-high-bg)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(200, 90, 23, 0.2)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--risk-high)' }}>HIGH STRAIN (WBGT 29 - 32°C)</div>
            <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>30 min Work / 30 min Shade</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Active supervisor monitoring</div>
          </div>

          <div style={{ padding: '14px', background: 'var(--risk-critical-bg)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 48, 48, 0.2)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--risk-critical)' }}>CRITICAL (WBGT &gt; 32°C)</div>
            <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>Cease Non-Essential Labor</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Mandatory cooling shelter</div>
          </div>
        </div>
      </div>
    </div>
  );
};
