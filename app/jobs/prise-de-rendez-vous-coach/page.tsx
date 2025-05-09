import React from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/components/Breadcrumb";

export const generateMetadata = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Qrenoo pour Coachs",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "19.90",
      priceCurrency: "EUR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "95",
    },
  };

  return {
    metadataBase: new URL("https://qrenoo.com"),
    title: "Logiciel de rendez-vous pour coachs et consultants | Qrenoo",
    description:
      "Solution de prise de rendez-vous en ligne spécialement conçue pour les coachs sportifs, consultants et formateurs. Optimisez votre planning et fidélisez vos clients.",
    keywords:
      "logiciel rendez-vous coach, prise rdv coach sportif, agenda coach en ligne, planification séances coaching, gestion clients coach",
    alternates: {
      canonical: "/prise-de-rendez-vous-coach",
    },
    other: {
      "script:ld+json": jsonLd,
    },
    openGraph: {
      title: "Logiciel de rendez-vous pour coach | Qrenoo",
      description:
        "Gérez vos rendez-vous en ligne, réduisez les annulations et fidélisez vos clients avec Qrenoo.",
      url: "https://www.qrenoo.com/prise-de-rendez-vous-coach",
      images: [
        {
          url: "/images/qrenoo-og-image.png",
          width: 1200,
          height: 630,
          alt: "Qrenoo pour coiffeurs",
        },
      ],
      type: "website",
      locale: "fr_FR",
      siteName: "Qrenoo",
    },
    robots: { index: true, follow: true },
  };
};

export default function CoachSolution() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-[#f6f8f2]">
      <div className="w-full max-w-4xl px-4 pt-8">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Solutions par métier", href: "/jobs" },
            { label: "Coach sportif et Coach de bien-être" },
          ]}
        />
      </div>
      <section className="w-full px-4 pt-16 pb-12 flex flex-col items-center">
        <div className="max-w-3xl text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#29381a] mb-4 leading-tight">
            Solution de prise de rendez-vous pour coachs et consultants
          </h1>
          <p className="text-lg md:text-xl text-[#405c26] mb-8 font-medium">
            Spécialement conçue pour répondre aux besoins des coachs sportifs,
            consultants et formateurs
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="bg-[#29381a] text-white font-semibold rounded-lg px-6 py-3 hover:brightness-105 transition"
            >
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#29381a] text-center mb-10">
            Pourquoi les coachs choisissent Qrenoo ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/calendar-icon.svg"
                alt="Gestion de séances"
                width={120}
                height={120}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Gestion de séances individuelles et collectives
              </h3>
              <p className="text-[#405c26] text-center">
                Planifiez facilement des séances individuelles ou des cours
                collectifs avec un nombre limité de participants.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/client-icon.svg"
                alt="Suivi client"
                width={120}
                height={120}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Suivi client reçu au fil des séances
              </h3>
              <p className="text-[#405c26] text-center">
                Conservez l&apos;historique des séances prises par vos clients,
                ainsi que les heures de fréquentation et les paiements
                effectués.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/reminder-icon.svg"
                alt="Rappels"
                width={120}
                height={120}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Rappels automatiques
              </h3>
              <p className="text-[#405c26] text-center">
                Réduisez l&apos;absentéisme grâce aux rappels SMS et email
                envoyés automatiquement avant chaque rendez-vous.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/payment-icon.svg"
                alt="Paiements en ligne"
                width={120}
                height={120}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Paiements en ligne
              </h3>
              <p className="text-[#405c26] text-center">
                Proposez la réservation avec paiement d&apos;acompte ou intégral
                pour sécuriser vos revenus.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-[#f6f8f2]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#29381a] text-center mb-10">
            Témoignages de coachs qui utilisent Qrenoo
          </h2>

          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-[#efe9db] overflow-hidden">
            <div className="p-8">
              <p className="text-[#405c26] italic text-lg mb-6">
                &quot;Depuis que j&apos;utilise Qrenoo, j&apos;ai réduit de 70%
                les rendez-vous manqués. Mes clients apprécient également la
                simplicité de réservation et les rappels automatiques.&quot;
              </p>
              <div className="flex items-center">
                <div className="relative h-16 w-16 mr-4">
                  <Image
                    src="/images/coach-testimonial.jpg"
                    alt="Sophie Martin, Coach sportive"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-[#29381a]">Sophie Martin</p>
                  <p className="text-[#405c26]">Coach sportive à Lyon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#29381a] text-center mb-10">
            Fonctionnalités adaptées aux besoins des coachs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Agenda multi-lieux
              </h3>
              <p className="text-[#405c26]">
                Gérez facilement vos rendez-vous dans différents emplacements
                (salle de sport, domicile, visio).
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Forfaits et abonnements
              </h3>
              <p className="text-[#405c26]">
                Créez des forfaits de plusieurs séances et suivez leur
                utilisation par vos clients.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Questionnaire pré-séance
              </h3>
              <p className="text-[#405c26]">
                Recueillez des informations importantes avant le premier
                rendez-vous (objectifs, contraintes médicales).
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Application mobile
              </h3>
              <p className="text-[#405c26]">
                Gérez votre planning même en déplacement grâce à notre
                application mobile intuitive.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-[#f6f8f2]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-[#29381a] text-center mb-10">
            Questions fréquemment posées
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Puis-je synchroniser Qrenoo avec mon calendrier Google ?
              </h3>
              <p className="text-[#405c26]">
                (toujours en développement) Mais oui, Qrenoo se synchronisera
                parfaitement avec Google Calendar pour éviter tout risque de
                double réservation.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Comment gérer des séances de durées différentes ?
              </h3>
              <p className="text-[#405c26]">
                Vous pouvez configurer autant de types de prestations que
                nécessaire, chacune avec sa propre durée et son tarif.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Qrenoo est-il adapté pour les coachs qui travaillent en équipe ?
              </h3>
              <p className="text-[#405c26]">
                Absolument ! Notre formule Prenium permet de gérer plusieurs
                intervenants avec des agendas différents.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-[#29381a] text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à simplifier la gestion de vos rendez-vous ?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Rejoignez plus de 500 coachs qui font confiance à Qrenoo pour leur
            activité
          </p>
          <Link
            href="/contact"
            className="px-8 py-4 bg-white text-[#29381a] font-semibold rounded-lg hover:brightness-95 transition inline-block"
          >
            Demandez accès à la version Test
          </Link>
        </div>
      </section>
      <section className="w-full px-4 py-8 flex flex-col items-center bg-white">
        <div className="max-w-3xl w-full">
          <h2 className="text-xl font-bold text-[#29381a] mb-4">Voir aussi</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>
              <Link
                href="/jobs/prise-de-rendez-vous-nettoyeur-auto"
                className="text-[#405c26] underline hover:text-[#29381a]"
              >
                Solution pour nettoyeurs & centres de lavage
              </Link>
            </li>
            <li>
              <Link
                href="/jobs/prise-de-rendez-vous-coiffeur"
                className="text-[#405c26] underline hover:text-[#29381a]"
              >
                Coiffeur et Barbier
              </Link>
            </li>
            <li>
              <Link
                href="/features"
                className="text-[#405c26] underline hover:text-[#29381a]"
              >
                Toutes les fonctionnalités
              </Link>
            </li>
            <li>
              <Link
                href="/price"
                className="text-[#405c26] underline hover:text-[#29381a]"
              >
                Tarifs
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-[#405c26] underline hover:text-[#29381a]"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/inscription"
                className="text-[#405c26] underline hover:text-[#29381a]"
              >
                Inscription gratuite
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
