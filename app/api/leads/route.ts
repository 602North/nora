import { NextRequest, NextResponse } from "next/server";
import { createLead, getLeads } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service_interest } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const lead = createLead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      company: company?.trim() || undefined,
      service_interest: service_interest?.trim() || undefined,
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = getLeads();
    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
