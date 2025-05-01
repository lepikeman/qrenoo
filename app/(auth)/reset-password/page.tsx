"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Cherche access_token et refresh_token dans l'URL
    const params = new URLSearchParams(window.location.search);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    if (access_token && refresh_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token,
      });
    }
  }, []);

  const validatePassword = (pwd: string) => {
    // Exemple de règle pro : min 8 caractères, 1 maj, 1 min, 1 chiffre
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirm) {
      setError("Veuillez remplir les deux champs.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre."
      );
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(
        error.message === "New password should be different from the old password."
          ? "Le nouveau mot de passe doit être différent de l'ancien."
          : error.message
      );
    } else {
      setSuccess("Votre mot de passe a été modifié avec succès !");
      // Déconnexion puis redirection
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push("/");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Réinitialisation du mot de passe
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Choisissez un nouveau mot de passe sécurisé pour votre compte.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Nouveau mot de passe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              className="border border-gray-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Confirmez le mot de passe"
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
            type="submit"
            className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Changement en cours..." : "Valider"}
          </button>
        </form>
        <div className="text-xs text-gray-400 mt-6 text-center">
          Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
        </div>
      </div>
    </div>
  );
}
