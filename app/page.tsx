"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Merci d'entrer un email valide.");
      return;
    }
    // Envoie l'email à l'API pour stockage
    try {
      const res = await fetch("/api/betaemails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-[#f6f8f2] ">
      <section className="w-full px-4 pt-10 pb-2 flex flex-col items-center">
        <div className="max-w-3xl text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#29381a] mb-4 leading-tight">
            Qrenoo : Simplifiez la gestion de vos rendez-vous
          </h1>
          <p className="text-lg md:text-xl text-[#405c26] mb-6 font-medium">
            Qrenoo est une application tout-en-un conçue pour les professionnels
            du bien-être (coiffeuses, plombier, coachs, etc.) et leurs clients.
            Elle permet de gérer facilement les rendez-vous, les disponibilités,
            la communication et la fidélisation, tout en offrant une expérience
            moderne et intuitive.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mb-12">
          <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
            <Image
              src="/assets/Schedule-amico.svg"
              alt="Gestion des rendez-vous"
              width={200}
              height={200}
              className="mb-3"
              loading="lazy"
            />
            <h2 className="text-xl font-bold text-[#29381a] mb-2">
              Gestion intelligente
            </h2>
            <p className="text-[#405c26] text-center">
              Planifiez, modifiez et annulez vos rendez-vous en quelques clics.
              Synchronisation facile avec vos calendriers.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
            <Image
              src="/assets/Emails-amico.svg"
              alt="Communication"
              width={200}
              height={200}
              className="mb-3"
              loading="lazy"
            />
            <h2 className="text-xl font-bold text-[#29381a] mb-2">
              Communication facilitée
            </h2>
            <p className="text-[#405c26] text-center">
              Notifications automatiques, rappels par email/SMS, et chat
              sécurisé pour rester connecté avec vos clients.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
            <Image
              src="/assets/Customerfeedback-amico.svg"
              alt="Fidélisation"
              width={200}
              height={200}
              className="mb-3"
              loading="lazy"
            />
            <h2 className="text-xl font-bold text-[#29381a] mb-2">
              Fidélisation & suivi
            </h2>
            <p className="text-[#405c26] text-center">
              Outils de suivi, statistiques, gestion de la satisfaction et
              offres personnalisées pour fidéliser votre clientèle.
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center w-full pb-10">
        <div className="bg-white rounded-xl shadow-lg px-8 py-10 flex flex-col items-center border border-[#efe9db] w-full max-w-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#29381a] mb-4 text-center">
            Participez à la Beta !
          </h2>
          <p className="text-[#405c26] mb-6 text-center max-w-md">
            Inscrivez-vous pour recevoir un accès anticipé à Qrenoo. Nous vous
            contacterons dès que la beta sera disponible.
          </p>
          {submitted ? (
            <div className="text-green-700 font-semibold text-lg py-4">
              Merci ! Votre email a bien été enregistré.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full max-w-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="border border-[#ded9cb] rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#b4c59b] bg-[#f6f8f2] text-[#29381a]"
                required
              />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                className="bg-[#29381a] text-white font-semibold rounded-lg px-6 py-3 hover:brightness-105 transition"
              >
                M&apos;inscrire à la beta
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
