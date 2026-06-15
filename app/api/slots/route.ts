import { NextResponse } from "next/server";
import { seedSlots, getAvailableSlots } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    seedSlots();
    const slots = getAvailableSlots();
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}
