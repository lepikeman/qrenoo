"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
  const router = useRouter();
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();

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
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur lors de la création de la session de paiement.");
      }
    } catch (e) {
      alert("Erreur lors de la redirection vers Stripe: " + e);
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
        Choisissez l’offre qui correspond à vos besoins.
      </p>
      <div className="flex flex-col gap-6 w-full max-w-4xl md:flex-row md:gap-8 md:justify-center">
        {plans.map((plan, idx) => {
          const planFeatures = features.filter(f => f.plans[plan.id]);
          const showAll = showAllFeatures[plan.id];
          const displayedFeatures = showAll ? planFeatures : planFeatures.slice(0, 5);
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
                  idx === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#405c26] hover:bg-[#29381a] transition"
                }`}
                disabled={idx === 0 || loadingCheckout === plan.id}
                onClick={idx === 0 ? undefined : () => handleSubscribe(plan.id)}
              >
                {loadingCheckout === plan.id
                  ? "Redirection..."
                  : idx === 0
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
            {features.map((feature, idx) => (
              <tr key={feature.id} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="py-2 px-2 border-b">{feature.label}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}