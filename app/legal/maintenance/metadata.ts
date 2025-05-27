import { Metadata } from "next";
import { defaultMetadata } from "../../metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Politique de maintenance | Qrenoo",
  description:
    "Notre politique de maintenance détaille nos engagements concernant la disponibilité du service, les interventions planifiées et l'assistance technique.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://qrenoo.com/legal/maintenance",
    languages: {
      "fr-FR": "https://qrenoo.com/legal/maintenance",
    },
  },
};
