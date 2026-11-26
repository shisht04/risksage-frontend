export type ThreatLevel = "Critical" | "High" | "Medium" | "Low";
export type AlertStatus = "Flagged" | "Investigating" | "Escalated" | "Cleared";
export type BehaviorChannel = "Login" | "File Access" | "Email" | "USB";

export interface ShapFactor {
  feature: string;
  channel: BehaviorChannel;
  observed: string;
  baseline: string;
  contribution: number; // positive increases risk, negative reduces risk
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  channel: BehaviorChannel;
  action: string;
  target: string;
  severity: "Critical" | "High" | "Medium" | "Normal";
  detail: string;
}

export interface DailyBehaviorPoint {
  day: string;
  riskScore: number;
  fileVolumeMb: number;
  baselineMb: number;
  afterHoursLogins: number;
  usbEvents: number;
  externalEmails: number;
}

export interface MonitoredUser {
  id: string;
  certId: string;
  name: string;
  initials: string;
  email: string;
  department: "R&D" | "Infrastructure" | "Finance" | "Legal" | "Analytics" | "Compliance";
  role: string;
  hostId: string;
  riskScore: number; // 0-100
  threatLevel: ThreatLevel;
  status: AlertStatus;
  lastActivity: string;
  primaryTrigger: string;
  explanationSummary: string;
  models: {
    isolationForest: number;
    autoencoder: number;
    lstm: number;
    ensemble: number;
  };
  shapBaseValue: number;
  shapFactors: ShapFactor[];
  channelDeviation: {
    channel: string;
    baseline: number;
    observed: number;
  }[];
  timeline: TimelineEvent[];
  history14d: DailyBehaviorPoint[];
  analystNotes: string;
}

export interface CertModelMetric {
  model: "RiskSage Ensemble" | "LSTM Sequence" | "Autoencoder" | "Isolation Forest";
  dataset: "r5.2" | "r6.2";
  auc: number;
  detectionRate: number;
  falsePositiveRate: number;
  f1Score: number;
  latencyMs: number;
  focus: string;
}

export interface RocPoint {
  fpr: number;
  ensemble: number;
  lstm: number;
  autoencoder: number;
  isolationForest: number;
}

