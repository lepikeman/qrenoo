import { type Viewport } from "next";

// Définition d'un viewport central pour toute l'application
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true, // Permettre le zoom pour l'accessibilité
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#B157FF" },
    { media: "(prefers-color-scheme: dark)", color: "#13072D" },
  ],
};
