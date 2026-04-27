import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nexus CRM - Customer Relationship Management",
  description: "Modern CRM platform for managing leads, customers, deals, and team collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-gray-50 font-sans antialiased dark:bg-gray-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
