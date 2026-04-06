"use client";

import React, { useState } from "react";

interface Province {
  code: string;
  name: string;
}

interface ComparisonData {
  [metric: string]: {
    [province: string]: string;
  };
}

const PROVINCES: Province[] = [
  { code: "ON", name: "Ontario" },
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "QC", name: "Québec" },
  { code: "MB", name: "Manitoba" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NB", name: "New Brunswick" },
];

const COMPARISON_DATA: ComparisonData = {
  "Termination Notice (5 years)": {
    ON: "2 weeks statutory + common law exposure of ~5 months",
    BC: "2 weeks statutory + common law exposure of ~5 months",
    AB: "2 weeks statutory + common law exposure of ~4–5 months",
    QC: "3 weeks statutory (ARLS) + common law exposure varies",
    MB: "2 weeks statutory",
    SK: "4 weeks statutory",
    NS: "2 weeks statutory + common law reasonable notice",
    NB: "2 weeks statutory + common law reasonable notice",
  },
  "Vacation Entitlement (Year 1)": {
    ON: "2 weeks (4% vacation pay)",
    BC: "2 weeks (4% vacation pay)",
    AB: "2 weeks (4% vacation pay)",
    QC: "2 weeks (4% indemnité de vacances)",
    MB: "2 weeks (4% vacation pay)",
    SK: "3 weeks (3/52 vacation pay)",
    NS: "2 weeks (4% vacation pay)",
    NB: "2 weeks (4% vacation pay)",
  },
  "Harassment Investigation": {
    ON: "Mandatory formal investigation required under OHSA Bill 132",
    BC: "Investigation required under WorkSafeBC policy",
    AB: "Investigation required under OHS Act",
    QC: "Investigation required under ARLS within 60 days",
    MB: "Investigation required under Safe Work Manitoba",
    SK: "Investigation required under OHS Regulations",
    NS: "Investigation required under OHS regulations",
    NB: "Investigation required under OHS regulations",
  },
  "Probation Period Maximum": {
    ON: "3 months (ESA minimum entitlements apply after)",
    BC: "3 months",
    AB: "No statutory probation — common law applies",
    QC: "3 months",
    MB: "30 days (ESA relief period)",
    SK: "No statutory probation period",
    NS: "Common law applies — typically 3 months",
    NB: "Common law applies — typically 3 months",
  },
};

export default function ComparePage() {
  const [compareProvinces, setCompareProvinces] = useState<string[]>([
    "ON",
    "BC",
    "AB",
    "QC",
  ]);
  const [compareMetric, setCompareMetric] = useState(
    "Termination Notice (5 years)"
  );

  const toggleProvince = (code: string) => {
    setCompareProvinces((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="font-serif text-3xl text-dark-green mb-1 font-light">
            Province Comparison
          </h2>
          <p className="text-xs text-muted-foreground">
            Compare any employment standard side-by-side across Canadian
            provinces.
          </p>
        </div>

        {/* Province Selection */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-muted-foreground mb-3">
            SELECT PROVINCES
          </div>
          <div className="flex gap-2 flex-wrap">
            {PROVINCES.map((p) => (
              <button
                key={p.code}
                onClick={() => toggleProvince(p.code)}
                className={`compare-toggle px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  compareProvinces.includes(p.code)
                    ? "active-compare bg-mid-green text-white border-mid-green"
                    : "bg-white border-border-color text-mid-green hover:bg-light-green"
                }`}
              >
                {p.code}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Selection */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-muted-foreground mb-3">
            SELECT TOPIC
          </div>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(COMPARISON_DATA).map((metric) => (
              <button
                key={metric}
                onClick={() => setCompareMetric(metric)}
                className={`metric-btn px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  compareMetric === metric
                    ? "active-metric bg-mid-green text-white border-mid-green"
                    : "bg-white border-border-color text-mid-green hover:bg-light-green"
                }`}
              >
                {metric}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl border border-border-color overflow-hidden">
          <div className="bg-dark-green px-6 py-4">
            <div className="text-sm font-semibold text-white">
              {compareMetric}
            </div>
          </div>

          {compareProvinces
            .filter((p) => COMPARISON_DATA[compareMetric]?.[p])
            .map((p, i) => (
              <div
                key={p}
                className="flex items-start gap-4 px-6 py-4 border-b border-border-color last:border-b-0"
                style={{
                  backgroundColor:
                    i % 2 === 0 ? "white" : "#fafaf8",
                }}
              >
                <div className="bg-light-green rounded-lg px-3 py-2 w-12 h-12 flex items-center justify-center font-semibold text-xs text-mid-green flex-shrink-0">
                  {p}
                </div>
                <div>
                  <div className="text-xs font-semibold text-mid-green mb-1">
                    {PROVINCES.find((pr) => pr.code === p)?.name}
                  </div>
                  <div className="text-sm text-near-black leading-relaxed">
                    {COMPARISON_DATA[compareMetric][p]}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-4 text-right text-xs text-border-color">
          Export as PDF · Share · Last verified: March 2026
        </div>
      </div>
    </div>
  );
}
