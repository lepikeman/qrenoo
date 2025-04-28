import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RequireProfileComplete from "./components/RequireProfileComplete";
import NavigationShell from "./components/NavigationShell";
import { ReactNode } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qrenoo",
  description: "La gestion simplifiée des rendez-vous",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className="bg-[#f6f8fa] text-gray-900 antialiased min-h-screen font-sans">
        <NavigationShell>
          <RequireProfileComplete>
            {children}
          </RequireProfileComplete>
        </NavigationShell>
      </body>
    </html>
  );
}
