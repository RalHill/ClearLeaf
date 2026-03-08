"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, ThumbsDown } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
  source?: string | null;
  confidence?: "high" | "medium" | "low" | null;
}

const CHAT_SAMPLES = [
  {
    q: "Can I terminate a 6-year employee in Ontario without cause? What's my exposure?",
    a: "Yes, you can terminate without cause at any time in Ontario. Your statutory minimum notice under the ESA for 6 years of service is 6 weeks. However, the real exposure is common law reasonable notice — courts typically award 1 month per year of service for mid-level employees, putting your risk at 5–7 months of base salary plus continuation of benefits. If the employee earns over $35,000 annually, severance pay under the ESA may also apply (1 week per year, capped at 26 weeks), but only if your payroll exceeds $2.5M.",
    source: "Ontario ESA, s.57 (notice) and s.64 (severance); Honda Canada Inc. v. Keays, 2008 SCC 39",
    confidence: "high",
  },
  {
    q: "What does Quebec law say about psychological harassment?",
    a: "Under Article 81.18 of the Act Respecting Labour Standards (ARLS), psychological harassment in Quebec is defined as any vexatious behaviour — repeated conduct, verbal comments, actions, or gestures — that is hostile or unwanted, affecting an employee's dignity or psychological integrity, and resulting in a harmful work environment. Employers have a legal obligation to prevent and stop psychological harassment. If a complaint is received, you must conduct an investigation within 60 days under the 2026 CNESST guidelines and take reasonable action to prevent recurrence.",
    source: "Loi sur les normes du travail, art. 81.18–81.20; CNESST Directive 2026-02",
    confidence: "high",
  },
  {
    q: "What about parental leave eligibility?",
    a: "To qualify for parental leave in Ontario, an employee must have: (1) completed 12 consecutive months of employment with the same employer AND (2) worked 1,250 hours in the past 12 months. If they don't meet both criteria, they're not eligible. Part-time employees must have logged the required hours.",
    source: "ESA s.35 (parental leave requirements)",
    confidence: "high",
  },
  {
    q: "What are the rules for vacation entitlement in BC?",
    a: "In British Columbia, employees are entitled to a minimum of 2 weeks (10 business days) of vacation per year after 5 years of employment. In their first 5 years, they receive 2 weeks starting year 1. Vacation pay is calculated as 4% of gross wages, or an employer can provide 2 weeks of unpaid time off plus 4% pay. Vacation must be scheduled and taken within 2 years of when it's earned, unless the employee agrees to carryover (capped at 2 weeks).",
    source: "BC Employment Standards Act, s.58–62",
    confidence: "high",
  },
  {
    q: "Can an employer require an employee to sign a non-compete agreement in Alberta?",
    a: "Yes, Alberta allows non-compete agreements, but they are subject to reasonableness testing. A non-compete is enforceable only if it is: (1) reasonable in duration (typically 1–2 years is acceptable), (2) reasonable in geographic scope (limited to where the business operates), and (3) reasonable in scope of activity (limited to the employer's legitimate interests). Overly broad restrictions may be unenforceable. Courts will generally enforce narrowly tailored non-competes that protect legitimate business interests.",
    source: "Alberta common law; Lysko v. Braley, 2006 AB 206",
    confidence: "medium",
  },
  {
    q: "What is the statutory notice period for termination in Federal jurisdiction?",
    a: "Under the Canada Labour Code Part II, an employer must provide written notice of termination of employment: (1) two weeks in advance if the employee has completed 3 consecutive months of employment, or (2) if the employee has completed 2 or more years of continuous employment, notice equal to 2 weeks plus 1 week for each additional year of employment, up to a maximum of 8 weeks. Alternatively, the employer may pay wages in lieu of notice.",
    source: "Canada Labour Code, Part II, s.230",
    confidence: "high",
  },
  {
    q: "What does accommodation to the point of undue hardship mean?",
    a: "Accommodation to the point of undue hardship is a legal duty in all Canadian jurisdictions. An employer must take steps to accommodate an employee's needs (related to protected grounds like disability, religion, or family status) unless doing so would cause the employer undue hardship. Undue hardship is determined by considering: (1) cost, (2) health and safety risks, and (3) operational requirements. The burden of proving undue hardship rests with the employer, and they must show substantive evidence, not mere speculation.",
    source: "Canadian Human Rights Act, s.7; Meiorin v. Doig Lake First Nation, [1997] 3 SCR 785",
    confidence: "high",
  },
  {
    q: "How long must employment records be kept in Ontario?",
    a: "In Ontario, employers must keep employment records for at least 3 years. These records must include: (1) hours worked, (2) wages paid, (3) deductions, (4) taxable benefits, and (5) vacation tracking. Records can be kept in electronic or paper format, but must be accessible and available for inspection by the Ministry of Labour on request.",
    source: "Ontario ESA, s.15 (record-keeping requirements)",
    confidence: "high",
  },
  {
    q: "What is the difference between wrongful dismissal and just cause termination?",
    a: "Just cause termination means an employer can terminate an employee without notice or severance for serious misconduct (theft, violence, gross insubordination, willful disobedience, or incompetence). Wrongful dismissal occurs when an employer terminates without cause and fails to provide adequate notice or pay in lieu. The employer bears the burden of proving just cause, and the standard is high — 'just cause' is narrowly defined and courts rarely accept vague allegations.",
    source: "Common law; Keays v. Honda of Canada Mfg., 2008 SCC 39",
    confidence: "high",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello. I'm ClearLeaf — Canada's HR intelligence layer. Ask me anything about employment standards, termination, accommodation, harassment investigations, leaves, or labour law across any Canadian province or territory. Select your province above to get jurisdiction-specific answers.",
      source: null,
      confidence: null,
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate API delay
    setTimeout(() => {
      const sample = CHAT_SAMPLES[sampleIndex % CHAT_SAMPLES.length];
      setSampleIndex((i) => i + 1);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: sample.a,
          source: sample.source,
          confidence: sample.confidence as "high" | "medium" | "low",
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const confidenceBadge = (
    c?: "high" | "medium" | "low" | null
  ): { label: string; bg: string; color: string; dot: string } => {
    if (c === "high")
      return {
        label: "High Confidence",
        bg: "#d1fae5",
        color: "#065f46",
        dot: "#10b981",
      };
    if (c === "medium")
      return {
        label: "Review Context",
        bg: "#fef3c7",
        color: "#92400e",
        dot: "#f59e0b",
      };
    return {
      label: "Consult Legal Counsel",
      bg: "#fee2e2",
      color: "#991b1b",
      dot: "#ef4444",
    };
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Jurisdiction banner */}
      <div className="bg-light-green border-b border-border-color px-6 py-2 flex items-center gap-3 text-xs text-mid-green flex-shrink-0">
        <span>🗺️</span>
        <span>
          Showing results for <strong>Ontario</strong> jurisdiction ·
          Federally regulated employer?
        </span>
        <button className="border border-mid-green rounded px-2 py-1 text-xs hover:bg-white/50 transition-colors">
          Switch to Federal
        </button>
        <span className="ml-auto text-accent-green">
          All responses include legal source citations
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="msg-appear flex flex-col"
            style={{
              alignItems: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "user" ? (
              <div className="bg-mid-green text-white rounded-tl-2xl rounded-tr-2xl rounded-br-md rounded-bl-2xl px-4 py-3 max-w-xs text-sm leading-relaxed">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-2xl flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-accent-green to-mid-green flex items-center justify-center text-white text-xs">
                    🍁
                  </div>
                  <span className="text-xs font-semibold text-mid-green">
                    ClearLeaf
                  </span>
                  <span className="text-xs text-muted font-light">
                    Ontario · Employment Standards
                  </span>
                </div>

                <div className="bg-white border border-border-color rounded-tl-md rounded-tr-2xl rounded-br-2xl rounded-bl-2xl p-4 text-sm leading-relaxed">
                  {msg.text}
                </div>

                {msg.source && (
                  <div
                    className="bg-slate-50 rounded-lg p-3 flex items-start gap-2"
                    style={{ backgroundColor: "#f0f4f2" }}
                  >
                    <span className="text-xs mt-0.5">📌</span>
                    <div className="flex-1">
                      <div
                        className="text-xs font-semibold mb-1"
                        style={{ color: "#2c5f4f" }}
                      >
                        Legal Source
                      </div>
                      <div
                        className="text-xs leading-relaxed"
                        style={{ color: "#4a6b5e" }}
                      >
                        {msg.source}
                      </div>
                    </div>
                    {msg.confidence && (() => {
                      const badge = confidenceBadge(msg.confidence);
                      return (
                        <div
                          className="rounded px-2 py-1 flex items-center gap-1 flex-shrink-0"
                          style={{ backgroundColor: badge.bg }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: badge.dot }}
                          />
                          <span
                            className="text-xs font-semibold whitespace-nowrap"
                            style={{ color: badge.color }}
                          >
                            {badge.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {!msg.source && (
                  <div
                    className="text-xs italic px-1"
                    style={{ color: "#b0a99f" }}
                  >
                    This is informational only and does not constitute legal
                    advice.
                  </div>
                )}

                {msg.source && (
                  <div className="flex items-center gap-2 pt-1">
                    <button className="p-1 hover:bg-light-green rounded transition-colors">
                      <ThumbsDown size={14} className="text-muted" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="msg-appear flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-accent-green to-mid-green flex items-center justify-center text-white text-xs">
              🍁
            </div>
            <div className="bg-white border border-border-color rounded-full px-3 py-2 flex gap-1">
              <div
                className="typing-dot w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#3a8a6c" }}
              />
              <div
                className="typing-dot w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#3a8a6c" }}
              />
              <div
                className="typing-dot w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#3a8a6c" }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border-color bg-white px-6 py-4 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex gap-2 items-end">
          <div className="flex-1 bg-off-white rounded-xl border border-border-color px-4 py-3 flex flex-col gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about Ontario employment law... (e.g. 'What's the notice period for a 4-year employee?')"
              rows={2}
              className="bg-transparent border-none focus:outline-none resize-none text-sm font-dm"
            />
            <div className="flex items-center gap-2 text-xs text-muted">
              <span>Suggestions:</span>
              <button
                onClick={() => setInput("Can I terminate an employee without cause?")}
                className="px-2 py-1 bg-white border border-border-color rounded-full text-xs hover:bg-light-green transition-colors"
              >
                Termination notice
              </button>
              <button
                onClick={() => setInput("What's the process for a harassment complaint?")}
                className="px-2 py-1 bg-white border border-border-color rounded-full text-xs hover:bg-light-green transition-colors"
              >
                Harassment complaint
              </button>
              <button
                onClick={() => setInput("What about parental leave eligibility?")}
                className="px-2 py-1 bg-white border border-border-color rounded-full text-xs hover:bg-light-green transition-colors"
              >
                Parental leave
              </button>
            </div>
          </div>
          <button
            onClick={sendMessage}
            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
              input.trim()
                ? "bg-mid-green hover:bg-mid-green/90 cursor-pointer"
                : "bg-muted/30 cursor-not-allowed"
            }`}
          >
            <Send
              size={16}
              className={input.trim() ? "text-white" : "text-muted/50"}
            />
          </button>
        </div>
        <p className="text-center text-xs text-muted/60 mt-3">
          ClearLeaf provides employment intelligence, not legal advice. For
          complex matters, consult a Canadian employment lawyer.
        </p>
      </div>
    </div>
  );
}
