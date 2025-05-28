"use client";
import { FiMail, FiSend } from "react-icons/fi";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import StructuredData from "../components/StructuredData";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

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

  // InView hooks
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [contactRef, contactInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur d'envoi");
      setNotificationMessage("Message envoyé avec succès !");
      setNotificationType("success");
      setShowNotification(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      setNotificationMessage("Une erreur est survenue. Veuillez réessayer.");
      setNotificationType("error");
      setShowNotification(true);

      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Qrenoo",
    url: "https://www.qrenoo.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "contact@qrenoo.com",
      availableLanguage: ["French"],
    },
  };

  return (
    <main className="bg-black text-white min-h-screen p-6 md:p-8">
      <StructuredData data={contactSchema} />
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Gradient background effect */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#B157FF]/10 to-transparent -z-10"></div>

        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#B157FF]">
            Nous contacter
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Une question, un problème ou une suggestion ? N&apos;hésitez pas à
            nous contacter.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Section Coordonnées */}
          <motion.div
            ref={contactRef}
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-[#1A0933] p-6 rounded-xl border border-white/10 backdrop-blur-sm"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="p-2 bg-[#B157FF]/20 rounded-full">
                  <FiMail className="w-5 h-5 text-[#B157FF]" />
                </span>
                Coordonnées
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-white/80">Email</p>
                    <a
                      href="mailto:contact@qrenoo.com"
                      className="text-[#B157FF] hover:text-[#d1a2ff] transition-colors"
                    >
                      contact@qrenoo.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-[#1A0933] p-6 rounded-xl border border-white/10 backdrop-blur-sm"
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                Réseaux sociaux
              </h2>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/qrenoo"
                  className="text-white hover:text-[#B157FF] transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/qrenoo_app/"
                  className="text-white hover:text-[#B157FF] transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/qrenoo/"
                  className="text-white hover:text-[#B157FF] transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Formulaire de contact */}
          <motion.div
            ref={formRef}
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="bg-[#1A0933] p-6 rounded-xl border border-white/10 backdrop-blur-sm"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Contactez-nous, ou rapportez-nous un bug
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#B157FF] focus:border-transparent transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#B157FF] focus:border-transparent transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#B157FF] focus:border-transparent transition-colors"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#B157FF] focus:border-transparent transition-colors"
                  placeholder="Votre message..."
                ></textarea>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02, backgroundColor: "#a340ff" }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-[#B157FF] text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isLoading
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:bg-[#9e44e5]"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le message <FiSend className="ml-1" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Notification toast */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 ${
            notificationType === "success"
              ? "bg-green-800/90 border border-green-500/30"
              : "bg-red-800/90 border border-red-500/30"
          }`}
        >
          <div
            className={`p-2 rounded-full ${
              notificationType === "success"
                ? "bg-green-500/20"
                : "bg-red-500/20"
            }`}
          >
            {notificationType === "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <span className="text-white">{notificationMessage}</span>
        </motion.div>
      )}
    </main>
  );
}
