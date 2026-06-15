"use client";

import { useState } from "react";

const SERVICE_OPTIONS = [
  "Lead Generation",
  "Quote Capture",
  "Appointment Scheduling",
  "Marketing Strategy",
  "Content Marketing",
  "Other",
];

type FormState = "idle" | "submitting" | "success" | "error";

export default function LeadCapturePage() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      service_interest: (form.elements.namedItem("service_interest") as HTMLSelectElement).value,
    };

    try {
      const res = await fetch("/api/leads", {
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
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-5xl">✓</div>
          <h1 className="text-2xl font-bold text-gray-900">Thank you!</h1>
          <p className="text-gray-600">
            We&apos;ve received your information and will be in touch shortly with a custom proposal.
          </p>
          <button
            onClick={() => setState("idle")}
            className="text-sm text-indigo-600 hover:underline"
          >
            Submit another inquiry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Get a Free Quote</h1>
          <p className="mt-2 text-gray-600">
            Tell us about your business and we&apos;ll follow up with a custom proposal.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Want to schedule a consultation?{" "}
            <a href="/quote" className="text-indigo-600 hover:underline font-medium" rel="noopener">
              Book a time →
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Jane Smith"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="jane@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(555) 000-0000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              id="company"
              name="company"
              type="text"
              placeholder="Acme Corp"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="service_interest" className="block text-sm font-medium text-gray-700 mb-1">
              Service Interest
            </label>
            <select
              id="service_interest"
              name="service_interest"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Select a service...</option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {state === "error" && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={state === "submitting"}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {state === "submitting" ? "Sending..." : "Request a Quote"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Your information is kept private and only used to follow up on your inquiry.
        </p>
      </div>
    </main>
  );
}
