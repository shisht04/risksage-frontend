import type { Metadata, Viewport } from "next";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "RiskSage: explainable insider threat detection for security teams",
  description:
    "RiskSage scores login, file, email, and USB telemetry across Isolation Forest, Autoencoder, and LSTM models and prints the SHAP factors behind every alert.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f1f10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-type="software"
      data-radius="soft"
      data-ground="sand"
      data-buttons="arrow"
      data-motion=""
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400..700&family=JetBrains+Mono:wght@400..500&display=swap"
          precedence="default"
        />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
