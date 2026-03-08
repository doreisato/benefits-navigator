import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benefits Navigator — Find Government Benefits You Qualify For",
  description:
    "Free, instant benefits calculator. Enter your info and discover SNAP, WIC, Medicaid and more programs you may qualify for. No signup required.",
  keywords: ["benefits calculator", "SNAP eligibility", "food stamps", "WIC", "Medicaid", "government benefits"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
