"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function PolitiqueConfidentialite() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#B157FF]">
            Politique de confidentialité
          </h1>

          <div className="space-y-8 text-white/80">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                Introduction
              </h2>
              <p className="mb-4">
                Chez Qrenoo, nous accordons une grande importance à la
                protection de vos données personnelles. Cette politique de
                confidentialité explique comment nous collectons, utilisons,
                partageons et protégeons vos informations personnelles lorsque
                vous utilisez notre application et notre site web.
              </p>
              <p>
                Cette politique s&apos;applique à tous les utilisateurs de nos
                services, qu&apos;ils soient professionnels ou clients finaux.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Collecte des données
              </h2>
              <p className="mb-4">
                Nous collectons les informations suivantes :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Informations d&apos;identification (nom, prénom, adresse
                  email)
                </li>
                <li>
                  Informations professionnelles (si vous êtes un professionnel)
                </li>
                <li>Données de rendez-vous et de disponibilité</li>
                <li>
                  Données de navigation et d&apos;utilisation de nos services
                </li>
                <li>Données techniques (adresse IP, type d&apos;appareil)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Utilisation des données
              </h2>
              <p className="mb-4">Vos données sont utilisées pour :</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Fournir, maintenir et améliorer nos services</li>
                <li>Traiter vos réservations et gérer votre compte</li>
                <li>
                  Vous envoyer des notifications importantes concernant vos
                  rendez-vous
                </li>
                <li>
                  Vous communiquer des mises à jour et des informations sur nos
                  services
                </li>
                <li>Détecter et prévenir les fraudes et abus</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                3. Partage des données
              </h2>
              <p className="mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons
                les partager dans les cas suivants :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Avec votre consentement explicite</li>
                <li>
                  Avec les professionnels pour faciliter les rendez-vous (si
                  vous êtes un client)
                </li>
                <li>
                  Avec les clients pour confirmer les réservations (si vous êtes
                  un professionnel)
                </li>
                <li>
                  Avec nos fournisseurs de services qui nous aident à fournir
                  nos services
                </li>
                <li>
                  Si la loi l&apos;exige ou pour protéger nos droits légaux
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                4. Protection des données
              </h2>
              <p>
                Nous mettons en place des mesures de sécurité appropriées pour
                protéger vos données contre tout accès, modification,
                divulgation ou destruction non autorisés. Ces mesures incluent
                le chiffrement des données, l&apos;accès restreint aux
                informations personnelles et des audits de sécurité réguliers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                5. Vos droits
              </h2>
              <p className="mb-4">
                Conformément au Règlement Général sur la Protection des Données
                (RGPD), vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Droit d&apos;accès à vos données</li>
                <li>Droit de rectification de vos données</li>
                <li>Droit à l&apos;effacement de vos données</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité de vos données</li>
                <li>Droit d&apos;opposition au traitement</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, veuillez nous contacter à
                l&apos;adresse :{" "}
                <span className="text-[#B157FF]">contact@qrenoo.com</span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                6. Cookies
              </h2>
              <p>
                Notre site utilise des cookies pour améliorer votre expérience
                utilisateur, analyser notre trafic et personnaliser notre
                contenu. Vous pouvez contrôler l&apos;utilisation des cookies
                via les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                7. Modifications de la politique
              </h2>
              <p>
                Nous pouvons modifier cette politique de confidentialité à tout
                moment. Les modifications entrent en vigueur dès leur
                publication sur notre site. Nous vous recommandons de consulter
                régulièrement cette page pour rester informé des éventuelles
                mises à jour.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                8. Contact
              </h2>
              <p>
                Si vous avez des questions concernant cette politique de
                confidentialité, veuillez nous contacter à :{" "}
                <span className="text-[#B157FF]">contact@qrenoo.com</span>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
