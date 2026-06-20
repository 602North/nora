"use client";

import { useState } from "react";

const REFERRAL_OPTIONS = [
  { value: "", label: "Select one (optional)..." },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "google", label: "Google" },
  { value: "friend_referral", label: "Friend / Referral" },
  { value: "other", label: "Other" },
];

type FormState = "idle" | "submitting" | "success" | "error";

export default function PatternDiscoveryGuidePage() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [joinNorth, setJoinNorth] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      first_name: (form.elements.namedItem("first_name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      join_north: (form.elements.namedItem("join_north") as HTMLInputElement).checked,
      referral_source: (form.elements.namedItem("referral_source") as HTMLSelectElement).value || undefined,
    };

    try {
      const res = await fetch("/api/pattern-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Submission failed");
      }
      const { lead } = await res.json();
      window.location.href = `/thank-you/pattern-discovery?id=${lead.id}`;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Pattern Discovery Guide</h1>
          <p className="mt-2 text-gray-600">
            Enter your details and we&apos;ll send you the guide right away.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-8 space-y-5">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              placeholder="Jane"
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

          <div className="flex items-start gap-3">
            <input
              id="join_north"
              name="join_north"
              type="checkbox"
              checked={joinNorth}
              onChange={(e) => setJoinNorth(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-0.5"
            />
            <label htmlFor="join_north" className="text-sm text-gray-700 leading-relaxed">
              Join North — free community for AI-era professionals
            </label>
          </div>

          <div>
            <label htmlFor="referral_source" className="block text-sm font-medium text-gray-700 mb-1">
              Where did you hear about us?
            </label>
            <select
              id="referral_source"
              name="referral_source"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {REFERRAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
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
            {state === "submitting" ? "Sending..." : "Send Me the Guide"}
          </button>

          <p className="text-center text-xs text-gray-400">
            Your info is kept private. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </main>
  );
}
