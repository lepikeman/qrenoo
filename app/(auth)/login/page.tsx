"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient, Session } from "@supabase/auth-helpers-nextjs";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Vérifie la session au chargement
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingSession(false);
    });
  }, [supabase]);

  // Redirige seulement après une connexion réussie
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        const redirectTo = searchParams.get("redirectTo") || "/";
        router.replace(redirectTo);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router, searchParams, supabase]);

  if (checkingSession) {
    return <div>Chargement...</div>;
  }

  if (!checkingSession && session) {
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

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    console.log("SignIn data:", data);
    console.log("SignIn error:", error);
    if (error) setErrorMsg(error.message);
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
