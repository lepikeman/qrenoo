"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface PlayStorePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlayStorePopup({
  isOpen,
  onClose,
}: PlayStorePopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay flou */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Popup centré */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1A0933] border border-[#793A8E]/40 rounded-xl p-6 shadow-lg z-[101] max-w-sm w-[90%]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-[#793A8E]/20 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#793A8E]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Application mobile en cours de développement
              </h3>
              <p className="text-white/80 mb-5">
                Notre application mobile est actuellement en phase de
                développement et sera bientôt disponible sur Google Play Store.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-[#793A8E] hover:bg-[#8c43a9] text-white py-2.5 px-6 rounded-lg transition-colors"
              >
                Compris
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook personnalisé pour gérer l'état de la popup
export function usePlayStorePopup(autoCloseDelay = 4000) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsPopupOpen(true);

    // Auto-fermeture après le délai spécifié
    if (autoCloseDelay > 0) {
      setTimeout(() => {
        setIsPopupOpen(false);
      }, autoCloseDelay);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return { isPopupOpen, openPopup, closePopup };
}
