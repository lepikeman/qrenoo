"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DevPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DevPopup({ isOpen, onClose }: DevPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay flou qui couvre tout l'écran */}
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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1A0933] border border-[#B157FF]/40 rounded-xl p-6 shadow-lg z-[101] max-w-sm w-[90%]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-[#B157FF]/20 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#B157FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                En développement
              </h3>
              <p className="text-white/80 mb-5">
                Cette fonctionnalité est actuellement en cours de développement
                et sera disponible prochainement.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-[#B157FF] hover:bg-[#a340ff] text-white py-2.5 px-6 rounded-lg transition-colors"
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
export function useDevPopup(autoCloseDelay = 4000) {
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
