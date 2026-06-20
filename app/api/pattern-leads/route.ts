import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { first_name, email, join_north, referral_source } = body;

    if (!first_name || typeof first_name !== "string" || first_name.trim() === "") {
      return NextResponse.json({ error: "First name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const lead = createPatternLead({
      first_name: first_name.trim(),
      email: email.trim().toLowerCase(),
      join_north: Boolean(join_north),
      referral_source: referral_source?.trim() || undefined,
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}
