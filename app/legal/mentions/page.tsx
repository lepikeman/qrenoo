"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function MentionsLegales() {
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
            Mentions légales
          </h1>

          <div className="space-y-8 text-white/80">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Présentation du site
              </h2>
              <p className="mb-4">
                Conformément aux dispositions des articles 6-III et 19 de la Loi
                n° 2004-575 du 21 juin 2004 pour la Confiance dans
                l&apos;économie numérique, dite L.C.E.N., nous portons à la
                connaissance des utilisateurs et visiteurs du site{" "}
                <span className="text-[#B157FF]">qrenoo.com</span> les
                informations suivantes :
              </p>

              <h3 className="text-lg font-medium text-white/90 mt-4 mb-2">
                Informations légales :
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Statut du propriétaire : <strong>micro-entreprise</strong>
                </li>
                <li>
                  Nom de l&apos;entreprise : <strong>Qrenoo</strong>
                </li>
                <li>
                  Adresse :{" "}
                  <strong>12 rue des Développeurs, 75000 Paris, France</strong>
                </li>
                <li>
                  Adresse électronique : <strong>contact@qrenoo.com</strong>
                </li>
                <li>
                  Numéro SIRET : <strong>00000000000000</strong>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Hébergeur
              </h2>
              <p>
                Le site <span className="text-[#B157FF]">qrenoo.com</span> est
                hébergé par <strong>Vercel Inc.</strong>, dont le siège social
                est situé aux États-Unis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                3. Directeur de la publication
              </h2>
              <p>
                Le Directeur de la publication est <strong>Qrenoo</strong>,
                joignable à l&apos;adresse email :{" "}
                <span className="text-[#B157FF]">contact@qrenoo.com</span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                4. Droits de propriété intellectuelle
              </h2>
              <p className="mb-4">
                L&apos;ensemble de ce site relève de la législation française et
                internationale sur le droit d&apos;auteur et la propriété
                intellectuelle. Tous les droits de reproduction sont réservés, y
                compris pour les documents téléchargeables et les
                représentations iconographiques et photographiques.
              </p>
              <p>
                Toute reproduction, adaptation, traduction, distribution ou
                représentation intégrale ou partielle, par quelque procédé que
                ce soit, faite sans le consentement écrit préalable de Qrenoo
                est illicite et constitue une contrefaçon sanctionnée par les
                articles L.335-2 et suivants du Code de la propriété
                intellectuelle.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                5. Contact
              </h2>
              <p>
                Pour toute question concernant ces mentions légales, vous pouvez
                nous contacter à l&apos;adresse email suivante :{" "}
                <span className="text-[#B157FF]">contact@qrenoo.com</span>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
