"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function PolitiqueMaintenance() {
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
            Politique de maintenance
          </h1>

          <div className="space-y-8 text-white/80">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Objectifs de notre politique de maintenance
              </h2>
              <p>
                Cette politique de maintenance décrit notre engagement à fournir
                un service fiable et de haute qualité. Nous nous efforçons de
                minimiser les interruptions de service tout en assurant que
                notre plateforme bénéficie des dernières améliorations et
                mesures de sécurité.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Types de maintenance
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    2.1 Maintenance planifiée
                  </h3>
                  <p>
                    Les maintenances planifiées sont programmées à l&apos;avance
                    et communiquées aux utilisateurs par email et/ou
                    notification dans l&apos;application au moins 48 heures
                    avant l&apos; intervention. Ces maintenances ont
                    généralement lieu pendant les périodes de faible activité
                    (nuits, week-ends) pour minimiser l&apos;impact sur votre
                    activité.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    2.2 Maintenance d&apos;urgence
                  </h3>
                  <p>
                    Dans certains cas exceptionnels (failles de sécurité
                    critiques, pannes majeures), nous pouvons être amenés à
                    effectuer une maintenance d&apos;urgence sans notification
                    préalable. Nous nous efforcerons de limiter ces
                    interventions au strict nécessaire et de rétablir le service
                    dans les plus brefs délais.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    2.3 Mises à jour continues
                  </h3>
                  <p>
                    Nous déployons régulièrement des mises à jour mineures
                    (corrections de bugs, améliorations de performance) qui
                    n&apos;affectent pas la disponibilité du service. Ces mises
                    à jour sont généralement transparentes pour
                    l&apos;utilisateur.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                3. Calendrier de maintenance
              </h2>
              <p className="mb-4">
                Les maintenances planifiées sont généralement programmées selon
                le calendrier suivant :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Mises à jour majeures : une fois par trimestre</li>
                <li>
                  Mises à jour de sécurité : mensuelles ou selon nécessité
                </li>
                <li>
                  Plage horaire privilégiée : entre 23h et 5h (heure de Paris)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                4. Communication
              </h2>
              <p className="mb-4">
                Nous vous informerons des maintenances planifiées par :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Email à l&apos;adresse associée à votre compte</li>
                <li>Notification dans l&apos;application</li>
                <li>
                  Bannière d&apos;information sur notre site et dans
                  l&apos;application
                </li>
                <li>
                  Mise à jour de notre page de statut :{" "}
                  <span className="text-[#B157FF]">status.qrenoo.com</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                5. Impact sur vos données
              </h2>
              <p>
                Nos opérations de maintenance sont conçues pour préserver
                l&apos;intégrité de vos données. Nous réalisons des sauvegardes
                avant chaque maintenance importante. En cas de problème, nous
                pouvons restaurer vos données à l&apos;état antérieur à la
                maintenance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                6. Engagement de disponibilité
              </h2>
              <p>
                Nous nous engageons à maintenir une disponibilité de notre
                service de 99,9% sur une base mensuelle, hors périodes de
                maintenance planifiée. Cela correspond à un maximum de 43
                minutes d&apos;indisponibilité non planifiée par mois.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                7. Assistance pendant les périodes de maintenance
              </h2>
              <p>
                Notre équipe de support reste disponible pendant les périodes de
                maintenance pour répondre à vos questions et préoccupations à
                l&apos;adresse :{" "}
                <span className="text-[#B157FF]">contact@qrenoo.com</span>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
