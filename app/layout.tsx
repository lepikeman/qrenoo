import { Inter } from "next/font/google";
import "./globals.css";
import NavigationShell from "./components/NavigationShell";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import GoogleAnalytics from "./components/GoogleAnanlytics";
import { defaultMetadata } from "./metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = defaultMetadata;

const Footer = dynamic(() => import("./components/Footer"), { ssr: false });

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 2. Récupérer la session ensuite (si nécessaire pour d'autres données de session)
  // mais nous n'utiliserons pas session.user qui n'est pas sécurisé
  // const { data: sessionData } = await supabase.auth.getSession();

  // 3. Utiliser userData.user qui est authentifié (sécurisé)
  // const session = sessionData.session;

  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
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
