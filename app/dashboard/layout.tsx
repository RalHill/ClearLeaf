"use client";

import React, { useState, useEffect, ReactNode, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { DashboardProvinceProvider, useDashboardProvince } from "@/components/dashboard/dashboard-province-context";

const PROVINCES = [
  { code: "ON", name: "Ontario" },
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "QC", name: "Québec" },
  { code: "MB", name: "Manitoba" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland" },
  { code: "PE", name: "PEI" },
  { code: "YT", name: "Yukon" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
];

interface PlanStatus {
  plan: string;
  queriesUsed: number;
  queriesLimit: number;
  name: string | null;
  email: string | null;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { province, setProvince } = useDashboardProvince();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [planStatus, setPlanStatus] = useState<PlanStatus>({
    plan: "free",
    queriesUsed: 0,
    queriesLimit: 5,
    name: null,
    email: null,
  });
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetch("/api/plan")
      .then((r) => r.json())
      .then(setPlanStatus)
      .catch(() => {});
  }, []);

  // Refresh plan on successful upgrade
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("upgraded") === "1") {
        fetch("/api/plan").then((r) => r.json()).then(setPlanStatus).catch(() => {});
        router.replace("/dashboard");
      }
    }
  }, [router]);

  const handleUpgrade = useCallback(
    async (plan: "starter" | "professional", billing: "monthly" | "annual" = "monthly") => {
      setUpgrading(true);
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, billing }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error ?? "Could not start checkout.");
        }
      } catch {
        alert("Something went wrong. Please try again.");
      } finally {
        setUpgrading(false);
      }
    },
    []
  );

  const handleManageBilling = useCallback(async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Could not open billing portal.");
    } finally {
      setUpgrading(false);
    }
  }, []);

  const navItems = [
    { id: "chat", icon: "💬", label: "Ask ClearLeaf", href: "/dashboard/chat" },
    { id: "news", icon: "📰", label: "News Feed", href: "/dashboard/news" },
    { id: "compliance", icon: "🛡️", label: "Policy Compliance", href: "/dashboard/compliance" },
    { id: "compare", icon: "⚖️", label: "Province Compare", href: "/dashboard/compare" },
    { id: "walkthroughs", icon: "🗺️", label: "Walkthroughs", href: "/dashboard/walkthroughs" },
  ];

  const isPaid = planStatus.plan !== "free";
  const queriesPercent =
    planStatus.queriesLimit === -1
      ? 0
      : Math.min(100, (planStatus.queriesUsed / planStatus.queriesLimit) * 100);

  const initials =
    planStatus.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) ?? "?";

  return (
    <div className="flex h-screen bg-off-white text-near-black">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-dark-green border-b border-white/5 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-white/10 rounded"
          >
            {sidebarOpen ? (
              <X size={20} className="text-white" />
            ) : (
              <Menu size={20} className="text-white" />
            )}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-accent-green to-mid-green flex items-center justify-center text-white text-sm">
              🍁
            </div>
            <span className="font-serif text-lg text-white tracking-tight">ClearLeaf</span>
            <span className="text-xs text-white/40 font-light">HR Intelligence</span>
          </Link>
        </div>

        {/* Province Selector + User */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowProvinceDropdown(!showProvinceDropdown)}
              className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-lg text-white text-xs hover:bg-white/15 transition-colors flex items-center gap-2"
            >
              <span className="opacity-60">Province</span>
              <span className="font-semibold">{province}</span>
              <span className="opacity-50 text-xs">▼</span>
            </button>

            {showProvinceDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-border-color rounded-lg shadow-lg z-50 min-w-48 max-h-96 overflow-y-auto">
                {PROVINCES.map((p) => (
                  <button
                    key={p.code}
                    onClick={() => {
                      setProvince(p.code);
                      setShowProvinceDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-light-green transition-colors ${
                      p.code === province
                        ? "bg-light-green text-mid-green font-semibold"
                        : "text-near-black"
                    }`}
                  >
                    <span className="font-semibold opacity-60 mr-3">{p.code}</span>
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-white text-xs flex items-center gap-3">
            {isPaid ? (
              <>
                <span className="capitalize text-accent-green font-semibold">
                  {planStatus.plan}
                </span>
                <button
                  onClick={handleManageBilling}
                  disabled={upgrading}
                  className="px-3 py-1.5 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-medium hover:bg-white/15 transition-colors disabled:opacity-50"
                >
                  Manage billing
                </button>
              </>
            ) : (
              <>
                <span>
                  Free ·{" "}
                  {planStatus.queriesLimit === -1
                    ? "Unlimited"
                    : `${planStatus.queriesUsed}/${planStatus.queriesLimit}`}{" "}
                  queries
                </span>
                <button
                  onClick={() => handleUpgrade("starter")}
                  disabled={upgrading}
                  className="px-3 py-1.5 bg-accent-green text-white rounded-lg text-xs font-semibold hover:bg-accent-green/90 transition-colors disabled:opacity-50"
                >
                  {upgrading ? "Loading…" : "Upgrade $49"}
                </button>
              </>
            )}

            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:bg-white/20 transition-colors">
              {initials}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed left-0 top-14 bottom-0 w-sidebar bg-sidebar-bg flex flex-col p-4 gap-1 z-30 border-r border-white/5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/55 hover:bg-white/10"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="flex-1" />

          {/* Plan indicator */}
          {!isPaid ? (
            <div className="bg-accent-green/15 rounded-lg p-3 border border-accent-green/30">
              <div className="text-xs font-semibold text-accent-green mb-2">FREE PLAN</div>
              <div className="text-xs text-white/45 mb-3">
                {planStatus.queriesUsed} of {planStatus.queriesLimit} monthly queries used
              </div>
              <div className="bg-white/10 rounded h-1 mb-3">
                <div
                  className="bg-accent-green h-1 rounded transition-all"
                  style={{ width: `${queriesPercent}%` }}
                />
              </div>
              <button
                onClick={() => handleUpgrade("starter")}
                disabled={upgrading}
                className="w-full bg-accent-green text-white py-1.5 rounded text-xs font-semibold hover:bg-accent-green/90 transition-colors disabled:opacity-50"
              >
                {upgrading ? "Loading…" : "Upgrade to Starter"}
              </button>
            </div>
          ) : (
            <div className="bg-accent-green/10 rounded-lg p-3 border border-accent-green/20">
              <div className="text-xs font-semibold text-accent-green mb-1 capitalize">
                {planStatus.plan} Plan
              </div>
              <div className="text-xs text-white/45 mb-2">
                {planStatus.queriesLimit === -1
                  ? "Unlimited queries"
                  : `${planStatus.queriesUsed}/${planStatus.queriesLimit} queries`}
              </div>
              <button
                onClick={handleManageBilling}
                disabled={upgrading}
                className="w-full text-accent-green/70 py-1 rounded text-xs hover:text-accent-green transition-colors disabled:opacity-50"
              >
                Manage subscription
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main
        className={`flex-1 flex flex-col overflow-hidden transition-all ${
          sidebarOpen ? "ml-sidebar" : "ml-0"
        }`}
        style={{ marginTop: "56px" }}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <DashboardProvinceProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvinceProvider>
  );
}
