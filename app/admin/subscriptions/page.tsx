"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function AdminSubscriptions() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [subscriptionId, setSubscriptionId] = useState<string>("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Référence pour éviter les chargements multiples
  const dataLoaded = useRef(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkAdmin() {
      if (!user || dataLoaded.current) {
        setLoading(false);
        return;
      }

      console.log("Vérification admin pour:", user.id);

      try {
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          console.error("Erreur lors de la vérification admin:", profileError);
          setError(`Erreur d'accès: ${profileError.message}`);
          setLoading(false);
          return;
        }

        const isUserAdmin = data?.is_admin === true;
        setIsAdmin(isUserAdmin);

        if (isUserAdmin) {
          dataLoaded.current = true;
          await loadData();
        }
      } catch (err: any) {
        console.error("Erreur:", err);
        setError(`Une erreur s'est produite: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [user, supabase]);

  async function loadData() {
    try {
      // Vérifier la structure de la table profiles
      console.log("Chargement des données utilisateurs et abonnements...");
      
      // Utilisez notre nouvelle API serverless pour obtenir les utilisateurs avec leurs abonnements
      const res = await fetch('/api/admin/users');
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erreur lors du chargement des utilisateurs');
      }
      
      const { users } = await res.json();
      
      // Formater les données pour l'affichage
      setUsers(
        users?.map((user: any) => ({
          id: user.user_id,
          email: user.email || `ID: ${user.user_id.substring(0, 8)}`,
          nom: `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email || `Utilisateur ${user.user_id.substring(0, 8)}`
        })) || []
      );
      
      // Charger les abonnements existants
      const subscriptionsData = users?.filter((user: any) => user.subscription_id) || [];
      setSubscriptions(subscriptionsData.map((user: any) => ({
        user_id: user.user_id,
        user_name: `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email,
        subscription_id: user.subscription_id,
        plan_name: user.plan_name,
        status: user.subscription_status
      })));

      // 3. Charger les plans disponibles
      const { data: plansData, error: plansError } = await supabase
        .from("plans")
        .select("id, name")
        .order("name");

      if (plansError) {
        console.error("Erreur lors du chargement des plans:", plansError);
        
        // Plan B : créer des données fictives si la table n'existe pas encore
        setPlans([
          { id: "plan-1", name: "Plan Gratuit" },
          { id: "plan-2", name: "Plan Standard" },
          { id: "plan-3", name: "Plan Premium" }
        ]);
      } else {
        setPlans(plansData || []);
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement des données:", err);
      setError(`Erreur de chargement: ${err.message}`);
    }
  }

  async function handleManualAssignment(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!selectedUser || !selectedPlan || !subscriptionId) {
      setMessage({ type: "error", text: "Tous les champs sont requis" });
      return;
    }

    try {
      setSubmitting(true);
      console.log("Envoi de la requête avec:", { selectedUser, selectedPlan, subscriptionId });
      
      // Appeler l'API serverless
      const response = await fetch('/api/admin/assign-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser,
          planId: selectedPlan,
          subscriptionId: subscriptionId
        }),
      });

      // Lire la réponse sous forme de texte d'abord pour le déboguer
      const responseText = await response.text();
      console.log("Réponse brute:", responseText);

      // Essayer de parser la réponse comme du JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Erreur lors du parsing de la réponse:", parseError);
        throw new Error(`Erreur de format: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(result.error || 'Une erreur est survenue');
      }

      // Afficher le message de succès
      setMessage({
        type: "success",
        text: result.message || `L'abonnement a été assigné avec succès`
      });

      // Réinitialiser le formulaire
      setSelectedUser("");
      setSelectedPlan("");
      setSubscriptionId("");
      
      // Rafraîchir les données
      await loadData();
      
    } catch (error: any) {
      console.error("Erreur lors de l'assignation:", error);
      setMessage({ 
        type: "error", 
        text: `Erreur: ${error.message}` 
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <Link href="/admin" className="text-blue-600 hover:underline">
          Retour à l'administration
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>Accès refusé. Cette page est réservée aux administrateurs.</p>
        </div>
        <Link href="/admin" className="text-blue-600 hover:underline">
          Retour à l'administration
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Administration des abonnements</h1>

      {message && (
        <div
          className={`p-4 mb-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-yellow-800">Note de développement</h3>
        <p className="text-yellow-800">
          Cette interface est en mode simplifié car l'accès à l'API admin
          de Supabase n'est pas possible depuis le navigateur. Pour une
          version complète, créez une API serverless ou ajoutez une colonne
          email dans votre table profiles.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">
          Assigner un abonnement manuellement
        </h2>

        <form onSubmit={handleManualAssignment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Utilisateur
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Sélectionner un utilisateur</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nom} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Plan
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Sélectionner un plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID d'abonnement Stripe
            </label>
            <input
              type="text"
              value={subscriptionId}
              onChange={(e) => setSubscriptionId(e.target.value)}
              placeholder="sub_1234567890"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              L'ID commencera par "sub_" et se trouve dans votre dashboard
              Stripe
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#29381a] hover:bg-[#405c26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#29381a] disabled:opacity-50"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Traitement en cours...
              </>
            ) : (
              "Assigner l'abonnement"
            )}
          </button>
        </form>
      </div>

      {subscriptions.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <h2 className="text-xl font-semibold p-6 border-b">
            Abonnements existants
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Abonnement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <tr key={subscription.subscription_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subscription.user_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.plan_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.subscription_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => {
                          // Fonction pour gérer le clic sur "Voir dans Stripe"
                          window.open(`https://dashboard.stripe.com/subscriptions/${subscription.subscription_id}`, '_blank');
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Voir dans Stripe
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
          Aucun abonnement trouvé
        </div>
      )}
    </div>
  );
}
