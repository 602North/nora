"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SERVICE_TYPES = [
  "Lead Generation",
  "Quote Capture",
  "Appointment Scheduling",
  "Marketing Strategy",
  "Content Marketing",
  "SEO & Advertising",
  "Other",
];

type FormState = "idle" | "submitting" | "error";

export default function QuotePage() {
  const router = useRouter();
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
      service_type: (form.elements.namedItem("service_type") as HTMLSelectElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Submission failed");
      router.push(`/schedule?quoteId=${body.quote.id}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
            Step 1 of 2
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Request a Custom Quote</h1>
          <p className="mt-2 text-gray-600">
            Tell us what you need and pick a time to connect.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(555) 000-0000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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
            <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-1">
              Service Type <span className="text-red-500">*</span>
            </label>
            <select
              id="service_type"
              name="service_type"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Select a service...</option>
              {SERVICE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Describe Your Needs <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              minLength={10}
              rows={4}
              placeholder="Tell us about your business goals, current challenges, and what success looks like for you..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {state === "error" && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={state === "submitting"}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {state === "submitting" ? (
              "Saving..."
            ) : (
              <>Continue to Schedule <span aria-hidden>→</span></>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Your information is kept private and only used to follow up on your inquiry.
        </p>
      </div>
    </main>
  );
}
