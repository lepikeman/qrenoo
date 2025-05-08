"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function ResetPassword() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Vérifie si l'utilisateur a une session valide
  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setCheckingSession(false);
    }
    
    checkSession();
  }, [supabase]);

  async function handleResetPassword(e: Parameters<React.FormEventHandler<HTMLFormElement>>[0]) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({ 
        password 
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Redirection après 3 secondes
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la réinitialisation du mot de passe" + err);
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return <div className="min-h-screen flex items-center justify-center">Vérification de votre session...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">Session invalide ou expirée</h1>
        <p>Veuillez demander un nouveau lien de réinitialisation de mot de passe.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retour à la page de connexion
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Réinitialisation de mot de passe</h1>
        
        {success ? (
          <div className="text-green-600">
            <p>Votre mot de passe a été réinitialisé avec succès!</p>
            <p>Vous allez être redirigé vers la page de connexion...</p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirmez le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
                minLength={8}
              />
            </div>
            
            {error && <div className="text-red-500">{error}</div>}
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Traitement..." : "Réinitialiser le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
