"use client";

import { useState } from "react";
import Image from "next/image";

import { FiMessageSquare } from "react-icons/fi";
import { GoBell } from "react-icons/go";
import { CiCalendar } from "react-icons/ci";
import { IoIosLink } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";

export default function Home() {
  const faq = [
    {
      question: "Qrenoo est-il adapté à mon activité ?",
      answer: (
        <>
          Oui. Qrenoo s&apos;adapte à tous les métiers :{" "}
          <span className="text-[#B157FF] font-bold">indépendants</span> ou
          entreprises. Notre solution est flexible et pensée pour s&apos;adapter
          à <span className="text-[#B157FF] font-bold">votre quotidien</span>.
        </>
      ),
    },
    {
      question: "Quels sont les tarifs de Qrenoo ?",
      answer: (
        <>
          Qrenoo propose des tarifs clairs et{" "}
          <span className="text-[#B157FF] font-bold">adaptés</span> à tous les
          besoins, avec une
          <span className="text-[#B157FF] font-bold">
            {" "}
            formule gratuite
          </span>{" "}
          pour commencer et des options payantes pour aller plus loin,
          <span className="text-[#B157FF] font-bold"> sans engagement</span>.
        </>
      ),
    },
    {
      question: "Pourquoi choisir Qrenoo plutôt qu'un autre ?",
      answer: (
        <>
          Qrenoo est <span className="text-[#B157FF] font-bold">simple</span>,
          rapide et conçu pour répondre à
          <span className="text-[#B157FF] font-bold"> vos besoins</span> sans
          complications. Vous profitez d&apos;un service fiable, intuitif et
          évolutif, avec un vrai accompagnement humain.
        </>
      ),
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full max-w-7xl mx-auto md:pb-10 lg:pb-16 lg:mt-10">
        <div className="flex flex-row mb-5 relative items-center">
          {/* Colonne texte - prend 70% de la largeur */}
          <div className="flex flex-col w-[70%] px-6 gap-5 mt-8 mb-6 md:mt-10 lg:mt-16 md:pr-8 md:pl-8 md:gap-7">
            <h1 className="text-3xl font-medium md:font-bold md:text-4xl lg:text-5xl md:leading-tight">
              Laissez vos clients{" "}
              <strong className="text-[#8F0FFF]">réserver</strong> pendant que
              vous <strong className="text-[#8F0FFF]">travaillez</strong>.
            </h1>
            <p className="font-light text-white/75 md:text-lg lg:text-xl">
              <strong className="text-[#8F0FFF] font-bold">Qrenoo</strong> est
              l&apos;app tout-en-un pour les{" "}
              <strong className="text-[#8F0FFF] font-bold">pros</strong> : prise
              de RDV automatisée, rappels clients, et bien plus.
            </p>
          </div>

          {/* Colonne image - prend 30% de la largeur avec image entière */}
          <div className="relative w-[30%] h-full flex mt-[4vh] mr-[2vw] justify-center md:justify-center overflow-hidden">
            <div className="w-[160px] h-[250px] md:w-[220px] md:h-[340px] lg:w-[280px] lg:h-[430px] relative">
              <Image
                src="/images/sans-titre.png"
                alt="Application mobile Qrenoo"
                fill
                sizes="(max-width: 768px) 160px, (max-width: 1024px) 220px, 280px"
                style={{
                  objectFit: "contain",
                  objectPosition: "center right",
                }}
                className="transform"
                priority
              />
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex items-center w-full px-6 gap-4 mb-4 md:w-3/4 lg:w-2/3 md:mx-auto">
          <a
            href="/signup"
            className="w-full bg-[#B157FF] text-white h-15 py-3.5 rounded-2xl text-center flex items-center justify-center md:text-lg"
          >
            Essayer gratuitement Qrenoo
          </a>
          <a
            href="#download"
            className="w-full bg-[#793A8E] text-white h-15 rounded-2xl flex items-center justify-center gap-3 md:text-lg"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="md:w-6 md:h-6"
            >
              <path d="M5.26 2.33l13.05 7.5c.75.44.75 1.53 0 1.97l-13.05 7.5c-.83.48-1.87-.11-1.87-1.06V3.38c0-.95 1.04-1.54 1.87-1.06z" />
            </svg>
            <div className="flex flex-col items-center text-sm leading-tight md:text-base">
              <span className="font-normal">Télécharger sur</span>
              <span className="font-medium">Google Play Store</span>
            </div>
          </a>
        </div>

        {/* Texte utilisateurs */}
        <p className="text-white/80 text-sm font-light italic mt-1 flex items-center gap-2 justify-center md:text-base md:mt-3">
          Déjà 200 pros utilisent Qrenoo
        </p>
      </section>
      {/* Section fonctionnalités */}
      <section className="w-full max-w-7xl mx-auto px-4 md:py-16 lg:py-20">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Fonctionnalités principales
          </h2>
          <p className="text-white/80 font-light text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Découvrez comment Qrenoo vous aide à automatiser votre gestion de
            rendez-vous et à vous libérer du temps.
          </p>
        </div>

        <div className="bg-[#221335] rounded-xl overflow-hidden shadow-lg md:rounded-2xl">
          {/* Grille des fonctionnalités avec meilleur espacement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 p-6 md:p-8">
            {/* Carte 1 - Améliorée avec hover et styles consistants */}
            <div className="bg-[#170628] hover:bg-[#2c0f4a] transition-all duration-300 rounded-lg p-5 flex flex-col items-center text-center">
              <div className="bg-[#B157FF]/20 rounded-full p-4 mb-4 inline-flex items-center justify-center">
                <FiMessageSquare className="text-4xl md:text-5xl text-[#B157FF]" />
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-2">
                Disponibilité 24/7
              </h3>
              <p className="text-white/70 text-sm">
                Vos clients réservent à tout moment, même pendant vos heures de
                travail.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="bg-[#170628] hover:bg-[#2c0f4a] transition-all duration-300 rounded-lg p-5 flex flex-col items-center text-center">
              <div className="bg-[#B157FF]/20 rounded-full p-4 mb-4 inline-flex items-center justify-center">
                <GoBell className="text-4xl md:text-5xl text-[#B157FF]" />
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-2">
                Rappels automatiques
              </h3>
              <p className="text-white/70 text-sm">
                Fini les oublis avec nos rappels automatisés par SMS et email.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="bg-[#170628] hover:bg-[#2c0f4a] transition-all duration-300 rounded-lg p-5 flex flex-col items-center text-center">
              <div className="bg-[#B157FF]/20 rounded-full p-4 mb-4 inline-flex items-center justify-center">
                <CiCalendar className="text-4xl md:text-5xl text-[#B157FF]" />
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-2">
                Planning en temps réel
              </h3>
              <p className="text-white/70 text-sm">
                Gérez votre emploi du temps depuis n&apos;importe quel appareil.
              </p>
            </div>

            {/* Carte 4 */}
            <div className="bg-[#170628] hover:bg-[#2c0f4a] transition-all duration-300 rounded-lg p-5 flex flex-col items-center text-center">
              <div className="bg-[#B157FF]/20 rounded-full p-4 mb-4 inline-flex items-center justify-center">
                <IoIosLink className="text-4xl md:text-5xl text-[#B157FF]" />
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-2">
                Lien de réservation unique
              </h3>
              <p className="text-white/70 text-sm">
                Partagez un lien personnalisé pour les réservations en 1 clic.
              </p>
            </div>
          </div>

          {/* Bannière statistique */}
          <div className="bg-[#B157FF]/10 p-4 md:p-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
            <div className="flex items-center gap-2">
              <CiClock2 className="text-3xl md:text-4xl text-[#B157FF]" />
              <p className="font-medium">
                Économisez jusqu&apos;à 5h par semaine
              </p>
            </div>
            <div className="h-12 w-px bg-white/20 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#B157FF]">96%</span>
              <p className="font-medium">de clients satisfaits</p>
            </div>
          </div>
        </div>

        {/* CTA en bas de section */}
        <div className="mt-8 md:mt-12 text-center">
          <a
            href="/signup"
            className="inline-block bg-[#B157FF] hover:bg-[#9a3ee2] text-white py-3.5 px-6 rounded-full text-center font-medium transition-all duration-300 md:text-lg"
          >
            Découvrir toutes les fonctionnalités
          </a>
        </div>
      </section>
      {/* Section témoignage */}
      <section className="w-full max-w-7xl mx-auto md:py-10">
        <div className="border-l-2 p-4 m-6 gap-2 flex flex-col items-start justify-center bg-[#696969]/3 rounded-3xl md:mx-auto md:w-3/4 lg:w-2/3 md:p-8">
          <p className="italic md:text-lg lg:text-xl">
            Avant Qrenoo, je perdais du temps chaque semaine à gérer mes
            rendez-vous à la main. Depuis que je l&apos;utilise, tout est
            automatisé : les clients prennent RDV seuls, reçoivent leurs rappels
            automatiquement, et j&apos;ai une vue claire de ma semaine.
            J&apos;ai gagné facilement 4h par semaine !<br />
          </p>
          <span className="md:text-lg md:mt-2">
            — Sonia L., esthéticienne indépendante à Lyon
          </span>
        </div>
        <div className="flex flex-col items-center justify-center w-full gap-4 md:my-8">
          <a
            href="/signup"
            className="bg-[#B157FF] h-15 py-3.5 rounded-2xl items-center justify-center flex w-3/4 md:w-1/2 lg:w-1/3 md:text-lg"
          >
            Créer mon profil public
          </a>
        </div>
      </section>
      {/* Section FAQ */}
      <section className="w-full max-w-7xl mx-auto md:py-10">
        <div className="bg-[#696969]/3 w-full max-w-3xl mx-auto rounded-3xl mt-10 p-6 md:p-8">
          <h2 className="text-xl font-bold text-center mb-6 md:text-2xl lg:text-3xl md:mb-10">
            Besoin de plus d&apos;information ?
          </h2>

          {faq.map((item, index) => {
            return (
              <div
                key={index}
                className="mb-4 border-b border-white/10 pb-2 md:mb-6 md:pb-4"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex justify-between items-center w-full text-left font-medium py-2 md:py-3"
                >
                  <h3 className="text-lg md:text-xl">{item.question}</h3>
                  <span className="text-xl md:text-2xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <p className="py-3 text-white/80 font-light md:text-lg md:py-4">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center w-full justify-center gap-2 my-6 md:my-10">
          <CiClock2 className="text-3xl md:text-4xl" />
          <p className="font-light italic text-sm md:text-base lg:text-lg">
            Gagnez jusqu&apos;à 5h/semaine grâce à l&apos;automatisation
          </p>
        </div>

        {/* Boutons finaux */}
        <div className="flex items-center w-full px-6 gap-4 mb-4 md:w-3/4 lg:w-2/3 md:mx-auto md:mb-16">
          <a
            href="/signup"
            className="w-full bg-[#B157FF] text-white h-15 py-3.5 rounded-2xl text-center flex items-center justify-center md:text-lg"
          >
            Essayer gratuitement Qrenoo
          </a>
          <a
            href="#download"
            className="w-full bg-[#793A8E] text-white h-15 rounded-2xl flex items-center justify-center gap-3 md:text-lg"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="md:w-6 md:h-6"
            >
              <path d="M5.26 2.33l13.05 7.5c.75.44.75 1.53 0 1.97l-13.05 7.5c-.83.48-1.87-.11-1.87-1.06V3.38c0-.95 1.04-1.54 1.87-1.06z" />
            </svg>
            <div className="flex flex-col items-center text-sm leading-tight md:text-base">
              <span className="font-normal">Télécharger sur</span>
              <span className="font-medium">Google Play Store</span>
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}
