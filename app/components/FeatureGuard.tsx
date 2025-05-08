"use client";

import { ReactNode, useEffect, useState } from 'react';
import { usePlanFeatures } from '@/app/context/PlanFeaturesContext';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

type FeatureGuardProps = {
  featureSlug: string;
  children: ReactNode;
  fallback?: ReactNode;
  redirectOnBlock?: boolean;
  premiumMessage?: string;
  ctaText?: string;
};

export default function FeatureGuard({
  featureSlug,
  children,
  fallback,
  premiumMessage = "Cette fonctionnalité nécessite un abonnement supérieur.",
  ctaText = "Voir les abonnements"
}: FeatureGuardProps) {
  const { hasAccess, checkAccess, isLoading, currentPlan } = usePlanFeatures();
  const { user } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Vérifier l'accès uniquement si l'utilisateur est connecté
    if (user && !isLoading) {
      checkAccess(featureSlug).then(() => {
        setChecked(true);
      });
    } else if (!user) {
      // Si l'utilisateur n'est pas connecté, marquer comme vérifié
      // mais l'accès sera refusé plus tard
      setChecked(true);
    }
  }, [featureSlug, user, isLoading, checkAccess]);

  // État de chargement
  if (isLoading || !checked) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse flex space-x-4 items-center justify-center">
          <div className="rounded-full bg-gray-200 h-8 w-8"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  // L'utilisateur a accès à la fonctionnalité
  if (hasAccess(featureSlug)) {
    return <>{children}</>;
  }

  // Fallback personnalisé si fourni
  if (fallback) {
    return <>{fallback}</>;
  }

  // L'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="p-6 border border-blue-200 bg-blue-50 rounded-lg text-center">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="font-semibold text-blue-800 text-lg mb-2">
          Connexion requise
        </h3>
        <p className="text-sm text-blue-700 mb-4">
          Connectez-vous pour accéder à cette fonctionnalité.
        </p>
        <Link
          href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition inline-flex items-center"
        >
          <span>Se connecter</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    );
  }

  // Message pour les fonctionnalités premium (abonnement requis)
  return (
    <div className="p-6 border border-yellow-200 bg-yellow-50 rounded-lg text-center">
      <div className="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-12V3m0 0v2m0-2h2m-2 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="font-semibold text-yellow-800 text-lg mb-2">
        Fonctionnalité premium
      </h3>
      <p className="text-sm text-yellow-700 mb-4">
        {premiumMessage}
      </p>
      {currentPlan ? (
        <p className="text-xs text-yellow-600 mb-4">
          Votre abonnement actuel: <span className="font-semibold">{currentPlan.name}</span>
        </p>
      ) : (
        <p className="text-xs text-yellow-600 mb-4">
          Votre abonnement actuel: <span className="font-semibold">Plan standard</span>
        </p>
      )}
      <Link
        href={`/price?feature=${featureSlug}`}
        className="px-4 py-2 bg-[#405c26] text-white rounded-lg text-sm hover:bg-[#29381a] transition inline-flex items-center"
      >
        <span>{ctaText}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  );
}