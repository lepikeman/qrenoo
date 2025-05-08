"use client";

import { createContext, useContext, ReactNode } from 'react';

// Structure pour représenter un plan
type Plan = {
  id: string;
  name: string;
  features: string[];
};

// Structure pour représenter une fonctionnalité
type Feature = {
  slug: string;
  name: string;
  description: string;
  available_plans: string[];
};

type PlanFeaturesContextType = {
  isLoading: boolean;
  hasAccess: (featureSlug: string) => boolean;
  checkAccess: (featureSlug: string) => Promise<boolean>;
  features: Feature[];
  currentPlan: Plan | null;
  loadingFeatures: boolean;
};

// Créer le contexte
const PlanFeaturesContext = createContext<PlanFeaturesContextType | undefined>(undefined);

// Version simplifiée du Provider pour développement
export function PlanFeaturesProvider({ children }: { children: ReactNode }) {
  // Plan fictif pour le développement
  const devPlan: Plan = {
    id: 'unlimited_dev',
    name: 'Plan de développement illimité',
    features: ['*'] // Toutes les fonctionnalités
  };
  
  // Fonctions simplifiées qui retournent toujours "true" pour l'accès
  const hasAccess = () => true;
  const checkAccess = async () => true;
  
  // Valeur du contexte avec accès illimité
  const value: PlanFeaturesContextType = {
    isLoading: false,
    hasAccess,
    checkAccess,
    features: [],  // Pas besoin de charger les fonctionnalités
    currentPlan: devPlan,
    loadingFeatures: false
  };

  return (
    <PlanFeaturesContext.Provider value={value}>
      {children}
    </PlanFeaturesContext.Provider>
  );
}

// Hook pour utiliser le contexte
export const usePlanFeatures = () => {
  const context = useContext(PlanFeaturesContext);
  if (context === undefined) {
    throw new Error('usePlanFeatures doit être utilisé à l\'intérieur d\'un PlanFeaturesProvider');
  }
  return context;
};