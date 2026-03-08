"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, FileText, BookOpen, Scale, ClipboardList, Check, Eye, EyeOff, X } from "lucide-react";
import { parseDocument } from "@/lib/documents/parser";
import { ComplianceCheckResult, ParsedDocument } from "@/lib/types/compliance";

type Phase = "upload" | "analyzing" | "report";

const POLICY_TYPES = [
  { id: "termination", label: "Termination", icon: "👤" },
  { id: "harassment", label: "Harassment & Violence", icon: "🛡️" },
  { id: "accommodation", label: "Accommodation", icon: "🤝" },
  { id: "overtime", label: "Overtime & Hours", icon: "⏰" },
  { id: "vacation", label: "Vacation & Leaves", icon: "📅" },
  { id: "privacy", label: "Privacy & Monitoring", icon: "👁️" },
  { id: "probation", label: "Probationary Period", icon: "⏳" },
  { id: "general", label: "General Employment", icon: "💼" },
];

const PROVINCES = [
  "ON", "BC", "AB", "QC", "MB", "SK", "NS", "NB", "NL", "PE", "YT", "NT", "NU"
];

export default function CompliancePage() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [result, setResult] = useState<ComplianceCheckResult | null>(null);
  const [parsedDoc, setParsedDoc] = useState<ParsedDocument | null>(null);
  const [province, setProvince] = useState("ON");
  const [policyType, setPolicyType] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showCompliant, setShowCompliant] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState(false);

  const canAnalyze = !!parsedDoc && !!province && !!policyType;

  // Handle file upload
  async function handleFileUpload(file: File) {
    try {
      setError(null);
      setPhase("upload");
      const parsed = await parseDocument(file);
      setParsedDoc(parsed);
    } catch (err: any) {
      setError(err.message || "Failed to parse document");
      setParsedDoc(null);
    }
  }

  // Handle drag and drop
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }

  // Main analyze function
  async function handleAnalyze() {
    if (!canAnalyze) return;
    setPhase("analyzing");
    setError(null);
    setProgressStep(0);

    // Advance progress steps every 4 seconds while API runs
    const progressInterval = setInterval(() => {
      setProgressStep((prev) => Math.min(prev + 1, 3));
    }, 4000);

    try {
      const res = await fetch("/api/compliance-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: parsedDoc!.text,
          fileName: parsedDoc!.fileName,
          province,
          policyType,
        }),
      });
      const data: ComplianceCheckResult = await res.json();
      if (data.error) throw new Error(data.message ?? data.error);
      clearInterval(progressInterval);
      setResult(data);
      setPhase("report");
      setShowRecommendations(false);
      setShowCompliant(false);
    } catch (e: any) {
      clearInterval(progressInterval);
      setError(e.message);
      setPhase("upload");
    }
  }

  // Reset function
  function handleReset() {
    setPhase("upload");
    setResult(null);
    setParsedDoc(null);
    setPolicyType("");
    setError(null);
    setProgressStep(0);
    setShowRecommendations(false);
    setShowCompliant(false);
    setConfirmation(false);
  }

  // Copy to clipboard
  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1500);
  }

  // Progress steps data
  const progressSteps = [
    { message: "Parsing document...", icon: FileText },
    { message: `Loading ${province} employment law requirements...`, icon: BookOpen },
    { message: "Comparing clauses against statute requirements...", icon: Scale },
    { message: "Generating compliance report...", icon: ClipboardList },
  ];

  const currentStep = progressSteps[progressStep] || progressSteps[0];
  const CurrentIcon = currentStep.icon;

  const getPolicyTypeName = (id: string) => POLICY_TYPES.find((p) => p.id === id)?.label || id;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-off-white via-light-green/5 to-off-white">
      {/* PHASE 1: UPLOAD */}
      {phase === "upload" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
          <div className="max-w-2xl w-full space-y-6">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 rounded-lg p-12 transition-all ${
                isDragging
                  ? "border-solid border-accent-green bg-light-green/20"
                  : parsedDoc
                    ? "border-solid border-accent-green bg-light-green/10"
                    : "border-dashed border-border-color bg-white hover:border-accent-green"
              }`}
            >
              {!parsedDoc ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <Upload className={`w-12 h-12 ${isDragging ? "text-accent-green" : "text-border-color"}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-near-black">Drop your policy here</h3>
                    <p className="text-sm text-gray-600 mt-2">PDF or DOCX up to 10MB</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-6 py-2 bg-accent-green text-white rounded-lg font-medium hover:bg-accent-green/90 transition-colors"
                  >
                    Browse files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    hidden
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-accent-green flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-near-black truncate">{parsedDoc.fileName}</p>
                    <p className="text-sm text-gray-600">~{Math.round(parsedDoc.charCount / 250)} words</p>
                    {parsedDoc.truncated && (
                      <p className="text-xs bg-amber-100 text-amber-900 px-2 py-1 rounded mt-2 inline-block">
                        Document trimmed to 80,000 characters
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setParsedDoc(null);
                      setError(null);
                    }}
                    className="p-2 hover:bg-light-green rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-mid-green" />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Province Selector */}
            <div>
              <label className="block text-sm font-semibold text-near-black mb-3">
                Province or jurisdiction
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-4 py-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-green"
              >
                {PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {/* Policy Type Chips */}
            <div>
              <label className="block text-sm font-semibold text-near-black mb-3">
                Policy type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {POLICY_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setPolicyType(type.id)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                      policyType === type.id
                        ? "bg-mid-green text-white border-mid-green"
                        : "bg-white text-near-black border-border-color hover:bg-light-green"
                    }`}
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                canAnalyze
                  ? "bg-mid-green text-white hover:bg-mid-green/90 cursor-pointer"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Analyze Policy
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: ANALYZING */}
      {phase === "analyzing" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-lg w-full text-center space-y-6">
            <div className="space-y-4">
              {progressSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-4 transition-opacity ${
                    idx <= progressStep ? "opacity-100" : "opacity-40"
                  }`}
                >
                  {idx === progressStep ? (
                    <div className="w-8 h-8 flex-shrink-0 animate-pulse">
                      <CurrentIcon className="w-8 h-8 text-accent-green" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-mid-green font-semibold">
                      {idx < progressStep ? "✓" : idx + 1}
                    </div>
                  )}
                  <p className="text-sm text-near-black">
                    {progressSteps[idx].message}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600">This takes 15–30 seconds — please keep this window open.</p>
          </div>
        </div>
      )}

      {/* PHASE 3: REPORT */}
      {phase === "report" && result && (
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                    {parsedDoc?.fileName}
                  </span>
                  <span className="px-3 py-1 bg-light-green text-mid-green rounded-full text-xs font-medium">
                    {province}
                  </span>
                  <span className="px-3 py-1 bg-light-green text-mid-green rounded-full text-xs font-medium">
                    {getPolicyTypeName(policyType)}
                  </span>
                </div>

                <h1 className="text-3xl font-serif text-dark-green">Compliance Analysis Report</h1>
                <p className="text-sm text-gray-600">
                  Analyzed {new Date(result.analyzedAt).toLocaleDateString()} at{" "}
                  {new Date(result.analyzedAt).toLocaleTimeString()}
                </p>

                {/* Risk Badge */}
                <div
                  className={`px-6 py-4 rounded-lg border-2 font-bold uppercase text-sm tracking-wide inline-block ${
                    result.overallRisk === "high"
                      ? "bg-red-50 text-red-900 border-red-300"
                      : result.overallRisk === "medium"
                        ? "bg-amber-50 text-amber-900 border-amber-300"
                        : "bg-green-50 text-green-900 border-green-300"
                  }`}
                >
                  {result.overallRisk === "high"
                    ? "⚠ HIGH COMPLIANCE RISK"
                    : result.overallRisk === "medium"
                      ? "◆ MEDIUM COMPLIANCE RISK"
                      : "✓ COMPLIANT — LOW RISK"}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 border-l-4 border-mid-green p-5 rounded-r-lg italic text-sm text-near-black">
                {result.summary}
              </div>

              {/* Gaps */}
              <div>
                <h2 className="text-xl font-semibold text-near-black mb-4">Compliance Gaps</h2>
                {result.gaps && result.gaps.length > 0 ? (
                  <div className="space-y-3">
                    {result.gaps.map((gap, idx) => (
                      <div
                        key={idx}
                        className={`bg-white border rounded-lg p-5 space-y-3 border-l-4 ${
                          gap.severity === "critical"
                            ? "border-l-red-500"
                            : gap.severity === "moderate"
                              ? "border-l-amber-500"
                              : "border-l-gray-400"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs uppercase font-bold tracking-wide text-gray-600">Your policy states:</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              gap.severity === "critical"
                                ? "bg-red-100 text-red-900"
                                : gap.severity === "moderate"
                                  ? "bg-amber-100 text-amber-900"
                                  : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {gap.severity.charAt(0).toUpperCase() + gap.severity.slice(1)}
                          </span>
                        </div>

                        <div className="bg-gray-100 border-l-2 border-gray-400 pl-3 py-2 font-mono text-xs text-gray-700 italic">
                          "{gap.clauseQuote}"
                        </div>

                        <div>
                          <span className="text-xs uppercase font-bold text-gray-600">Issue:</span>
                          <p className="text-sm text-near-black mt-1">{gap.issue}</p>
                        </div>

                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-light-green text-mid-green rounded-full text-xs font-medium">
                            {gap.statuteCitation}
                          </span>
                        </div>

                        <p className="text-sm text-amber-700 italic">{gap.legalRisk}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                    No compliance gaps identified for this policy type in {province}.
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div>
                <button
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  className="flex items-center gap-2 text-mid-green font-semibold hover:text-mid-green/80 transition-colors"
                >
                  {showRecommendations ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  {showRecommendations
                    ? `Hide ${result.recommendations?.length || 0} recommended fixes`
                    : `Show ${result.recommendations?.length || 0} recommended fixes`}
                </button>

                {showRecommendations && result.recommendations && (
                  <div className="mt-4 space-y-3">
                    {result.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-white border border-blue-200 rounded-lg p-5 space-y-3 border-l-4 border-l-blue-500">
                        <div>
                          <span className="text-xs uppercase font-bold text-gray-600">Addressing:</span>
                          <p className="text-sm text-near-black mt-1 truncate">{rec.forGap.substring(0, 80)}...</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase font-bold text-gray-600">Suggested replacement:</span>
                          <div className="flex items-start gap-2 mt-2">
                            <div className="flex-1 bg-dark-green text-accent-green font-mono text-xs p-3 rounded border border-dark-green/20 overflow-x-auto">
                              {rec.replacementText}
                            </div>
                            <button
                              onClick={() => copyText(rec.replacementText)}
                              className="p-2 hover:bg-light-green rounded transition-colors flex-shrink-0"
                            >
                              {copiedText === rec.replacementText ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <FileText className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs uppercase font-bold text-gray-600">Rationale:</span>
                          <p className="text-xs text-gray-600 mt-1 italic">{rec.rationale}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Compliant Clauses */}
              {result.compliantClauses && result.compliantClauses.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowCompliant(!showCompliant)}
                    className="flex items-center gap-2 text-mid-green font-semibold hover:text-mid-green/80 transition-colors"
                  >
                    {showCompliant ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    {showCompliant
                      ? `Hide ${result.compliantClauses.length} compliant clauses`
                      : `View ${result.compliantClauses.length} compliant clauses`}
                  </button>

                  {showCompliant && (
                    <div className="mt-4 space-y-2">
                      {result.compliantClauses.map((clause, idx) => (
                        <div key={idx} className="bg-light-green border border-accent-green rounded-lg p-3">
                          <p className="text-xs text-mid-green font-semibold mb-1">✓ Compliant</p>
                          <p className="text-sm text-near-black italic">"{clause.clauseQuote}"</p>
                          <p className="text-xs text-mid-green mt-2">{clause.statuteCitation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-amber-50 border-t border-amber-200 p-4 rounded-lg text-xs text-gray-700 space-y-2">
                <p className="font-semibold text-amber-900">⚖️ Legal Disclaimer</p>
                <p>
                  This analysis is informational only and does not constitute legal advice. ClearLeaf's analysis is based on
                  statute text current as of {new Date(result.analyzedAt).toLocaleDateString()}. Have any material policy
                  changes reviewed by a qualified Canadian employment lawyer before implementation.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="bg-white border-t border-border-color px-8 py-4 flex items-center justify-end gap-3 sticky bottom-0">
            <button
              onClick={() => {
                if (result) {
                  setConfirmation(true);
                }
              }}
              className="px-6 py-2 border border-mid-green text-mid-green rounded-lg font-semibold hover:bg-light-green transition-colors"
            >
              Check Another Policy
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-mid-green text-white rounded-lg font-semibold hover:bg-mid-green/90 transition-colors"
            >
              Export Report PDF
            </button>
          </div>

          {/* Confirmation Modal */}
          {confirmation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm space-y-4">
                <h3 className="text-lg font-semibold text-near-black">Start a new check?</h3>
                <p className="text-sm text-gray-600">Your current report will be cleared.</p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setConfirmation(false)}
                    className="px-4 py-2 border border-border-color rounded-lg text-sm font-medium hover:bg-light-green transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleReset();
                    }}
                    className="px-4 py-2 bg-mid-green text-white rounded-lg text-sm font-medium hover:bg-mid-green/90 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
