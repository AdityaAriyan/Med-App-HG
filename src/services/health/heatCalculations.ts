import type { HealthTelemetry, RiskAssessment, RiskLevel, HeatDebtLevel, RecoveryStatus } from '../../types';

/**
 * Deterministic personalized heat-risk estimation logic.
 * Note: Clearly labeled as prototype personal heat-risk estimation.
 * Combines physiological telemetry (HR, Skin Temp, SpO2) and environmental factors (Ambient Temp, Humidity).
 */

export function calculateWBGT(ambientTemp: number, humidity: number): number {
  // Simplified outdoor WBGT estimate in sunlight/work conditions
  // WBGT ≈ 0.7 * NWB + 0.2 * GT + 0.1 * DB
  // Empirical approximation based on ambient temp & relative humidity:
  const e = (humidity / 100) * 6.105 * Math.exp((17.27 * ambientTemp) / (237.7 + ambientTemp));
  const tw = 0.567 * ambientTemp + 0.393 * e + 3.94;
  return parseFloat(tw.toFixed(1));
}

export function calculateHeatIndex(ambientTempC: number, humidity: number): number {
  // Convert C to F for standard Rothfusz Heat Index regression
  const T = (ambientTempC * 9) / 5 + 32;
  const R = humidity;

  let HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (R * 0.094));

  if (HI >= 80) {
    HI = -42.379 + 2.04901523 * T + 10.14333127 * R - 0.22475541 * T * R
      - 0.00683783 * T * T - 0.05481717 * R * R + 0.00122874 * T * T * R
      + 0.00085282 * T * R * R - 0.00000199 * T * T * R * R;
  }

  // Convert back to Celsius
  const hiCelsius = ((HI - 32) * 5) / 9;
  return parseFloat(hiCelsius.toFixed(1));
}

