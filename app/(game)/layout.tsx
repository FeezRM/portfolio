import type { Metadata } from "next";
import { Barlow_Condensed, JetBrains_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "./game.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Faiz Kerawala | AI Engineer and Software Engineer",
  description:
    "Portfolio for Faiz Kerawala, an AI Engineer and Software Engineer building real-world computer vision, LLM, agentic AI, and full-stack software systems.",
  authors: [{ name: "Faiz Kerawala" }],
  openGraph: {
    title: "Faiz Kerawala | AI Engineer and Software Engineer",
    description:
      "AI engineering and software portfolio focused on practical systems with measurable impact.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body
        data-experience="game"
        suppressHydrationWarning
        className={`${display.variable} ${body.variable} ${mono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
