import type { Metadata } from "next";
import "./globals.css";
import "./print.css";
import { SessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "ClearLeaf — Canada's HR Intelligence Layer",
  description:
    "Province-specific employment law intelligence, live regulatory updates, and guided HR walkthroughs.",
  openGraph: {
    title: "ClearLeaf — Canada's HR Intelligence Layer",
    description:
      "Province-specific employment law intelligence for Canadian HR professionals.",
    images: [
      {
        url: "https://clearleaf.ca/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-dm bg-off-white text-near-black antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
