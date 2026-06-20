import { NextRequest, NextResponse } from "next/server";
import { getPatternLeadById } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);
    if (isNaN(leadId)) {
      return NextResponse.json({ error: "Invalid lead id" }, { status: 400 });
    }

    const lead = getPatternLeadById(leadId);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
