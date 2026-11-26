import Link from "next/link";

export default function TermsPage() {
  return (
    <main id="top" className="wrap" style={{ paddingBlock: "120px 72px", maxWidth: "760px" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "24px" }}>Terms of use</h1>
      <p style={{ marginBottom: "16px", lineHeight: 1.65 }}>
        RiskSage provides explainable anomaly detection scores and SHAP attribution outputs for
        authorized security operations analysts.
      </p>
      <p style={{ marginBottom: "32px", lineHeight: 1.65 }}>
        All benchmark comparisons reference public Carnegie Mellon University CERT Insider Threat
        Dataset evaluations (r5.2 and r6.2) across Isolation Forest, Autoencoder, and LSTM models.
      </p>
      <Link className="btn btn--primary" href="/">
        Return to RiskSage
      </Link>
    </main>
  );
}
