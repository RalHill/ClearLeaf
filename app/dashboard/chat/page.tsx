"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, ThumbsDown } from "lucide-react";
import { useDashboardProvince } from "@/components/dashboard/dashboard-province-context";

interface Message {
  role: "user" | "assistant";
  text: string;
  source?: string | null;
  confidence?: "high" | "medium" | "low" | null;
  sources?: Array<{ title: string; section: string; province: string; relevance?: number }>;
}

export default function ChatPage() {
  const { province } = useDashboardProvince();
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
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      // Build conversation history from previous messages (last 10 turns)
      const conversationHistory = messages
        .slice(-10)
        .map((msg) => ({
          role: msg.role,
          content: msg.text,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          province,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        
        // Handle 400 missing_context gracefully
        if (response.status === 400 && data.error === "missing_context") {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: data.message,
              confidence: "low",
              source: null,
            },
          ]);
          setIsTyping(false);
          return;
        }

        throw new Error(data.error || "AI service error");
      }

      const result = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: result.message,
          source: result.sources?.[0]?.title || null,
          confidence: result.confidence,
          sources: result.sources,
        },
      ]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Network error";
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Sorry, I encountered an error: ${errorMsg}. Please try again.`,
          confidence: null,
          source: null,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
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
          Showing results for <strong>{province}</strong> jurisdiction ·
          {province !== "Federal" && "Federally regulated employer?"}
        </span>
        {province !== "Federal" && (
          <button 
            onClick={() => {}} 
            className="border border-mid-green rounded px-2 py-1 text-xs hover:bg-white/50 transition-colors"
          >
            Switch to Federal
          </button>
        )}
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
                    {province} · Employment Standards
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
