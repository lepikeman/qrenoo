"use client";

import Image from "next/image";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";

export default function FunctionsPage() {
  return (
    <main className="flex flex-col min-h-screen md:w-[80vw] items-center justify-center mx-auto">
      {/* Section Agenda */}
      <section className="w-full pt-6 pb-8">
        <div className="flex flex-col md:flex-row items-center justify-center mb-6">
          <div className="px-4 md:px-8 lg:px-12 max-w-6xl mx-auto md:w-1/2">
            <h1 className="text-3xl sm:text-3xl font-medium md:font-bold md:text-4xl lg:text-5xl md:leading-tight">
              Un agenda{" "}
              <span className="text-[#B157FF] font-semibold">intelligent</span>,
              pensé pour les{" "}
              <span className="text-[#B157FF] font-semibold">pros</span>.
            </h1>
            <p className="text-white/80 my-3 sm:my-4 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
              Tous les rendez-vous pris par vos clients depuis votre page de
              réservation sont automatiquement ajoutés à votre calendrier.{" "}
              <span className="text-[#B157FF]">Aucun oubli</span>, aucun double
              emploi.
            </p>
          </div>

          <div className="my-8 w-full md:w-1/2 md:ml-5 flex justify-center">
            {/* Mobile image */}
            <div className="w-full sm:hidden">
              <Image
                src="/images/mockup/iMockup-Incline.png"
                alt="Application mobile Qrenoo - Agenda"
                width={300}
                height={500}
                quality={100}
                className="w-full max-h-[300px]"
                priority
              />
            </div>

            {/* Tablet image */}
            <div className="hidden sm:block lg:hidden">
              <Image
                src="/images/mockup/iMockup-incline-large.png"
                alt="Application tablette Qrenoo - Agenda"
                width={500}
                height={400}
                className="max-w-md mx-auto h-auto"
                priority
              />
            </div>

            {/* Desktop image */}
            <div className="hidden lg:block">
              <Image
                src="/images/mockup/iMockup-incline-large.png"
                alt="Application desktop Qrenoo - Agenda"
                width={600}
                height={450}
                className="max-w-lg mx-auto h-auto"
                priority
              />
            </div>
          </div>
        </div>

        {/* Boutons mobile - exactement comme sur la maquette */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between mx-3 sm:mx-6 md:mx-8 lg:mx-12">
          <Link
            href="/signup"
            className="bg-[#B157FF] text-white flex py-3 px-4 rounded-2xl justify-center items-center text-center font-medium w-full text-sm sm:text-base"
          >
            Essayer gratuitement Qrenoo
          </Link>
          <Link
            href="#download"
            className="bg-[#793A8E] text-white py-2 px-3 sm:px-4 rounded-2xl flex items-center justify-center gap-2 w-full mt-2 sm:mt-0"
          >
            <svg
              width="24"
              height="24"
              className="w-6 h-6 sm:w-7 sm:h-7"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.26 2.33l13.05 7.5c.75.44.75 1.53 0 1.97l-13.05 7.5c-.83.48-1.87-.11-1.87-1.06V3.38c0-.95 1.04-1.54 1.87-1.06z" />
            </svg>
            <div className="flex flex-col text-xs sm:text-sm items-start leading-tight">
              <span className="font-normal">Télécharger sur</span>
              <span className="font-medium">Google Play Store</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Section Tableau de bord - exactement comme sur la maquette */}
      <section className="w-full pl-4 sm:px-6 py-8 border-t border-white/10">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-1">
            Tableau de bord{" "}
            <span className="text-[#B157FF] font-semibold">intuitif</span>
          </h2>
          <p className="text-white/80 text-xs md:text-sm lg:text-base mb-5">
            Ne perdez plus de temps à chercher le prochain rendez-vous
          </p>
        </div>
        <div className="flex flex-row w-full items-center max-w-6xl mx-auto">
          <div className="flex-1">
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <FiCheck className="text-[#B157FF] text-base flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm md:text-base text-white/90">
                  Paramétrez facilement vos horaires d&apos;ouverture et vos
                  jours de fermetures
                </p>
              </li>
              <li className="flex items-start gap-2">
                <FiCheck className="text-[#B157FF] text-base flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm md:text-base text-white/90">
                  Naviguez facilement à travers les différentes pages en
                  quelques cliques
                </p>
              </li>
              <li className="flex items-start gap-2">
                <FiCheck className="text-[#B157FF] text-base flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm md:text-base text-white/90">
                  Garder un œil sur les revenus générés grâce à votre profil
                  public
                </p>
              </li>
              <li className="flex items-start gap-2">
                <FiCheck className="text-[#B157FF] text-base flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm md:text-base text-white/90">
                  Vérifiez ou annulez les rendez-vous de vos client en 1 clic
                  grâce à l&apos;envoi automatique d&apos;email
                </p>
              </li>
            </ul>
          </div>

          <div className="flex-shrink-0 ml-2 sm:ml-4 md:ml-6">
            <Image
              src="/images/mockup/main-crop.png"
              alt="Tableau de bord Qrenoo"
              width={300}
              height={600}
              className="w-[100px] sm:w-[140px] md:w-[180px] lg:w-[220px] h-auto object-contain md:hidden"
              priority
            />
            <Image
              src="/images/mockup/main.png"
              alt="Tableau de bord Qrenoo"
              width={300}
              height={600}
              className="w-[100px] sm:w-[140px] md:w-[180px] lg:w-[220px] h-auto object-contain hidden md:block"
              priority
            />
          </div>
        </div>
      </section>

      {/* Section Augmenter vos réservations - exactement comme sur la maquette */}
      <section className="w-full px-5 py-8 border-t border-white/10">
        <h2 className="text-xl font-medium mb-1">
          Augmenter vos{" "}
          <span className="text-[#B157FF] font-semibold">réservations</span>
        </h2>
        <p className="text-white/80 text-xs mb-5">
          Prenez des réservations 24/7 sans être dérangé
        </p>

        <ul className="space-y-4">
          <li className="flex items-start gap-2">
            <FiCheck className="text-[#B157FF] text-base flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white/90">
              Créez un profil en ligne disponible à toute heure, qui affiche
              automatiquement vos disponibilités
            </p>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="text-[#B157FF] text-base flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white/90">
              Personnalisez les informations, prestations et horaires
              disponibles pour vos client, depuis le tableau de bord
            </p>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="text-[#B157FF] text-base flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white/90">
              Soyez référencé dans notre moteur de recherche, pour augmenter
              votre nombre de réservations
            </p>
          </li>
        </ul>

        <div className="mt-5">
          <Image
            src="/images/mockup/iMockup-droite.png"
            alt="Réservations sur Qrenoo"
            width={300}
            height={600}
            className="w-9/12 h-auto mx-auto"
          />
        </div>
      </section>

      {/* Section CTA - exactement comme sur la maquette */}
      <section className="w-full px-5 py-10 border-t border-white/10">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">
            Découvrez comment <span className="text-[#B157FF]">augmenter</span>{" "}
            votre <span className="text-[#B157FF]">profit</span> ?
          </h2>
          <p className="text-white/80 text-sm mb-5">
            Commencez maintenant pour optimisez votre temps et augmentez vos
            revenus.
          </p>
          <Link
            href="/signup"
            className="bg-[#B157FF] text-white py-3 px-6 rounded-full text-center font-medium inline-block text-sm"
          >
            Essayer gratuitement !
          </Link>
        </div>
      </section>
    </main>
  );
}
