import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Ugatuzi Terminal — Kenya Devolution & Sovereign Fiscal Intelligence",
  description: "Audited primary-source intelligence on Kenya's 47 county governments, sovereign debt, CBK monetary policy, and devolved fiscal flows. Bloomberg x Wikipedia x Modern African Publication.",
  keywords: "Kenya counties, devolution, ugatuzi, CBK, sovereign debt, county allocation, fiscal intelligence, CRA, equitable share",
  openGraph: {
    title: "Ugatuzi Terminal",
    description: "Kenya Devolution & Sovereign Fiscal Intelligence",
    siteName: "Ugatuzi Terminal",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
