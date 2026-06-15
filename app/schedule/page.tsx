"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Slot {
  id: number;
  slot_time: string;
}

interface SlotsByDate {
  date: string;
  slots: Slot[];
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  const [h, min] = timeStr.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(min).padStart(2, "0")} ${suffix}`;
}

function ScheduleContent() {
  const params = useSearchParams();
  const router = useRouter();
  const quoteId = params.get("quoteId");

  const [slotsByDate, setSlotsByDate] = useState<SlotsByDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [bookingState, setBookingState] = useState<"idle" | "booking" | "error">("idle");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    if (!quoteId) return;
    fetch("/api/slots")
      .then((r) => r.json())
      .then((data) => {
        setSlotsByDate(data.slots ?? []);
        setLoading(false);
      })
      .catch(() => {
        setFetchError("Failed to load available slots.");
        setLoading(false);
      });
  }, [quoteId]);

  async function handleConfirm() {
    if (!selectedSlotId || !quoteId) return;
    setBookingState("booking");
    setBookingError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: parseInt(quoteId, 10), slotId: selectedSlotId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      router.push(`/confirm?bookingId=${data.booking.id}`);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Something went wrong");
      setBookingState("error");
    }
  }

  if (!quoteId) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <p className="text-gray-600">No quote request found.</p>
          <Link href="/quote" className="text-indigo-600 hover:underline text-sm">
            Start a new quote request
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
            Step 2 of 2
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Pick a Time to Connect</h1>
          <p className="mt-2 text-gray-600">
            Choose a slot that works for you. We&apos;ll review your quote request and come prepared.
          </p>
        </div>

        {loading && (
          <div className="text-center text-gray-400 py-16">Loading available times...</div>
        )}

        {fetchError && (
          <div className="text-center text-red-600 py-8">{fetchError}</div>
        )}

        {!loading && !fetchError && slotsByDate.length === 0 && (
          <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow">
            No available slots right now. Please check back soon or contact us directly.
          </div>
        )}

        {!loading && slotsByDate.length > 0 && (
          <div className="space-y-6">
            {slotsByDate.slice(0, 10).map(({ date, slots }) => (
              <div key={date} className="bg-white rounded-xl shadow p-5">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {formatDate(date)}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                        }`}
                      >
                        {formatTime(slot.slot_time)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedSlotId && (
          <div className="sticky bottom-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Selected: </span>
              {(() => {
                for (const { date, slots } of slotsByDate) {
                  const slot = slots.find((s) => s.id === selectedSlotId);
                  if (slot) return `${formatDate(date)} at ${formatTime(slot.slot_time)}`;
                }
                return "—";
              })()}
            </div>
            <div className="flex items-center gap-3">
              {bookingState === "error" && (
                <p className="text-xs text-red-600">{bookingError}</p>
              )}
              <button
                onClick={handleConfirm}
                disabled={bookingState === "booking"}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors"
              >
                {bookingState === "booking" ? "Booking..." : "Confirm Appointment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <ScheduleContent />
    </Suspense>
  );
}
