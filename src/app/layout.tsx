import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apo Data | Analyse de données pharmaceutiques",
  description: "Plateforme d'analyse de données pour pharmacies développée par Phardev.",
};

/**
 * RootLayout Component
 * 
 * Main layout wrapper for the entire application.
 * Includes global styles, fonts, and common elements like header.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Global header */}
        <Header />
        
        {/* Main content */}
        {children}

        {/* Global footer */}
        <Footer />
      </body>
    </html>
  );
}