"use client";

import React, { useState } from "react";

interface Situation {
  icon: string;
  title: string;
  steps: number;
  provinces: number;
  desc: string;
  slug: string;
  locked: boolean;
}

const SITUATIONS: Situation[] = [
  {
    icon: "⚠️",
    title: "Terminating an Employee",
    steps: 8,
    provinces: 13,
    desc: "Without cause or for cause — province-specific checklist",
    slug: "termination",
    locked: false,
  },
  {
    icon: "🛡️",
    title: "Harassment Complaint Received",
    steps: 7,
    provinces: 13,
    desc: "Investigation process, timelines, documentation",
    slug: "harassment",
    locked: false,
  },
  {
    icon: "♿",
    title: "Accommodation Request",
    steps: 6,
    provinces: 13,
    desc: "Duty to accommodate to the point of undue hardship",
    slug: "accommodation",
    locked: true,
  },
  {
    icon: "📋",
    title: "Conducting a Layoff",
    steps: 5,
    provinces: 13,
    desc: "Temporary vs permanent, notice, recall rights",
    slug: "layoff",
    locked: true,
  },
  {
    icon: "⚖️",
    title: "Human Rights Complaint Filed",
    steps: 7,
    provinces: 13,
    desc: "Internal process, tribunal timelines, documentation",
    slug: "human-rights",
    locked: true,
  },
];

export default function WalkthroughsPage() {
  const [selectedSituation, setSelectedSituation] = useState<string | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState(0);

  if (selectedSituation) {
    const situation = SITUATIONS.find((s) => s.slug === selectedSituation);
    if (!situation) return null;

    return (
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => {
              setSelectedSituation(null);
              setCurrentStep(0);
            }}
            className="text-xs text-mid-green font-medium mb-6 hover:underline"
          >
            ← Back to Walkthroughs
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="text-4xl mb-3">{situation.icon}</div>
            <h1 className="font-serif text-4xl text-dark-green mb-2 font-light">
              {situation.title}
            </h1>
            <p className="text-muted text-sm">
              {situation.desc} · {situation.steps} steps · All{" "}
              {situation.provinces} provinces
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8 bg-white rounded-lg border border-border-color p-4">
            <div className="flex items-center gap-2 mb-3">
              {Array.from({ length: situation.steps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i <= currentStep
                      ? "bg-accent-green"
                      : "bg-off-white border border-border-color"
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-muted">
              Step {currentStep + 1} of {situation.steps}
            </div>
          </div>

          {/* Step Content (Placeholder) */}
          <div className="bg-white rounded-lg border border-border-color p-8 mb-6">
            <h2 className="font-serif text-2xl text-dark-green mb-4 font-light">
              Step {currentStep + 1}: {{
                0: "Documentation Review",
                1: "Immediate Actions",
                2: "Communication Plan",
                3: "Legal Compliance Check",
                4: "Execution",
                5: "Follow-up",
                6: "Record Keeping",
                7: "Closure",
              }[currentStep] || "Next Step"}
            </h2>

            <p className="text-sm text-near-black leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. This is
              placeholder content for the walkthrough step. Real content would
              include:
            </p>

            <ul className="space-y-3 mb-6">
              <li className="flex gap-3">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm">
                  Action item specific to Ontario jurisdiction
                </span>
              </li>
              <li className="flex gap-3">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm">
                  Another action item with legal citation
                </span>
              </li>
              <li className="flex gap-3">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm">
                  Third action item or decision point
                </span>
              </li>
            </ul>

            <div className="bg-light-green p-4 rounded-lg mb-6 border border-border-color">
              <p className="text-xs font-semibold text-mid-green mb-2">
                💡 Tip
              </p>
              <p className="text-sm text-mid-green">
                Province-specific advice would appear here, based on selected
                jurisdiction.
              </p>
            </div>

            <button className="text-sm text-mid-green font-medium hover:underline">
              Ask ClearLeaf about this step →
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-lg border border-border-color text-sm font-medium hover:bg-light-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {currentStep === situation.steps - 1 ? (
              <button className="px-4 py-2 rounded-lg bg-accent-green text-white text-sm font-medium hover:bg-accent-green/90">
                Generate My Checklist
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentStep(
                    Math.min(situation.steps - 1, currentStep + 1)
                  )
                }
                className="px-4 py-2 rounded-lg bg-mid-green text-white text-sm font-medium hover:bg-mid-green/90"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="font-serif text-3xl text-dark-green mb-1 font-light">
            Situation Walkthroughs
          </h2>
          <p className="text-xs text-muted">
            Step-by-step guided processes for high-stakes HR situations.
            Province-specific checklists generated at the end.
          </p>
        </div>

        {/* Situations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SITUATIONS.map((s) => (
            <div
              key={s.slug}
              className={`wt-card bg-white rounded-lg border border-border-color p-6 flex flex-col gap-4 ${
                s.locked ? "opacity-70" : ""
              }`}
            >
              <div className="text-4xl">{s.icon}</div>

              <div>
                <h3 className="text-lg font-semibold text-dark-green mb-1">
                  {s.title}
                </h3>
                <p className="text-xs text-muted">{s.desc}</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-medium px-2 py-1 rounded bg-light-green text-mid-green">
                  {s.steps} steps
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded bg-off-white text-muted">
                  All {s.provinces} provinces
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded bg-light-green text-mid-green">
                  Checklist output
                </span>
              </div>

              <button
                onClick={() =>
                  !s.locked && setSelectedSituation(s.slug)
                }
                className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  s.locked
                    ? "bg-off-white text-muted cursor-not-allowed"
                    : "bg-mid-green text-white hover:bg-mid-green/90"
                }`}
              >
                {s.locked
                  ? "🔒 Upgrade to Access"
                  : "Start — Ontario"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
