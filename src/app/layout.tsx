import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enterprise AI Support V2 - Cyberpunk Edition",
  description: "Next-generation AI-Powered Support Dashboard with Cyberpunk Neon Aesthetics",
  keywords: ["support", "ticketing", "AI", "dashboard", "analytics", "cyberpunk", "neon"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className="h-screen overflow-hidden bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
