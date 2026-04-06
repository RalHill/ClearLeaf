"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WALKTHROUGHS, type Walkthrough } from "@/lib/walkthroughs/data";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CheckedItems {
  [itemId: string]: boolean;
}

// ── Upgrade Gate ──────────────────────────────────────────────────────────────

function UpgradeGate({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-2xl mx-auto text-center pt-16">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="font-serif text-3xl text-dark-green mb-4 font-light">
          Starter Plan Required
        </h2>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed max-w-md mx-auto">
          This walkthrough is available on the Starter and Professional plans. Upgrade to access all 5
          guided walkthroughs with province-specific checklists and statute citations.
        </p>
        <button
          onClick={onUpgrade}
          className="px-6 py-3 bg-accent-green text-white rounded-lg font-semibold hover:bg-accent-green/90 transition-colors"
        >
          Upgrade to Starter — $49/mo →
        </button>
        <p className="text-xs text-muted-foreground mt-4">No commitment. Cancel anytime.</p>
      </div>
    </div>
  );
}

// ── Checklist Item ────────────────────────────────────────────────────────────

function ChecklistItem({
  id,
  text,
  required,
  checked,
  onChange,
}: {
  id: string;
  text: string;
  required: boolean;
  checked: boolean;
  onChange: (id: string, val: boolean) => void;
}) {
  return (
    <li className="flex gap-3 items-start">
      <input
        type="checkbox"
        id={`chk-${id}`}
        checked={checked}
        onChange={(e) => onChange(id, e.target.checked)}
        className="mt-1 h-4 w-4 accent-accent-green cursor-pointer flex-shrink-0"
      />
      <label htmlFor={`chk-${id}`} className="text-sm text-near-black leading-relaxed cursor-pointer select-none">
        {text}
        {required && (
          <span className="ml-2 text-xs text-red-500 font-medium">Required</span>
        )}
      </label>
    </li>
  );
}

// ── Step View ─────────────────────────────────────────────────────────────────

