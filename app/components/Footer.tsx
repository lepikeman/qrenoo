"use client";
import Image from "next/image";
import Link from "next/link";
import { MdEmail } from "react-icons/md";
import { useState } from "react";

interface FooterLink {
  label: string;
  href?: string;
}

interface FooterProps {
  links?: FooterLink[];
  children?: React.ReactNode;
}

export default function Footer({}: FooterProps) {
  const currentYear = new Date().getFullYear();
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
    <footer className="bg-[#1b0c33] text-white pt-10">
      {/* Section newsletter */}
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center mb-3">
          <h3 className="text-2xl font-medium mb-2">
            S&apos;inscrire à la Newletter
          </h3>
          <p className="text-sm text-white/80">
            Inscrivez-vous à la newletter pour être au courant des dernières
            nouveautés de Qrenoo
          </p>
        </div>
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          {submitted ? (
            <div className="p-4 bg-green-100/20 text-green-400 rounded-md text-center mb-4">
              Merci ! Votre email a bien été enregistré.
            </div>
          ) : (
            <>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 px-4 bg-white/20 text-white rounded-md border-0 placeholder-gray-300"
                />
                {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#471d70] hover:bg-[#522180] rounded-full text-white font-medium"
                disabled={loading}
              >
                {loading ? "Inscription..." : "M'inscrire à la newsletter"}
              </button>
            </>
          )}
        </form>
      </div>

      {/* Section principale du footer */}
      <div className="bg-[#170628] py-10">
        <div className="mx-auto px-6">
          {/* Logo et contact */}
          <div className="mb-8">
            <div className="flex items-center -mt-20 -mb-15">
              <Image
                src="/assets/logo.png"
                alt="Qrenoo Logo"
                width={200}
                height={200}
                className=""
              />
            </div>
            <div className="flex items-center text-white/80 mb-8">
              <MdEmail className="mr-2" />
              <a
                href="mailto:contact@qrenoo.com"
                className="text-white/80 hover:text-white"
              >
                contact@qrenoo.com
              </a>
            </div>
          </div>

          {/* Deux colonnes de liens */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-white font-medium mb-4 pb-1 border-b border-white/20">
                Page
              </h4>
              <ul className="space-y-3 text-white/80">
                <li>
                  <Link href="/functions" className="hover:text-white">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="/price" className="hover:text-white">
                    Tarifs
                  </Link>
                </li>
                {/* <li>
                  <Link href="/about" className="hover:text-white">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="hover:text-white">
                    Métiers
                  </Link>
                </li> */}
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4 pb-1 border-b border-white/20">
                Politiques
              </h4>
              <ul className="space-y-3 text-white/80">
                <li>
                  <Link href="/legal/mentions" className="hover:text-white">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-white">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/legal/maintenance" className="hover:text-white">
                    Politique de maintenance
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cgu" className="hover:text-white">
                    CGU et CGV
                  </Link>
                </li>
                <li>
                  <Link href="/legal/rgpd" className="hover:text-white">
                    RGPD
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-white/60 text-sm pt-4 border-t border-white/10">
            <p>{currentYear} Qrenoo. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
