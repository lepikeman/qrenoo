"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function CGU() {
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
            Conditions Générales d&apos;Utilisation et de Vente
          </h1>

          <div className="space-y-8 text-white/80">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Préambule
              </h2>
              <p>
                Les présentes Conditions Générales d&apos;Utilisation et de
                Vente (ci-après &quot;CGUV&quot;) ont pour objet de définir les
                modalités et conditions d&apos;utilisation des services proposés
                par Qrenoo (ci-après &quot;le Service&quot;), ainsi que de
                définir les droits et obligations des parties dans ce cadre.
                Elles sont accessibles et imprimables à tout moment sur le site{" "}
                <span className="text-[#B157FF]">qrenoo.com</span>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Définitions
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>&quot;Utilisateur&quot;</strong> : toute personne
                  physique ou morale qui utilise le Service
                </li>
                <li>
                  <strong>&quot;Professionnel&quot;</strong> : tout Utilisateur
                  proposant des prestations de services via le Service
                </li>
                <li>
                  <strong>&quot;Client&quot;</strong> : tout Utilisateur
                  réservant des prestations auprès d&apos;un Professionnel via
                  le Service
                </li>
                <li>
                  <strong>&quot;Compte&quot;</strong> : espace personnel de
                  l&apos;Utilisateur sur le Service
                </li>
                <li>
                  <strong>&quot;Contenu&quot;</strong> : toutes les informations
                  et données publiées par l&apos;Utilisateur sur le Service
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                3. Inscription et accès au Service
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    3.1 Conditions d&apos;inscription
                  </h3>
                  <p>
                    L&apos;utilisation du Service est réservée aux personnes
                    physiques majeures capables juridiquement ou aux personnes
                    morales. L&apos;Utilisateur garantit qu&apos;il dispose de
                    toutes les autorisations nécessaires pour utiliser le
                    Service.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    3.2 Création de compte
                  </h3>
                  <p>
                    Pour utiliser le Service, l&apos;Utilisateur doit créer un
                    compte en fournissant des informations complètes et exactes.
                    L&apos;Utilisateur est responsable de la confidentialité de
                    ses identifiants de connexion et s&apos;engage à ne pas les
                    partager avec des tiers.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                4. Description des services
              </h2>
              <p className="mb-4">
                Qrenoo propose une plateforme de gestion de rendez-vous en ligne
                permettant aux Professionnels de gérer leurs disponibilités et
                aux Clients de prendre rendez-vous. Les services comprennent
                notamment :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>La création et la gestion d&apos;un agenda en ligne</li>
                <li>La prise de rendez-vous par les Clients</li>
                <li>L&apos;envoi de rappels automatiques par email et SMS</li>
                <li>La gestion d&apos;un profil public personnalisable</li>
                <li>L&apos;accès à des statistiques d&apos;utilisation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                5. Conditions financières
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    5.1 Prix
                  </h3>
                  <p>
                    Les prix des services sont indiqués en euros, toutes taxes
                    comprises. Qrenoo se réserve le droit de modifier ses prix à
                    tout moment, les services étant facturés sur la base des
                    tarifs en vigueur au moment de la validation de la commande.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    5.2 Modalités de paiement
                  </h3>
                  <p>
                    Le paiement s&apos;effectue en ligne par carte bancaire via
                    une connexion sécurisée. La facture est disponible dans
                    l&apos;espace client du Professionnel.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    5.3 Durée et renouvellement
                  </h3>
                  <p>
                    Les abonnements sont conclus pour la durée indiquée lors de
                    la souscription. Sauf indication contraire, ils sont
                    automatiquement renouvelés à l&apos;échéance pour une
                    période identique, sauf dénonciation par l&apos;une des
                    parties dans les conditions prévues à l&apos;article 8.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                6. Obligations des utilisateurs
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    6.1 Obligations des Professionnels
                  </h3>
                  <p className="mb-4">Le Professionnel s&apos;engage à :</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Fournir des informations exactes sur son activité</li>
                    <li>Respecter les rendez-vous pris via le Service</li>
                    <li>Mettre à jour régulièrement ses disponibilités</li>
                    <li>
                      Respecter la politique d&apos;annulation définie dans son
                      profil
                    </li>
                    <li>
                      Ne pas utiliser le Service à des fins illégales ou
                      contraires à l&apos;ordre public
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    6.2 Obligations des Clients
                  </h3>
                  <p className="mb-4">Le Client s&apos;engage à :</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Fournir des informations exactes lors de la prise de
                      rendez-vous
                    </li>
                    <li>
                      Honorer les rendez-vous pris ou les annuler dans le
                      respect des délais indiqués
                    </li>
                    <li>
                      Respecter les conditions particulières définies par chaque
                      Professionnel
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                7. Propriété intellectuelle
              </h2>
              <p className="mb-4">
                Le contenu du Service (textes, images, logos, etc.) est protégé
                par le droit de la propriété intellectuelle. Toute reproduction
                ou représentation, totale ou partielle, du Service ou de
                l&apos;un de ses éléments, sans autorisation expresse, est
                interdite.
              </p>
              <p>
                L&apos;Utilisateur conserve l&apos;intégralité des droits de
                propriété intellectuelle sur le Contenu qu&apos;il publie sur le
                Service. Il accorde à Qrenoo une licence non exclusive,
                mondiale, gratuite et cessible pour utiliser, reproduire,
                représenter et adapter ce Contenu dans le cadre du Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                8. Résiliation
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    8.1 Résiliation par l&apos;Utilisateur
                  </h3>
                  <p>
                    L&apos;Utilisateur peut résilier son Compte à tout moment
                    depuis son espace personnel. En cas d&apos;abonnement
                    payant, la résiliation prendra effet à la fin de la période
                    d&apos;abonnement en cours.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    8.2 Résiliation par Qrenoo
                  </h3>
                  <p>
                    Qrenoo se réserve le droit de résilier le Compte d&apos;un
                    Utilisateur en cas de manquement aux présentes CGUV,
                    notamment en cas d&apos;utilisation frauduleuse ou abusive
                    du Service, de non-paiement, ou de fourniture
                    d&apos;informations erronées.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                9. Responsabilité et garanties
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    9.1 Responsabilité de Qrenoo
                  </h3>
                  <p>
                    Qrenoo s&apos;engage à fournir le Service avec diligence et
                    selon les règles de l&apos;art, étant précisé qu&apos;il
                    pèse sur elle une obligation de moyens, à l&apos;exclusion
                    de toute obligation de résultat. Qrenoo ne saurait être
                    tenue responsable des problèmes techniques échappant à son
                    contrôle raisonnable.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white/90 mb-2">
                    9.2 Responsabilité des Utilisateurs
                  </h3>
                  <p>
                    L&apos;Utilisateur est seul responsable du Contenu
                    qu&apos;il publie sur le Service. Il garantit qu&apos;il
                    dispose de tous les droits et autorisations nécessaires à
                    leur publication. L&apos;Utilisateur est également
                    responsable de l&apos;usage qu&apos;il fait du Service et
                    des relations qu&apos;il entretient avec les autres
                    Utilisateurs.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                10. Loi applicable et juridiction compétente
              </h2>
              <p>
                Les présentes CGUV sont régies par la loi française. En cas de
                litige, les parties s&apos;engagent à rechercher une solution
                amiable avant toute action judiciaire. À défaut, les tribunaux
                français seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                11. Modification des CGUV
              </h2>
              <p>
                Qrenoo se réserve le droit de modifier les présentes CGUV à tout
                moment. Les Utilisateurs seront informés de toute modification
                par email et/ou par un avis sur le Service. Les modifications
                entreront en vigueur 30 jours après leur publication.
                L&apos;utilisation continue du Service après cette date vaut
                acceptation des nouvelles CGUV.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
