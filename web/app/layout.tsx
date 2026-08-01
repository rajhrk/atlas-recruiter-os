import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { AtlasProvider } from "@/context/AtlasContext";
import Sidebar from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas Recruiter OS",
  description: "Talent Intelligence Platform for Technical Recruiters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-50">
        <AtlasProvider>

          <div className="flex min-h-screen">

            <Sidebar />

            <main className="flex-1 overflow-auto">
              {children}
            </main>

          </div>

        </AtlasProvider>
      </body>
    </html>
  );
}