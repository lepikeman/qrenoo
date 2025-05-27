import { Metadata } from "next";
import { defaultMetadata } from "../../metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Politique RGPD | Qrenoo",
  description:
    "Notre politique RGPD détaille nos pratiques concernant la collecte, le traitement et la protection de vos données personnelles conformément à la réglementation européenne.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://qrenoo.com/legal/rgpd",
    languages: {
      "fr-FR": "https://qrenoo.com/legal/rgpd",
    },
  },
};
