"use client";

import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (!error) {
      router.push("/pro/dashboard");
    } else {
      setErrorMsg(error.message);
    }
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
      <Link href="/register" className="text-blue-500">
        S&apos;inscrire
      </Link>
    </div>
  );
}
