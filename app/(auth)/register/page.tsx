"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [accessCodeValue, setAccessCodeValue] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) setAccessCodeValue(code);
  }, []);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const form = event.currentTarget;
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement).value;
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const accessCode = (form.elements.namedItem("accessCode") as HTMLInputElement).value;

    // Vérifier la limite de testeurs
    const testersResp = await fetch("/api/testers-count");
    const { count } = await testersResp.json();
    if (count >= 10) {
      setError("Le nombre maximum de testeurs a été atteint.");
      setLoading(false);
      return;
    }

    // Vérifier le code d'accès
    const { data: codeData, error: codeError } = await supabase
      .from("access_codes")
      .select("*")
      .eq("email", email)
      .eq("code", accessCode)
      .eq("used", false)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (codeError || !codeData) {
      setError("Code d'accès invalide ou expiré.");
      setLoading(false);
      return;
    }

    // Vérifier si l'email existe déjà
    const checkEmailResp = await fetch("/api/check-email-exists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const { exists } = await checkEmailResp.json();
    if (exists) {
      setError("Cet email est déjà utilisé.");
      setLoading(false);
      return;
    }

    // Créer le compte
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { lastName, firstName },
        emailRedirectTo: "https://qrenoo.com/login",
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Inscription réussie, vérifiez vos emails.");
      form.reset();
      // Marquer le code comme utilisé
      await supabase.from("access_codes").update({ used: true }).eq("id", codeData.id);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Créer un compte
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Rejoignez Qrenoo en remplissant le formulaire ci-dessous.
        </p>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              name="lastName"
              id="lastName"
              type="text"
              placeholder="Nom"
              className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              name="firstName"
              id="firstName"
              type="text"
              placeholder="Prénom"
              className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              id="email"
              type="email"
              placeholder="Email"
              className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              name="password"
              id="password"
              type="password"
              placeholder="Mot de passe"
              className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
              Code d&#39;accès
            </label>
            <input
              name="accessCode"
              id="accessCode"
              type="text"
              placeholder="Code d'accès"
              className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
              value={accessCodeValue}
              onChange={e => setAccessCodeValue(e.target.value)}
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm">
              {success}
            </div>
          )}
          <button
            className="w-full py-2 px-4 rounded-lg font-semibold text-white transition bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
        <div className="text-xs text-gray-400 mt-6 text-center">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
