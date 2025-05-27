// Métadonnées pour la page d'accueil et valeurs par défaut pour le site

import { Metadata } from "next";

export const defaultMetadata: Metadata = {
  metadataBase: new URL("https://qrenoo.com"),
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
    url: "https://qrenoo.com",
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
  viewport: "width=device-width, initial-scale=1",
  verification: {
    google: "verification_token_google",
  },
  alternates: {
    canonical: "https://qrenoo.com",
    languages: {
      "fr-FR": "https://qrenoo.com/fr",
    },
  },
};

// Métadonnées pour la page d'accueil
export const homeMetadata: Metadata = {
  ...defaultMetadata,
  alternates: {
    canonical: "https://qrenoo.com",
    languages: {
      "fr-FR": "https://qrenoo.com",
    },
  },
};
