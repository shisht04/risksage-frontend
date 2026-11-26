"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Cpu, Pulse } from "@phosphor-icons/react";
import { CERT_BENCHMARKS, CERT_ROC_CURVES, KAFKA_TOPICS } from "@/data/risksage";

export function CertBenchmarkPanel() {
  const [dataset, setDataset] = useState<"r6.2" | "r5.2">("r6.2");

  const metrics = CERT_BENCHMARKS.filter((m) => m.dataset === dataset);
  const rocPoints = CERT_ROC_CURVES[dataset];

  const comparisonBarData = metrics.map((m) => ({
    model: m.model.replace("RiskSage ", ""),
    detectionRate: m.detectionRate,
    aucPct: Number((m.auc * 100).toFixed(1)),
    fpr: m.falsePositiveRate,
  }));

  return (
    <div className="space-y-6">
      {/* Header & Dataset Switcher */}
      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#162a17] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-medium text-white">
            CMU CERT Insider Threat Model Evaluation
          </h2>
          <p className="mt-1 text-sm text-[#9aa39a]">
            Benchmarking RiskSage Ensemble against Isolation Forest, Autoencoder, and LSTM
            detectors on CERT {dataset}.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-white/10 bg-[#0f1f10] p-1">
          {(["r6.2", "r5.2"] as const).map((ver) => (
            <button
              key={ver}
              type="button"
              onClick={() => setDataset(ver)}
              className={`rounded-md px-3.5 py-1.5 font-mono-code text-xs font-medium transition ${
                dataset === ver
                  ? "bg-[#c6f19d] text-[#0f1f10]"
                  : "text-[#9aa39a] hover:text-white"
              }`}
            >
              CERT {ver}
            </button>
          ))}
        </div>
      </div>

      {/* Charts: ROC Curve + Detection/AUC Bar Chart */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="rounded-xl border border-white/10 bg-[#162a17] p-5 sm:p-6 xl:col-span-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-white">ROC Curve Comparison (CERT {dataset})</h3>
              <p className="text-xs text-[#9aa39a]">
                True Positive Rate (%) vs. False Positive Rate (%)
              </p>
            </div>
            <span className="font-mono-code text-xs text-[#c6f19d]">
              Ensemble AUC {metrics[0].auc.toFixed(3)}
            </span>
          </div>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocPoints} margin={{ top: 10, right: 16, left: -12, bottom: 4 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="fpr"
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: "#9aa39a", fontSize: 11, fontFamily: "JetBrains Mono" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: "#9aa39a", fontSize: 11, fontFamily: "JetBrains Mono" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1f10",
                    borderColor: "rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#ffffff",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="ensemble"
                  name="RiskSage Ensemble"
                  stroke="#c6f19d"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="lstm"
                  name="LSTM Sequence"
                  stroke="#79b8ff"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="autoencoder"
                  name="Autoencoder"
                  stroke="#f6cd7a"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="isolationForest"
                  name="Isolation Forest"
                  stroke="#9aa39a"
                  strokeWidth={1.75}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#162a17] p-5 sm:p-6 xl:col-span-6">
          <div>
            <h3 className="text-base font-medium text-white">Detection Rate &amp; AUC by Model</h3>
            <p className="text-xs text-[#9aa39a]">
              Ensemble improves recall while suppressing false alarms to {metrics[0].falsePositiveRate}%
            </p>
          </div>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonBarData}
                margin={{ top: 10, right: 16, left: -12, bottom: 4 }}
              >
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="model"
                  tick={{ fill: "#9aa39a", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#9aa39a", fontSize: 11, fontFamily: "JetBrains Mono" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1f10",
                    borderColor: "rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#ffffff",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="aucPct" name="AUC (%)" fill="#c6f19d" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="detectionRate"
                  name="Detection Rate (%)"
                  fill="#6b9963"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="fpr" name="False Positive (%)" fill="#ef6461" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Metrics Table + Kafka / FastAPI Stream Status */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#162a17] p-5 sm:p-6 xl:col-span-7">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-medium text-white">Model Evaluation Table ({dataset})</h3>
            <Cpu className="h-4 w-4 text-[#c6f19d]" />
          </div>
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-[#9aa39a]">
                <th className="pb-3 font-medium">Model</th>
                <th className="pb-3 font-medium">AUC</th>
                <th className="pb-3 font-medium">Detection Rate</th>
                <th className="pb-3 font-medium">FPR</th>
                <th className="pb-3 font-medium">F1</th>
                <th className="pb-3 font-medium">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {metrics.map((m, idx) => (
                <tr key={m.model} className={idx === 0 ? "bg-[#c6f19d]/5" : ""}>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-white">{m.model}</p>
                    <p className="text-xs text-[#9aa39a]">{m.focus}</p>
                  </td>
                  <td className="py-3 font-mono-code text-white">{m.auc.toFixed(3)}</td>
                  <td className="py-3 font-mono-code text-[#c6f19d]">
                    {m.detectionRate.toFixed(1)}%
                  </td>
                  <td className="py-3 font-mono-code text-white">
                    {m.falsePositiveRate.toFixed(1)}%
                  </td>
                  <td className="py-3 font-mono-code text-white">{m.f1Score.toFixed(3)}</td>
                  <td className="py-3 font-mono-code text-[#9aa39a]">{m.latencyMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#162a17] p-5 sm:p-6 xl:col-span-5">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="text-base font-medium text-white">Kafka &amp; FastAPI Stream Pipeline</h3>
              <p className="text-xs text-[#9aa39a]">Simulated real-time event ingestion topics</p>
            </div>
            <Pulse className="h-4 w-4 text-[#c6f19d]" />
          </div>
          <div className="space-y-3">
            {KAFKA_TOPICS.map((t) => (
              <div
                key={t.topic}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0f1f10]/70 px-4 py-3"
              >
                <div>
                  <p className="font-mono-code text-xs font-medium text-white">{t.topic}</p>
                  <p className="mt-0.5 text-xs text-[#9aa39a]">
                    {t.partitions} partitions · Lag {t.lag}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono-code text-xs text-[#c6f19d]">{t.throughput}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#9aa39a]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c6f19d]" />
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
