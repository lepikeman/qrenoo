import { Metadata } from "next";
import { defaultMetadata } from "../../metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Mentions légales | Qrenoo",
  description:
    "Mentions légales de Qrenoo. Informations sur l'éditeur du site, l'hébergement et les droits de propriété intellectuelle.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://qrenoo.com/legal/mentions",
    languages: {
      "fr-FR": "https://qrenoo.com/legal/mentions",
    },
  },
};
