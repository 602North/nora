import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, "leads.db"));

// ─── Leads (NORA-3) ───────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    service_interest TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  created_at: string;
}

export interface LeadInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_interest?: string;
}

const insertLead = db.prepare(`
  INSERT INTO leads (name, email, phone, company, service_interest)
  VALUES (@name, @email, @phone, @company, @service_interest)
`);

const getAllLeads = db.prepare(`
  SELECT * FROM leads ORDER BY created_at DESC
`);

export function createLead(input: LeadInput): Lead {
  const result = insertLead.run(input);
  return db.prepare("SELECT * FROM leads WHERE id = ?").get(result.lastInsertRowid) as Lead;
}

export function getLeads(): Lead[] {
  return getAllLeads.all() as Lead[];
}

// ─── Quote Requests (NORA-4) ──────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS quote_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export interface QuoteRequest {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service_type: string;
  description: string;
  status: string;
  created_at: string;
}

export interface QuoteInput {
  name: string;
  email: string;
  phone?: string;
  service_type: string;
  description: string;
}

export function createQuote(input: QuoteInput): QuoteRequest {
  const result = db.prepare(`
    INSERT INTO quote_requests (name, email, phone, service_type, description)
    VALUES (@name, @email, @phone, @service_type, @description)
  `).run(input);
  return db.prepare("SELECT * FROM quote_requests WHERE id = ?").get(result.lastInsertRowid) as QuoteRequest;
}

export function getQuotes(): QuoteRequest[] {
  return db.prepare("SELECT * FROM quote_requests ORDER BY created_at DESC").all() as QuoteRequest[];
}

export function getQuoteById(id: number): QuoteRequest | undefined {
  return db.prepare("SELECT * FROM quote_requests WHERE id = ?").get(id) as QuoteRequest | undefined;
}

// ─── Time Slots (NORA-4) ──────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS time_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slot_date TEXT NOT NULL,
    slot_time TEXT NOT NULL,
    available INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(slot_date, slot_time)
  )
`);

export interface TimeSlot {
  id: number;
  slot_date: string;
  slot_time: string;
  available: number;
  created_at: string;
}

export interface SlotsByDate {
  date: string;
  slots: { id: number; slot_time: string }[];
}

export function seedSlots(): void {
  const count = (db.prepare("SELECT COUNT(*) as c FROM time_slots WHERE slot_date >= date('now')").get() as { c: number }).c;
  if (count > 0) return;

  const insertSlot = db.prepare(`
    INSERT OR IGNORE INTO time_slots (slot_date, slot_time) VALUES (?, ?)
  `);
  const seedMany = db.transaction(() => {
    const now = new Date();
    let daysAdded = 0;
    const cursor = new Date(now);
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0, 0, 0, 0);

    while (daysAdded < 21) {
      const dow = cursor.getDay();
      if (dow >= 1 && dow <= 5) {
        const dateStr = cursor.toISOString().slice(0, 10);
        for (let hour = 9; hour <= 16; hour++) {
          const timeStr = `${String(hour).padStart(2, "0")}:00`;
          insertSlot.run(dateStr, timeStr);
        }
        daysAdded++;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  });
  seedMany();
}

export function getAvailableSlots(): SlotsByDate[] {
  const rows = db.prepare(`
    SELECT id, slot_date, slot_time
    FROM time_slots
    WHERE available = 1 AND slot_date >= date('now')
    ORDER BY slot_date ASC, slot_time ASC
  `).all() as { id: number; slot_date: string; slot_time: string }[];

  const grouped: Record<string, { id: number; slot_time: string }[]> = {};
  for (const row of rows) {
    if (!grouped[row.slot_date]) grouped[row.slot_date] = [];
    grouped[row.slot_date].push({ id: row.id, slot_time: row.slot_time });
  }
  return Object.entries(grouped).map(([date, slots]) => ({ date, slots }));
}

export function markSlotBooked(slotId: number): void {
  db.prepare("UPDATE time_slots SET available = 0 WHERE id = ?").run(slotId);
}

export function getSlotById(id: number): TimeSlot | undefined {
  return db.prepare("SELECT * FROM time_slots WHERE id = ?").get(id) as TimeSlot | undefined;
}

// ─── Bookings (NORA-4) ────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_request_id INTEGER NOT NULL UNIQUE,
    time_slot_id INTEGER NOT NULL UNIQUE,
    confirmation_code TEXT NOT NULL UNIQUE,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(quote_request_id) REFERENCES quote_requests(id),
    FOREIGN KEY(time_slot_id) REFERENCES time_slots(id)
  )
`);

export interface Booking {
  id: number;
  quote_request_id: number;
  time_slot_id: number;
  confirmation_code: string;
  notes: string | null;
  created_at: string;
}

