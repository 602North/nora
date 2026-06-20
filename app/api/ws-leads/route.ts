import { NextRequest, NextResponse } from "next/server";
import { createWsLead, getWsLeads } from "@/lib/db";

const WS_SERVICES = [
  "Remodeling",
  "Painting",
  "Metal Roofing",
  "Plumbing / Electrical",
  "Carpentry",
  "Repairs",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!service || !WS_SERVICES.includes(service)) {
      return NextResponse.json({ error: "Valid service selection is required" }, { status: 400 });
    }

    const lead = createWsLead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      service,
      message: message?.trim() || undefined,
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = getWsLeads();
    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
