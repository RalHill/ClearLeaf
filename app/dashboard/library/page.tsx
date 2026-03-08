"use client";

import React from "react";
import { Download, Lock } from "lucide-react";

interface PolicyTemplate {
  id: number;
  name: string;
  province: string;
  reviewed: string;
  tag: string;
  locked: boolean;
}

const TEMPLATES: PolicyTemplate[] = [
  {
    id: 1,
    name: "Termination Letter (No Cause)",
    province: "ON",
    reviewed: "Jan 2026",
    tag: "Termination",
    locked: false,
  },
  {
    id: 2,
    name: "Termination Letter (No Cause)",
    province: "BC",
    reviewed: "Jan 2026",
    tag: "Termination",
    locked: false,
  },
  {
    id: 3,
    name: "Termination Letter (No Cause)",
    province: "AB",
    reviewed: "Jan 2026",
    tag: "Termination",
    locked: false,
  },
  {
    id: 4,
    name: "Progressive Discipline — Written Warning",
    province: "All",
    reviewed: "Dec 2025",
    tag: "Discipline",
    locked: false,
  },
  {
    id: 5,
    name: "Accommodation Request Acknowledgment",
    province: "All",
    reviewed: "Feb 2026",
    tag: "Accommodation",
    locked: false,
  },
  {
    id: 6,
    name: "Harassment Investigation Initiation Letter",
    province: "ON",
    reviewed: "Feb 2026",
    tag: "Harassment",
    locked: false,
  },
  {
    id: 7,
    name: "Parental Leave Acknowledgment (Québec)",
    province: "QC",
    reviewed: "Jan 2026",
    tag: "Leaves",
    locked: true,
  },
  {
    id: 8,
    name: "Return to Work Plan",
    province: "All",
    reviewed: "Dec 2025",
    tag: "Accommodation",
    locked: true,
  },
  {
    id: 9,
    name: "Employment Contract — Termination Clause (post-Waksdale)",
    province: "ON",
    reviewed: "Feb 2026",
    tag: "Contract",
    locked: true,
  },
];

export default function LibraryPage() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="font-serif text-3xl text-dark-green mb-1 font-light">
            Policy & Document Library
          </h2>
          <p className="text-xs text-muted">
            Legally reviewed templates, reviewed against current Canadian
            statute. Last review noted on each document.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg border border-border-color p-4 flex flex-col gap-3"
              style={{ opacity: template.locked ? 0.7 : 1 }}
            >
              <div className="text-2xl">📄</div>

              <div className="text-sm font-semibold text-dark-green leading-snug">
                {template.name}
              </div>

              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-light-green text-mid-green">
                  {template.province}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-off-white text-muted">
                  {template.tag}
                </span>
              </div>

              <div className="text-xs text-muted">
                Reviewed: {template.reviewed}
              </div>

              <button
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  template.locked
                    ? "bg-off-white text-muted cursor-not-allowed"
                    : "bg-mid-green text-white hover:bg-mid-green/90"
                }`}
              >
                {template.locked ? (
                  <span className="flex items-center justify-center gap-1">
                    <Lock size={12} /> Upgrade to Download
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <Download size={12} /> Download
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