export interface BookingDetail extends Booking {
  name: string;
  email: string;
  phone: string | null;
  service_type: string;
  description: string;
  slot_date: string;
  slot_time: string;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "NR-";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function createBooking(quoteId: number, slotId: number): Booking {
  const slot = getSlotById(slotId);
  if (!slot) throw new Error("Slot not found");
  if (!slot.available) throw new Error("Slot is no longer available");

  let code = generateCode();
  while (db.prepare("SELECT id FROM bookings WHERE confirmation_code = ?").get(code)) {
    code = generateCode();
  }

  const result = db.prepare(`
    INSERT INTO bookings (quote_request_id, time_slot_id, confirmation_code)
    VALUES (?, ?, ?)
  `).run(quoteId, slotId, code);
  markSlotBooked(slotId);
  return db.prepare("SELECT * FROM bookings WHERE id = ?").get(result.lastInsertRowid) as Booking;
}

export function getBookingById(id: number): BookingDetail | undefined {
  return db.prepare(`
    SELECT b.*, q.name, q.email, q.phone, q.service_type, q.description,
           s.slot_date, s.slot_time
    FROM bookings b
    JOIN quote_requests q ON b.quote_request_id = q.id
    JOIN time_slots s ON b.time_slot_id = s.id
    WHERE b.id = ?
  `).get(id) as BookingDetail | undefined;
}

export function getBookings(): BookingDetail[] {
  return db.prepare(`
    SELECT b.*, q.name, q.email, q.phone, q.service_type, q.description,
           s.slot_date, s.slot_time
    FROM bookings b
    JOIN quote_requests q ON b.quote_request_id = q.id
    JOIN time_slots s ON b.time_slot_id = s.id
    ORDER BY s.slot_date ASC, s.slot_time ASC
  `).all() as BookingDetail[];
}

// ─── Walter Sierra Leads (NORA-23) ─────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS ws_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT NOT NULL,
    message TEXT,
    source TEXT NOT NULL DEFAULT 'ws_landing_page',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export interface WsLead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  message: string | null;
  source: string;
  created_at: string;
}

export interface WsLeadInput {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message?: string;
}

const insertWsLead = db.prepare(`
  INSERT INTO ws_leads (name, email, phone, service, message, source)
  VALUES (@name, @email, @phone, @service, @message, @source)
`);

const getAllWsLeads = db.prepare(`
  SELECT * FROM ws_leads ORDER BY created_at DESC
`);

export function createWsLead(input: WsLeadInput): WsLead {
  const result = insertWsLead.run({
    ...input,
    phone: input.phone || null,
    message: input.message || null,
    source: "ws_landing_page",
  });
  return db.prepare("SELECT * FROM ws_leads WHERE id = ?").get(result.lastInsertRowid) as WsLead;
}

export function getWsLeads(): WsLead[] {
  return getAllWsLeads.all() as WsLead[];
}

// ─── Pattern Discovery Guide Leads (NORA-85) ──────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS pattern_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    join_north INTEGER NOT NULL DEFAULT 1,
    referral_source TEXT,
    confirmation_sent INTEGER NOT NULL DEFAULT 0,
    downloaded INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export interface PatternLead {
  id: number;
  first_name: string;
  email: string;
  join_north: number;
  referral_source: string | null;
  confirmation_sent: number;
  downloaded: number;
  created_at: string;
}

export interface PatternLeadInput {
  first_name: string;
  email: string;
  join_north?: boolean;
  referral_source?: string;
}

const insertPatternLead = db.prepare(`
  INSERT INTO pattern_leads (first_name, email, join_north, referral_source)
  VALUES (@first_name, @email, @join_north, @referral_source)
`);

const getPatternLeadByIdStmt = db.prepare(
  "SELECT * FROM pattern_leads WHERE id = ?"
);

const getAllPatternLeads = db.prepare(
  "SELECT * FROM pattern_leads ORDER BY created_at DESC"
);

const markConfirmationSent = db.prepare(
  "UPDATE pattern_leads SET confirmation_sent = 1 WHERE id = ?"
);

const markDownloaded = db.prepare(
  "UPDATE pattern_leads SET downloaded = 1 WHERE id = ?"
);

export function createPatternLead(input: PatternLeadInput): PatternLead {
  const result = insertPatternLead.run({
    first_name: input.first_name,
    email: input.email,
    join_north: input.join_north ? 1 : 0,
    referral_source: input.referral_source || null,
  });
  return db.prepare("SELECT * FROM pattern_leads WHERE id = ?").get(result.lastInsertRowid) as PatternLead;
}

export function getPatternLeadById(id: number): PatternLead | undefined {
  return getPatternLeadByIdStmt.get(id) as PatternLead | undefined;
}

export function getPatternLeads(): PatternLead[] {
  return getAllPatternLeads.all() as PatternLead[];
}

export function confirmPatternLeadSent(id: number): void {
  markConfirmationSent.run(id);
}

export function markPatternLeadDownloaded(id: number): void {
  markDownloaded.run(id);
}