export const MONITORED_USERS: MonitoredUser[] = [
  {
    id: "usr-4091",
    certId: "CERT-MJV0491",
    name: "Martin Vance",
    initials: "MV",
    email: "m.vance@enterprise.internal",
    department: "R&D",
    role: "Senior Firmware Engineer",
    hostId: "PC-RD-0419",
    riskScore: 94,
    threatLevel: "Critical",
    status: "Flagged",
    lastActivity: "4m ago",
    primaryTrigger: "Unusual 02:14 login + 1.84 GB archive download + USB mount",
    explanationSummary:
      "Flagged by all three models due to an anomalous 02:14 workstation login followed within 18 minutes by a 1.84 GB confidential schematic export and an unregistered Kingston USB mount.",
    models: {
      isolationForest: 0.91,
      autoencoder: 0.93,
      lstm: 0.96,
      ensemble: 0.94,
    },
    shapBaseValue: 0.14,
    shapFactors: [
      {
        feature: "After-hours login time (02:14)",
        channel: "Login",
        observed: "02:14 local",
        baseline: "08:45 - 18:10",
        contribution: 0.31,
      },
      {
        feature: "Confidential R&D archive read",
        channel: "File Access",
        observed: "1.84 GB (412 files)",
        baseline: "42 MB / day",
        contribution: 0.27,
      },
      {
        feature: "Unregistered USB mass storage mount",
        channel: "USB",
        observed: "VID_0951 / 2 writes",
        baseline: "0 mounts / 90d",
        contribution: 0.18,
      },
      {
        feature: "Sequence drift over 72h window",
        channel: "File Access",
        observed: "z = +4.2",
        baseline: "z < 1.0",
        contribution: 0.08,
      },
      {
        feature: "Internal corporate host origin",
        channel: "Login",
        observed: "PC-RD-0419",
        baseline: "Primary workstation",
        contribution: -0.04,
      },
    ],
    channelDeviation: [
      { channel: "Login Hour", baseline: 18, observed: 92 },
      { channel: "File Volume", baseline: 22, observed: 96 },
      { channel: "USB Activity", baseline: 5, observed: 89 },
      { channel: "Email Volume", baseline: 34, observed: 41 },
      { channel: "Privilege Scope", baseline: 28, observed: 67 },
    ],
    timeline: [
      {
        id: "ev-1",
        timestamp: "02:14:09",
        channel: "Login",
        action: "Workstation logon outside shift window",
        target: "PC-RD-0419",
        severity: "High",
        detail: "First 02:00-04:00 authentication recorded in 180-day profile.",
      },
      {
        id: "ev-2",
        timestamp: "02:21:44",
        channel: "File Access",
        action: "Bulk read on restricted firmware repo",
        target: "\\\\fs-rd\\asic-v4\\schematics.zip",
        severity: "Critical",
        detail: "1.84 GB read across 412 CAD and spec files in 11 minutes.",
      },
      {
        id: "ev-3",
        timestamp: "02:32:18",
        channel: "USB",
        action: "Removable drive mounted and written",
        target: "USB\\VID_0951_PID_1666",
        severity: "Critical",
        detail: "Unregistered removable device received 1.84 GB encrypted archive.",
      },
      {
        id: "ev-4",
        timestamp: "02:39:51",
        channel: "Email",
        action: "External message with attachment hash match",
        target: "v.personal@proton.me",
        severity: "Medium",
        detail: "2.1 MB design manifest sent outside corporate allowlist.",
      },
    ],
    history14d: [
      { day: "Nov 13", riskScore: 14, fileVolumeMb: 38, baselineMb: 42, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 14", riskScore: 16, fileVolumeMb: 44, baselineMb: 42, afterHoursLogins: 0, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 15", riskScore: 15, fileVolumeMb: 29, baselineMb: 42, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 16", riskScore: 19, fileVolumeMb: 51, baselineMb: 42, afterHoursLogins: 0, usbEvents: 0, externalEmails: 2 },
      { day: "Nov 17", riskScore: 22, fileVolumeMb: 47, baselineMb: 42, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 18", riskScore: 24, fileVolumeMb: 63, baselineMb: 42, afterHoursLogins: 0, usbEvents: 0, externalEmails: 2 },
      { day: "Nov 19", riskScore: 27, fileVolumeMb: 71, baselineMb: 42, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 20", riskScore: 31, fileVolumeMb: 94, baselineMb: 42, afterHoursLogins: 1, usbEvents: 0, externalEmails: 3 },
      { day: "Nov 21", riskScore: 38, fileVolumeMb: 128, baselineMb: 42, afterHoursLogins: 1, usbEvents: 0, externalEmails: 2 },
      { day: "Nov 22", riskScore: 46, fileVolumeMb: 185, baselineMb: 42, afterHoursLogins: 1, usbEvents: 0, externalEmails: 4 },
      { day: "Nov 23", riskScore: 54, fileVolumeMb: 260, baselineMb: 42, afterHoursLogins: 1, usbEvents: 1, externalEmails: 3 },
      { day: "Nov 24", riskScore: 69, fileVolumeMb: 410, baselineMb: 42, afterHoursLogins: 2, usbEvents: 1, externalEmails: 5 },
      { day: "Nov 25", riskScore: 81, fileVolumeMb: 890, baselineMb: 42, afterHoursLogins: 2, usbEvents: 1, externalEmails: 4 },
      { day: "Nov 26", riskScore: 94, fileVolumeMb: 1840, baselineMb: 42, afterHoursLogins: 3, usbEvents: 2, externalEmails: 6 },
    ],
    analystNotes: "Pending SOC Tier-2 containment review. Host isolation recommended prior to shift start.",
  },
  {
    id: "usr-3182",
    certId: "CERT-RHL0812",
    name: "Rachel Lindqvist",
    initials: "RL",
    email: "r.lindqvist@enterprise.internal",
    department: "Infrastructure",
    role: "Database Administrator",
    hostId: "PC-INF-0108",
    riskScore: 89,
    threatLevel: "Critical",
    status: "Investigating",
    lastActivity: "11m ago",
    primaryTrigger: "Cross-host credential switch + SQL dump export + off-hour session",
    explanationSummary:
      "Autoencoder and LSTM flagged an atypical privilege chain: service account elevation from a finance subnet workstation followed by 940 MB customer ledger export.",
    models: {
      isolationForest: 0.84,
      autoencoder: 0.91,
      lstm: 0.90,
      ensemble: 0.89,
    },
    shapBaseValue: 0.14,
    shapFactors: [
      {
        feature: "Cross-department host login",
        channel: "Login",
        observed: "PC-FIN-0214",
        baseline: "PC-INF-0108 only",
        contribution: 0.29,
      },
      {
        feature: "Production SQL table export",
        channel: "File Access",
        observed: "940 MB CSV dump",
        baseline: "15 MB / day",
        contribution: 0.25,
      },
      {
        feature: "External mail attachment spike",
        channel: "Email",
        observed: "14 external recipients",
        baseline: "1.2 / week",
        contribution: 0.16,
      },
      {
        feature: "Late evening session duration",
        channel: "Login",
        observed: "23:10 - 01:05",
        baseline: "09:00 - 17:30",
        contribution: 0.09,
      },
      {
        feature: "No removable media detected",
        channel: "USB",
        observed: "0 mounts",
        baseline: "0 mounts",
        contribution: -0.04,
      },
    ],
    channelDeviation: [
      { channel: "Login Hour", baseline: 20, observed: 81 },
      { channel: "File Volume", baseline: 30, observed: 88 },
      { channel: "USB Activity", baseline: 4, observed: 4 },
      { channel: "Email Volume", baseline: 22, observed: 84 },
      { channel: "Privilege Scope", baseline: 45, observed: 93 },
    ],
    timeline: [
      {
        id: "ev-21",
        timestamp: "23:12:04",
        channel: "Login",
        action: "SSH jump from non-assigned Finance terminal",
        target: "PC-FIN-0214 -> db-prod-02",
        severity: "Critical",
        detail: "First login from Finance VLAN in 12 months.",
      },
      {
        id: "ev-22",
        timestamp: "23:28:19",
        channel: "File Access",
        action: "Unscheduled pg_dump archive written locally",
        target: "/tmp/ledger_q4_export.sql.gz",
        severity: "High",
        detail: "940 MB dump outside automated 04:00 backup window.",
      },
      {
        id: "ev-23",
        timestamp: "23:54:40",
        channel: "Email",
        action: "Split archive emailed to external domain",
        target: "archive-drop@fastmail.fm",
        severity: "High",
        detail: "6 outbound emails with encrypted zip chunks.",
      },
    ],
    history14d: [
      { day: "Nov 13", riskScore: 18, fileVolumeMb: 15, baselineMb: 18, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 14", riskScore: 20, fileVolumeMb: 19, baselineMb: 18, afterHoursLogins: 0, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 15", riskScore: 17, fileVolumeMb: 14, baselineMb: 18, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 16", riskScore: 21, fileVolumeMb: 22, baselineMb: 18, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 17", riskScore: 19, fileVolumeMb: 16, baselineMb: 18, afterHoursLogins: 0, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 18", riskScore: 26, fileVolumeMb: 34, baselineMb: 18, afterHoursLogins: 1, usbEvents: 0, externalEmails: 2 },
      { day: "Nov 19", riskScore: 33, fileVolumeMb: 48, baselineMb: 18, afterHoursLogins: 1, usbEvents: 0, externalEmails: 2 },
      { day: "Nov 20", riskScore: 39, fileVolumeMb: 61, baselineMb: 18, afterHoursLogins: 1, usbEvents: 0, externalEmails: 3 },
      { day: "Nov 21", riskScore: 44, fileVolumeMb: 89, baselineMb: 18, afterHoursLogins: 1, usbEvents: 0, externalEmails: 4 },
      { day: "Nov 22", riskScore: 58, fileVolumeMb: 140, baselineMb: 18, afterHoursLogins: 2, usbEvents: 0, externalEmails: 6 },
      { day: "Nov 23", riskScore: 67, fileVolumeMb: 280, baselineMb: 18, afterHoursLogins: 2, usbEvents: 0, externalEmails: 7 },
      { day: "Nov 24", riskScore: 76, fileVolumeMb: 490, baselineMb: 18, afterHoursLogins: 2, usbEvents: 0, externalEmails: 10 },
      { day: "Nov 25", riskScore: 83, fileVolumeMb: 710, baselineMb: 18, afterHoursLogins: 3, usbEvents: 0, externalEmails: 11 },
      { day: "Nov 26", riskScore: 89, fileVolumeMb: 940, baselineMb: 18, afterHoursLogins: 3, usbEvents: 0, externalEmails: 14 },
    ],
    analystNotes: "Confirming with Infrastructure lead whether db-prod-02 maintenance ticket was approved.",
  },
  {
    id: "usr-2745",
    certId: "CERT-DKW0274",
    name: "Devon Kowalski",
    initials: "DK",
    email: "d.kowalski@enterprise.internal",
    department: "Finance",
    role: "Principal Financial Analyst",
    hostId: "PC-FIN-0311",
    riskScore: 82,
    threatLevel: "High",
    status: "Escalated",
    lastActivity: "19m ago",
    primaryTrigger: "Gradual 10-day external email surge + payroll folder enumeration",
    explanationSummary:
      "LSTM sequence detector identified a slow 10-day behavioral ramp in outbound M&A spreadsheet forwarding combined with first-time access to executive payroll shares.",
    models: {
      isolationForest: 0.71,
      autoencoder: 0.79,
      lstm: 0.90,
      ensemble: 0.82,
    },
    shapBaseValue: 0.14,
    shapFactors: [
      {
        feature: "10-day outbound email ramp",
        channel: "Email",
        observed: "34 external attachments",
        baseline: "3 / week",
        contribution: 0.28,
      },
      {
        feature: "Payroll share directory scan",
        channel: "File Access",
        observed: "188 files opened",
        baseline: "0 payroll reads",
        contribution: 0.24,
      },
      {
        feature: "Weekend VPN authentication",
        channel: "Login",
        observed: "Sun 06:40 & 22:15",
        baseline: "Mon-Fri 08:00-17:45",
        contribution: 0.19,
      },
      {
        feature: "USB policy clean",
        channel: "USB",
        observed: "0 mounts",
        baseline: "0 mounts",
        contribution: -0.03,
      },
    ],
    channelDeviation: [
      { channel: "Login Hour", baseline: 16, observed: 72 },
      { channel: "File Volume", baseline: 28, observed: 78 },
      { channel: "USB Activity", baseline: 3, observed: 3 },
      { channel: "Email Volume", baseline: 25, observed: 91 },
      { channel: "Privilege Scope", baseline: 20, observed: 64 },
    ],
    timeline: [
      {
        id: "ev-31",
        timestamp: "19:44:12",
        channel: "File Access",
        action: "Opened restricted compensation workbook",
        target: "\\\\fs-fin\\exec\\comp_2026_final.xlsx",
        severity: "High",
        detail: "First access by user role outside quarterly audit.",
      },
      {
        id: "ev-32",
        timestamp: "20:09:33",
        channel: "Email",
        action: "Forwarded sensitive attachments to personal mail",
        target: "dkowalski.consulting@gmail.com",
        severity: "High",
        detail: "11 XLSX files totaling 48 MB transmitted off-domain.",
      },
    ],
    history14d: [
      { day: "Nov 13", riskScore: 22, fileVolumeMb: 28, baselineMb: 25, afterHoursLogins: 0, usbEvents: 0, externalEmails: 2 },
      { day: "Nov 14", riskScore: 24, fileVolumeMb: 30, baselineMb: 25, afterHoursLogins: 0, usbEvents: 0, externalEmails: 3 },
      { day: "Nov 15", riskScore: 29, fileVolumeMb: 34, baselineMb: 25, afterHoursLogins: 0, usbEvents: 0, externalEmails: 4 },
      { day: "Nov 16", riskScore: 34, fileVolumeMb: 41, baselineMb: 25, afterHoursLogins: 0, usbEvents: 0, externalEmails: 5 },
      { day: "Nov 17", riskScore: 39, fileVolumeMb: 49, baselineMb: 25, afterHoursLogins: 0, usbEvents: 0, externalEmails: 7 },
      { day: "Nov 18", riskScore: 45, fileVolumeMb: 58, baselineMb: 25, afterHoursLogins: 1, usbEvents: 0, externalEmails: 9 },
      { day: "Nov 19", riskScore: 51, fileVolumeMb: 67, baselineMb: 25, afterHoursLogins: 1, usbEvents: 0, externalEmails: 11 },
      { day: "Nov 20", riskScore: 57, fileVolumeMb: 82, baselineMb: 25, afterHoursLogins: 1, usbEvents: 0, externalEmails: 15 },
      { day: "Nov 21", riskScore: 63, fileVolumeMb: 94, baselineMb: 25, afterHoursLogins: 1, usbEvents: 0, externalEmails: 18 },
      { day: "Nov 22", riskScore: 68, fileVolumeMb: 112, baselineMb: 25, afterHoursLogins: 1, usbEvents: 0, externalEmails: 21 },
      { day: "Nov 23", riskScore: 73, fileVolumeMb: 129, baselineMb: 25, afterHoursLogins: 2, usbEvents: 0, externalEmails: 25 },
      { day: "Nov 24", riskScore: 77, fileVolumeMb: 145, baselineMb: 25, afterHoursLogins: 2, usbEvents: 0, externalEmails: 29 },
      { day: "Nov 25", riskScore: 80, fileVolumeMb: 162, baselineMb: 25, afterHoursLogins: 2, usbEvents: 0, externalEmails: 31 },
      { day: "Nov 26", riskScore: 82, fileVolumeMb: 188, baselineMb: 25, afterHoursLogins: 2, usbEvents: 0, externalEmails: 34 },
    ],
    analystNotes: "Escalated to Finance Compliance and DLP team; outbound mail rule queued.",
  },
  {
    id: "usr-5519",
    certId: "CERT-KTH0551",
    name: "Kenji Takahashi",
    initials: "KT",
    email: "k.takahashi@enterprise.internal",
    department: "Infrastructure",
    role: "Cloud Systems Integrator",
    hostId: "PC-INF-0221",
    riskScore: 78,
    threatLevel: "High",
    status: "Flagged",
    lastActivity: "31m ago",
    primaryTrigger: "USB keystroke/storage mount + SSH config copy",
    explanationSummary:
      "Isolation Forest detected an acute USB device insertion immediately followed by `.ssh` and Kubernetes kubeconfig directory reads.",
    models: {
      isolationForest: 0.86,
      autoencoder: 0.77,
      lstm: 0.71,
      ensemble: 0.78,
    },
    shapBaseValue: 0.14,
    shapFactors: [
      {
        feature: "Unknown USB device mounted",
        channel: "USB",
        observed: "SanDisk Cruzer / 14m",
        baseline: "0 USB mounts",
        contribution: 0.30,
      },
      {
        feature: "Credential directory reads",
        channel: "File Access",
        observed: "19 key & kubeconfig files",
        baseline: "1 / week",
        contribution: 0.24,
      },
      {
        feature: "Simultaneous dual-host logon",
        channel: "Login",
        observed: "PC-INF-0221 + bastion-eu",
        baseline: "Single active host",
        contribution: 0.14,
      },
      {
        feature: "Standard workday timing",
        channel: "Login",
        observed: "14:22 local",
        baseline: "09:00 - 18:00",
        contribution: -0.04,
      },
    ],
    channelDeviation: [
      { channel: "Login Hour", baseline: 22, observed: 46 },
      { channel: "File Volume", baseline: 26, observed: 71 },
      { channel: "USB Activity", baseline: 4, observed: 86 },
      { channel: "Email Volume", baseline: 18, observed: 22 },
      { channel: "Privilege Scope", baseline: 40, observed: 81 },
    ],
    timeline: [
      {
        id: "ev-41",
        timestamp: "14:22:08",
        channel: "USB",
        action: "USB storage connected to workstation",
        target: "USB\\VID_0781_PID_5567",
        severity: "High",
        detail: "Device serial absent from IT asset inventory.",
      },
      {
        id: "ev-42",
        timestamp: "14:25:19",
        channel: "File Access",
        action: "Copied cluster kubeconfig & PEM keys",
        target: "/home/ktakahashi/.kube/prod-cluster.yaml",
        severity: "Critical",
        detail: "19 credential artifacts copied within 3 minutes of USB mount.",
      },
    ],
    history14d: [
      { day: "Nov 13", riskScore: 15, fileVolumeMb: 20, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 14", riskScore: 14, fileVolumeMb: 18, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 15", riskScore: 16, fileVolumeMb: 24, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 16", riskScore: 19, fileVolumeMb: 25, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 17", riskScore: 18, fileVolumeMb: 21, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 18", riskScore: 17, fileVolumeMb: 23, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 19", riskScore: 21, fileVolumeMb: 26, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 20", riskScore: 20, fileVolumeMb: 19, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 21", riskScore: 24, fileVolumeMb: 28, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 22", riskScore: 22, fileVolumeMb: 25, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 23", riskScore: 23, fileVolumeMb: 27, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 24", riskScore: 25, fileVolumeMb: 31, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 25", riskScore: 29, fileVolumeMb: 35, baselineMb: 22, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 26", riskScore: 78, fileVolumeMb: 142, baselineMb: 22, afterHoursLogins: 1, usbEvents: 2, externalEmails: 2 },
    ],
    analystNotes: "Awaiting confirmation on whether USB staging tool was authorized for air-gapped node setup.",
  },
  {
    id: "usr-6204",
    certId: "CERT-NBA0620",
    name: "Nadia Benali",
    initials: "NB",
    email: "n.benali@enterprise.internal",
    department: "Analytics",
    role: "Lead Data Engineer",
    hostId: "PC-ANA-0044",
    riskScore: 74,
    threatLevel: "High",
    status: "Investigating",
    lastActivity: "48m ago",
    primaryTrigger: "Large Parquet warehouse export + late-night VPN session",
    explanationSummary:
      "Autoencoder reconstruction error spiked on an unscheduled 1.1 GB Parquet table export at 00:42 outside ETL batch hours.",
    models: {
      isolationForest: 0.70,
      autoencoder: 0.81,
      lstm: 0.72,
      ensemble: 0.74,
    },
    shapBaseValue: 0.14,
    shapFactors: [
      {
        feature: "Parquet warehouse export size",
        channel: "File Access",
        observed: "1.12 GB",
        baseline: "85 MB / day",
        contribution: 0.27,
      },
      {
        feature: "Midnight VPN session",
        channel: "Login",
        observed: "00:42 local",
        baseline: "09:15 - 18:30",
        contribution: 0.21,
      },
      {
        feature: "Destination path local drive",
        channel: "File Access",
        observed: "C:\\Users\\nbenali\\export",
        baseline: "S3 staging bucket",
        contribution: 0.15,
      },
      {
        feature: "Zero external emails",
        channel: "Email",
        observed: "0 external mails",
        baseline: "2 / week",
        contribution: -0.03,
      },
    ],
    channelDeviation: [
      { channel: "Login Hour", baseline: 21, observed: 76 },
      { channel: "File Volume", baseline: 38, observed: 87 },
      { channel: "USB Activity", baseline: 2, observed: 2 },
      { channel: "Email Volume", baseline: 19, observed: 17 },
      { channel: "Privilege Scope", baseline: 34, observed: 58 },
    ],
    timeline: [
      {
        id: "ev-51",
        timestamp: "00:42:11",
        channel: "Login",
        action: "Remote VPN authentication",
        target: "vpn-gw-03 -> PC-ANA-0044",
        severity: "Medium",
        detail: "Session initiated outside scheduled ETL rotation.",
      },
      {
        id: "ev-52",
        timestamp: "00:51:04",
        channel: "File Access",
        action: "Warehouse snapshot exported locally",
        target: "C:\\Users\\nbenali\\export\\cust_cohort.parquet",
        severity: "High",
        detail: "1.12 GB written to local disk instead of staging bucket.",
      },
    ],
    history14d: [
      { day: "Nov 13", riskScore: 20, fileVolumeMb: 80, baselineMb: 85, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 14", riskScore: 21, fileVolumeMb: 82, baselineMb: 85, afterHoursLogins: 0, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 15", riskScore: 19, fileVolumeMb: 74, baselineMb: 85, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 16", riskScore: 24, fileVolumeMb: 91, baselineMb: 85, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 17", riskScore: 22, fileVolumeMb: 88, baselineMb: 85, afterHoursLogins: 0, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 18", riskScore: 25, fileVolumeMb: 96, baselineMb: 85, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 19", riskScore: 23, fileVolumeMb: 84, baselineMb: 85, afterHoursLogins: 0, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 20", riskScore: 28, fileVolumeMb: 112, baselineMb: 85, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 21", riskScore: 31, fileVolumeMb: 138, baselineMb: 85, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 22", riskScore: 36, fileVolumeMb: 180, baselineMb: 85, afterHoursLogins: 1, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 23", riskScore: 41, fileVolumeMb: 225, baselineMb: 85, afterHoursLogins: 1, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 24", riskScore: 49, fileVolumeMb: 340, baselineMb: 85, afterHoursLogins: 1, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 25", riskScore: 62, fileVolumeMb: 680, baselineMb: 85, afterHoursLogins: 1, usbEvents: 0, externalEmails: 0 },
      { day: "Nov 26", riskScore: 74, fileVolumeMb: 1120, baselineMb: 85, afterHoursLogins: 2, usbEvents: 0, externalEmails: 0 },
    ],
    analystNotes: "Contacted user to confirm local Parquet benchmark test.",
  },
  {
    id: "usr-1890",
    certId: "CERT-HAL0189",
    name: "Hannah Albrecht",
    initials: "HA",
    email: "h.albrecht@enterprise.internal",
    department: "Legal",
    role: "Senior Legal Counsel",
    hostId: "PC-LEG-0019",
    riskScore: 64,
    threatLevel: "Medium",
    status: "Investigating",
    lastActivity: "1h ago",
    primaryTrigger: "Off-hours contract archive access + 6 external counsel emails",
    explanationSummary:
      "Elevated off-hours PDF contract downloads coinciding with external counsel attachments; moderate anomaly confidence.",
    models: {
      isolationForest: 0.59,
      autoencoder: 0.65,
      lstm: 0.68,
      ensemble: 0.64,
    },
    shapBaseValue: 0.14,
    shapFactors: [
      {
        feature: "Contract vault batch read",
        channel: "File Access",
        observed: "76 PDFs in 25m",
        baseline: "14 / day",
        contribution: 0.23,
      },
      {
        feature: "External legal domain mail",
        channel: "Email",
        observed: "6 attachments",
        baseline: "2 / day",
        contribution: 0.17,
      },
      {
        feature: "Evening session (21:30)",
        channel: "Login",
        observed: "21:30 local",
        baseline: "08:30 - 18:30",
        contribution: 0.13,
      },
      {
        feature: "Known partner domain allowlist",
        channel: "Email",
        observed: "keller-law.de",
        baseline: "Approved counsel",
        contribution: -0.03,
      },
    ],
    channelDeviation: [
      { channel: "Login Hour", baseline: 22, observed: 61 },
      { channel: "File Volume", baseline: 31, observed: 69 },
      { channel: "USB Activity", baseline: 2, observed: 2 },
      { channel: "Email Volume", baseline: 36, observed: 64 },
      { channel: "Privilege Scope", baseline: 25, observed: 35 },
    ],
    timeline: [
      {
        id: "ev-61",
        timestamp: "21:30:18",
        channel: "File Access",
        action: "Batch opened vendor NDA archive",
        target: "\\\\fs-leg\\contracts\\2026-nda\\",
        severity: "Medium",
        detail: "76 PDF documents accessed inside 25-minute window.",
      },
      {
        id: "ev-62",
        timestamp: "21:58:02",
        channel: "Email",
        action: "Sent redlined agreements to external counsel",
        target: "partner@keller-law.de",
        severity: "Normal",
        detail: "Recipient domain matches approved M&A counsel directory.",
      },
    ],
    history14d: [
      { day: "Nov 13", riskScore: 19, fileVolumeMb: 14, baselineMb: 16, afterHoursLogins: 0, usbEvents: 0, externalEmails: 2 },
      { day: "Nov 14", riskScore: 22, fileVolumeMb: 18, baselineMb: 16, afterHoursLogins: 0, usbEvents: 0, externalEmails: 2 },
      { day: "Nov 15", riskScore: 21, fileVolumeMb: 15, baselineMb: 16, afterHoursLogins: 0, usbEvents: 0, externalEmails: 1 },
      { day: "Nov 16", riskScore: 25, fileVolumeMb: 21, baselineMb: 16, afterHoursLogins: 0, usbEvents: 0, externalEmails: 3 },
      { day: "Nov 17", riskScore: 23, fileVolumeMb: 19, baselineMb: 16, afterHoursLogins: 0, usbEvents: 0, externalEmails: 2 },
      { day: "Nov 18", riskScore: 27, fileVolumeMb: 24, baselineMb: 16, afterHoursLogins: 0, usbEvents: 0, externalEmails: 3 },
      { day: "Nov 19", riskScore: 29, fileVolumeMb: 26, baselineMb: 16, afterHoursLogins: 0, usbEvents: 0, externalEmails: 3 },
      { day: "Nov 20", riskScore: 34, fileVolumeMb: 31, baselineMb: 16, afterHoursLogins: 1, usbEvents: 0, externalEmails: 4 },
      { day: "Nov 21", riskScore: 38, fileVolumeMb: 36, baselineMb: 16, afterHoursLogins: 1, usbEvents: 0, externalEmails: 4 },
      { day: "Nov 22", riskScore: 42, fileVolumeMb: 44, baselineMb: 16, afterHoursLogins: 1, usbEvents: 0, externalEmails: 4 },
      { day: "Nov 23", riskScore: 47, fileVolumeMb: 52, baselineMb: 16, afterHoursLogins: 1, usbEvents: 0, externalEmails: 5 },
      { day: "Nov 24", riskScore: 52, fileVolumeMb: 60, baselineMb: 16, afterHoursLogins: 1, usbEvents: 0, externalEmails: 5 },
      { day: "Nov 25", riskScore: 59, fileVolumeMb: 68, baselineMb: 16, afterHoursLogins: 1, usbEvents: 0, externalEmails: 6 },
      { day: "Nov 26", riskScore: 64, fileVolumeMb: 76, baselineMb: 16, afterHoursLogins: 2, usbEvents: 0, externalEmails: 6 },
    ],
    analystNotes: "Likely tied to Q4 supplier closing; verifying deal room exemption.",
  },
  {
    id: "usr-7302",
    certId: "CERT-SMS0730",
    name: "Samuel Mensah",
    initials: "SM",
    email: "s.mensah@enterprise.internal",
    department: "Infrastructure",
    role: "Site Reliability Engineer",
    hostId: "PC-INF-0309",
    riskScore: 58,
    threatLevel: "Medium",
    status: "Flagged",
    lastActivity: "2h ago",
    primaryTrigger: "Repeated failed sudo attempts + log archive read",
    explanationSummary:
      "Elevated privilege escalation retries on staging nodes combined with local system log collection.",
    models: {
      isolationForest: 0.61,
      autoencoder: 0.56,
      lstm: 0.57,
      ensemble: 0.58,
    },
    shapBaseValue: 0.14,
    shapFactors: [
      {
        feature: "Privilege elevation retries",
        channel: "Login",
        observed: "7 failed sudo calls",
        baseline: "0.2 / week",
        contribution: 0.24,
      },
      {
        feature: "Auth log bundle export",
        channel: "File Access",
        observed: "110 MB .log tar",
        baseline: "12 MB / day",
        contribution: 0.14,
      },
      {
        feature: "On-call rotation window",
        channel: "Login",
        observed: "Scheduled shift",
        baseline: "On-call SRE",
        contribution: -0.05,
      },
    ],
    channelDeviation: [
      { channel: "Login Hour", baseline: 35, observed: 55 },
      { channel: "File Volume", baseline: 28, observed: 52 },
      { channel: "USB Activity", baseline: 3, observed: 3 },
      { channel: "Email Volume", baseline: 14, observed: 16 },
      { channel: "Privilege Scope", baseline: 42, observed: 71 },
    ],
    timeline: [
      {
        id: "ev-71",
        timestamp: "16:12:30",
        channel: "Login",
        action: "Multiple sudo permission denials",
        target: "node-staging-07",
        severity: "Medium",
        detail: "7 elevation attempts rejected by PAM policy.",
      },
    ],
    history14d: Array.from({ length: 14 }, (_, idx) => ({
      day: `Nov ${13 + idx}`,
      riskScore: idx < 11 ? 21 + idx : 42 + (idx - 11) * 8,
      fileVolumeMb: idx < 11 ? 14 : 65 + (idx - 11) * 20,
      baselineMb: 15,
      afterHoursLogins: idx > 11 ? 1 : 0,
      usbEvents: 0,
      externalEmails: 0,
    })),
    analystNotes: "Check staging PAM change request before closing.",
  },
  {
    id: "usr-8841",
    certId: "CERT-CBE0884",
    name: "Claire Beaumont",
    initials: "CB",
    email: "c.beaumont@enterprise.internal",
    department: "R&D",
    role: "Technical Product Manager",
    hostId: "PC-RD-0112",
    riskScore: 29,
    threatLevel: "Low",
    status: "Cleared",
    lastActivity: "3h ago",
    primaryTrigger: "Normal baseline activity",
    explanationSummary: "Behavioral signals remain within 1.1 standard deviations of 90-day baseline.",
    models: {
      isolationForest: 0.27,
      autoencoder: 0.31,
      lstm: 0.28,
      ensemble: 0.29,
    },
    shapBaseValue: 0.14,
    shapFactors: [
      {
        feature: "Minor spike in slide deck reads",
        channel: "File Access",
        observed: "48 MB",
        baseline: "32 MB",
        contribution: 0.09,
      },
      {
        feature: "Standard shift hours",
        channel: "Login",
        observed: "09:10 - 17:40",
        baseline: "09:00 - 18:00",
        contribution: -0.05,
      },
    ],
    channelDeviation: [
      { channel: "Login Hour", baseline: 20, observed: 22 },
      { channel: "File Volume", baseline: 25, observed: 34 },
      { channel: "USB Activity", baseline: 2, observed: 2 },
      { channel: "Email Volume", baseline: 30, observed: 33 },
      { channel: "Privilege Scope", baseline: 18, observed: 19 },
    ],
    timeline: [
      {
        id: "ev-81",
        timestamp: "11:18:04",
        channel: "File Access",
        action: "Opened Q1 roadmap deck",
        target: "\\\\fs-rd\\planning\\roadmap_2027.pptx",
        severity: "Normal",
        detail: "Routine team share access during core business hours.",
      },
    ],
    history14d: Array.from({ length: 14 }, (_, idx) => ({
      day: `Nov ${13 + idx}`,
      riskScore: 22 + (idx % 7),
      fileVolumeMb: 28 + (idx % 5) * 4,
      baselineMb: 32,
      afterHoursLogins: 0,
      usbEvents: 0,
      externalEmails: 1,
    })),
    analystNotes: "Routine activity verified.",
  },
  {
    id: "usr-9102",
    certId: "CERT-VPT0910",
    name: "Viktor Petrov",
    initials: "VP",
    email: "v.petrov@enterprise.internal",
    department: "Compliance",
    role: "Security Compliance Auditor",
    hostId: "PC-CMP-0012",
    riskScore: 21,
    threatLevel: "Low",
    status: "Cleared",
    lastActivity: "5h ago",
    primaryTrigger: "Normal baseline activity",
    explanationSummary: "No anomalous behavior detected across login, file, email, or USB telemetry.",
    models: {
      isolationForest: 0.19,
      autoencoder: 0.22,
      lstm: 0.21,
      ensemble: 0.21,
    },
    shapBaseValue: 0.14,
    shapFactors: [
      {
        feature: "Routine audit PDF downloads",
        channel: "File Access",
        observed: "18 MB",
        baseline: "20 MB",
        contribution: 0.04,
      },
      {
        feature: "Single assigned workstation",
        channel: "Login",
        observed: "PC-CMP-0012",
        baseline: "PC-CMP-0012",
        contribution: -0.05,
      },
    ],
    channelDeviation: [
      { channel: "Login Hour", baseline: 18, observed: 19 },
      { channel: "File Volume", baseline: 21, observed: 20 },
      { channel: "USB Activity", baseline: 2, observed: 2 },
      { channel: "Email Volume", baseline: 22, observed: 24 },
      { channel: "Privilege Scope", baseline: 20, observed: 21 },
    ],
    timeline: [
      {
        id: "ev-91",
        timestamp: "10:05:19",
        channel: "File Access",
        action: "Reviewed SOC2 control evidence",
        target: "\\\\fs-cmp\\audit\\soc2_2026.pdf",
        severity: "Normal",
        detail: "Normal compliance read pattern.",
      },
    ],
    history14d: Array.from({ length: 14 }, (_, idx) => ({
      day: `Nov ${13 + idx}`,
      riskScore: 18 + (idx % 4),
      fileVolumeMb: 18 + (idx % 3) * 2,
      baselineMb: 20,
      afterHoursLogins: 0,
      usbEvents: 0,
      externalEmails: 1,
    })),
    analystNotes: "Baseline normal.",
  },
];

export const CERT_BENCHMARKS: CertModelMetric[] = [
  // CERT r6.2
  {
    model: "RiskSage Ensemble",
    dataset: "r6.2",
    auc: 0.964,
    detectionRate: 94.8,
    falsePositiveRate: 1.4,
    f1Score: 0.921,
    latencyMs: 18,
    focus: "Weighted fusion + SHAP attribution",
  },
  {
    model: "LSTM Sequence",
    dataset: "r6.2",
    auc: 0.928,
    detectionRate: 89.2,
    falsePositiveRate: 2.8,
    f1Score: 0.874,
    latencyMs: 11,
    focus: "Gradual multi-day behavioral drift",
  },
  {
    model: "Autoencoder",
    dataset: "r6.2",
    auc: 0.905,
    detectionRate: 86.4,
    falsePositiveRate: 3.5,
    f1Score: 0.842,
    latencyMs: 6,
    focus: "Reconstruction error on feature combinations",
  },
  {
    model: "Isolation Forest",
    dataset: "r6.2",
    auc: 0.879,
    detectionRate: 82.1,
    falsePositiveRate: 4.9,
    f1Score: 0.806,
    latencyMs: 4,
    focus: "Sudden single-session point outliers",
  },
  // CERT r5.2
  {
    model: "RiskSage Ensemble",
    dataset: "r5.2",
    auc: 0.971,
    detectionRate: 95.6,
    falsePositiveRate: 1.2,
    f1Score: 0.934,
    latencyMs: 17,
    focus: "Weighted fusion + SHAP attribution",
  },
  {
    model: "LSTM Sequence",
    dataset: "r5.2",
    auc: 0.936,
    detectionRate: 90.4,
    falsePositiveRate: 2.5,
    f1Score: 0.885,
    latencyMs: 10,
    focus: "Gradual multi-day behavioral drift",
  },
  {
    model: "Autoencoder",
    dataset: "r5.2",
    auc: 0.914,
    detectionRate: 87.9,
    falsePositiveRate: 3.1,
    f1Score: 0.858,
    latencyMs: 6,
    focus: "Reconstruction error on feature combinations",
  },
  {
    model: "Isolation Forest",
    dataset: "r5.2",
    auc: 0.888,
    detectionRate: 83.5,
    falsePositiveRate: 4.4,
    f1Score: 0.819,
    latencyMs: 4,
    focus: "Sudden single-session point outliers",
  },
];

export const CERT_ROC_CURVES: Record<"r5.2" | "r6.2", RocPoint[]> = {
  "r6.2": [
    { fpr: 0, ensemble: 0, lstm: 0, autoencoder: 0, isolationForest: 0 },
    { fpr: 1, ensemble: 86, lstm: 74, autoencoder: 68, isolationForest: 61 },
    { fpr: 2, ensemble: 95, lstm: 85, autoencoder: 79, isolationForest: 73 },
    { fpr: 4, ensemble: 97, lstm: 91, autoencoder: 86, isolationForest: 81 },
    { fpr: 8, ensemble: 98.5, lstm: 94.5, autoencoder: 91, isolationForest: 87 },
    { fpr: 15, ensemble: 99.4, lstm: 96.8, autoencoder: 94.5, isolationForest: 91.5 },
    { fpr: 30, ensemble: 99.8, lstm: 98.4, autoencoder: 97.1, isolationForest: 95.2 },
    { fpr: 100, ensemble: 100, lstm: 100, autoencoder: 100, isolationForest: 100 },
  ],
  "r5.2": [
    { fpr: 0, ensemble: 0, lstm: 0, autoencoder: 0, isolationForest: 0 },
    { fpr: 1, ensemble: 89, lstm: 77, autoencoder: 71, isolationForest: 64 },
    { fpr: 2, ensemble: 96, lstm: 87, autoencoder: 82, isolationForest: 75 },
    { fpr: 4, ensemble: 98, lstm: 92, autoencoder: 88, isolationForest: 83 },
    { fpr: 8, ensemble: 99, lstm: 95.4, autoencoder: 92.2, isolationForest: 88.4 },
    { fpr: 15, ensemble: 99.6, lstm: 97.4, autoencoder: 95.3, isolationForest: 92.6 },
    { fpr: 30, ensemble: 99.9, lstm: 98.9, autoencoder: 97.8, isolationForest: 96.1 },
    { fpr: 100, ensemble: 100, lstm: 100, autoencoder: 100, isolationForest: 100 },
  ],
};

export const TELEMETRY_14D_OVERVIEW = [
  { day: "Nov 13", totalEvents: 14200, anomalies: 4, loginFlags: 1, fileFlags: 2, emailFlags: 1, usbFlags: 0 },
  { day: "Nov 14", totalEvents: 14850, anomalies: 3, loginFlags: 1, fileFlags: 1, emailFlags: 1, usbFlags: 0 },
  { day: "Nov 15", totalEvents: 13900, anomalies: 5, loginFlags: 2, fileFlags: 2, emailFlags: 1, usbFlags: 0 },
  { day: "Nov 16", totalEvents: 9400, anomalies: 2, loginFlags: 1, fileFlags: 1, emailFlags: 0, usbFlags: 0 },
  { day: "Nov 17", riskPeak: 41, totalEvents: 8800, anomalies: 3, loginFlags: 1, fileFlags: 1, emailFlags: 1, usbFlags: 0 },
  { day: "Nov 18", totalEvents: 15100, anomalies: 6, loginFlags: 2, fileFlags: 2, emailFlags: 1, usbFlags: 1 },
  { day: "Nov 19", totalEvents: 15640, anomalies: 7, loginFlags: 2, fileFlags: 3, emailFlags: 2, usbFlags: 0 },
  { day: "Nov 20", totalEvents: 16200, anomalies: 8, loginFlags: 3, fileFlags: 3, emailFlags: 2, usbFlags: 0 },
  { day: "Nov 21", totalEvents: 15980, anomalies: 9, loginFlags: 2, fileFlags: 4, emailFlags: 2, usbFlags: 1 },
  { day: "Nov 22", totalEvents: 16720, anomalies: 11, loginFlags: 3, fileFlags: 4, emailFlags: 3, usbFlags: 1 },
  { day: "Nov 23", totalEvents: 11200, anomalies: 12, loginFlags: 4, fileFlags: 4, emailFlags: 2, usbFlags: 2 },
  { day: "Nov 24", totalEvents: 11950, anomalies: 15, loginFlags: 4, fileFlags: 5, emailFlags: 4, usbFlags: 2 },
  { day: "Nov 25", totalEvents: 17400, anomalies: 19, loginFlags: 5, fileFlags: 6, emailFlags: 5, usbFlags: 3 },
  { day: "Nov 26", totalEvents: 18340, anomalies: 24, loginFlags: 6, fileFlags: 8, emailFlags: 6, usbFlags: 4 },
];

export const RISK_DISTRIBUTION = [
  { bucket: "Low (0-39)", count: 3640, fill: "#2f5732" },
  { bucket: "Medium (40-69)", count: 184, fill: "#6b9963" },
  { bucket: "High (70-84)", count: 29, fill: "#d9a441" },
  { bucket: "Critical (85-100)", count: 11, fill: "#ef6461" },
];

export const KAFKA_TOPICS = [
  { topic: "cert.auth.logon", partitions: 8, throughput: "1,420 msg/s", lag: "12 ms", status: "Streaming" },
  { topic: "cert.file.access", partitions: 12, throughput: "3,180 msg/s", lag: "18 ms", status: "Streaming" },
  { topic: "cert.email.outbound", partitions: 6, throughput: "640 msg/s", lag: "9 ms", status: "Streaming" },
  { topic: "cert.device.usb", partitions: 4, throughput: "190 msg/s", lag: "7 ms", status: "Streaming" },
];
