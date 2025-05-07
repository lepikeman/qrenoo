import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RequireProfileComplete from "./components/RequireProfileComplete";
import NavigationShell from "./components/NavigationShell";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import CookieConsent from "./components/CookieConsent";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ClientProviders from "./ClientProviders";
import GoogleAnalytics from "./components/GoogleAnanlytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Qrenoo | Logiciel de prise de rendez-vous en ligne pour professionnels indépendants",
  description:
    "Solution complète de prise de rendez-vous en ligne pour coiffeurs, tatoueurs, kinés, coachs et tous professionnels indépendants. Simplifiez la gestion de vos rendez-vous et réduisez les annulations.",
  keywords:
    "prise de rendez-vous, logiciel rendez-vous, application rendez-vous, agenda en ligne, gestion planning, coiffeur, tatoueur, kiné, coach, indépendants",
  openGraph: {
    title:
      "Qrenoo | Logiciel de prise de rendez-vous en ligne pour professionnels",
    description:
      "Solution complète de prise de rendez-vous en ligne pour professionnels indépendants. Gérez votre agenda, réduisez les annulations et fidélisez vos clients.",
    url: "https://www.qrenoo.fr/",
    siteName: "Qrenoo",
    images: [
      {
        url: "/images/qrenoo-og-image.png", // Créez cette image de 1200x630px
        width: 1200,
        height: 630,
        alt: "Qrenoo - Application de prise de rendez-vous en ligne",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.qrenoo.fr/",
  },
};

const Footer = dynamic(() => import("./components/Footer"), { ssr: false });

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // 1. Récupérer l'utilisateur authentifié d'abord (méthode sécurisée)
  const { data: userData } = await supabase.auth.getUser();

  // 2. Récupérer la session ensuite (si nécessaire pour d'autres données de session)
  // mais nous n'utiliserons pas session.user qui n'est pas sécurisé
  const { data: sessionData } = await supabase.auth.getSession();

  // 3. Utiliser userData.user qui est authentifié (sécurisé)
  const authenticatedUser = userData.user;
  const session = sessionData.session;

  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className="bg-[#f6f8fa] text-gray-900 antialiased min-h-screen font-sans">
        <ClientProviders
          initialUser={authenticatedUser}
          initialSession={session}
        >
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
          <GoogleAnalytics />
          <Analytics />
          <CookieConsent />
        </ClientProviders>
      </body>
    </html>
  );
}
