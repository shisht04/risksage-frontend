# AGENT.md — RiskSage Frontend

## Execution & Ownership Rule
- **Whatever action you can do, do yourself this includes starting apps and verification.**
- Never leave runnable checks, dev server startup, build validation, or UI/browser verification to the user when you have the tools to execute and verify them directly.

## Project Overview
**RiskSage** is an AI-based insider threat detection platform that monitors authorized user behavior (login times, file access, email activity, and USB usage) to identify sudden and gradual behavioral anomalies.

Its core differentiator is **explainable AI (XAI)**:
- Combines an ensemble of **Isolation Forest**, **Autoencoder**, and **LSTM** models.
- Integrates **SHAP (SHapley Additive exPlanations)** to clearly explain *why* a user was flagged (e.g., `"unusual login time + large file download"`), rather than showing an opaque risk score alone.
- Evaluated against the **CMU CERT Insider Threat Dataset** (versions **r5.2** and **r6.2**), comparing the ensemble against individual models using **AUC**, **Detection Rate**, and **False Positive Rate (FPR)**.
- Production backend context: **Kafka** (real-time event streaming) and **FastAPI** (ML/API services).

## Scope & Architecture
- **Frontend-only implementation** in **Next.js** (React) and **Tailwind CSS**, using interactive charting libraries and realistic mock data.
- Design aesthetic: **Premium enterprise cybersecurity SaaS** — clean modern typography, consistent color palette, subtle animations, smooth transitions, interactive charts, well-structured tables, thoughtful spacing, and full responsiveness across desktop, tablet, and mobile.
- Maintain reusable components and a clean, modular project structure.

## Key Product Surfaces
1. **Landing Page** — Modern product narrative covering RiskSage's insider threat detection, ensemble ML + SHAP explainability, CERT r5.2/r6.2 benchmarks, and navigation into the dashboard.
2. **Security Overview Dashboard** — Key metrics (total monitored users, detected threats, high-risk users, overall risk distribution), ensemble vs. model benchmark visualizations, and anomaly detection charts.
3. **Suspicious User Activity Table** — Searchable/filterable table with user info, risk scores, threat levels, and activity status.
4. **Individual User Behavior & SHAP Explainability** — Activity timelines, behavioral anomaly breakdowns (login, file, email, USB), and clear SHAP feature-contribution visualizations explaining flagged anomalies.
5. **Alert Management** — Analyst triage workflow to review flagged users, inspect contributing behaviors, and prioritize or update investigation statuses.

## Verification Standards
- Run static checks (`lint`, `typecheck`, `build`) after edits.
- Start the Next.js application yourself and verify pages, responsiveness, charts, and interactive flows end-to-end before reporting completion.
