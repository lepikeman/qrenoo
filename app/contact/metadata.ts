import { Metadata } from "next";
import { defaultMetadata } from "../metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Contact | Qrenoo - Assistance et support",
  description:
    "Contactez l'équipe Qrenoo pour toute question, suggestion ou assistance. Notre équipe est à votre disposition pour vous accompagner dans l'utilisation de notre solution.",
  keywords: [
    "contact Qrenoo",
    "assistance Qrenoo",
    "support technique",
    "aide rendez-vous en ligne",
    "contacter service client",
    "formulaire contact",
  ],
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Contact Qrenoo - Assistance et support",
    description:
      "Besoin d'aide ou d'informations ? Contactez notre équipe pour toute question concernant notre solution de prise de rendez-vous en ligne.",
    url: "https://qrenoo.com/contact",
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: "Contact Qrenoo - Assistance et support",
    description:
      "Besoin d'aide ou d'informations ? Contactez notre équipe pour toute question concernant notre solution.",
  },
  alternates: {
    canonical: "https://qrenoo.com/contact",
    languages: {
      "fr-FR": "https://qrenoo.com/contact",
    },
  },
};
