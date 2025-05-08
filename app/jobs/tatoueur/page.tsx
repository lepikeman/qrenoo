import React from "react";
import Image from "next/image";
import Link from "next/link";

export const generateMetadata = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Qrenoo pour Nettoyeurs Auto",
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
      ratingCount: "86",
    },
  };

  return {
    metadataBase: new URL("https://qrenoo.com"),
    title:
      "Logiciel de rendez-vous pour nettoyeurs auto et centres de lavage | Qrenoo",
    description:
      "Solution de prise de rendez-vous en ligne dédiée aux nettoyeurs auto et centres de lavage. Gérez vos prestations, réservations et fidélisez vos clients en toute simplicité.",
    keywords:
      "logiciel rendez-vous nettoyage auto, prise rdv lavage voiture, agenda nettoyeur auto en ligne, gestion planning centre lavage, système réservation nettoyage automobile",
    alternates: {
      canonical: "/nettoyeur-auto",
    },
    other: {
      "script:ld+json": jsonLd,
    },
  };
};

export default function NettoyeurAutoSolution() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-[#f6f8f2]">
      <section className="w-full px-4 pt-16 pb-12 flex flex-col items-center">
        <div className="max-w-3xl text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#29381a] mb-4 leading-tight">
            Solution de prise de rendez-vous pour nettoyeurs auto et centres de
            lavage
          </h1>
          <p className="text-lg md:text-xl text-[#405c26] mb-8 font-medium">
            Spécialement conçue pour gérer les réservations, les différentes
            formules de nettoyage et la fidélisation client
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inscription"
              className="bg-[#29381a] text-white font-semibold rounded-lg px-6 py-3 hover:brightness-105 transition"
            >
              Essayer gratuitement
            </Link>
            <Link
              href="/demo"
              className="px-6 py-3 border border-[#29381a] text-[#29381a] font-medium rounded-lg hover:bg-[#efe9db] transition-colors"
            >
              Demander une démo
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#29381a] text-center mb-10">
            Pourquoi les nettoyeurs auto choisissent Qrenoo ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/Schedule-amico.svg"
                alt="Gestion des réservations"
                width={120}
                height={120}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Planification optimisée
              </h3>
              <p className="text-[#405c26] text-center">
                Gérez efficacement votre planning et maximisez le nombre de
                véhicules traités quotidiennement.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/client-icon.svg"
                alt="Formules de nettoyage"
                width={120}
                height={120}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Formules personnalisées
              </h3>
              <p className="text-[#405c26] text-center">
                Configurez toutes vos formules de nettoyage avec durées,
                services inclus et tarifs spécifiques.
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
                Réservation avec acompte
              </h3>
              <p className="text-[#405c26] text-center">
                Réduisez les annulations de dernière minute grâce aux
                réservations avec acompte en ligne.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/reminder-icon.svg"
                alt="Rappels automatisés"
                width={120}
                height={120}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Rappels automatiques
              </h3>
              <p className="text-[#405c26] text-center">
                Envoyez des rappels par SMS/email à vos clients avant leur
                rendez-vous pour réduire les oublis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-[#f6f8f2]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#29381a] text-center mb-10">
            Témoignages de professionnels qui utilisent Qrenoo
          </h2>

          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-[#efe9db] overflow-hidden">
            <div className="p-8">
              <p className="text-[#405c26] italic text-lg mb-6">
                &quot;Grâce à Qrenoo, nous avons augmenté notre nombre de
                rendez-vous de 40%. La possibilité pour nos clients de réserver
                en ligne 24h/24 et les options de personnalisation des formules
                ont révolutionné notre activité.&quot;
              </p>
              <div className="flex items-center">
                <div className="relative h-16 w-16 mr-4">
                  <div className="h-16 w-16 rounded-full bg-[#29381a] flex items-center justify-center text-white text-xl font-bold">
                    JD
                  </div>
                </div>
                <div>
                  <p className="font-medium text-[#29381a]">Jean Dupont</p>
                  <p className="text-[#405c26]">Crystal Car Wash, Bordeaux</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#29381a] text-center mb-10">
            Fonctionnalités adaptées aux nettoyeurs auto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Gestion des postes de lavage
              </h3>
              <p className="text-[#405c26]">
                Attribuez facilement les rendez-vous aux différents
                postes/espaces de nettoyage disponibles.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Payement en ligne sécurisé
              </h3>
              <p className="text-[#405c26]">
                Proposez a vos client de régler en ligne lors de la réservation
                pour sécuriser les paiements et réduire les annulations.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Historique des Rendez-vous
              </h3>
              <p className="text-[#405c26]">
                Conservez l&apos;historique des rendez-vous, et consulter le
                nombre de nouveau clients et de clients récurrents.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Horaires flexibles
              </h3>
              <p className="text-[#405c26]">
                Gérez facilement vos horaires, et adaptez-les selon vos besoins
                ou imprévus.
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
                Puis-je proposer des options supplémentaires lors de la
                réservation ?
              </h3>
              <p className="text-[#405c26]">
                Oui, vous pouvez configurer des options additionnelles
                (traitement cuir, polissage, etc.) que vos clients peuvent
                sélectionner lors de leur réservation.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Comment gérer différents types de véhicules avec des durées de
                nettoyage variables ?
              </h3>
              <p className="text-[#405c26]">
                Qrenoo permet de paramétrer des prestations spécifiques selon le
                type de véhicule (citadine, SUV, utilitaire) avec des durées et
                tarifs adaptés.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Est-il possible de gérer plusieurs centres de lavage avec un
                seul compte ?
              </h3>
              <p className="text-[#405c26]">
                Absolument ! Vous pouvez gérer plusieurs centres de lavage
                depuis le tableau de bord unique de Qrenoo grave au différents
                tags personnalisables.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-[#29381a] text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à optimiser la gestion de votre centre de lavage ?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Rejoignez des centaines de professionnels du nettoyage automobile
            qui utilisent Qrenoo au quotidien
          </p>
          <Link
            href="/inscription"
            className="px-8 py-4 bg-white text-[#29381a] font-semibold rounded-lg hover:brightness-95 transition inline-block"
          >
            Commencer votre essai gratuit
          </Link>
        </div>
      </section>
    </main>
  );
}
