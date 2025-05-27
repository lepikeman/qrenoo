"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function RGPD() {
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
            Politique RGPD
          </h1>

          <div className="space-y-8 text-white/80">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Introduction au RGPD
              </h2>
              <p>
                Le Règlement Général sur la Protection des Données (RGPD) est
                entré en vigueur le 25 mai 2018. Ce règlement renforce et unifie
                la protection des données pour tous les individus au sein de
                l&apos;Union européenne. Chez Qrenoo, nous prenons très au
                sérieux la protection de vos données personnelles et nous nous
                engageons à respecter pleinement cette réglementation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Responsable du traitement
              </h2>
              <p>
                Le responsable du traitement des données collectées via notre
                service est : <br />
                <strong>Qrenoo</strong>
                <br />
                12 rue des Développeurs
                <br />
                75000 Paris, France
                <br />
                Email :{" "}
                <span className="text-[#B157FF]">contact@qrenoo.com</span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                3. Délégué à la Protection des Données (DPO)
              </h2>
              <p>
                Nous avons nommé un Délégué à la Protection des Données que vous
                pouvez contacter pour toute question relative au traitement de
                vos données personnelles : <br />
                Email :{" "}
                <span className="text-[#B157FF]">contact@qrenoo.com</span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                4. Catégories de données traitées
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    4.1 Données d&apos;identification
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Nom et prénom</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Identifiants de connexion (hachés)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    4.2 Données professionnelles (pour les professionnels)
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Nom de l&apos;entreprise ou de l&apos;activité</li>
                    <li>Adresse professionnelle</li>
                    <li>Numéro SIRET/SIREN</li>
                    <li>Domaine d&apos;activité</li>
                    <li>Horaires d&apos;ouverture</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    4.3 Données de rendez-vous
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Date et heure des rendez-vous</li>
                    <li>Type de prestation</li>
                    <li>
                      Informations fournies dans les formulaires préalables aux
                      rendez-vous
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    4.4 Données de connexion et d&apos;utilisation
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Adresse IP</li>
                    <li>
                      Données de navigation (pages visitées, durée de la visite)
                    </li>
                    <li>Type d&apos;appareil et système d&apos;exploitation</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                5. Finalités du traitement
              </h2>
              <p className="mb-4">
                Nous collectons et traitons vos données personnelles pour les
                finalités suivantes :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Création et gestion de votre compte utilisateur</li>
                <li>Fourniture des services de prise de rendez-vous</li>
                <li>
                  Envoi de rappels et notifications concernant vos rendez-vous
                </li>
                <li>
                  Communication d&apos;informations sur nos services (avec votre
                  consentement)
                </li>
                <li>
                  Amélioration de nos services et analyse d&apos;utilisation
                </li>
                <li>Respect de nos obligations légales et réglementaires</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                6. Base juridique du traitement
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    6.1 Exécution du contrat
                  </h3>
                  <p>
                    Le traitement est nécessaire à l&apos;exécution du contrat
                    auquel vous êtes partie ou à l&apos;exécution de mesures
                    précontractuelles prises à votre demande.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    6.2 Consentement
                  </h3>
                  <p>
                    Pour certains traitements spécifiques, comme l&apos;envoi de
                    communications marketing, nous recueillons votre
                    consentement explicite.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    6.3 Intérêts légitimes
                  </h3>
                  <p>
                    Certains traitements sont basés sur nos intérêts légitimes,
                    comme l&apos;amélioration de nos services ou la prévention
                    des fraudes, tout en respectant vos droits et libertés
                    fondamentaux.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    6.4 Obligation légale
                  </h3>
                  <p>
                    Certains traitements peuvent être nécessaires pour respecter
                    nos obligations légales.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                7. Durée de conservation des données
              </h2>
              <p className="mb-4">
                Nous conservons vos données personnelles aussi longtemps que
                nécessaire pour les finalités pour lesquelles elles ont été
                collectées, notamment :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Données du compte : pendant toute la durée d&apos;existence de
                  votre compte et jusqu&apos;à 3 ans après sa suppression
                </li>
                <li>
                  Données de rendez-vous : pendant 3 ans après le dernier
                  rendez-vous
                </li>
                <li>
                  Données de facturation : pendant 10 ans conformément aux
                  obligations légales
                </li>
                <li>Données de navigation : pendant 13 mois maximum</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                8. Destinataires des données
              </h2>
              <p className="mb-4">
                Dans la limite des finalités définies ci-dessus, vos données
                peuvent être partagées avec :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Notre personnel habilité</li>
                <li>
                  Nos sous-traitants techniques (hébergement, envoi
                  d&apos;emails, etc.)
                </li>
                <li>
                  Les professionnels ou clients concernés par les rendez-vous
                </li>
                <li>
                  Les autorités compétentes, à leur demande, dans le cadre de
                  procédures légales
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                9. Transferts de données hors UE
              </h2>
              <p>
                Si nous transférons vos données vers des pays situés en dehors
                de l&apos;Union européenne, nous nous assurons que ces
                transferts sont encadrés par des garanties appropriées
                conformément au RGPD (décision d&apos;adéquation, clauses
                contractuelles types, etc.).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                10. Sécurité des données
              </h2>
              <p>
                Nous mettons en œuvre des mesures techniques et
                organisationnelles appropriées pour garantir la sécurité de vos
                données personnelles, notamment contre le traitement non
                autorisé ou illicite et contre la perte, la destruction ou les
                dégâts d&apos;origine accidentelle. Ces mesures comprennent le
                chiffrement des données sensibles, l&apos;accès restreint aux
                données personnelles, la mise à jour régulière de nos systèmes
                de sécurité, et la formation de notre personnel.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                11. Vos droits
              </h2>
              <p className="mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Droit d&apos;accès</strong> : vous pouvez obtenir une
                  copie des données vous concernant
                </li>
                <li>
                  <strong>Droit de rectification</strong> : vous pouvez demander
                  la correction des données inexactes
                </li>
                <li>
                  <strong>Droit à l&apos;effacement</strong> : vous pouvez
                  demander la suppression de vos données dans certaines
                  conditions
                </li>
                <li>
                  <strong>Droit à la limitation du traitement</strong> : vous
                  pouvez demander de limiter l&apos;utilisation de vos données
                </li>
                <li>
                  <strong>Droit à la portabilité</strong> : vous pouvez
                  récupérer vos données dans un format structuré
                </li>
                <li>
                  <strong>Droit d&apos;opposition</strong> : vous pouvez vous
                  opposer au traitement de vos données
                </li>
                <li>
                  <strong>Droit de retirer votre consentement</strong> à tout
                  moment pour les traitements basés sur le consentement
                </li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, vous pouvez nous contacter à
                l&apos;adresse :{" "}
                <span className="text-[#B157FF]">contact@qrenoo.com</span>. Nous
                répondrons à votre demande dans un délai maximum d&apos;un mois.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                12. Réclamation auprès d&apos;une autorité de contrôle
              </h2>
              <p>
                Si vous estimez que le traitement de vos données personnelles
                n&apos;est pas conforme à la réglementation, vous avez le droit
                d&apos;introduire une réclamation auprès de la Commission
                Nationale de l&apos;Informatique et des Libertés (CNIL) ou de
                toute autre autorité de contrôle compétente.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
