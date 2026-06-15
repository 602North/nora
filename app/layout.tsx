import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NORA – Marketing Services",
  description: "Lead generation, quote capture, and appointment scheduling for your business.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-gray-900 text-lg tracking-tight">NORA</Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Get a Quote</Link>
              <Link href="/quote" className="text-gray-600 hover:text-gray-900">Book a Consultation</Link>
              <Link href="/admin" className="text-gray-400 hover:text-gray-600">Admin</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
