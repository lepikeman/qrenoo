"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Empêche double soumission
    setError("");
    setLoading(true);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Merci d'entrer un email valide.");
      setLoading(false);
      return;
    }
    // Envoie l'email à l'API pour stockage
    try {
      const res = await fetch("/api/betaemails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setLoading(false); // Arrête le chargement dès la réponse reçue
      if (!res.ok) {
        const errorMessage = await res.text();
        console.error("API Error:", errorMessage);
        setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false); // Arrête le chargement en cas d'erreur réseau
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section>
        <div className="flex flex-col w-3/5 gap-7 ml-8 mt-10 mb-10">
          <h1 className="text-3xl font-medium">
            Laissez vos clients{" "}
            <strong className="text-[#8F0FFF]">réserver</strong> pendant que
            vous <strong className="text-[#8F0FFF]">travaillez</strong>.
          </h1>
          <p className="font-light text-white/75">
            <strong className="text-[#8F0FFF] font-bold">Qrenoo</strong> est
            l’app tout-en-un pour les{" "}
            <strong className="text-[#8F0FFF] font-bold">pros</strong> : prise
            de RDV automatisée, rappels clients, et bien plus.
          </p>
        </div>
        <div className="flex  items-center w-full px-6 gap-4 mb-4">
          {/* Bouton Essayer gratuitement */}
          <a
            href="#signup"
            className="w-full bg-[#B157FF] text-white h-15 py-3.5 rounded-3xl text-center flex items-center justify-center"
          >
            Essayer gratuitement Qrenoo
          </a>

          {/* Bouton Google Play Store */}
          <a
            href="#download"
            className="w-full bg-[#793A8E] text-white  h-15 rounded-3xl flex items-center justify-center gap-3"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.26 2.33l13.05 7.5c.75.44.75 1.53 0 1.97l-13.05 7.5c-.83.48-1.87-.11-1.87-1.06V3.38c0-.95 1.04-1.54 1.87-1.06z" />
            </svg>
            <div className="flex flex-col items-center text-sm leading-tight">
              <span className="font-normal">Télécharger sur</span>
              <span className="font-medium">Google Play Store</span>
            </div>
          </a>

          {/* Texte en dessous */}
        </div>
        <p className="text-white/80 text-sm font-light italic mt-1 flex items-center gap-2 justify-center">
          Déjà 200 pros utilisent Qrenoo
        </p>
      </section>

    </main>
  );
}
