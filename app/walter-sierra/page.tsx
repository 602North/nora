"use client";

import Link from "next/link";
import { useState } from "react";

const WS_SERVICES = [
  "Remodeling",
  "Painting",
  "Metal Roofing",
  "Plumbing / Electrical",
  "Carpentry",
  "Repairs",
];

const SERVICE_ICONS: Record<string, string> = {
  "Remodeling": "🏠",
  "Painting": "🎨",
  "Metal Roofing": "🏗️",
  "Plumbing / Electrical": "🔧",
  "Carpentry": "🪚",
  "Repairs": "🛠️",
};

type FormState = "idle" | "submitting" | "success" | "error";

export default function WalterSierraPage() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedService, setSelectedService] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/ws-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Submission failed");
      }
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-stone-50">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-5xl">✓</div>
          <h1 className="text-2xl font-bold text-stone-900">Thank you!</h1>
          <p className="text-stone-600">
            We&apos;ve received your quote request. Walter Sierra Reconstruction will follow up within 1 business day.
          </p>
          <button
            onClick={() => { setState("idle"); setSelectedService(""); }}
            className="text-sm text-amber-700 hover:underline font-medium"
          >
            Request another quote
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-amber-400 font-semibold text-sm tracking-widest uppercase mb-3">
              Walter Sierra Reconstruction
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Rebuild. Renovate. Restore.
            </h1>
            <p className="mt-4 text-lg text-stone-300 max-w-xl">
              Trusted contractor services for your home or business — remodeling, roofing, carpentry, and more across the region.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {WS_SERVICES.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 bg-stone-700/50 text-stone-200 text-sm px-3 py-1.5 rounded-full"
                >
                  <span>{SERVICE_ICONS[s]}</span>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* Left info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Get a Free Quote</h2>
              <p className="mt-2 text-stone-600">
                Tell us about your project and we&apos;ll provide a detailed, no-obligation estimate.
              </p>
            </div>
            <div className="space-y-4 text-sm text-stone-600">
              <div className="flex items-start gap-3">
                <span className="text-amber-700 text-lg leading-none mt-0.5">✓</span>
                <span>Licensed and insured for all services</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-700 text-lg leading-none mt-0.5">✓</span>
                <span>Free on-site estimates available</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-700 text-lg leading-none mt-0.5">✓</span>
                <span>Serving residential and commercial properties</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 000-0000"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-stone-700 mb-1">
                  Service Needed <span className="text-red-500">*</span>
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                >
                  <option value="">Select a service...</option>
                  {WS_SERVICES.map((s) => (
                    <option key={s} value={s}>{SERVICE_ICONS[s]} {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Describe the scope of work, timeline, or any specific needs..."
                  className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-y"
                />
              </div>

              {state === "error" && (
                <p className="text-sm text-red-600">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-full bg-amber-700 hover:bg-amber-800 disabled:bg-amber-400 text-white font-semibold py-3 rounded-lg transition-colors text-base"
              >
                {state === "submitting" ? "Sending..." : "Get a Free Quote"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-stone-400">
              Your information is kept private and only used to follow up on your quote request.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-stone-500">
          <p className="font-semibold text-stone-700">Walter Sierra Reconstruction</p>
          <p className="mt-1">Licensed &bull; Insured &bull; Bonded</p>
          <p className="mt-4 text-xs text-stone-400">
            Powered by <Link href="/" className="text-amber-700 hover:underline">NORA</Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
