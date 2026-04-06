"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ExternalLink, AlertTriangle, Clock, Calendar, CheckSquare } from "lucide-react";
import { useDashboardProvince } from "@/components/dashboard/dashboard-province-context";

interface Deadline {
  id: number;
  title: string;
  deadline_type: "tax" | "hr_policy" | "statutory" | "remittance" | "wsib";
  description: string;
  due_date: string;
  recurrence: string;
  provinces: string[];
  consequence: string;
  action_items: string[];
  authority: string;
  source_url?: string;
}

const TYPE_LABELS: Record<string, string> = {
  tax: "Tax",
  hr_policy: "HR Policy",
  statutory: "Statutory",
  remittance: "Remittance",
  wsib: "WSIB / WCB",
};

const TYPE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  tax:        { bg: "bg-blue-100",   text: "text-blue-800",   dot: "bg-blue-500" },
  hr_policy:  { bg: "bg-purple-100", text: "text-purple-800", dot: "bg-purple-500" },
  statutory:  { bg: "bg-teal-100",   text: "text-teal-800",   dot: "bg-teal-500" },
  remittance: { bg: "bg-orange-100", text: "text-orange-800", dot: "bg-orange-500" },
  wsib:       { bg: "bg-rose-100",   text: "text-rose-800",   dot: "bg-rose-500" },
};

function getDaysUntil(dueDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Parse just the date portion to avoid timezone issues
  const datePart = dueDateStr.slice(0, 10); // "YYYY-MM-DD"
  const [y, m, d] = datePart.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getSeverity(days: number): "critical" | "important" | "upcoming" | "info" | "past" {
  if (days < 0) return "past";
  if (days <= 14) return "critical";
  if (days <= 28) return "important";
  if (days <= 60) return "upcoming";
  return "info";
}

const SEVERITY_STYLES = {
  critical:  { bar: "bg-red-500",    badge: "bg-red-100 text-red-700",    label: "Due soon" },
  important: { bar: "bg-amber-500",  badge: "bg-amber-100 text-amber-700", label: "Upcoming" },
  upcoming:  { bar: "bg-yellow-400", badge: "bg-yellow-100 text-yellow-700", label: "Upcoming" },
  info:      { bar: "bg-accent-green", badge: "bg-light-green text-mid-green", label: "" },
  past:      { bar: "bg-gray-300",   badge: "bg-gray-100 text-gray-500",  label: "Past" },
};

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

function formatDate(dateStr: string): string {
  const datePart = dateStr.slice(0, 10);
  const [y, m, d] = datePart.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

const ALL_TYPES = ["tax", "hr_policy", "statutory", "remittance", "wsib"];

export default function ComplianceCalendarPage() {
  const { province } = useDashboardProvince();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const fetchDeadlines = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ province });
      const res = await fetch(`/api/compliance-calendar?${params}`);
      const data = await res.json();
      setDeadlines(data.deadlines ?? []);
    } catch {
      setDeadlines([]);
    } finally {
      setLoading(false);
    }
  }, [province]);

  useEffect(() => {
    fetchDeadlines();
  }, [fetchDeadlines]);

  const filteredDeadlines = activeTypes.length === 0
    ? deadlines
    : deadlines.filter((d) => activeTypes.includes(d.deadline_type));

  // Group by date string for calendar lookup
  const byDate: Record<string, Deadline[]> = {};
  for (const d of filteredDeadlines) {
    const key = d.due_date.slice(0, 10);
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(d);
  }

  const calCells = buildCalendarDays(calYear, calMonth);
  const monthName = new Date(calYear, calMonth, 1).toLocaleDateString("en-CA", { month: "long", year: "numeric" });

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  }

  // List view: upcoming sorted
  const upcoming = filteredDeadlines
    .filter((d) => getDaysUntil(d.due_date) >= 0)
    .sort((a, b) => a.due_date.localeCompare(b.due_date));

  const past = filteredDeadlines
    .filter((d) => getDaysUntil(d.due_date) < 0)
    .sort((a, b) => b.due_date.localeCompare(a.due_date));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <div className="flex-shrink-0 bg-white border-b border-border-color px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-serif text-2xl text-dark-green font-light">Compliance Calendar</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Employment law deadlines for <span className="font-semibold text-mid-green">{province}</span> + Federal
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex border border-border-color rounded-lg overflow-hidden text-xs">
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-3 py-1.5 font-medium transition-colors ${viewMode === "calendar" ? "bg-dark-green text-white" : "text-muted-foreground hover:bg-light-green"}`}
              >
                📅 Calendar
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 font-medium transition-colors ${viewMode === "list" ? "bg-dark-green text-white" : "text-muted-foreground hover:bg-light-green"}`}
              >
                ☰ List
              </button>
            </div>
          </div>
        </div>

        {/* Type filters */}
        <div className="max-w-6xl mx-auto flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs text-muted-foreground mr-1">Filter:</span>
          {ALL_TYPES.map((type) => {
            const c = TYPE_COLORS[type];
            const active = activeTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => setActiveTypes((prev) =>
                  prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                )}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  active ? `${c.bg} ${c.text} border-transparent` : "bg-white text-muted-foreground border-border-color hover:bg-off-white"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                {TYPE_LABELS[type]}
              </button>
            );
          })}
          {activeTypes.length > 0 && (
            <button onClick={() => setActiveTypes([])} className="text-xs text-muted-foreground hover:text-near-black underline ml-1">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
              Loading deadlines…
            </div>
          ) : viewMode === "calendar" ? (
            <CalendarView
              calCells={calCells}
              calYear={calYear}
              calMonth={calMonth}
              monthName={monthName}
              byDate={byDate}
              today={today}
              onPrev={prevMonth}
              onNext={nextMonth}
              onSelectDeadline={setSelectedDeadline}
            />
          ) : (
            <ListView
              upcoming={upcoming}
              past={past}
              onSelectDeadline={setSelectedDeadline}
            />
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedDeadline && (
        <DetailPanel
          deadline={selectedDeadline}
          onClose={() => setSelectedDeadline(null)}
        />
      )}
    </div>
  );
}

