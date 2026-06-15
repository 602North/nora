import { NextRequest, NextResponse } from "next/server";
import { createQuote } from "@/lib/db";

const SERVICE_TYPES = [
  "Lead Generation",
  "Quote Capture",
  "Appointment Scheduling",
  "Marketing Strategy",
  "Content Marketing",
  "SEO & Advertising",
  "Other",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service_type, description } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!service_type || !SERVICE_TYPES.includes(service_type)) {
      return NextResponse.json({ error: "Valid service type is required" }, { status: 400 });
    }
    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json({ error: "Description must be at least 10 characters" }, { status: 400 });
    }

    const quote = createQuote({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      service_type,
      description: description.trim(),
    });

    return NextResponse.json({ success: true, quote }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save quote request" }, { status: 500 });
  }
}
