/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AdminPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Utilisez une référence pour éviter les vérifications multiples
  const adminChecked = useRef(false);

  // Utilisez useCallback pour éviter que cette fonction ne soit recréée à chaque rendu
  const checkAdmin = useCallback(async () => {
    // Évitez de vérifier à nouveau si déjà vérifié
    if (adminChecked.current) return;
    adminChecked.current = true;
    
    if (!user) {
      setLoading(false);
      return;
    }

    console.log("[Page admin] Vérification des droits admin pour:", user.id);

    // Debug info
    const debug: any = {
      userId: user.id,
      email: user.email
    };

    // Tentative d'accès à la table profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("user_id", user.id)
      .single();

    debug.profileQuery = { data: profileData, error: profileError };

    // Mettre à jour l'état en fonction du résultat
    const isAdminValue = profileData?.is_admin === true;
    setIsAdmin(isAdminValue);
    debug.isAdmin = isAdminValue;
    setDebugInfo(debug);
    setLoading(false);
  }, [user, supabase]); 

  useEffect(() => {
    if (!adminChecked.current) {
      checkAdmin();
    }
  }, [checkAdmin]);

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Administration</h1>
      
      {/* Informations de débogage */}
      <div className="mb-6 p-4 bg-gray-100 rounded text-sm">
        <h3 className="font-bold mb-2">Informations de débogage:</h3>
        <p>User ID: {user?.id || 'Non connecté'}</p>
        <p>Email: {user?.email || 'Non connecté'}</p>
        <p>Admin: {isAdmin ? 'Oui' : 'Non'}</p>
        <pre className="mt-2 p-2 bg-gray-200 rounded overflow-auto max-h-40">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
        
        <button 
          onClick={async () => {
            try {
              // Tentative de se définir comme admin
              const { error } = await supabase
                .from('profiles')
                .update({ is_admin: true })
                .eq('user_id', user?.id);
              
              if (error) {
                alert(`Erreur: ${error.message}`);
              } else {
                alert('Profil mis à jour - vous êtes maintenant admin! Rafraîchissez la page.');
                window.location.reload();
              }
            } catch (e: any) {
              alert(`Exception: ${e.message}`);
            }
          }}
          className="mt-4 px-3 py-2 bg-blue-500 text-white rounded text-sm"
        >
          Me définir comme admin (DEV)
        </button>

        <div className="flex space-x-2 mt-2">
          <button 
            onClick={async () => {
              try {
                // Afficher les politiques RLS pour profiles
                const { data, error } = await supabase.rpc('get_policies_debug', { 
                  table_name: 'profiles'
                });
                
                if (error) {
                  alert(`Erreur: ${error.message}`);
                } else {
                  alert(`Politiques pour profiles: ${JSON.stringify(data, null, 2)}`);
                }
              } catch (e: any) {
                alert(`Exception: ${e.message}`);
              }
            }}
            className="px-3 py-1 bg-purple-500 text-white rounded text-xs"
          >
            Vérifier politiques RLS
          </button>
          
          <button 
            onClick={() => {
              // Nettoyer le storage local et recharger
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            className="px-3 py-1 bg-orange-500 text-white rounded text-xs"
          >
            Nettoyer cache
          </button>
          
          <button 
            onClick={() => {
              // Forcer une nouvelle vérification d'authentification
              supabase.auth.refreshSession();
              setTimeout(() => window.location.reload(), 1000);
            }}
            className="px-3 py-1 bg-green-500 text-white rounded text-xs"
          >
            Rafraîchir session
          </button>
        </div>
      </div>
      
      {!isAdmin ? (
        <div className="p-6 bg-yellow-50 text-yellow-800 rounded-lg mb-6">
          Vous n&apos;avez pas les droits administrateur. Ce tableau de bord est limité.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/subscriptions" className="block">
            <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition">
              <h2 className="text-xl font-semibold mb-3">Abonnements</h2>
              <p className="text-gray-600">
                Gérer les abonnements utilisateurs et assigner des plans manuellement.
              </p>
            </div>
          </Link>
          
          <Link href="/admin/users" className="block">
            <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition">
              <h2 className="text-xl font-semibold mb-3">Utilisateurs</h2>
              <p className="text-gray-600">
                Gérer les utilisateurs et leurs permissions.
              </p>
            </div>
          </Link>
          
          <Link href="/admin/plans" className="block">
            <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition">
              <h2 className="text-xl font-semibold mb-3">Plans</h2>
              <p className="text-gray-600">
                Configurer les plans et leurs fonctionnalités.
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