// ── Calendar View ─────────────────────────────────────────────────────────────

function CalendarView({
  calCells, calYear, calMonth, monthName, byDate, today, onPrev, onNext, onSelectDeadline,
}: {
  calCells: (Date | null)[];
  calYear: number;
  calMonth: number;
  monthName: string;
  byDate: Record<string, Deadline[]>;
  today: Date;
  onPrev: () => void;
  onNext: () => void;
  onSelectDeadline: (d: Deadline) => void;
}) {
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="p-2 rounded-lg hover:bg-light-green transition-colors text-mid-green">
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-serif text-xl text-dark-green font-light">{monthName}</h3>
        <button onClick={onNext} className="p-2 rounded-lg hover:bg-light-green transition-colors text-mid-green">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DOW.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calCells.map((cell, i) => {
          if (!cell) return <div key={`empty-${i}`} className="h-24 rounded-lg bg-off-white/50" />;

          const key = `${cell.getFullYear()}-${String(cell.getMonth() + 1).padStart(2, "0")}-${String(cell.getDate()).padStart(2, "0")}`;
          const cellDeadlines = byDate[key] ?? [];
          const isToday = cell.toDateString() === today.toDateString();
          const isThisMonth = cell.getMonth() === calMonth;

          return (
            <div
              key={key}
              className={`h-24 rounded-lg border p-1 flex flex-col overflow-hidden ${
                isToday ? "border-mid-green bg-light-green/40" : "border-border-color bg-white"
              } ${!isThisMonth ? "opacity-40" : ""}`}
            >
              <span className={`text-xs font-semibold mb-1 ${isToday ? "text-mid-green" : "text-near-black"}`}>
                {cell.getDate()}
              </span>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {cellDeadlines.slice(0, 3).map((dl) => {
                  const days = getDaysUntil(dl.due_date);
                  const sev = getSeverity(days);
                  const styles = SEVERITY_STYLES[sev];
                  const c = TYPE_COLORS[dl.deadline_type];
                  return (
                    <button
                      key={dl.id}
                      onClick={() => onSelectDeadline(dl)}
                      className={`text-left px-1 py-0.5 rounded text-xs leading-tight truncate flex items-center gap-1 ${c.bg} ${c.text} hover:opacity-80 transition-opacity`}
                      title={dl.title}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.bar}`} />
                      <span className="truncate">{dl.title}</span>
                    </button>
                  );
                })}
                {cellDeadlines.length > 3 && (
                  <span className="text-xs text-muted-foreground pl-1">+{cellDeadlines.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border-color flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">Urgency:</span>
        {(["critical", "important", "upcoming", "info"] as const).map((sev) => (
          <div key={sev} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`w-2.5 h-2.5 rounded-full ${SEVERITY_STYLES[sev].bar}`} />
            {sev === "critical" ? "≤14 days" : sev === "important" ? "15–28 days" : sev === "upcoming" ? "29–60 days" : "61+ days"}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── List View ─────────────────────────────────────────────────────────────────

function ListView({
  upcoming,
  past,
  onSelectDeadline,
}: {
  upcoming: Deadline[];
  past: Deadline[];
  onSelectDeadline: (d: Deadline) => void;
}) {
  return (
    <div className="space-y-6">
      {upcoming.length === 0 && past.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-12">No deadlines found for selected filters.</p>
      )}

      {upcoming.length > 0 && (
        <section>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Upcoming</h4>
          <div className="space-y-2">
            {upcoming.map((dl) => <DeadlineRow key={dl.id} deadline={dl} onClick={() => onSelectDeadline(dl)} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Past</h4>
          <div className="space-y-2 opacity-60">
            {past.map((dl) => <DeadlineRow key={dl.id} deadline={dl} onClick={() => onSelectDeadline(dl)} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function DeadlineRow({ deadline, onClick }: { deadline: Deadline; onClick: () => void }) {
  const days = getDaysUntil(deadline.due_date);
  const sev = getSeverity(days);
  const styles = SEVERITY_STYLES[sev];
  const c = TYPE_COLORS[deadline.deadline_type];

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-border-color rounded-lg px-4 py-3 flex items-center gap-4 hover:shadow-md transition-all group"
    >
      {/* Severity bar */}
      <div className={`w-1 h-10 rounded-full flex-shrink-0 ${styles.bar}`} />

      {/* Due date */}
      <div className="w-20 flex-shrink-0">
        <div className="text-xs font-semibold text-near-black">{formatDate(deadline.due_date).split(",")[0].trim()}</div>
        <div className="text-xs text-muted-foreground">
          {days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? "Today" : `${days}d left`}
        </div>
      </div>

      {/* Title + authority */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-near-black truncate">{deadline.title}</div>
        <div className="text-xs text-muted-foreground truncate">{deadline.authority}</div>
      </div>

      {/* Type badge */}
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${c.bg} ${c.text}`}>
        {TYPE_LABELS[deadline.deadline_type]}
      </span>

      {/* Provinces */}
      <div className="flex gap-1 flex-shrink-0">
        {deadline.provinces.map((p) => (
          <span key={p} className="text-xs font-semibold px-1.5 py-0.5 rounded bg-off-white text-muted-foreground">
            {p}
          </span>
        ))}
      </div>
    </button>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function DetailPanel({ deadline, onClose }: { deadline: Deadline; onClose: () => void }) {
  const days = getDaysUntil(deadline.due_date);
  const sev = getSeverity(days);
  const styles = SEVERITY_STYLES[sev];
  const c = TYPE_COLORS[deadline.deadline_type];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border-color gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
                {TYPE_LABELS[deadline.deadline_type]}
              </span>
              {sev !== "past" && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles.badge}`}>
                  {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `${days} days left`}
                </span>
              )}
              {sev === "past" && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                  {Math.abs(days)}d past
                </span>
              )}
            </div>
            <h3 className="font-serif text-lg text-dark-green font-normal leading-snug">{deadline.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-off-white rounded-lg transition-colors flex-shrink-0">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Due date */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={15} className="text-mid-green flex-shrink-0" />
            <span className="font-semibold text-near-black">{formatDate(deadline.due_date)}</span>
            <span className="text-muted-foreground">· {deadline.recurrence}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-near-black leading-relaxed">{deadline.description}</p>

          {/* Consequence */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
            <AlertTriangle size={15} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-red-700 mb-1">Consequence of missing</div>
              <p className="text-xs text-red-800 leading-relaxed">{deadline.consequence}</p>
            </div>
          </div>

          {/* Action items */}
          {deadline.action_items.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <CheckSquare size={14} className="text-mid-green" />
                <span className="text-xs font-semibold text-near-black">Action items</span>
              </div>
              <ul className="space-y-1.5">
                {deadline.action_items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-near-black">
                    <span className="w-4 h-4 rounded border border-border-color flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Authority */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground border-t border-border-color pt-3">
            <Clock size={13} className="flex-shrink-0 mt-0.5" />
            <span>{deadline.authority}</span>
          </div>

          {/* Provinces */}
          <div className="flex gap-1.5">
            {deadline.provinces.map((p) => (
              <span key={p} className="text-xs font-semibold px-2 py-1 rounded bg-light-green text-mid-green">
                {p}
              </span>
            ))}
          </div>

          {/* Source link */}
          {deadline.source_url && (
            <a
              href={deadline.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-mid-green hover:underline"
            >
              <ExternalLink size={12} />
              View official source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
