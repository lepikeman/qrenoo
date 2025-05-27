"use client";

import { SetStateAction, useState } from "react";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { FiCheck, FiX, FiArrowRight } from "react-icons/fi";
import { IoFlashOutline, IoRocketOutline } from "react-icons/io5";

// Composant principal avec Suspense
export default function Price() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#B157FF] animate-spin"></div>
            <span className="text-[#B157FF] text-sm font-medium">
              Chargement des offres...
            </span>
          </div>
        </div>
      }
    >
      <PriceContent />
    </Suspense>
  );
}

// Composant de contenu séparé
function PriceContent() {
  // Données des plans
  const plans = [
    {
      id: "essential",
      name: "Essentielle",
      price: 19.99,
      isPopular: false,
      icon: <IoFlashOutline className="w-6 h-6" />,
      description: "Parfait pour démarrer et découvrir les fonctionnalités",
      features: [
        "Accès aux fonctions de base",
        "Rappel par email",
        "Profil public",
        "Support basique",
      ],
      buttonText: "S'abonner",
      buttonColor: "bg-[#B157FF]",
    },
    {
      id: "premium",
      name: "Premium",
      price: 49.99,
      isPopular: true,
      icon: <IoRocketOutline className="w-6 h-6" />,
      description: "Pour les professionnels exigeants",
      features: [
        "Toutes les fonctionnalités",
        "Rappel par email et sms",
        "Paiement en ligne",
        "Export PDF / Excel",
        "Mise à jour anticipées",
        "Support prioritaire",
      ],
      buttonText: "Essayer gratuitement",
      buttonColor: "bg-[#B157FF]",
    },
  ];

  // Tableau comparatif
  const featureComparison = [
    { name: "Accès aux fonction de base", essential: true, premium: true },
    { name: "Profil public", essential: true, premium: true },
    { name: "Paiement en ligne", essential: false, premium: true },
    { name: "Export PDF / Excel", essential: false, premium: true },
    { name: "Mise à jour anticipées", essential: false, premium: true },
  ];

  const supportComparison = [
    { name: "Support", essential: "Classique", premium: "Prioritaire" },
    { name: "Rappel automatique", essential: "Email", premium: "Email / SMS" },
  ];

  const baseFeatures = [
    { id: 1, name: "Système de rdv en ligne", icon: "📱" },
    { id: 2, name: "Profil public générer automatiquement", icon: "📄" },
    { id: 3, name: "Tableau de bord", icon: "📊" },
    {
      id: 4,
      name: "Email de rappels, d'annulation et de confirmation",
      icon: "📧",
    },
    { id: 5, name: "Formulaire de pré rdv", icon: "📝" },
    { id: 6, name: "QRcode générer en 1 clic", icon: "🔗" },
  ];

  // Animation variants
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
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [plansRef, plansInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [tableRef, tableInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // État pour le popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Fonction pour afficher le popup
  const handleShowDevPopup = (message: SetStateAction<string>) => {
    setPopupMessage(message);
    setShowPopup(true);
    // Fermer automatiquement après 3 secondes
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center w-full">
      {/* Hero section with gradient background */}
      <div className="w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#B157FF]/10 to-transparent pointer-events-none"></div>
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-12 w-full pt-12 px-4 relative z-10 max-w-3xl mx-auto"
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#B157FF]">
            Essayer{" "}
            <span className="text-[#B157FF] uppercase">GRATUITEMENT</span>
          </h1>
          <p className="text-base md:text-lg text-white/90">
            pendant 1 mois, sans engagement
          </p>
        </motion.div>
      </div>

      {/* Plans de prix avec shadow et hover effects */}
      <motion.div
        ref={plansRef}
        initial="hidden"
        animate={plansInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="w-full px-4 md:px-8 flex flex-col md:flex-row gap-6 md:gap-8 max-w-3xl mx-auto -mt-4"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            variants={cardAnimation}
            whileHover={{
              y: -5,
              boxShadow: plan.isPopular
                ? "0 20px 40px -12px rgba(177, 87, 255, 0.25)"
                : "0 20px 40px -12px rgba(255, 255, 255, 0.1)",
            }}
            className={`relative rounded-2xl p-6 flex-1 flex flex-col backdrop-blur-sm ${
              plan.isPopular
                ? "border-2 border-[#B157FF] bg-gradient-to-b from-[#1A0933] to-[#13072D]"
                : "border border-white/10 bg-[#1A0933]/80 hover:border-white/20"
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-5 -translate-y-1/2 bg-gradient-to-r from-[#B157FF] to-[#9e44e5] text-xs rounded-full px-3 py-1.5 font-medium shadow-lg">
                Le plus populaire
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <div
                className={`text-[#B157FF] p-2 rounded-full ${plan.isPopular ? "bg-[#B157FF]/20" : "bg-white/5"}`}
              >
                {plan.id === "essential" ? (
                  <IoFlashOutline className="w-5 h-5" />
                ) : (
                  <IoRocketOutline className="w-5 h-5" />
                )}
              </div>
              <h3 className="text-lg font-medium">{plan.name}</h3>
            </div>

            {plan.description && (
              <p className="text-xs text-white/60 mb-4">{plan.description}</p>
            )}

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold">{plan.price}€</span>
              <span className="text-white/70 text-sm">/ mois</span>
            </div>

            <div className="flex-1">
              {plan.id === "premium" && (
                <div className="text-[#B157FF] mb-3 text-sm font-medium">
                  Toutes les fonctionnalités
                </div>
              )}

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-white/80"
                  >
                    <div className="rounded-full bg-[#B157FF]/20 p-0.5 flex items-center justify-center mt-0.5">
                      <FiCheck className="text-[#B157FF] text-xs" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <motion.button
              onClick={() =>
                handleShowDevPopup(
                  "Cette fonctionnalité est en cours de développement"
                )
              }
              whileHover={{ scale: 1.02, backgroundColor: "#a340ff" }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 rounded-lg ${plan.buttonColor} text-white font-medium text-sm text-center flex items-center justify-center gap-2 group transition-colors duration-200`}
            >
              {plan.buttonText}
              <FiArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Tableau comparatif avec navigation par tabs */}
      <motion.div
        ref={tableRef}
        initial="hidden"
        animate={tableInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="w-full mt-16 overflow-x-auto px-4"
      >
        <div className="max-w-2xl mx-auto overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1A0933]/70">
                <th className="py-4 px-4 text-left font-medium text-white/90">
                  Fonctionnalité
                </th>
                <th className="py-4 px-4 text-center font-medium text-white/90">
                  Essentielle
                </th>
                <th className="py-4 px-4 text-center font-medium text-white/90">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody>
              {featureComparison.map((feature, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 pl-4 pr-4">{feature.name}</td>
                  <td className="py-4 px-6 text-center">
                    {feature.essential ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#B157FF]/20">
                        <FiCheck className="text-[#B157FF]" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/5">
                        <FiX className="text-white/30" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {feature.premium ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#B157FF]/20">
                        <FiCheck className="text-[#B157FF]" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/5">
                        <FiX className="text-white/30" />
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
              {supportComparison.map((feature, idx) => (
                <motion.tr
                  key={`support-${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: (featureComparison.length + idx) * 0.05,
                  }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 pl-4 pr-4">{feature.name}</td>
                  <td className="py-4 px-6 text-center text-xs">
                    <span className="px-3 py-1 bg-white/10 rounded-full">
                      {feature.essential}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-xs">
                    <span className="px-3 py-1 bg-[#B157FF]/20 text-[#B157FF] rounded-full">
                      {feature.premium}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Fonctionnalités de base avec icônes améliorées */}
      <motion.div
        ref={featuresRef}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="w-full px-4 mt-16 max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#B157FF]/30"></div>
          <h2 className="text-xl font-medium">
            Fonctionnalités de{" "}
            <span className="text-[#B157FF] uppercase font-bold">base</span>
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#B157FF]/30"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {baseFeatures.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-3 group"
            >
              <div className="text-3xl p-2 bg-[#B157FF]/10 rounded-xl group-hover:bg-[#B157FF]/20 transition-colors">
                {feature.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-white/90 mb-1">
                  {feature.name}
                </div>
                <div className="text-xs text-white/60">
                  {idx === 0 &&
                    "Réservations disponibles 24/7 pour vos clients"}
                  {idx === 1 &&
                    "Aucune configuration nécessaire, tout est automatique"}
                  {idx === 2 &&
                    "Interface intuitive pour gérer vos rendez-vous"}
                  {idx === 3 && "Communication automatisée avec vos clients"}
                  {idx === 4 &&
                    "Collectez les informations avant le rendez-vous"}
                  {idx === 5 &&
                    "Partagez facilement votre profil avec vos clients"}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="md:flex items-center justify-between gap-12 md:mt-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={
              featuresInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
            }
            transition={{ delay: 0.3, duration: 0.6 }}
            className="md:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#B157FF]/20 to-transparent rounded-3xl blur-2xl opacity-60"></div>
              <Image
                src="/images/mockup/main-crop.png"
                alt="Application mobile Qrenoo"
                width={280}
                height={560}
                className="mx-auto md:mx-0 object-contain relative z-10 drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={
              featuresInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
            }
            transition={{ delay: 0.5, duration: 0.6 }}
            className="md:w-1/2 mt-10 md:mt-0"
          >
            <h3 className="text-xl font-medium mb-4">
              Une application <span className="text-[#B157FF]">sur mesure</span>
            </h3>
            <p className="text-sm text-white/80 mb-6">
              Notre application mobile est conçue pour vous offrir une
              expérience utilisateur optimale et simplifier la gestion de vos
              rendez-vous au quotidien.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <FiCheck className="text-[#B157FF] mt-1" />
                <span>Interface intuitive et facile à prendre en main</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <FiCheck className="text-[#B157FF] mt-1" />
                <span>Notifications et rappels personnalisables</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <FiCheck className="text-[#B157FF] mt-1" />
                <span>Synchronisation avec votre calendrier existant</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA amélioré avec effets de survol */}
      <motion.div
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="w-full px-4 py-16 max-w-2xl mx-auto text-center"
      >
        <h2 className="text-xl font-medium mb-3">
          Découvrez comment <span className="text-[#B157FF]">augmenter</span>{" "}
          votre <span className="text-[#B157FF]">profit</span>
        </h2>
        <p className="text-sm text-white/80 mb-8 max-w-md mx-auto">
          Commencez maintenant pour optimiser votre temps et augmenter vos
          revenus grâce à notre solution complète.
        </p>

        <motion.div
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative inline-block mb-16"
          onClick={() =>
            handleShowDevPopup(
              "Cette fonctionnalité est en cours de développement"
            )
          }
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r from-[#B157FF] to-[#9537FF] rounded-full blur-md transition-opacity ${isButtonHovered ? "opacity-80" : "opacity-30"}`}
          ></div>
          <button className="relative bg-gradient-to-r from-[#B157FF] to-[#8B2AFF] text-white py-3.5 px-8 rounded-full text-center font-medium z-10">
            Essayer gratuitement !
          </button>
        </motion.div>
      </motion.div>

      {/* Popup d'information */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#1A0933] border border-[#B157FF] rounded-lg px-6 py-4 shadow-lg z-50 min-w-[280px] sm:min-w-[320px]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#B157FF]/20 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#B157FF]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm">{popupMessage}</p>
              <p className="text-xs text-white/60 mt-1">
                Essayez ultérieurement
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
