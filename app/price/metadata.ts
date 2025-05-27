import { Metadata } from "next";
import { defaultMetadata } from "../metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Tarifs | Qrenoo - Solutions de rendez-vous en ligne abordables",
  description:
    "Découvrez nos offres tarifaires adaptées à tous les budgets. Forfaits flexibles, fonctionnalités premium et version gratuite pour démarrer sans engagement.",
  keywords: [
    "tarifs Qrenoo",
    "prix rendez-vous en ligne",
    "abonnement gestion agenda",
    "forfait prise rendez-vous",
    "solution planning gratuite",
    "tarification flexible",
  ],
  openGraph: {
    ...defaultMetadata.openGraph,
    title:
      "Tarifs Qrenoo - Solutions de rendez-vous en ligne pour tous les budgets",
    description:
      "Forfaits flexibles adaptés à votre activité, avec une version gratuite pour démarrer et des options premium sans engagement. Comparez nos offres.",
    url: "https://qrenoo.com/price",
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: "Tarifs Qrenoo - Solutions de rendez-vous en ligne abordables",
    description:
      "Forfaits flexibles adaptés à votre activité, avec une version gratuite pour démarrer et des options premium sans engagement.",
  },
  alternates: {
    canonical: "https://qrenoo.com/price",
    languages: {
      "fr-FR": "https://qrenoo.com/price",
    },
  },
};
