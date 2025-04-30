"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const form = event.currentTarget;
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement)
      .value;
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement)
      .value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const accessCode = (
      form.elements.namedItem("accessCode") as HTMLInputElement
    ).value;

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
      .gte("expires_at", new Date().toISOString()) // <-- CORRECTION ICI
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
      await supabase
        .from("access_codes")
        .update({ used: true })
        .eq("id", codeData.id);
    }
    setLoading(false);
  }

  return (
    <div className="items-center justify-center flex flex-col min-h-screen gap-4">
      <h1 className="text-2xl">Nous rejoindre</h1>
      <div className="flex flex-col bg-white p-6 rounded shadow-md min-w-[320px]">
        <form
          className="flex flex-col gap-4 items-center"
          onSubmit={handleRegister}
        >
          <input
            name="lastName"
            type="text"
            placeholder="Nom"
            className="border px-3 py-2 rounded text-black"
            required
          />
          <input
            name="firstName"
            type="text"
            placeholder="Prénom"
            className="border px-3 py-2 rounded text-black"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border px-3 py-2 rounded text-black"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            className="border px-3 py-2 rounded text-black"
            required
          />
          <input
            name="accessCode"
            type="text"
            placeholder="Code d'accès"
            className="border px-3 py-2 rounded text-black"
            required
          />
          <button
            className="text-white bg-blue-500 px-4 py-2 rounded cursor-pointer disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
        </form>
      </div>
      <p>Vous avez déjà un compte ?</p>
      <Link href="/login" className="text-blue-500">
        Se connecter
      </Link>
    </div>
  );
}
