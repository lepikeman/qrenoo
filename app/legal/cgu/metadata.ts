import { Metadata } from "next";
import { defaultMetadata } from "../../metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Conditions Générales d'Utilisation et de Vente | Qrenoo",
  description:
    "Nos conditions générales d'utilisation et de vente détaillent les modalités d'accès et d'utilisation de notre service de prise de rendez-vous en ligne.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://qrenoo.com/legal/cgu",
    languages: {
      "fr-FR": "https://qrenoo.com/legal/cgu",
    },
  },
};
