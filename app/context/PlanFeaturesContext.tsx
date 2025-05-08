"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from './AuthContext';

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

const PlanFeaturesContext = createContext<PlanFeaturesContextType | undefined>(undefined);

export function PlanFeaturesProvider({ children }: { children: ReactNode }) {
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [accessMap, setAccessMap] = useState<Record<string, boolean>>({});
  const [loadingFeatures, setLoadingFeatures] = useState(true);

  // Charger les fonctionnalités disponibles
  useEffect(() => {
    async function loadFeatures() {
      setLoadingFeatures(true);
      
      try {
        // Récupérer toutes les fonctionnalités
        const { data: featuresData, error: featuresError } = await supabase
          .from('features')
          .select('*')
          .order('name');

        if (featuresError) throw featuresError;
        
        setFeatures(featuresData || []);
      } catch (error) {
        console.error('Erreur lors du chargement des fonctionnalités:', error);
      } finally {
        setLoadingFeatures(false);
      }
    }

    loadFeatures();
  }, [supabase]);

  // Détecter le plan de l'utilisateur actuel
  useEffect(() => {
    async function loadUserPlan() {
      setIsLoading(true);
      setAccessMap({});
      
      if (!user) {
        // Si l'utilisateur n'est pas connecté, on considère qu'il a le plan gratuit
        const { data: freePlan } = await supabase
          .from('plans')
          .select('*')
          .eq('price', 0)
          .single();
        
        setCurrentPlan(freePlan || { id: 'free', name: 'Plan Gratuit', features: [] });
        setIsLoading(false);
        return;
      }

      try {
        // Récupérer le profil de l'utilisateur avec son plan
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('plan_id, subscription_status')
          .eq('user_id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Si l'utilisateur n'a pas de plan ou si son abonnement n'est pas actif,
        // on lui attribue le plan gratuit par défaut
        const planId = profileData?.plan_id;
        const isSubscriptionActive = profileData?.subscription_status === 'active';
        
        if (!planId || !isSubscriptionActive) {
          const { data: freePlan } = await supabase
            .from('plans')
            .select('*')
            .eq('price', 0)
            .single();
          
          setCurrentPlan(freePlan || { id: 'free', name: 'Plan Gratuit', features: [] });
        } else {
          // Récupérer les détails du plan de l'utilisateur
          const { data: planData, error: planError } = await supabase
            .from('plans')
            .select('*, plan_features!inner(feature_id)')
            .eq('id', planId)
            .single();
            
          if (planError) throw planError;
          
          // Récupérer les slugs des fonctionnalités associées à ce plan
          const { data: planFeatures, error: featuresError } = await supabase
            .from('plan_features')
            .select('features(slug)')
            .eq('plan_id', planId);
            
          if (featuresError) throw featuresError;
          
          const featureSlugs = planFeatures?.map(pf => pf.features?.slug).filter(Boolean) || [];
          
          setCurrentPlan({
            id: planData.id,
            name: planData.name,
            features: featureSlugs
          });
          
          // Construire la map d'accès aux fonctionnalités
          const accessMapUpdate: Record<string, boolean> = {};
          featureSlugs.forEach(slug => {
            accessMapUpdate[slug] = true;
          });
          
          setAccessMap(accessMapUpdate);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du plan:', error);
        
        // En cas d'erreur, attribuer le plan gratuit par défaut
        const { data: freePlan } = await supabase
          .from('plans')
          .select('*')
          .eq('price', 0)
          .single();
        
        setCurrentPlan(freePlan || { id: 'free', name: 'Plan Gratuit', features: [] });
      } finally {
        setIsLoading(false);
      }
    }

    loadUserPlan();
  }, [user, supabase]);

  // Vérifier si l'utilisateur a accès à une fonctionnalité spécifique
  const hasAccess = (featureSlug: string): boolean => {
    // Si la fonctionnalité est dans la map d'accès, l'utilisateur y a accès
    return !!accessMap[featureSlug];
  };

  // Vérifier et mettre à jour l'accès à une fonctionnalité
  const checkAccess = async (featureSlug: string): Promise<boolean> => {
    // Si on connaît déjà l'accès, pas besoin de vérifier à nouveau
    if (accessMap[featureSlug] !== undefined) {
      return accessMap[featureSlug];
    }

    // Si l'utilisateur n'est pas connecté, pas d'accès
    if (!user) {
      setAccessMap(prev => ({ ...prev, [featureSlug]: false }));
      return false;
    }

    try {
      // Vérifier si la fonctionnalité est disponible dans le plan de l'utilisateur
      const { data, error } = await supabase
        .rpc('check_feature_access', { 
          p_user_id: user.id,
          p_feature_slug: featureSlug
        });

      if (error) throw error;

      const hasFeatureAccess = !!data;
      setAccessMap(prev => ({ ...prev, [featureSlug]: hasFeatureAccess }));
      return hasFeatureAccess;
    } catch (error) {
      console.error(`Erreur lors de la vérification de l'accès à ${featureSlug}:`, error);
      // Par défaut, refuser l'accès en cas d'erreur
      setAccessMap(prev => ({ ...prev, [featureSlug]: false }));
      return false;
    }
  };

  return (
    <PlanFeaturesContext.Provider
      value={{
        isLoading,
        hasAccess,
        checkAccess,
        features,
        currentPlan,
        loadingFeatures
      }}
    >
      {children}
    </PlanFeaturesContext.Provider>
  );
}

export const usePlanFeatures = () => {
  const context = useContext(PlanFeaturesContext);
  if (context === undefined) {
    throw new Error('usePlanFeatures doit être utilisé à l\'intérieur d\'un PlanFeaturesProvider');
  }
  return context;
};