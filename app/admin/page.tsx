import Link from "next/link";
import { getLeads, getQuotes, getBookings, getWsLeads } from "@/lib/db";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function fmtDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtTime(timeStr: string) {
  const [h] = timeStr.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:00 ${suffix}`;
}

export default function AdminPage() {
  const leads = getLeads();
  const wsLeads = getWsLeads();
  const quotes = getQuotes();
  const bookings = getBookings();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">NORA Admin</h1>
          <p className="text-sm text-gray-500 mt-1">
            {leads.length} lead{leads.length !== 1 ? "s" : ""} &middot;{" "}
            {wsLeads.length} WS lead{wsLeads.length !== 1 ? "s" : ""} &middot;{" "}
            {quotes.length} quote{quotes.length !== 1 ? "s" : ""} &middot;{" "}
            {bookings.length} appointment{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="text-indigo-600 hover:underline">Lead form</Link>
          <Link href="/quote" className="text-indigo-600 hover:underline">Quote form</Link>
        </div>
      </div>

      {/* ── Appointments ──────────────────────────────────── */}
      <section id="appointments">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Appointments ({bookings.length})
        </h2>
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400 text-sm">
            No appointments booked yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left">
                    <th className="px-4 py-3 font-medium text-gray-600">Code</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Time</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Service</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Booked At</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={b.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                          {b.confirmation_code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{fmtDate(b.slot_date)}</td>
                      <td className="px-4 py-3 text-gray-700">{fmtTime(b.slot_time)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                      <td className="px-4 py-3 text-indigo-600">
                        <a href={`mailto:${b.email}`} className="hover:underline">{b.email}</a>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{b.service_type}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmt(b.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── Quote Requests ────────────────────────────────── */}
      <section id="quotes">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Quote Requests ({quotes.length})
        </h2>
        {quotes.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400 text-sm">
            No quote requests yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left">
                    <th className="px-4 py-3 font-medium text-gray-600">#</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Service</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Description</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q, i) => (
                    <tr key={q.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 text-gray-400">{q.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{q.name}</td>
                      <td className="px-4 py-3 text-indigo-600">
                        <a href={`mailto:${q.email}`} className="hover:underline">{q.email}</a>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{q.service_type}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          q.status === "pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-green-50 text-green-700"
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{q.description}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmt(q.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── Walter Sierra Leads ────────────────────────────── */}
      <section id="ws-leads">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Walter Sierra Leads ({wsLeads.length})
        </h2>
        {wsLeads.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400 text-sm">
            No Walter Sierra leads yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left">
                    <th className="px-4 py-3 font-medium text-gray-600">#</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Phone</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Service</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Message</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Source</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {wsLeads.map((lead, i) => (
                    <tr key={lead.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 text-gray-400">{lead.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-4 py-3 text-indigo-600">
                        <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{lead.phone || "\u2014"}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.service}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{lead.message || "\u2014"}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmt(lead.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── Leads ─────────────────────────────────────────── */}
      <section id="leads">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          NORA Leads ({leads.length})
        </h2>
        {leads.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400 text-sm">
            No leads yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left">
                    <th className="px-4 py-3 font-medium text-gray-600">#</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Phone</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Company</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Service Interest</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr key={lead.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 text-gray-400">{lead.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-4 py-3 text-indigo-600">
                        <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{lead.phone || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.company || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.service_interest || "—"}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmt(lead.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
