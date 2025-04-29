"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowConsent(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600">
            Nous utilisons des cookies pour améliorer votre expérience. En
            continuant, vous acceptez notre{" "}
            <Link
              href="/rgpd"
              className="text-[#29381a] underline hover:text-opacity-80"
            >
              politique de confidentialité
            </Link>
            .
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-[#29381a] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
