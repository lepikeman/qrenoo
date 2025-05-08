import React from "react";
import Image from "next/image";
import Link from "next/link";

export const generateMetadata = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Qrenoo pour Coiffeurs",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "19.90",
      priceCurrency: "EUR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      ratingCount: "132",
    },
  };

  return {
    metadataBase: new URL("https://qrenoo.com"),
    title:
      "Logiciel de rendez-vous pour coiffeurs et salons de coiffure | Qrenoo",
    description:
      "Solution de prise de rendez-vous en ligne spécialement conçue pour les coiffeurs et salons de coiffure. Gérez votre planning, réduisez les annulations et fidélisez vos clients.",
    keywords:
      "logiciel rendez-vous coiffeur, prise rdv salon coiffure, agenda coiffeur en ligne, gestion planning salon, système réservation coiffure",
    alternates: {
      canonical: "/prise-de-rendez-vous-coiffeur",
    },
    other: {
      "script:ld+json": jsonLd,
    },
    openGraph: {
      title: "Logiciel de rendez-vous pour coiffeurs | Qrenoo",
      description: "Gérez vos rendez-vous en ligne, réduisez les annulations et fidélisez vos clients avec Qrenoo.",
      url: "https://www.qrenoo.com/prise-de-rendez-vous-coiffeur",
      images: [{ url: "/images/qrenoo-og-image.png", width: 1200, height: 630, alt: "Qrenoo pour coiffeurs" }],
      type: "website",
      locale: "fr_FR",
      siteName: "Qrenoo",
    },
    robots: { index: true, follow: true },
  };
};

export default function CoiffeurSolution() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-[#f6f8f2]">
      <section className="w-full px-4 pt-16 pb-12 flex flex-col items-center">
        <div className="max-w-3xl text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#29381a] mb-4 leading-tight">
            Solution de prise de rendez-vous pour coiffeurs et salons de
            coiffure
          </h1>
          <p className="text-lg md:text-xl text-[#405c26] mb-8 font-medium">
            Spécialement conçue pour simplifier la gestion des rendez-vous dans
            votre salon
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/inscription"
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
            Pourquoi les coiffeurs choisissent Qrenoo ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/team-icon.svg"
                alt="Planning multi-collaborateurs"
                width={120}
                height={120}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Planning multi-collaborateurs
              </h3>
              <p className="text-[#405c26] text-center">
                Gérez facilement les agendas de tous vos coiffeurs et
                répartissez efficacement les rendez-vous.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/services-icon.svg"
                alt="Types de prestations"
                width={120}
                height={120}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Types de prestations personnalisables
              </h3>
              <p className="text-[#405c26] text-center">
                Configurez toutes vos prestations (coupe, coloration,
                brushing...) avec leurs durées et tarifs spécifiques.
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
                Réduction des rendez-vous manqués
              </h3>
              <p className="text-[#405c26] text-center">
                Nos clients constatent jusqu&apos;à 80% de réduction des
                annulations grâce aux rappels automatiques, et a la confirmation a la prise de rendez-vous.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#efe9db] p-6 flex flex-col items-center">
              <Image
                src="/assets/client-icon.svg"
                alt="Fidélisation client"
                width={120}
                height={120}
                className="mb-4"
                loading="lazy"
              />
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Fidélisation client
              </h3>
              <p className="text-[#405c26] text-center">
                Conservez l&apos;historique complet des rendez-vous (heure la plus
                fréquentée, type de prestation, etc.) pour mieux comprendre vos
                clients et leur proposer des offres adaptées.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-[#f6f8f2]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#29381a] text-center mb-10">
            Témoignages de coiffeurs qui utilisent Qrenoo
          </h2>

          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-[#efe9db] overflow-hidden">
            <div className="p-8">
              <p className="text-[#405c26] italic text-lg mb-6">
                &quot;Qrenoo a transformé la gestion de mon salon. Mes clients
                peuvent réserver 24h/24 et j&apos;ai drastiquement réduit les
                no-shows grâce aux rappels automatiques. Un gain de temps
                considérable !&quot;
              </p>
              <div className="flex items-center">
                <div className="relative h-16 w-16 mr-4">
                  <div className="h-16 w-16 rounded-full bg-[#29381a] flex items-center justify-center text-white text-xl font-bold">
                    TL
                  </div>
                </div>
                <div>
                  <p className="font-medium text-[#29381a]">Thomas Laurent</p>
                  <p className="text-[#405c26]">Salon Éclat, Bordeaux</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-[#29381a] text-center mb-10">
            Fonctionnalités adaptées aux salons de coiffure
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Gestion des prestations combinées
              </h3>
              <p className="text-[#405c26]">
                Créez des prestations combinées (coupe + coloration) avec calcul
                intelligent du temps nécessaire.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Fiches clients détaillées
              </h3>
              <p className="text-[#405c26]">
                Demande spécifique indiquée par le client, directement sur la
                fiche du rendez-vous
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Planning par compétences
              </h3>
              <p className="text-[#405c26]">
                Attribuez les rendez-vous selon les compétences spécifiques de
                chaque membre de votre équipe.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                SMS et e-mails de confirmation
              </h3>
              <p className="text-[#405c26]">
                Envoyez des confirmations automatiques par SMS ou e-mail pour
                chaque rendez-vous pris en 1-clique !
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
                Qrenoo peut-il gérer différentes durées pour un même type de
                prestation ?
              </h3>
              <p className="text-[#405c26]">
                Oui, vous pouvez configurer des variantes d&apos;une même
                prestation (coupe femme cheveux courts/mi-longs/longs) avec des
                durées spécifiques.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Est-il possible de bloquer des créneaux pour des tâches internes
                ?
              </h3>
              <p className="text-[#405c26]">
                Tout à fait, vous pouvez réserver des plages horaires pour des
                formations, inventaires ou autres tâches administratives, ou des
                rendez-vous pris au salon directement.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-[#efe9db]">
              <h3 className="text-xl font-bold text-[#29381a] mb-2">
                Comment gérer les horaires d&apos;ouverture ?
              </h3>
              <p className="text-[#405c26]">
                Qrenoo permet de configurer vos horaires d&apos;ouverture
                directement dans votre tableau de bord.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-12 flex flex-col items-center bg-[#29381a] text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer la gestion de votre salon ?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Rejoignez plus de 600 salons de coiffure qui utilisent Qrenoo au
            quotidien
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
