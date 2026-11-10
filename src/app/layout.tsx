import type { Metadata, Viewport } from "next";
import { Anton, Caveat_Brush, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const caveatBrush = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caveat-brush",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jeevan Srinivasan — Digital Marketing Executive",
  description:
    "Portfolio of Jeevan Srinivasan, Digital Marketing Executive based in Coimbatore, Tamil Nadu. Social media marketing, Meta Ads campaign management, lead generation, and Next.js web builds.",
  openGraph: {
    title: "Jeevan Srinivasan — Digital Marketing Executive",
    description:
      "Paid & organic growth campaigns, content production, and Next.js web applications from Coimbatore, Tamil Nadu.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

const BOOT_PRE_HYDRATION_SCRIPT = `
(function() {
  try {
    var params = new URLSearchParams(window.location.search);
    var qp = params.get("agents");
    var stored = null;
    try { stored = window.localStorage.getItem("portfolio-agents"); } catch (e) {}
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var mode;
    if (qp === "on" || qp === "off") {
      mode = qp;
    } else if (stored === "on" || stored === "off") {
      mode = stored;
    } else {
      mode = reduced ? "off" : "on";
    }
    var doc = document.documentElement;
    doc.dataset.agents = mode;
    doc.dataset.agentsForced = qp === "on" ? "true" : "false";
    if (mode === "on") {
      doc.classList.add("build-mode", "booting");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${geistSans.variable} ${geistMono.variable} ${caveatBrush.variable} dark`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: BOOT_PRE_HYDRATION_SCRIPT }}
        />
      </head>
      <body className="min-h-dvh bg-[#09090b] text-zinc-100 font-sans antialiased">
        <a
          href="#main-content"
          className="visually-hidden fixed top-3 left-3 z-50 rounded-md bg-[#ff3b2f] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-950"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
