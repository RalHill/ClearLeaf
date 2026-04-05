"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface DashboardProvinceContextType {
  province: string;
  setProvince: (province: string) => void;
}

const DashboardProvinceContext = createContext<DashboardProvinceContextType | undefined>(undefined);

export function DashboardProvinceProvider({ children }: { children: ReactNode }) {
  const [province, setProvince] = useState("ON");

  return (
    <DashboardProvinceContext.Provider value={{ province, setProvince }}>
      {children}
    </DashboardProvinceContext.Provider>
  );
}

export function useDashboardProvince() {
  const context = useContext(DashboardProvinceContext);
  if (!context) {
    throw new Error("useDashboardProvince must be used within DashboardProvinceProvider");
  }
  return context;
}