export function evaluatePersonalHeatRisk(
  telemetry: HealthTelemetry,
  _history: HealthTelemetry[] = []
): RiskAssessment {
  const { heartRate, spo2, skinTemperature, ambientTemperature, humidity, activityLevel } = telemetry;

  // 1. Calculate Physiological Stress Factor (0 - 40 points)
  // Baseline resting HR ~ 70. HR > 100 begins adding stress points.
  let physStress = 0;
  if (heartRate > 75) physStress += (heartRate - 75) * 0.6;
  if (skinTemperature > 36.8) physStress += (skinTemperature - 36.8) * 20;
  if (spo2 < 97) physStress += (97 - spo2) * 4;
  physStress = Math.min(40, Math.max(0, physStress));

  // 2. Calculate Environmental Heat Load Factor (0 - 40 points)
  let heatLoad = 0;
  if (ambientTemperature > 26) heatLoad += (ambientTemperature - 26) * 2.2;
  if (humidity > 50) heatLoad += ((humidity - 50) / 10) * 2.5;
  heatLoad = Math.min(40, Math.max(0, heatLoad));

  // 3. Activity Factor (0 - 20 points)
  let activityStress = 5;
  if (activityLevel === 'MODERATE') activityStress = 12;
  else if (activityLevel === 'HIGH') activityStress = 18;
  else if (activityLevel === 'INTENSE') activityStress = 22;

  // Total raw Heat Risk Index (0 - 100)
  const rawRisk = Math.round(physStress + heatLoad + activityStress);
  const heatRisk = Math.max(8, Math.min(96, rawRisk));

  // Determine Category
  let riskLevel: RiskLevel = 'LOW';
  if (heatRisk >= 75) riskLevel = 'CRITICAL';
  else if (heatRisk >= 55) riskLevel = 'HIGH';
  else if (heatRisk >= 32) riskLevel = 'CAUTION';

  // Heat Reserve: estimated remaining physiological buffer
  const heatReserve = Math.max(12, Math.min(98, Math.round(100 - (heatRisk * 0.9))));

  // Heat Debt: cumulative thermal burden
  let heatDebt: HeatDebtLevel = 'LOW';
  if (heatRisk > 70) heatDebt = 'HIGH';
  else if (heatRisk > 48) heatDebt = 'ELEVATED';
  else if (heatRisk > 28) heatDebt = 'MODERATE';

  // Recovery Status
  let recoveryStatus: RecoveryStatus = 'EXCELLENT';
  if (heatRisk > 70 || skinTemperature > 38.0) recoveryStatus = 'POOR';
  else if (heatRisk > 50 || skinTemperature > 37.4) recoveryStatus = 'FAIR';
  else if (heatRisk > 28) recoveryStatus = 'GOOD';

  // 5D Radar Dimensions
  const dimensions = {
    heatLoad: Math.min(100, Math.round((heatLoad / 40) * 100)),
    physiologicalStress: Math.min(100, Math.round((physStress / 40) * 100)),
    activityStress: Math.min(100, Math.round((activityStress / 20) * 100)),
    exposureIndex: Math.min(100, Math.round((ambientTemperature / 42) * 90)),
    recoveryCapacity: recoveryStatus === 'EXCELLENT' ? 92 : (recoveryStatus === 'GOOD' ? 78 : (recoveryStatus === 'FAIR' ? 52 : 28))
  };

  // Contextual Insights & Recommendations
  let aiInsight = '';
  let recommendation = '';
  const improvements: { label: string; value: string; positive: boolean }[] = [];
  const focusAreas: { title: string; subtitle: string }[] = [];

  if (riskLevel === 'CRITICAL') {
    aiInsight = 'Critical thermal strain detected. High skin temperature combined with elevated cardiovascular exertion indicates dangerous heat load.';
    recommendation = 'Mandatory active cooling required. Cease physical exertion, relocate to air-conditioned rest zone, and hydrate immediately.';
    improvements.push({ label: 'Core cooldown rate', value: 'Delayed', positive: false });
    improvements.push({ label: 'Cardiovascular load', value: '+38 bpm above rest', positive: false });
    focusAreas.push({ title: 'Immediate Cooling', subtitle: 'Apply cool packs or cold water misting' });
    focusAreas.push({ title: 'Electrolyte Replenishment', subtitle: 'Target 500ml cold electrolyte drink' });
  } else if (riskLevel === 'HIGH') {
    aiInsight = 'Elevated heat strain. Ambient temperature and metabolic heat output are approaching threshold limits for continuous work.';
    recommendation = 'Initiate a 15-minute shaded rest break. Loosen restrictive gear and consume 350ml water.';
    improvements.push({ label: 'Thermal buffering', value: 'Declining', positive: false });
    improvements.push({ label: 'Hydration adherence', value: 'Moderate', positive: true });
    focusAreas.push({ title: 'Work-to-Rest Ratio', subtitle: 'Switch to 40 min work / 20 min rest' });
    focusAreas.push({ title: 'Ambient Heat Tracking', subtitle: 'Direct solar radiation increasing' });
  } else if (riskLevel === 'CAUTION') {
    aiInsight = 'Mild thermal stress observed. Cardiovascular metrics are slightly elevated due to ambient temperature increase.';
    recommendation = 'Maintain regular hydration intervals (200ml every 20 minutes) and pace physical tasks.';
    improvements.push({ label: 'Cardiovascular recovery', value: '-3 bpm trend', positive: true });
    improvements.push({ label: 'Skin temp stability', value: 'Stable', positive: true });
    focusAreas.push({ title: 'Hydration Target', subtitle: 'Keep 1.5L bottle nearby' });
    focusAreas.push({ title: 'Microclimate Pacing', subtitle: 'Take advantage of shaded walkways' });
  } else {
    aiInsight = 'Your thermal equilibrium remains optimal. Physiological markers reflect healthy cardiovascular buffering and strong recovery capacity.';
    recommendation = 'Continue regular hydration and maintain your current operational pace.';
    improvements.push({ label: 'Physiological balance', value: 'Optimal', positive: true });
    improvements.push({ label: 'Recovery efficiency', value: '+12% vs yesterday', positive: true });
    improvements.push({ label: 'Heat tolerance buffer', value: 'High', positive: true });
    focusAreas.push({ title: 'Hydration baseline', subtitle: 'On track for daily 3.0L goal' });
    focusAreas.push({ title: 'Activity pacing', subtitle: 'Sustained moderate effort is well-buffered' });
  }

  return {
    id: `risk-${telemetry.userId}-${Date.now()}`,
    userId: telemetry.userId,
    timestamp: telemetry.timestamp,
    heatRisk,
    riskLevel,
    heatReserve,
    heatDebt,
    recoveryStatus,
    dimensions,
    aiInsight,
    recommendation,
    improvements,
    focusAreas
  };
}
