import { Metadata } from "next";
import { defaultMetadata } from "../../metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Politique de confidentialité | Qrenoo",
  description:
    "Notre politique de confidentialité détaille comment nous collectons, utilisons et protégeons vos données personnelles conformément au RGPD.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://qrenoo.com/legal/privacy",
    languages: {
      "fr-FR": "https://qrenoo.com/legal/privacy",
    },
  },
};
