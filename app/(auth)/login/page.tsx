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
            window.location.reload(); // Force le reload pour nettoyer l'état
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
      </form>
      <p>Vous n&apos;avez pas encore de compte ?</p>
      <a href="/register" className="text-blue-500">
        S&apos;inscrire
      </a>
    </div>
  );
}
