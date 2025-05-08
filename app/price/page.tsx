"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast"; // Assurez-vous d'installer react-hot-toast

type Plan = {
  id: string;
  name: string;
  price: number;
  order: number;
};

type PlanFeature = {
  plan_id: string;
  enabled: boolean;
};

type Feature = {
  id: string;
  label: string;
  plans: { [planId: string]: boolean };
  order: number;
};

export default function Price() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllFeatures, setShowAllFeatures] = useState<{ [planId: string]: boolean }>({});
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);
  const [currentUserPlan, setCurrentUserPlan] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const highlightFeatureRef = useRef<HTMLDivElement | null>(null);
  const featureSlug = searchParams.get("feature");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch plans
      const { data: plansData } = await supabase
        .from("plans")
        .select("*")
        .order("order", { ascending: true });

      // Fetch features
      const { data: featuresData } = await supabase
        .from("features")
        .select("id,label,order,plan_features(plan_id,enabled)")
        .order("order", { ascending: true });

      // Récupérer le plan actuel de l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("plan_id")
          .eq("id", user.id)
          .single();
        
        if (userData?.plan_id) {
          setCurrentUserPlan(userData.plan_id);
        }
      }

      const featuresWithPlans: Feature[] = (featuresData || []).map((f: { id: string; label: string; order: number; plan_features: PlanFeature[] }) => {
        const plansObj: { [planId: string]: boolean } = {};
        (f.plan_features as PlanFeature[] || []).forEach((pf: PlanFeature) => {
          plansObj[pf.plan_id] = pf.enabled;
        });
        return {
          id: f.id as string,
          label: f.label as string,
          plans: plansObj,
          order: f.order as number,
        };
      });

      setPlans(plansData || []);
      setFeatures(featuresWithPlans);
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  useEffect(() => {
    // Vérifier les paramètres d'URL pour les messages de statut
    if (searchParams.get("cancelled") === "true") {
      toast.error("Paiement annulé. Vous n'avez pas été débité.");
    }
    
    const subscribePlanId = searchParams.get("subscribe");
    if (!subscribePlanId) return;

    // Vérifie si l'utilisateur est connecté avant de lancer handleSubscribe
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        handleSubscribe(subscribePlanId);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    // Si un feature_slug est présent dans les paramètres d'URL
    if (featureSlug && features.length > 0) {
      // Trouver la fonctionnalité correspondante
      const feature = features.find(f => f.label.toLowerCase().includes(featureSlug.replace('_', ' ')));
      
      if (feature) {
        // Mettre en évidence la fonctionnalité
        setTimeout(() => {
          const featureRow = document.getElementById(`feature-${feature.id}`);
          if (featureRow) {
            featureRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            featureRow.classList.add('bg-yellow-100');
            setTimeout(() => {
              featureRow.classList.remove('bg-yellow-100');
              featureRow.classList.add('bg-yellow-50');
            }, 1000);
          }
        }, 500);
        
        // Afficher une notification
        toast.custom((t) => (
          <div className={`bg-yellow-50 border-l-4 border-yellow-500 p-4 shadow-md rounded ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
            <div className="flex items-center">
              <div className="text-yellow-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Cette fonctionnalité nécessite un abonnement. Consultez nos offres ci-dessous.
                </p>
              </div>
            </div>
          </div>
        ), { duration: 5000 });
      }
    }
  }, [searchParams, features, featureSlug]);

  async function handleSubscribe(planId: string) {
    setLoadingCheckout(planId);

    // Vérifie si l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Redirige vers /login avec redirectTo vers cette page + planId
      router.push(`/login?redirectTo=/price?subscribe=${planId}`);
      setLoadingCheckout(null);
      return;
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur lors de la création de la session de paiement");
      }
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Erreur lors de la création de la session de paiement.");
      }
    } catch (e) {
      toast.error(`Erreur: ${e instanceof Error ? e.message : "Problème de connexion"}`);
    } finally {
      setLoadingCheckout(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-[#29381a]">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-[#29381a] mb-2 tracking-tight">
        Tarifs
      </h1>
      <p className="text-base text-[#29381a] mb-6">
        Choisissez l&apos;offre qui correspond à vos besoins.
      </p>
      <div className="flex flex-col gap-6 w-full max-w-4xl md:flex-row md:gap-8 md:justify-center">
        {plans.map((plan, idx) => {
          const planFeatures = features.filter(f => f.plans[plan.id]);
          const showAll = showAllFeatures[plan.id];
          const displayedFeatures = showAll ? planFeatures : planFeatures.slice(0, 5);
          const isCurrentPlan = currentUserPlan === plan.id;
          
          return (
            <div
              key={plan.id}
              className={`flex-1 bg-white rounded-xl shadow-lg p-6 border ${
                idx === 1
                  ? "border-2 border-[#405c26] scale-100 md:scale-105"
                  : "border-gray-200"
              } flex flex-col items-center`}
            >
              <h2 className="text-lg md:text-xl font-semibold text-[#29381a] mb-2">
                {plan.name}
              </h2>
              <div className="text-2xl md:text-3xl font-bold text-[#405c26] mb-4">
                {plan.price === 0
                  ? "0€"
                  : `${plan.price.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}€`}
                {plan.price > 0 && <span className="text-base font-normal">/mois</span>}
              </div>
              <ul className="text-gray-700 mb-6 space-y-2 text-sm">
                {displayedFeatures.map(f => (
                  <li key={f.id}>✅ {f.label}</li>
                ))}
              </ul>
              {planFeatures.length > 5 && (
                <button
                  className="mb-4 text-xs text-[#405c26] hover:underline"
                  onClick={() =>
                    setShowAllFeatures(s => ({
                      ...s,
                      [plan.id]: !s[plan.id],
                    }))
                  }
                >
                  {showAll ? "Voir moins -" : "Voir plus +"}
                </button>
              )}
              <button
                className={`w-full py-2 px-4 rounded-lg font-semibold text-white ${
                  isCurrentPlan
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#405c26] hover:bg-[#29381a] transition"
                }`}
                disabled={isCurrentPlan || loadingCheckout === plan.id}
                onClick={() => handleSubscribe(plan.id)}
              >
                {loadingCheckout === plan.id
                  ? "Redirection..."
                  : isCurrentPlan
                  ? "Offre actuelle"
                  : `Choisir ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Tableau comparatif */}
      <div className="w-full max-w-4xl mt-10 overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white rounded-xl shadow text-xs md:text-sm">
          <thead>
            <tr className="bg-gray-100 text-[#29381a]">
              <th className="py-3 px-2 border-b text-left w-1/3">Fonctionnalité</th>
              {plans.map(plan => (
                <th
                  key={plan.id}
                  className="py-3 px-2 border-b font-semibold text-center w-1/6"
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[#29381a]">
            {features.map((feature, idx) => {
              const isHighlighted = featureSlug && feature.label.toLowerCase().includes(featureSlug.replace('_', ' '));
              
              return (
                <tr 
                  key={feature.id} 
                  id={`feature-${feature.id}`}
                  className={`${isHighlighted ? 'bg-yellow-100 transition-colors duration-700' : 
                    idx % 2 === 0 ? 'bg-gray-50' : ''}`}
                  ref={isHighlighted ? highlightFeatureRef : undefined}
                >
                  <td className="py-2 px-2 border-b">
                    {feature.label}
                    {isHighlighted && (
                      <span className="ml-2 inline-block px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                        Fonctionnalité demandée
                      </span>
                    )}
                  </td>
                  {plans.map(plan => (
                    <td
                      key={plan.id}
                      className={`py-2 px-2 border-b text-center ${
                        feature.plans[plan.id]
                          ? "text-green-600 font-bold"
                          : "text-gray-300 font-bold"
                      }`}
                    >
                      {feature.plans[plan.id] ? "✔️" : "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Informations de souscription */}
      <div className="w-full max-w-4xl mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-[#29381a] mb-4">Informations sur les abonnements</h2>
        <ul className="space-y-2 text-sm text-[#405c26]">
          <li>✓ Paiement sécurisé par carte bancaire via Stripe</li>
          <li>✓ Facturation mensuelle sans engagement</li>
          <li>✓ Changement ou annulation de l&apos;abonnement à tout moment</li>
          <li>✓ Accès immédiat aux fonctionnalités premium après souscription</li>
        </ul>
      </div>
    </div>
  );
}