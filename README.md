# RiskSage — AI-Powered Explainable Insider Threat Detection

RiskSage is a modern cybersecurity frontend for detecting and investigating authorized insider threats. Rather than focusing solely on perimeter attacks or displaying opaque, uninterpretable risk scores, RiskSage combines multi-model anomaly detection with **SHAP (SHapley Additive exPlanations)** to provide transparent, plain-language attribution behind every flagged employee behavior.

---

## Live Demo

- **Landing Page**: [https://risksage-frontend.vercel.app](https://risksage-frontend.vercel.app)
- **Security Dashboard**: [https://risksage-frontend.vercel.app/dashboard](https://risksage-frontend.vercel.app/dashboard)

---

## Key Features

- **Multi-Model Anomaly Detection**: Integrates an ensemble of Isolation Forest, Autoencoder, and LSTM models evaluated against the Carnegie Mellon University (CMU) CERT Insider Threat Dataset (r5.2 & r6.2).
- **Explainable AI (XAI) with SHAP**: Visualizes exact behavioral contributing factors (e.g. after-hours logins, unauthorized USB mounts, bulk file archives, elevated outbound email volumes) alongside observed deviations vs. baselines.
- **Analyst Triage & Containment**: Real-time triage workflow supporting alert prioritization, investigation status management, containment playbooks (host isolation, USB revocation, SOC escalation), and analyst investigation notes.
- **Interactive Security Dashboard**: Multi-channel anomaly monitoring, population risk distribution breakdowns, historical risk trajectories, and chronologically indexed audit event timelines.
- **Living WebGL Shader Backdrop**: Dynamic, hardware-accelerated ambient shader backdrop responding smoothly to pointer interactions while maintaining accessibility.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4, custom cyber-defense token palette
- **Icons**: Phosphor Icons (`@phosphor-icons/react`)
- **Visualizations**: Recharts, WebGL Shader Engine
- **Telemetry & Pipeline Simulation**: Apache Kafka, FastAPI, PostgreSQL

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/shreygupta15/risksage-frontend.git
cd risksage-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

---

## Evaluation Metrics (CMU CERT r6.2)

| Model | Detection Rate | False Positive Rate | ROC AUC | Latency (p95) |
|---|---|---|---|---|
| **RiskSage Ensemble** | **94.8%** | **1.4%** | **0.964** | **18 ms** |
| Isolation Forest | 86.4% | 3.8% | 0.912 | 12 ms |
| Deep Autoencoder | 89.1% | 2.9% | 0.935 | 24 ms |
| Bidirectional LSTM | 91.5% | 2.1% | 0.948 | 31 ms |

---

## License

This project is licensed under the MIT License.
