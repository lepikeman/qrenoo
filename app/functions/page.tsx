"use client";

import Image from "next/image";
import { FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import DevPopup, { useDevPopup } from "../components/DevPopup";
import PlayStorePopup, {
  usePlayStorePopup,
} from "../components/PlayStorePopup";
import StructuredData from "../components/StructuredData";

export default function FunctionsPage() {
  // Animation variants améliorés
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const imageAnimation = {
    hidden: { opacity: 0, scale: 0.92, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
        delay: 0.1,
      },
    },
  };

  const listItemVariant = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // InView hooks avec seuils optimisés
  const [agendaRef, agendaInView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
    rootMargin: "-50px 0px",
  });
  const [tableauRef, tableauInView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
    rootMargin: "-50px 0px",
  });
  const [reservationRef, reservationInView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
    rootMargin: "-50px 0px",
  });

  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const { isPopupOpen, openPopup, closePopup } = useDevPopup();
  const {
    isPopupOpen: isPlayStorePopupOpen,
    openPopup: openPlayStorePopup,
    closePopup: closePlayStorePopup,
  } = usePlayStorePopup();

  const functionsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Agenda intelligent",
        description:
          "Tous les rendez-vous pris par vos clients depuis votre page de réservation sont automatiquement ajoutés à votre calendrier.",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Rappels automatiques",
        description:
          "Fini les oublis avec nos rappels automatisés par SMS et email.",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Planning en temps réel",
        description:
          "Gérez votre emploi du temps depuis n'importe quel appareil.",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Lien de réservation unique",
        description:
          "Partagez un lien personnalisé pour les réservations en 1 clic.",
      },
    ],
  };

  return (
    <main className="flex flex-col min-h-screen md:w-[80vw] items-center justify-center mx-auto">
      <StructuredData data={functionsSchema} />
      {/* Section Agenda avec animations améliorées */}
      <section ref={agendaRef} className="w-full pt-6 pb-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-center mb-6">
          <motion.div
            initial="hidden"
            animate={agendaInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="px-4 md:px-8 lg:px-12 max-w-6xl mx-auto md:w-1/2"
          >
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
          </motion.div>

          <motion.div
            initial="hidden"
            animate={agendaInView ? "visible" : "hidden"}
            variants={imageAnimation}
            className="my-8 w-full md:w-1/2 md:ml-5 flex justify-center relative"
          >
            {/* Image optimisée pour tous les appareils */}
            <div className="relative w-full max-w-[420px] h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
              <Image
                src="/images/mockup/iMockup-incline-large.png"
                alt="Application Qrenoo - Agenda"
                fill
                style={{ objectFit: "contain", objectPosition: "center" }}
                quality={90}
                priority
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 500px"
                className="drop-shadow-2xl"
              />
            </div>

            {/* Élément décoratif */}
            <motion.div
              className="absolute -z-10 rounded-full bg-gradient-to-tr from-[#B157FF]/20 to-transparent w-[300px] h-[300px] blur-3xl opacity-50"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </div>

        {/* Boutons mobile avec animations améliorées */}
        <motion.div
          initial="hidden"
          animate={agendaInView ? "visible" : "hidden"}
          variants={buttonAnimation}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between mx-3 sm:mx-6 md:mx-8 lg:mx-12"
        >
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 25px -10px rgba(177, 87, 255, 0.45)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full"
          >
            <a
              href="#"
              onClick={openPopup}
              className="bg-[#B157FF] text-white flex py-3 px-4 rounded-2xl justify-center items-center text-center font-medium w-full text-sm sm:text-base"
            >
              Essayer gratuitement Qrenoo
            </a>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 25px -10px rgba(121, 58, 142, 0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full mt-2 sm:mt-0"
          >
            <a
              href="#"
              onClick={openPlayStorePopup}
              className="bg-[#793A8E] text-white py-2 px-3 sm:px-4 rounded-2xl flex items-center justify-center gap-2 w-full h-full"
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
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Section Tableau de bord avec animations améliorées */}
      <section
        ref={tableauRef}
        className="w-full pl-4 sm:px-6 py-8 border-t border-white/10 overflow-hidden"
      >
        <motion.div
          initial="hidden"
          animate={tableauInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-6 md:mb-8"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-1">
            Tableau de bord{" "}
            <span className="text-[#B157FF] font-semibold">intuitif</span>
          </h2>
          <p className="text-white/80 text-xs md:text-sm lg:text-base mb-5">
            Ne perdez plus de temps à chercher le prochain rendez-vous
          </p>
        </motion.div>
        <div className="grid grid-cols-2 w-full items-center max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate={tableauInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="flex-1"
          >
            <ul className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <motion.li
                  key={i}
                  variants={listItemVariant}
                  className="flex items-start gap-2"
                >
                  <div className="flex items-start gap-2">
                    <motion.div
                      whileHover={{ scale: 1.15, color: "#d1a2ff" }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <FiCheck className="text-[#B157FF] text-base flex-shrink-0 mt-0.5" />
                    </motion.div>
                    <p className="text-xs sm:text-sm md:text-base text-white/90">
                      {i === 0 &&
                        "Paramétrez facilement vos horaires d'ouverture et vos jours de fermetures"}
                      {i === 1 &&
                        "Naviguez facilement à travers les différentes pages en quelques cliques"}
                      {i === 2 &&
                        "Garder un œil sur les revenus générés grâce à votre profil public"}
                      {i === 3 &&
                        "Vérifiez ou annulez les rendez-vous de vos client en 1 clic grâce à l'envoi automatique d'email"}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={tableauInView ? "visible" : "hidden"}
            variants={imageAnimation}
            whileHover={{ scale: 1.03, rotate: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex-shrink-0 ml-2 sm:ml-4 md:ml-6 relative"
          >
            {/* Image optimisée pour tableau de bord */}
            <div className="relative w-[120px] h-[240px] sm:w-[160px] sm:h-[320px] md:w-[180px] md:h-[360px] lg:w-[220px] lg:h-[440px] overflow-hidden rounded-xl">
              <Image
                src="/images/mockup/main.png"
                alt="Tableau de bord Qrenoo"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
                quality={90}
                className="drop-shadow-lg"
                sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 220px"
                priority
              />

              {/* Reflet subtil sur l'écran */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-40" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Augmenter vos réservations avec animations améliorées */}
      <section
        ref={reservationRef}
        className="w-full px-4 sm:px-6 py-8 border-t border-white/10 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate={reservationInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-xl md:text-2xl font-medium mb-1">
              Augmenter vos{" "}
              <span className="text-[#B157FF] font-semibold">réservations</span>
            </h2>
            <p className="text-white/80 text-xs md:text-sm mb-5">
              Prenez des réservations 24/7 sans être dérangé
            </p>
          </motion.div>

          <div className="flex flex-row w-full items-start space-x-2 sm:space-x-4 md:space-x-6">
            <motion.div
              initial="hidden"
              animate={reservationInView ? "visible" : "hidden"}
              variants={imageAnimation}
              whileHover={{ scale: 1.03, rotate: -1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex-shrink-0"
            >
              {/* Image optimisée pour réservation */}
              <div className="relative w-[100px] h-[200px] sm:w-[140px] sm:h-[280px] md:w-[180px] md:h-[360px] lg:w-[220px] lg:h-[440px] overflow-hidden rounded-xl">
                <Image
                  src="/images/mockup/iMockup-droite.png"
                  alt="Réservations sur Qrenoo"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  quality={90}
                  sizes="(max-width: 640px) 100px, (max-width: 768px) 140px, (max-width: 1024px) 180px, 220px"
                  className="drop-shadow-lg"
                  priority
                />

                {/* Reflet subtil sur l'écran */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-40" />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={reservationInView ? "visible" : "hidden"}
              variants={staggerContainer}
              className="flex-1"
            >
              <ul className="space-y-3 md:space-y-4">
                {[0, 1, 2].map((i) => (
                  <motion.li
                    key={i}
                    variants={listItemVariant}
                    className="flex items-start gap-2"
                  >
                    <motion.div
                      whileHover={{ scale: 1.15, color: "#d1a2ff" }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <FiCheck className="text-[#B157FF] text-base flex-shrink-0 mt-0.5" />
                    </motion.div>
                    <p className="text-xs sm:text-sm md:text-base text-white/90">
                      {i === 0 &&
                        "Créez un profil en ligne disponible à toute heure, qui affiche automatiquement vos disponibilités"}
                      {i === 1 &&
                        "Personnalisez les informations, prestations et horaires disponibles pour vos client, depuis le tableau de bord"}
                      {i === 2 &&
                        "Soyez référencé dans notre moteur de recherche, pour augmenter votre nombre de réservations"}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <motion.div
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="w-full px-4 py-12 max-w-2xl mx-auto text-center"
      >
        <h2 className="text-xl mb-3">
          Découvrez comment{" "}
          <span className="text-[#B157FF]">d&apos;augmenter</span> votre{" "}
          <span className="text-[#B157FF]">profit</span> ?
        </h2>
        <p className="text-sm text-white/80 mb-6">
          Commencez maintenant pour optimisez votre temps et augmentez vos
          revenus.
        </p>

        <motion.a
          href="#"
          onClick={openPopup}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#B157FF] text-white py-3 px-8 rounded-full text-center font-medium mb-12 inline-block"
        >
          Essayer gratuitement !
        </motion.a>
      </motion.div>

      {/* Popups */}
      <DevPopup isOpen={isPopupOpen} onClose={closePopup} />
      <PlayStorePopup
        isOpen={isPlayStorePopupOpen}
        onClose={closePlayStorePopup}
      />
    </main>
  );
}
