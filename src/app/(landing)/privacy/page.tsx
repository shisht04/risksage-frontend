import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main id="top" className="wrap" style={{ paddingBlock: "120px 72px", maxWidth: "760px" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "24px" }}>Privacy notice</h1>
      <p style={{ marginBottom: "16px", lineHeight: 1.65 }}>
        RiskSage processes enterprise behavioral telemetry (authentication logs, file access metadata,
        outbound email headers, and removable media mount events) strictly within your tenant boundary.
      </p>
      <p style={{ marginBottom: "32px", lineHeight: 1.65 }}>
        This static frontend demonstration uses synthetic records modeled on the CMU CERT Insider
        Threat Dataset (r5.2 and r6.2). No personal data is transmitted or stored externally.
      </p>
      <Link className="btn btn--primary" href="/">
        Return to RiskSage
      </Link>
    </main>
  );
}
