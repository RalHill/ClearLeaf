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
        "muted-text": "#7A756E",
        "near-black": "#1C1C1E",
        "amber": "#D4823A",
        "sidebar-bg": "#1E2E27",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
      borderRadius: {
        DEFAULT: "calc(var(--radius))",
      },
    },
  },
  plugins: [],
};

export default config;
