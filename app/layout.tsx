import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RequireProfileComplete from "./components/RequireProfileComplete";
import NavigationShell from "./components/NavigationShell";
import { ReactNode } from "react";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ClientProviders from "./ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qrenoo",
  description: "La gestion simplifiée des rendez-vous",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className="bg-[#f6f8fa] text-gray-900 antialiased min-h-screen font-sans">
        <ClientProviders initialSession={session}>
          <NavigationShell>
            <RequireProfileComplete>{children}</RequireProfileComplete>
            <Footer
              links={[
                { label: "Mentions légales", href: "/mentions" },
                { label: "CGU et CGV", href: "/cgu" },
                { label: "RGPD", href: "/rgpd" },
                { label: "Contact", href: "/contact" },
              ]}
            />
          </NavigationShell>
          <SpeedInsights />
          <Analytics />
          <CookieConsent />
        </ClientProviders>
      </body>
    </html>
  );
}
