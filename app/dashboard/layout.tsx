"use client";

import React, { useState, ReactNode } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

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

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [province, setProvince] = useState("ON");
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);

  const currentProvinceName =
    PROVINCES.find((p) => p.code === province)?.name || "Ontario";

  const navItems = [
    {
      id: "chat",
      icon: "💬",
      label: "Ask ClearLeaf",
      href: "/dashboard/chat",
    },
    {
      id: "news",
      icon: "📰",
      label: "News Feed",
      href: "/dashboard/news",
    },
    {
      id: "compliance",
      icon: "🛡️",
      label: "Policy Compliance",
      href: "/dashboard/compliance",
    },
    {
      id: "compare",
      icon: "⚖️",
      label: "Province Compare",
      href: "/dashboard/compare",
    },
    {
      id: "walkthroughs",
      icon: "🗺️",
      label: "Walkthroughs",
      href: "/dashboard/walkthroughs",
    },
  ];

  return (
    <div className="flex h-screen bg-off-white text-near-black">
      {/* Header */}
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
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-accent-green to-mid-green flex items-center justify-center text-white text-sm">
              🍁
            </div>
            <span className="font-serif text-lg text-white tracking-tight">
              ClearLeaf
            </span>
            <span className="text-xs text-white/40 font-light">
              HR Intelligence
            </span>
          </div>
        </div>

        {/* Province Selector */}
        <div className="flex items-center gap-6">
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
                    <span className="font-semibold opacity-60 mr-3">
                      {p.code}
                    </span>
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-white text-xs flex items-center gap-3">
            <span>Free · 3/5 queries</span>
            <button className="px-3 py-1.5 bg-accent-green text-white rounded-lg text-xs font-semibold hover:bg-accent-green/90 transition-colors">
              Upgrade $49
            </button>
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors">
              H
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed left-0 top-14 bottom-0 w-sidebar bg-sidebar-bg flex flex-col p-4 gap-1 z-30 border-r border-white/5">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/55 hover:bg-white/10 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="flex-1" />

          {/* Plan indicator */}
          <div className="bg-accent-green/15 rounded-lg p-3 border border-accent-green/30">
            <div className="text-xs font-semibold text-accent-green mb-2">
              FREE PLAN
            </div>
            <div className="text-xs text-white/45 mb-3">
              3 of 5 monthly queries used
            </div>
            <div className="bg-white/10 rounded h-1 mb-3">
              <div className="bg-accent-green h-1 rounded" style={{ width: "60%" }} />
            </div>
            <button className="w-full bg-accent-green text-white py-1.5 rounded text-xs font-semibold hover:bg-accent-green/90 transition-colors">
              Upgrade to Starter
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
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
