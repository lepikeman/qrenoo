import { Metadata } from "next";
import { defaultMetadata } from "../metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Fonctionnalités | Qrenoo - Solution de rendez-vous en ligne",
  description:
    "Découvrez toutes les fonctionnalités de Qrenoo : agenda intelligent, rappels automatiques, planning en temps réel, et profil de réservation personnalisable.",
  keywords: [
    "fonctionnalités Qrenoo",
    "agenda intelligent",
    "rappels automatiques",
    "planning temps réel",
    "lien réservation",
    "gestion rendez-vous",
  ],
  openGraph: {
    ...defaultMetadata.openGraph,
    title:
      "Fonctionnalités de Qrenoo - Solution complète de gestion de rendez-vous",
    description:
      "Un agenda intelligent, des rappels automatiques, un planning en temps réel et un profil public personnalisable pour optimiser votre activité professionnelle.",
    url: "https://qrenoo.com/functions",
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: "Fonctionnalités de Qrenoo - Solution de gestion de rendez-vous",
    description:
      "Un agenda intelligent, des rappels automatiques, un planning en temps réel et un profil public personnalisable.",
  },
  alternates: {
    canonical: "https://qrenoo.com/functions",
    languages: {
      "fr-FR": "https://qrenoo.com/functions",
    },
  },
};
