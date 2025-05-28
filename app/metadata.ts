import { Metadata } from "next";

// Métadonnées par défaut pour tout le site
export const defaultMetadata: Metadata = {
  metadataBase: new URL("https://www.qrenoo.com"),
  title: "Qrenoo - Rendez-vous en ligne pour professionnels",
  description:
    "Qrenoo est l'application tout-en-un pour les professionnels : prise de rendez-vous automatisée, rappels clients, et gestion optimisée de votre agenda.",
  keywords: [
    "rendez-vous en ligne",
    "agenda professionnel",
    "prise de rendez-vous",
    "gestion de planning",
    "rappels automatiques",
    "application professionnels",
  ],
  authors: [{ name: "Qrenoo" }],
  creator: "Qrenoo",
  publisher: "Qrenoo",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    siteName: "Qrenoo",
    title: "Qrenoo - Gestion de rendez-vous en ligne pour professionnels",
    description:
      "Automatisez vos rendez-vous, réduisez les absences avec nos rappels automatiques et gérez votre planning efficacement avec Qrenoo.",
    url: "https://www.qrenoo.com",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Qrenoo - Solution de prise de rendez-vous en ligne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qrenoo - Gestion de rendez-vous en ligne pour professionnels",
    description:
      "Automatisez vos rendez-vous, réduisez les absences avec nos rappels automatiques et gérez votre planning efficacement.",
    images: ["/images/twitter-image.jpg"],
    creator: "@qrenoo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/apple-icon.png"],
  },
  verification: {
    google: "verification_token_google",
  },
  alternates: {
    canonical: "https://www.qrenoo.com",
    languages: {
      "fr-FR": "https://www.qrenoo.com/fr",
      fr: "https://www.qrenoo.com",
    },
  },
  appleWebApp: {
    title: "Qrenoo",
    statusBarStyle: "black-translucent",
    capable: true,
  },
  manifest: "/manifest.json",
};
