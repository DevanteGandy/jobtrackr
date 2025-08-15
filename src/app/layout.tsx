import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobTrackr",
  description: "Track your job applications fast.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        <div className="min-h-dvh bg-[radial-gradient(40rem_20rem_at_20%_-10%,#0b1220,transparent),radial-gradient(50rem_30rem_at_120%_10%,#111827,transparent)]">
          {children}
        </div>
      </body>
    </html>
  );
}
