"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface BookingDetail {
  id: number;
  confirmation_code: string;
  name: string;
  email: string;
  phone: string | null;
  service_type: string;
  description: string;
  slot_date: string;
  slot_time: string;
  created_at: string;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeStr: string): string {
  const [h, min] = timeStr.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(min).padStart(2, "0")} ${suffix}`;
}

function ConfirmContent() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId");

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    fetch(`/api/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.booking) {
          setBooking(data.booking);
        } else {
          setError("Booking not found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load confirmation.");
        setLoading(false);
      });
  }, [bookingId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading confirmation...</p>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <p className="text-red-600">{error || "Booking not found."}</p>
          <a href="/quote" className="text-indigo-600 hover:underline text-sm">
            Start over
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full text-3xl mb-2">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-gray-900">You&apos;re booked!</h1>
          <p className="text-gray-600">
            We&apos;ve received your request and look forward to connecting.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 space-y-5">
          <div className="text-center py-3 bg-indigo-50 rounded-lg">
            <p className="text-xs text-indigo-500 uppercase tracking-wide font-medium mb-1">
              Confirmation Code
            </p>
            <p className="text-2xl font-bold text-indigo-700 tracking-widest">
              {booking.confirmation_code}
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-900">{formatDate(booking.slot_date)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Time</span>
              <span className="font-medium text-gray-900">{formatTime(booking.slot_time)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Service</span>
              <span className="font-medium text-gray-900">{booking.service_type}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-gray-900">{booking.name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-900">{booking.email}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 font-medium mb-1">Your Message</p>
            <p className="text-sm text-gray-700">{booking.description}</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">
          Save your confirmation code. Our team will reach out to confirm details before your appointment.
        </p>

        <div className="text-center">
          <Link href="/" className="text-sm text-indigo-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
