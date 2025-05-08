import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

type PlanFeaturesHook = {
  hasAccess: (featureSlug: string) => boolean;
  checkAccess: (featureSlug: string, redirectTo?: string) => Promise<boolean>;
  isLoading: boolean;
  userPlanId: string | null;
  planName: string | null;
};

export function usePlanFeatures(): PlanFeaturesHook {
  const [featuresMap, setFeaturesMap] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [userPlanId, setUserPlanId] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    async function loadUserFeatures() {
      try {
        // Vérifier si l'utilisateur est connecté
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Charger le plan de l'utilisateur
        const { data: userData } = await supabase
          .from('users')
          .select('plan_id')
          .eq('id', user.id)
          .single();

        if (!userData?.plan_id) {
          setIsLoading(false);
          return;
        }

        setUserPlanId(userData.plan_id);

        // Charger les détails du plan
        const { data: planData } = await supabase
          .from('plans')
          .select('name')
          .eq('id', userData.plan_id)
          .single();

        if (planData) {
          setPlanName(planData.name);
        }

        // Charger les fonctionnalités disponibles pour ce plan
        const { data: features } = await supabase
          .from('plan_features')
          .select('feature_slug, enabled')
          .eq('plan_id', userData.plan_id);

        if (features && features.length > 0) {
          const map: Record<string, boolean> = {};
          features.forEach((feature) => {
            map[feature.feature_slug] = feature.enabled;
          });
          setFeaturesMap(map);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des fonctionnalités:', error);
        setIsLoading(false);
      }
    }

    loadUserFeatures();
  }, [supabase]);

  // Vérifier si l'utilisateur a accès à une fonctionnalité
  const hasAccess = (featureSlug: string): boolean => {
    // Si on est en train de charger, on suppose que non
    if (isLoading) return false;
    
    // Si la fonctionnalité n'est pas dans la map, on suppose que non
    return featuresMap[featureSlug] === true;
  };

  // Vérifier l'accès et rediriger si nécessaire
  const checkAccess = async (featureSlug: string, redirectTo = '/price'): Promise<boolean> => {
    // Si on est en train de charger, attendre un peu
    if (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return checkAccess(featureSlug, redirectTo);
    }
    
    const access = hasAccess(featureSlug);
    
    if (!access) {
      // Rediriger vers la page de tarification avec un paramètre pour mettre en évidence la fonctionnalité
      router.push(`${redirectTo}?feature=${featureSlug}`);
      return false;
    }
    
    return true;
  };

  return {
    hasAccess,
    checkAccess,
    isLoading,
    userPlanId,
    planName
  };
}