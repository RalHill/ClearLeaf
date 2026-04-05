"use client";

import React, { useState } from "react";
import { Bookmark } from "lucide-react";

interface NewsItem {
  id: number;
  source: string;
  sourceShort: string;
  headline: string;
  summary: string;
  date: string;
  provinces: string[];
  topic: string;
  color: string;
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,
    source: "Ontario Ministry of Labour",
    sourceShort: "ON Labour",
    headline:
      "Working for Workers Act, 2025: New AI Hiring Disclosure Requirements in Effect",
    summary:
      "Ontario employers must now disclose use of AI tools in the hiring process within job postings, effective January 1, 2026. Non-compliance triggers ESA enforcement.",
    date: "Mar 5, 2026",
    provinces: ["ON"],
    topic: "Hiring",
    color: "#2d6a4f",
  },
  {
    id: 2,
    source: "ESDC Canada",
    sourceShort: "Federal",
    headline:
      "Canada Labour Code Amendments: Federally Regulated Employer Bereavement Leave Expansion",
    summary:
      "Federal employers must now provide up to 10 days of bereavement leave for expanded family categories including chosen family, effective March 2026.",
    date: "Mar 3, 2026",
    provinces: ["Federal"],
    topic: "Leaves",
    color: "#1a4480",
  },
  {
    id: 3,
    source: "CNESST Québec",
    sourceShort: "CNESST",
    headline:
      "Mise à jour: Harcèlement psychologique — nouvelles lignes directrices d'enquête 2026",
    summary:
      "La CNESST publie des lignes directrices révisées pour les enquêtes sur le harcèlement psychologique, réduisant les délais de réponse requis de 90 à 60 jours.",
    date: "Mar 1, 2026",
    provinces: ["QC"],
    topic: "Harassment",
    color: "#7b3f6e",
  },
  {
    id: 4,
    source: "BC Employment Standards",
    sourceShort: "BC ESB",
    headline:
      "BC Court of Appeal: Reasonable Notice Period Expanded for Remote Workers",
    summary:
      "The BC Court of Appeal ruled that remote workers may be entitled to longer reasonable notice periods due to reduced mobility and market access considerations.",
    date: "Feb 28, 2026",
    provinces: ["BC"],
    topic: "Termination",
    color: "#9b4400",
  },
  {
    id: 5,
    source: "CPHR Canada",
    sourceShort: "CPHR",
    headline:
      "2026 National HR Compensation Report: Canadian Wages Up 4.2% Year-Over-Year",
    summary:
      "CPHR Canada's annual compensation survey reveals average Canadian HR professional salaries increased 4.2%, with Alberta and BC leading growth driven by resource sector demand.",
    date: "Feb 26, 2026",
    provinces: ["ON", "BC", "AB"],
    topic: "Compensation",
    color: "#1a4480",
  },
  {
    id: 6,
    source: "Alberta Labour",
    sourceShort: "AB Labour",
    headline: "Alberta Bill 7: Changes to Group Termination Notice Requirements",
    summary:
      "Alberta's new group termination provisions require employers to provide 4 weeks advance notice to the Director of Employment Standards when terminating 50 or more employees.",
    date: "Feb 24, 2026",
    provinces: ["AB"],
    topic: "Termination",
    color: "#5c3200",
  },
];

const TOPICS = [
  "Termination",
  "Harassment",
  "Accommodation",
  "Leaves",
  "Hiring",
  "Compensation",
  "Federal",
];

export default function NewsPage() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  const filteredNews =
    selectedTopics.length === 0
      ? NEWS_ITEMS
      : NEWS_ITEMS.filter((item) => selectedTopics.includes(item.topic));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Disclaimer banner */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Note:</span> These are illustrative example news items for reference. For live regulatory updates, consult official government sources or use ClearLeaf's AI Chat to ask about the latest rules in your jurisdiction.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="font-serif text-3xl text-dark-green mb-1 font-light">
            Employment Law News
          </h2>
          <p className="text-xs text-muted">
            Auto-updated nightly from 12+ Canadian government and HR sources.
            Summarized by AI.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() =>
                  setSelectedTopics((prev) =>
                    prev.includes(topic)
                      ? prev.filter((t) => t !== topic)
                      : [...prev, topic]
                  )
                }
                className={`chip px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedTopics.includes(topic)
                    ? "bg-mid-green text-white"
                    : "bg-white border border-border-color text-mid-green hover:bg-light-green"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
          <div className="text-xs text-muted whitespace-nowrap">
            Updated: March 7, 2026 · 2:00 AM EST
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="news-card bg-white rounded-xl border border-border-color p-4 flex flex-col gap-3 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-semibold text-muted">
                    {item.sourceShort.toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-1 items-center">
                  {item.provinces.map((p) => {
                    let bgColor = "#eef4f1";
                    let textColor = "#2c5f4f";
                    if (p === "QC") {
                      bgColor = "#f3e8f9";
                      textColor = "#7b3f6e";
                    } else if (p === "Federal") {
                      bgColor = "#e8eef9";
                      textColor = "#1a4480";
                    }
                    return (
                      <span
                        key={p}
                        className="text-xs font-semibold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: bgColor, color: textColor }}
                      >
                        {p}
                      </span>
                    );
                  })}
                  <span className="text-xs text-border-color ml-1">
                    {item.date}
                  </span>
                </div>
              </div>

              <div className="text-sm font-semibold text-dark-green leading-snug">
                {item.headline}
              </div>

              <div className="text-xs text-muted leading-relaxed">
                {item.summary}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-off-white">
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{ backgroundColor: "#f3f2ef", color: "#666" }}
                >
                  {item.topic}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setBookmarkedIds((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id]
                      )
                    }
                    className="p-1 hover:bg-light-green rounded transition-colors"
                  >
                    <Bookmark
                      size={14}
                      className={
                        bookmarkedIds.includes(item.id)
                          ? "fill-mid-green text-mid-green"
                          : "text-muted"
                      }
                    />
                  </button>
                  <button className="text-xs text-mid-green font-medium hover:underline">
                    Read more →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted text-sm">
              No news items found for selected topics.
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
