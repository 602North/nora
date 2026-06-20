"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type FormState = "loading" | "ready" | "error";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get("id");
  const [state, setState] = useState<FormState>("loading");
  const [firstName, setFirstName] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!leadId) {
      setState("error");
      setErrorMsg("Missing lead reference.");
      return;
    }

    let cancelled = false;
    fetch(`/api/confirm-pattern-lead/${leadId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Lead not found");
        return r.json();
      })
      .then(({ lead }) => {
        if (cancelled) return;
        setFirstName(lead.first_name);
        setDownloadUrl("/pattern-discovery-guide.pdf");
        setState("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setState("error");
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      });

    return () => { cancelled = true; };
  }, [leadId]);

  if (state === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600">Loading your guide...</p>
      </main>
    );
  }

  if (state === "error") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="text-gray-600">{errorMsg}</p>
          <a href="/pattern-discovery-guide" className="text-indigo-600 hover:underline">Return to form</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-5xl">✓</div>
        <h1 className="text-2xl font-bold text-gray-900">
          Your Pattern Discovery Guide is ready
        </h1>
        <p className="text-gray-600">
          Thanks{firstName ? `, ${firstName}` : ""}! Click below to download your guide.
          We&apos;ve also sent a confirmation email with this link.
        </p>

        <a
          href={downloadUrl}
          download
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Download Your Guide
        </a>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Want to connect with other AI-era professionals?
          </p>
          <a
            href="https://602north.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-indigo-600 hover:underline font-medium"
          >
            Join North Community →
          </a>
        </div>

        <p className="text-xs text-gray-400">
          Didn&apos;t get the email? Check spam or{" "}
          <a href="/pattern-discovery-guide" className="text-indigo-600 hover:underline">
            re-enter your info
          </a>
          .
        </p>
      </div>
    </main>
  );
}
