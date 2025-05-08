"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // États pour le modal de réinitialisation du mot de passe
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");

  // 1. Vérifie l'auth au chargement, une fois seulement
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getUser();
        setIsAuthenticated(!!data.user);
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, [supabase.auth]);

  // 2. Écoute les changements d'état (connexion/déconnexion)
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        const redirectTo = searchParams.get("redirectTo") || "/pro/dashboard";
        router.push(redirectTo);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [router, searchParams, supabase.auth]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setErrorMsg(error.message);
    } catch (err) {
      setErrorMsg(err + "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }
  
  // Fonction pour gérer la réinitialisation du mot de passe
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    setResetError("");
    setResetSuccess(false);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        // Changement important ici: configurer correctement redirectTo
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      
      if (error) {
        setResetError(error.message);
      } else {
        setResetSuccess(true);
      }
    } catch (err) {
      setResetError("Une erreur s'est produite lors de la réinitialisation." + err);
    } finally {
      setResetLoading(false);
    }
  }

  if (!authChecked) {
    return <div>Chargement...</div>;
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2>Vous êtes déjà connecté.</h2>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.reload();
          }}
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-2xl">Vous avez un compte ?</h1>
      <form
        onSubmit={signIn}
        className="flex flex-col gap-4 bg-white p-6 rounded shadow-md min-w-[320px]"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded text-black"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded text-black"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        {errorMsg && <div className="text-red-500 text-center">{errorMsg}</div>}
        
        {/* Lien mot de passe oublié */}
        <button
          type="button"
          onClick={() => {
            setResetEmail(email);
            setShowResetModal(true);
          }}
          className="text-blue-500 text-sm text-center mt-2 hover:underline"
        >
          Mot de passe oublié ?
        </button>
      </form>
      <p>Vous n&apos;avez pas encore de compte ?</p>
      <a href="/register" className="text-blue-500">
        S&apos;inscrire
      </a>
      
      {/* Modal de réinitialisation de mot de passe */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Réinitialiser votre mot de passe</h3>
            
            {resetSuccess ? (
              <div className="text-center">
                <div className="text-green-600 mb-4">
                  Un email de réinitialisation a été envoyé à {resetEmail}. Veuillez vérifier votre boîte de réception.
                </div>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Adresse email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Entrez votre adresse email"
                    className="w-full border px-3 py-2 rounded text-black"
                    required
                  />
                </div>
                
                {resetError && (
                  <div className="text-red-500 text-sm mb-4">{resetError}</div>
                )}
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
                    disabled={resetLoading}
                  >
                    {resetLoading ? "Envoi en cours..." : "Envoyer le lien"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
