"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import DevPopup, { useDevPopup } from "./components/DevPopup";
import PlayStorePopup, { usePlayStorePopup } from "./components/PlayStorePopup";
import StructuredData from "./components/StructuredData";

// Import des icônes
import { FiMessageSquare } from "react-icons/fi";
import { GoBell } from "react-icons/go";
import { CiCalendar } from "react-icons/ci";
import { IoIosLink } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";

export default function Home() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
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

  const cardAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 10,
      },
    },
  };

  // InView hooks
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [testimonialRef, testimonialInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [faqRef, faqInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const faq = [
    {
      question: "Qrenoo est-il adapté à mon activité ?",
      answer: (
        <>
          Oui. Qrenoo s&apos;adapte à tous les métiers :{" "}
          <span className="text-[#B157FF] font-bold">indépendants</span> ou
          entreprises. Notre solution est flexible et pensée pour s&apos;adapter
          à <span className="text-[#B157FF] font-bold">votre quotidien</span>.
        </>
      ),
    },
    {
      question: "Quels sont les tarifs de Qrenoo ?",
      answer: (
        <>
          Qrenoo propose des tarifs clairs et{" "}
          <span className="text-[#B157FF] font-bold">adaptés</span> à tous les
          besoins, avec une
          <span className="text-[#B157FF] font-bold">
            {" "}
            formule gratuite
          </span>{" "}
          pour commencer et des options payantes pour aller plus loin,
          <span className="text-[#B157FF] font-bold"> sans engagement</span>.
        </>
      ),
    },
    {
      question: "Pourquoi choisir Qrenoo plutôt qu'un autre ?",
      answer: (
        <>
          Qrenoo est <span className="text-[#B157FF] font-bold">simple</span>,
          rapide et conçu pour répondre à
          <span className="text-[#B157FF] font-bold"> vos besoins</span> sans
          complications. Vous profitez d&apos;un service fiable, intuitif et
          évolutif, avec un vrai accompagnement humain.
        </>
      ),
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { isPopupOpen, openPopup, closePopup } = useDevPopup();
  const {
    isPopupOpen: isPlayStorePopupOpen,
    openPopup: openPlayStorePopup,
    closePopup: closePlayStorePopup,
  } = usePlayStorePopup();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Qrenoo",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    operatingSystem: "Web",
    description:
      "Qrenoo est l'application tout-en-un pour les professionnels : prise de rendez-vous automatisée, rappels clients, et gestion optimisée de votre agenda.",
  };

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <StructuredData data={organizationSchema} />
      {/* Section Hero */}
      <section
        ref={heroRef}
        className="w-full max-w-7xl mx-auto md:pb-10 lg:pb-16 lg:mt-10 overflow-hidden"
      >
        <div className="flex flex-row mb-5 relative items-center">
          {/* Colonne texte - prend 70% de la largeur */}
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInRight}
            className="flex flex-col w-[70%] px-6 gap-5 mt-8 mb-6 md:mt-10 lg:mt-16 md:pr-8 md:pl-8 md:gap-7"
          >
            <h1 className="text-3xl font-medium md:font-bold md:text-4xl lg:text-5xl md:leading-tight">
              Laissez vos clients{" "}
              <strong className="text-[#8F0FFF]">réserver</strong> pendant que
              vous <strong className="text-[#8F0FFF]">travaillez</strong>.
            </h1>
            <p className="font-light text-white/75 md:text-lg lg:text-xl">
              <strong className="text-[#8F0FFF] font-bold">Qrenoo</strong> est
              l&apos;app tout-en-un pour les{" "}
              <strong className="text-[#8F0FFF] font-bold">pros</strong> : prise
              de RDV automatisée, rappels clients, et bien plus.
            </p>
          </motion.div>

          {/* Colonne image - prend 30% de la largeur avec image entière */}
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInLeft}
            className="relative w-[30%] h-full flex mt-[4vh] mr-[2vw] justify-center md:justify-center overflow-hidden"
          >
            <div className="w-[160px] h-[250px] md:w-[220px] md:h-[340px] lg:w-[280px] lg:h-[430px] relative">
              <Image
                src="/images/mockup/main.png"
                alt="Application mobile Qrenoo"
                fill
                sizes="(max-width: 768px) 160px, (max-width: 1024px) 220px, 280px"
                style={{
                  objectFit: "contain",
                  objectPosition: "center right",
                }}
                className="drop-shadow-2xl"
                priority
              />

              {/* Élément décoratif */}
              <motion.div
                className="absolute -z-10 rounded-full bg-gradient-to-tr from-[#B157FF]/20 to-transparent w-full h-full blur-3xl opacity-50"
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
            </div>
          </motion.div>
        </div>

        {/* Boutons */}
        <motion.div
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={buttonAnimation}
          className="flex items-center w-full px-6 gap-4 mb-4 md:w-3/4 lg:w-2/3 md:mx-auto"
        >
          <motion.a
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 25px -10px rgba(177, 87, 255, 0.45)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            href="#"
            onClick={openPopup}
            className="w-full bg-[#B157FF] text-white h-15 py-3.5 rounded-2xl text-center flex items-center justify-center md:text-lg"
          >
            Essayer gratuitement Qrenoo
          </motion.a>
          <motion.a
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 25px -10px rgba(121, 58, 142, 0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            href="#"
            onClick={openPlayStorePopup}
            className="w-full bg-[#793A8E] text-white h-15 rounded-2xl flex items-center justify-center gap-3 md:text-lg"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="md:w-6 md:h-6"
            >
              <path d="M5.26 2.33l13.05 7.5c.75.44.75 1.53 0 1.97l-13.05 7.5c-.83.48-1.87-.11-1.87-1.06V3.38c0-.95 1.04-1.54 1.87-1.06z" />
            </svg>
            <div className="flex flex-col items-center text-sm leading-tight md:text-base">
              <span className="font-normal">Télécharger sur</span>
              <span className="font-medium">Google Play Store</span>
            </div>
          </motion.a>
        </motion.div>

        {/* Texte utilisateurs */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-white/80 text-sm font-light italic mt-1 flex items-center gap-2 justify-center md:text-base md:mt-3"
        >
          Déjà 200 pros utilisent Qrenoo
        </motion.p>
      </section>

      {/* Section fonctionnalités */}
      <section
        ref={featuresRef}
        className="w-full max-w-7xl mx-auto px-4 md:py-16 lg:py-20 overflow-hidden"
      >
        <motion.div
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Fonctionnalités principales
          </h2>
          <p className="text-white/80 font-light text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Découvrez comment Qrenoo vous aide à automatiser votre gestion de
            rendez-vous et à vous libérer du temps.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="bg-[#221335] rounded-xl overflow-hidden shadow-lg md:rounded-2xl"
        >
          {/* Grille des fonctionnalités avec meilleur espacement */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 p-6 md:p-8"
          >
            {/* Carte 1 */}
            <motion.div
              variants={cardAnimation}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 30px -15px rgba(177, 87, 255, 0.3)",
              }}
              className="bg-[#170628] hover:bg-[#2c0f4a] transition-all duration-300 rounded-lg p-5 flex flex-col items-center text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="bg-[#B157FF]/20 rounded-full p-4 mb-4 inline-flex items-center justify-center"
              >
                <FiMessageSquare className="text-4xl md:text-5xl text-[#B157FF]" />
              </motion.div>
              <h3 className="text-lg md:text-xl font-medium mb-2">
                Disponibilité 24/7
              </h3>
              <p className="text-white/70 text-sm">
                Vos clients réservent à tout moment, même pendant vos heures de
                travail.
              </p>
            </motion.div>

            {/* Carte 2 */}
            <motion.div
              variants={cardAnimation}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 30px -15px rgba(177, 87, 255, 0.3)",
              }}
              className="bg-[#170628] hover:bg-[#2c0f4a] transition-all duration-300 rounded-lg p-5 flex flex-col items-center text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="bg-[#B157FF]/20 rounded-full p-4 mb-4 inline-flex items-center justify-center"
              >
                <GoBell className="text-4xl md:text-5xl text-[#B157FF]" />
              </motion.div>
              <h3 className="text-lg md:text-xl font-medium mb-2">
                Rappels automatiques
              </h3>
              <p className="text-white/70 text-sm">
                Fini les oublis avec nos rappels automatisés par SMS et email.
              </p>
            </motion.div>

            {/* Carte 3 */}
            <motion.div
              variants={cardAnimation}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 30px -15px rgba(177, 87, 255, 0.3)",
              }}
              className="bg-[#170628] hover:bg-[#2c0f4a] transition-all duration-300 rounded-lg p-5 flex flex-col items-center text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="bg-[#B157FF]/20 rounded-full p-4 mb-4 inline-flex items-center justify-center"
              >
                <CiCalendar className="text-4xl md:text-5xl text-[#B157FF]" />
              </motion.div>
              <h3 className="text-lg md:text-xl font-medium mb-2">
                Planning en temps réel
              </h3>
              <p className="text-white/70 text-sm">
                Gérez votre emploi du temps depuis n&apos;importe quel appareil.
              </p>
            </motion.div>

            {/* Carte 4 */}
            <motion.div
              variants={cardAnimation}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 30px -15px rgba(177, 87, 255, 0.3)",
              }}
              className="bg-[#170628] hover:bg-[#2c0f4a] transition-all duration-300 rounded-lg p-5 flex flex-col items-center text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="bg-[#B157FF]/20 rounded-full p-4 mb-4 inline-flex items-center justify-center"
              >
                <IoIosLink className="text-4xl md:text-5xl text-[#B157FF]" />
              </motion.div>
              <h3 className="text-lg md:text-xl font-medium mb-2">
                Lien de réservation unique
              </h3>
              <p className="text-white/70 text-sm">
                Partagez un lien personnalisé pour les réservations en 1 clic.
              </p>
            </motion.div>
          </motion.div>

          {/* Bannière statistique */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-[#B157FF]/10 p-4 md:p-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10"
          >
            <div className="flex items-center gap-2">
              <CiClock2 className="text-3xl md:text-4xl text-[#B157FF]" />
              <p className="font-medium">
                Économisez jusqu&apos;à 5h par semaine
              </p>
            </div>
            <div className="h-12 w-px bg-white/20 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#B157FF]">96%</span>
              <p className="font-medium">de clients satisfaits</p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA en bas de section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 md:mt-12 text-center"
        >
          <motion.a
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 25px -10px rgba(177, 87, 255, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            href="/functions"
            className="inline-block bg-[#B157FF] hover:bg-[#9a3ee2] text-white py-3.5 px-6 rounded-full text-center font-medium transition-all duration-300 md:text-lg"
          >
            Découvrir toutes les fonctionnalités
          </motion.a>
        </motion.div>
      </section>

      {/* Section témoignage */}
      <section
        ref={testimonialRef}
        className="w-full max-w-7xl mx-auto md:py-10 overflow-hidden"
      >
        <motion.div
          initial="hidden"
          animate={testimonialInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="border-l-2 p-4 m-6 gap-2 flex flex-col items-start justify-center bg-[#696969]/3 rounded-3xl md:mx-auto md:w-3/4 lg:w-2/3 md:p-8"
        >
          <p className="italic md:text-lg lg:text-xl">
            Avant Qrenoo, je perdais du temps chaque semaine à gérer mes
            rendez-vous à la main. Depuis que je l&apos;utilise, tout est
            automatisé : les clients prennent RDV seuls, reçoivent leurs rappels
            automatiquement, et j&apos;ai une vue claire de ma semaine.
            J&apos;ai gagné facilement 4h par semaine !<br />
          </p>
          <span className="md:text-lg md:mt-2">
            — Sonia L., esthéticienne indépendante à Lyon
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            testimonialInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col items-center justify-center w-full gap-4 md:my-8"
        >
          <motion.a
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 25px -10px rgba(177, 87, 255, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            href="/signup"
            className="bg-[#B157FF] h-15 py-3.5 rounded-2xl items-center justify-center flex w-3/4 md:w-1/2 lg:w-1/3 md:text-lg"
          >
            Créer mon profil public
          </motion.a>
        </motion.div>
      </section>

      {/* Section FAQ */}
      <section
        ref={faqRef}
        className="w-full max-w-7xl mx-auto md:py-10 overflow-hidden"
      >
        <motion.div
          initial="hidden"
          animate={faqInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="bg-[#696969]/3 w-full max-w-3xl mx-auto rounded-3xl mt-10 p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-center mb-6 md:text-2xl lg:text-3xl md:mb-10">
            Besoin de plus d&apos;information ?
          </h2>

          {faq.map((item, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="mb-4 border-b border-white/10 pb-2 md:mb-6 md:pb-4"
              >
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex justify-between items-center w-full text-left font-medium py-2 md:py-3"
                >
                  <h3 className="text-lg md:text-xl">{item.question}</h3>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl md:text-2xl"
                  >
                    {openIndex === index ? "−" : "+"}
                  </motion.span>
                </motion.button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="py-3 text-white/80 font-light md:text-lg md:py-4">
                    {item.answer}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={faqInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center w-full justify-center gap-2 my-6 md:my-10"
        >
          <CiClock2 className="text-3xl md:text-4xl" />
          <p className="font-light italic text-sm md:text-base lg:text-lg">
            Gagnez jusqu&apos;à 5h/semaine grâce à l&apos;automatisation
          </p>
        </motion.div>

        {/* Boutons finaux */}
        <motion.div
          initial="hidden"
          animate={faqInView ? "visible" : "hidden"}
          variants={buttonAnimation}
          className="flex items-center w-full px-6 gap-4 mb-4 md:w-3/4 lg:w-2/3 md:mx-auto md:mb-16"
        >
          <motion.a
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 25px -10px rgba(177, 87, 255, 0.45)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            href="#"
            onClick={openPopup}
            className="w-full bg-[#B157FF] text-white h-15 py-3.5 rounded-2xl text-center flex items-center justify-center md:text-lg"
          >
            Essayer gratuitement Qrenoo
          </motion.a>
          <motion.a
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 25px -10px rgba(121, 58, 142, 0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            href="#"
            onClick={openPlayStorePopup}
            className="w-full bg-[#793A8E] text-white h-15 rounded-2xl flex items-center justify-center gap-3 md:text-lg"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="md:w-6 md:h-6"
            >
              <path d="M5.26 2.33l13.05 7.5c.75.44.75 1.53 0 1.97l-13.05 7.5c-.83.48-1.87-.11-1.87-1.06V3.38c0-.95 1.04-1.54 1.87-1.06z" />
            </svg>
            <div className="flex flex-col items-center text-sm leading-tight md:text-base">
              <span className="font-normal">Télécharger sur</span>
              <span className="font-medium">Google Play Store</span>
            </div>
          </motion.a>
        </motion.div>
      </section>

      {/* Section CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-7xl mx-auto px-4 py-16 text-center"
      >
        <h2 className="text-xl font-medium mb-3">
          Découvrez comment <span className="text-[#B157FF]">augmenter</span>{" "}
          votre <span className="text-[#B157FF]">profit</span>
        </h2>
        <p className="text-sm text-white/80 mb-8 max-w-md mx-auto">
          Commencez maintenant pour optimiser votre temps et augmenter vos
          revenus grâce à notre solution complète.
        </p>

        <motion.a
          href="#"
          onClick={openPopup}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#B157FF] text-white py-3 px-8 rounded-full text-center font-medium inline-block"
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