function StepView({
  walkthrough,
  stepIndex,
  checkedItems,
  onCheckChange,
  onBack,
  onPrev,
  onNext,
  onFinish,
  province,
}: {
  walkthrough: Walkthrough;
  stepIndex: number;
  checkedItems: CheckedItems;
  onCheckChange: (id: string, val: boolean) => void;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  province: string;
}) {
  const step = walkthrough.steps[stepIndex];
  const totalSteps = walkthrough.steps.length;
  const progressPercent = ((stepIndex + 1) / totalSteps) * 100;
  const isLast = stepIndex === totalSteps - 1;
  const requiredChecked = step.checklist
    .filter((i) => i.required)
    .every((i) => checkedItems[i.id]);
  const allChecked = step.checklist.every((i) => checkedItems[i.id]);

  const handleAskClearLeaf = () => {
    const q = encodeURIComponent(step.askPrompt + ` (${province})`);
    window.open(`/dashboard/chat?q=${q}`, "_self");
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <button
          onClick={onBack}
          className="text-xs text-mid-green font-medium mb-6 hover:underline"
        >
          ← Back to Walkthroughs
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="text-4xl mb-2">{walkthrough.icon}</div>
          <h1 className="font-serif text-3xl text-dark-green mb-1 font-light">
            {walkthrough.title}
          </h1>
          <p className="text-xs text-muted-foreground">
            {walkthrough.desc} · All 13 provinces
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8 bg-white rounded-lg border border-border-color p-4">
          <div className="flex gap-1 mb-2">
            {walkthrough.steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i < stepIndex
                    ? "bg-accent-green"
                    : i === stepIndex
                    ? "bg-mid-green"
                    : "bg-off-white border border-border-color"
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>Step {stepIndex + 1} of {totalSteps}</span>
            <span>{Math.round(progressPercent)}% complete</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg border border-border-color p-8 mb-6">
          <h2 className="font-serif text-2xl text-dark-green mb-3 font-light">
            Step {stepIndex + 1}: {step.title}
          </h2>
          <p className="text-sm text-near-black leading-relaxed mb-6">
            {step.description}
          </p>

          {/* Checklist */}
          <ul className="space-y-3 mb-6">
            {step.checklist.map((item) => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                text={item.text}
                required={item.required}
                checked={!!checkedItems[item.id]}
                onChange={onCheckChange}
              />
            ))}
          </ul>

          {/* Tip */}
          <div className="bg-light-green p-4 rounded-lg mb-6 border border-border-color">
            <p className="text-xs font-semibold text-mid-green mb-1">💡 Legal Tip</p>
            <p className="text-sm text-mid-green leading-relaxed">{step.tip}</p>
          </div>

          {/* Citation */}
          <div className="bg-off-white px-4 py-3 rounded-lg border border-border-color mb-6">
            <p className="text-xs font-semibold text-muted-foreground mb-1">📖 Statute Citation</p>
            <p className="text-xs font-mono text-near-black">{step.citation}</p>
          </div>

          {/* Ask ClearLeaf */}
          <button
            onClick={handleAskClearLeaf}
            className="text-sm text-mid-green font-medium hover:underline flex items-center gap-1"
          >
            Ask ClearLeaf about this step →
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onPrev}
            disabled={stepIndex === 0}
            className="px-4 py-2 rounded-lg border border-border-color text-sm font-medium hover:bg-light-green disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          {!requiredChecked && (
            <p className="text-xs text-muted-foreground text-center flex-1">
              Complete required items to continue
            </p>
          )}

          {isLast ? (
            <button
              onClick={onFinish}
              disabled={!allChecked}
              className="px-5 py-2 rounded-lg bg-accent-green text-white text-sm font-semibold hover:bg-accent-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Complete Walkthrough ✓
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!requiredChecked}
              className="px-5 py-2 rounded-lg bg-mid-green text-white text-sm font-semibold hover:bg-mid-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Summary / Completion View ──────────────────────────────────────────────────

function CompletionView({
  walkthrough,
  checkedItems,
  province,
  onRestart,
  onBack,
}: {
  walkthrough: Walkthrough;
  checkedItems: CheckedItems;
  province: string;
  onRestart: () => void;
  onBack: () => void;
}) {
  const allItems = walkthrough.steps.flatMap((s) => s.checklist);
  const completedCount = allItems.filter((i) => checkedItems[i.id]).length;
  const requiredItems = allItems.filter((i) => i.required);
  const requiredComplete = requiredItems.every((i) => checkedItems[i.id]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="text-xs text-mid-green font-medium mb-6 hover:underline">
          ← Back to Walkthroughs
        </button>

        <div className="bg-white rounded-lg border border-border-color p-8 mb-6">
          <div className="text-5xl mb-4">{requiredComplete ? "✅" : "⚠️"}</div>
          <h2 className="font-serif text-3xl text-dark-green mb-2 font-light">
            {requiredComplete ? "Walkthrough Complete" : "Review Required Items"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {completedCount} of {allItems.length} items completed · Province: <span className="font-semibold">{province}</span>
          </p>

          {/* Summary table */}
          <div className="border border-border-color rounded-lg overflow-hidden mb-6">
            {walkthrough.steps.map((step, si) => {
              const stepItems = step.checklist;
              const stepComplete = stepItems.filter((i) => i.required).every((i) => checkedItems[i.id]);
              return (
                <div
                  key={si}
                  className={`flex items-center justify-between px-4 py-3 border-b border-border-color last:border-0 ${
                    stepComplete ? "bg-light-green/50" : "bg-red-50"
                  }`}
                >
                  <span className="text-sm font-medium text-near-black">
                    Step {si + 1}: {step.title}
                  </span>
                  <span className={`text-xs font-semibold ${stepComplete ? "text-accent-green" : "text-red-500"}`}>
                    {stepComplete ? "✓ Complete" : "Incomplete"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onRestart}
              className="px-4 py-2 rounded-lg border border-border-color text-sm font-medium hover:bg-light-green transition-colors"
            >
              Restart Walkthrough
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-mid-green text-white text-sm font-semibold hover:bg-mid-green/90 transition-colors"
            >
              Print Checklist
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          ClearLeaf provides informational intelligence only — not legal advice. For decisions affecting individual employees, consult a qualified Canadian employment lawyer.
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function WalkthroughsPage() {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const [completed, setCompleted] = useState(false);
  const [plan, setPlan] = useState("free");
  const [province, setProvince] = useState("ON");
  const [showUpgradeGate, setShowUpgradeGate] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetch("/api/plan")
      .then((r) => r.json())
      .then((d) => setPlan(d.plan ?? "free"))
      .catch(() => {});
  }, []);

  const handleUpgrade = useCallback(async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "starter", billing: "monthly" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Could not start checkout. Please try again.");
    } finally {
      setUpgrading(false);
    }
  }, []);

  const handleSelect = (slug: string, locked: boolean) => {
    if (locked && plan === "free") {
      setShowUpgradeGate(true);
      setSelectedSlug(slug);
      return;
    }
    setSelectedSlug(slug);
    setStepIndex(0);
    setCheckedItems({});
    setCompleted(false);
    setShowUpgradeGate(false);
  };

  const handleBack = () => {
    setSelectedSlug(null);
    setStepIndex(0);
    setCheckedItems({});
    setCompleted(false);
    setShowUpgradeGate(false);
  };

  const handleCheckChange = (id: string, val: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: val }));
  };

  const walkthrough = selectedSlug
    ? WALKTHROUGHS.find((w) => w.slug === selectedSlug) ?? null
    : null;

  // ── Upgrade gate view ─────────────────────────────────────────────────────
  if (showUpgradeGate) {
    return <UpgradeGate onUpgrade={handleUpgrade} />;
  }

  // ── Completion view ───────────────────────────────────────────────────────
  if (walkthrough && completed) {
    return (
      <CompletionView
        walkthrough={walkthrough}
        checkedItems={checkedItems}
        province={province}
        onRestart={() => {
          setStepIndex(0);
          setCheckedItems({});
          setCompleted(false);
        }}
        onBack={handleBack}
      />
    );
  }

  // ── Step view ─────────────────────────────────────────────────────────────
  if (walkthrough) {
    return (
      <StepView
        walkthrough={walkthrough}
        stepIndex={stepIndex}
        checkedItems={checkedItems}
        onCheckChange={handleCheckChange}
        onBack={handleBack}
        onPrev={() => setStepIndex((i) => Math.max(0, i - 1))}
        onNext={() => setStepIndex((i) => Math.min(walkthrough.steps.length - 1, i + 1))}
        onFinish={() => setCompleted(true)}
        province={province}
      />
    );
  }

  // ── Card grid ─────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="font-serif text-3xl text-dark-green mb-1 font-light">
            Situation Walkthroughs
          </h2>
          <p className="text-xs text-muted-foreground">
            Step-by-step guided processes for high-stakes HR situations. Province-specific checklists generated at the end.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WALKTHROUGHS.map((w) => {
            const isLocked = w.locked && plan === "free";
            return (
              <div
                key={w.slug}
                className={`bg-white rounded-lg border border-border-color p-6 flex flex-col gap-4 ${
                  isLocked ? "opacity-80" : ""
                }`}
              >
                <div className="text-4xl">{w.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-dark-green mb-1">{w.title}</h3>
                  <p className="text-xs text-muted-foreground">{w.desc}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-light-green text-mid-green">
                    {w.steps.length} steps
                  </span>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-off-white text-muted-foreground">
                    All 13 provinces
                  </span>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-light-green text-mid-green">
                    Statute citations
                  </span>
                </div>
                <button
                  onClick={() => handleSelect(w.slug, w.locked)}
                  disabled={upgrading}
                  className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors ${
                    isLocked
                      ? "bg-off-white text-muted-foreground hover:bg-light-green hover:text-mid-green cursor-pointer"
                      : "bg-mid-green text-white hover:bg-mid-green/90"
                  }`}
                >
                  {isLocked ? "🔒 Upgrade to Access" : `Start — ${province}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
