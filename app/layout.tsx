import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RequireProfileComplete from "./components/RequireProfileComplete";
import NavigationShell from "./components/NavigationShell";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qrenoo",
  description: "La gestion simplifiée des rendez-vous",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f6f8fa] text-gray-900 antialiased min-h-screen">
        <NavigationShell>
          <RequireProfileComplete>
            {children}
          </RequireProfileComplete>
        </NavigationShell>
      </body>
    </html>
  );
}
