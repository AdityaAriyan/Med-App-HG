# HeatGuard-Edge 🛡️🔥
> **Intelligent Edge-First Occupational Heat Stress & Physiological Monitoring Platform**

HeatGuard-Edge is a proactive, edge-first physiological monitoring and heat strain mitigation platform designed for high-risk industrial, agricultural, manufacturing, and outdoor operations. Built to safeguard workers in extreme thermal environments, HeatGuard-Edge continuously analyzes biometric and environmental telemetry to predict, detect, and mitigate heat-related illnesses (heat fatigue, heat exhaustion, and heat stroke) before critical health events occur.

---

## 📌 Project Overview & Purpose

Heat stress in industrial environments is a critical occupational hazard. HeatGuard-Edge bridges the gap between field personnel, safety managers, and enterprise infrastructure by delivering:

- **Personal Worker Dashboard**: Real-time biometric tracking (heart rate, SpO2, skin temperature), environmental monitoring (ambient temperature, relative humidity, heat index), and personalized Heat Risk Index scoring.
- **Dynamic Heat Risk Engine**: Multi-dimensional risk modeling assessing physiological strain, thermal accumulation, physical activity intensity, and recovery capacity.
- **Interactive Thermal & Physiological Visualization**: Interactive anatomical heat load maps and multi-axis radar stress profiling.
- **Safety Manager Command Center**: Fleet-wide worker heat stress heatmaps, active status monitoring, triage management, alert broadcasting, and safety incident reporting.
- **Administrator Console**: System telemetry, audit logs, device fleet registry, and role-based access management.
- **Emergency Action Protocol**: Automated high-risk alerts, hydration timers, mandatory rest interval notifications, and one-click SOS response triggers.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`19.2.8`) | Fast, modern component-driven UI architecture |
| **Routing** | React Router DOM v7 (`7.18.4`) | Declarative client-side routing & RBAC route guards |
| **Language** | TypeScript (`~6.0.2`) | Strict static type checking across models and interfaces |
| **Build Tool & Dev Server**| Vite (`8.3.0`) | Lightning-fast HMR and optimized production bundling |
| **Styling & Design System**| Custom Vanilla CSS | Tailored design tokens, CSS variables, glassmorphism, fluid typography, dark/light adaptation |
| **Icons & Micro-interactions** | Lucide React (`^1.48.0`), Canvas-Confetti (`^1.9.4`) | Minimalist icon set & milestone celebration effects |
| **Database / Persistence** | IndexedDB (`heatguard_edge_db` v2) | Fully client-side relational storage with indexed object stores |
| **Session & Auth** | Web Crypto SHA-256 + LocalStorage | Secure client-side password hashing and tokenized sessions |
| **Data Visualizations** | Custom SVG Data Engines | Lightweight, interactive SVG Radar, Multi-metric Smooth Curve Trend, and Body Heat distribution charts |
| **Code Quality / Linter** | Oxlint (`^1.81.0`) | High-performance Rust-based linter |

---

## 📁 Project Structure

