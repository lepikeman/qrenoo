import React from "react";
import JobsList from "../components/JobsList";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  metadataBase: new URL("https://qrenoo.com"),
  title: "Solutions de prise de rendez-vous par métier | Qrenoo",
  description:
    "Découvrez nos solutions de prise de rendez-vous adaptées aux besoins spécifiques de chaque profession : coiffeurs, tatoueurs, coachs, kinésithérapeutes et plus.",
  keywords:
    "logiciel rendez-vous professionnel, prise rdv métier spécifique, agenda en ligne, gestion planning, coiffeur, tatoueur, kiné, coach",
  alternates: {
    canonical: "/jobs",
  },
};

export default function JobsPage() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-[#f6f8f2]">
      <section className="w-full px-4 pt-16 pb-12 flex flex-col items-center">
        <div className="max-w-3xl text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#29381a] mb-4 leading-tight">
            Solutions de prise de rendez-vous adaptées à votre métier
          </h1>
          <p className="text-lg md:text-xl text-[#405c26] mb-8 font-medium">
            Qrenoo s&apos;adapte aux besoins spécifiques de chaque profession
          </p>
        </div>
      </section>

      <JobsList />

      <section className="w-full px-4 py-12 flex flex-col items-center bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#29381a] text-center mb-10">
            Fonctionnalités disponibles pour tous les professionnels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/Schedule-amico.svg"
                alt="Réservation en ligne"
                width={100}
                height={100}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Réservation en ligne 24/7
              </h3>
              <p className="text-[#405c26] text-center">
                Permettez à vos clients de prendre rendez-vous à tout moment,
                même en dehors de vos horaires d&apos;ouverture.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/Emails-amico.svg"
                alt="Rappels automatiques"
                width={100}
                height={100}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Rappels automatiques
              </h3>
              <p className="text-[#405c26] text-center">
                Réduisez les rendez-vous manqués grâce à nos rappels
                personnalisés par SMS et email.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/payment-icon.svg"
                alt="Paiements en ligne"
                width={100}
                height={100}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Paiements en ligne
              </h3>
              <p className="text-[#405c26] text-center">
                Acceptez les acomptes et paiements complets directement lors de
                la réservation.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/Customerfeedback-amico.svg"
                alt="Statistiques"
                width={100}
                height={100}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Statistiques et rapports
              </h3>
              <p className="text-[#405c26] text-center">
                Analysez votre activité grâce à nos tableaux de bord et rapports
                détaillés.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-[#29381a] text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">
            Vous ne trouvez pas votre métier ?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Qrenoo s&apos;adapte à pratiquement tous les professionnels qui
            prennent des rendez-vous
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-[#29381a] font-semibold rounded-lg hover:brightness-95 transition"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
