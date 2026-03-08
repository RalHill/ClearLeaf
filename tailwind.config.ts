import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-green": "#1A2E24",
        "mid-green": "#2C5F4F",
        "accent-green": "#3A8A6C",
        "off-white": "#F8F7F4",
        "light-green": "#EEF4F1",
        "border-color": "#E8E6E1",
        "muted": "#7A756E",
        "near-black": "#1C1C1E",
        "amber": "#D4823A",
        "sidebar-bg": "#1E2E27",
      },
      fontFamily: {
        dm: ["'DM Sans'", "sans-serif"],
        serif: ["'DM Serif Display'", "serif"],
      },
      fontSize: {
        xs: "11px",
        sm: "12px",
        base: "14px",
        lg: "15px",
        xl: "18px",
        "2xl": "24px",
      },
      spacing: {
        sidebar: "220px",
        header: "56px",
      },
      maxWidth: {
        chat: "720px",
      },
    },
  },
  plugins: [],
};

export default config;