```text
HeatGuard-Edge/
├── public/                 # Static assets and icons
├── src/
│   ├── assets/             # Images and design assets
│   ├── components/
│   │   ├── common/         # Reusable UI primitives (Buttons, Badges, Modals, Cards)
│   │   ├── health/         # SVG visualizations (TrendChart, RadarChart, BodyViz, AIInsightCard, SimulationDrawer)
│   │   └── layout/         # Navigation bars, sidebars, and role layouts (AppLayout, TopBar, Sidebar)
│   ├── pages/
│   │   ├── admin/          # Admin portal (Overview, Device Registry, System Logs)
│   │   ├── auth/           # Login & Registration authentication flows
│   │   ├── manager/        # Safety Manager fleet overview, worker detail, alerts, reports
│   │   └── user/           # Worker dashboard (Health, Activity, Heat Risk, Device, Alerts, Emergency)
│   ├── services/
│   │   ├── auth/           # AuthContext, ProtectedRoute, AuthService (SHA-256 hashing)
│   │   ├── database/       # Relational IndexedDB client (`db.ts`) & database seeder (`seed.ts`)
│   │   └── health/         # Heat calculation engine, telemetry contracts, and simulation provider
│   ├── types/              # Comprehensive TypeScript definitions and data models
│   ├── App.tsx             # Main routing hub & provider orchestration
│   ├── main.tsx            # React application entry point
│   └── index.css           # Global design system & theme variables
├── index.html              # HTML5 root template
├── package.json            # Project dependencies and script definitions
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── .gitignore              # Repository exclusion rules
```

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.x` or later recommended)
- `npm`, `pnpm`, or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/HeatGuard-Edge.git
cd HeatGuard-Edge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

---

## 🔑 Demo Accounts

The application automatically seeds an offline-first IndexedDB instance on the initial launch with preconfigured demo accounts and historical telemetry data.

| Role | Email | Password | Access / Features |
| :--- | :--- | :--- | :--- |
| **Worker / User** | `user@heatguard.demo` | `HeatGuardDemo2026!` | Personal health metrics, biometric live feeds, hydration schedule, SOS triggers |
| **Safety Manager** | `manager@heatguard.demo` | `HeatGuardDemo2026!` | Multi-worker fleet monitoring, heat strain triage, threshold alerts, shift reports |
| **System Admin** | `admin@heatguard.demo` | `HeatGuardDemo2026!` | Device fleet inventory, system health telemetry, access audit logs |

> 💡 *You can also create new custom accounts anytime using the **Register** interface.*

---

## ⚙️ Environment Variables

HeatGuard-Edge is engineered to run in a zero-configuration, edge-first architecture out of the box. No external cloud credentials or third-party API keys are required for local operation and simulation.

If you integrate remote microservices, copy `.env.example` to `.env`:
```env
# Optional Remote Telemetry Gateway (Future Hardware Integration)
VITE_TELEMETRY_API_ENDPOINT=
VITE_IOT_BROKER_URL=
```

---

## 📊 How Simulated Health Data Works

HeatGuard-Edge contains an onboard **Biometric Simulation Engine** (`SimulatedHealthDataProvider.ts`) that mimics live edge wearable hardware:
- **Continuous Telemetry Loop**: Emits real-time readings every 5 seconds (heart rate, SpO2, skin temperature, ambient temperature, relative humidity, accelerometer/motion data).
- **Stochastic Drift & Presets**: Allows simulation of different operational scenarios (`NORMAL`, `CAUTION`, `HIGH_RISK`, `CRITICAL_HEAT_STRAIN`) directly via the **Simulation Drawer** in the UI.
- **Deterministic Heat Strain Algorithms**: Implements the Wet Bulb Globe Temperature (WBGT) approximations, Physiological Strain Index (PSI) modeling, and cumulative thermal dose equations (`heatCalculations.ts`).

---

## 📡 Future Hardware Integration

HeatGuard-Edge is designed with a provider-agnostic interface (`IHealthDataProvider.ts`). This allows seamless drop-in integration of physical IoT hardware and wearables:

1. **BLE / Web Bluetooth**: Direct connection to wearable sensor bands (e.g., MAX30102 PPG sensor, MLX90614 infrared skin thermometer, SHT31 ambient humidity/temperature sensor).
2. **MQTT / LoRaWAN Gateways**: Subscribing to an MQTT topic broker for remote industrial site workers operating in remote locations without Wi-Fi.
3. **Serial / WebUSB**: Direct tethering to field station diagnostic hubs.

To switch from simulated telemetry to real hardware, implement `IHealthDataProvider` with the respective device driver SDK.

---

## 📦 Building for Production

To create an optimized, minified production build:

```bash
npm run build
```

To preview the generated production build locally:

```bash
npm run preview
```

---

## 🔒 Security & Code Integrity

- **No Hardcoded Secrets**: All passwords in demo seed data use SHA-256 one-way hashing; no third-party keys or private tokens are stored in the codebase.
- **Edge Data Privacy**: Biometric telemetry is stored in the browser's local IndexedDB sandbox, preventing unauthorized cloud telemetry transmission unless explicitly configured.
- **Git Hygiene**: An extensive `.gitignore` ensures that build outputs, node packages, environment secrets, and IDE caches are never committed to version control.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
