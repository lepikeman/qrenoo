import { Inter } from "next/font/google";
import "./globals.css";
import NavigationShell from "./components/NavigationShell";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import GoogleAnalytics from "./components/GoogleAnanlytics";
import { defaultMetadata } from "./metadata";
import { viewport } from "./viewport";

export { viewport }; // Export la configuration du viewport globale
export const metadata = defaultMetadata; // Export les métadonnées par défaut

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const Footer = dynamic(() => import("./components/Footer"), { ssr: false });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Préconnexion aux origines externes importantes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS Prefetch pour les ressources tierces */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="bg-[#f6f8fa] text-white antialiased min-h-screen font-sans">
        <NavigationShell>
          {children}
          <Footer
            links={[
              { label: "Mentions légales", href: "/mentions" },
              { label: "CGU et CGV", href: "/cgu" },
              { label: "RGPD", href: "/rgpd" },
              { label: "Contact", href: "/contact" },
            ]}
          />
        </NavigationShell>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
