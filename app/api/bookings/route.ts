import { NextRequest, NextResponse } from "next/server";
import { createBooking, getBookingById, getQuoteById } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId, slotId } = body;

    if (!quoteId || typeof quoteId !== "number") {
      return NextResponse.json({ error: "Valid quoteId is required" }, { status: 400 });
    }
    if (!slotId || typeof slotId !== "number") {
      return NextResponse.json({ error: "Valid slotId is required" }, { status: 400 });
    }

    const quote = getQuoteById(quoteId);
    if (!quote) {
      return NextResponse.json({ error: "Quote request not found" }, { status: 404 });
    }

    const booking = createBooking(quoteId, slotId);
    const detail = getBookingById(booking.id);
    return NextResponse.json({ success: true, booking: detail }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
