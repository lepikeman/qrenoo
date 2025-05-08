"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        // Récupère le hash des paramètres d'URL (contient le token)
        
        // Traite l'authentification
        const { error } = await supabase.auth.refreshSession();
        
        if (error) {
          setError(error.message);
          return;
        }

        // Redirige vers la page spécifiée dans le paramètre next
        const next = searchParams.get('next') || '/pro/dashboard';
        router.replace(next);
      } catch (err) {
        console.error("Erreur d'authentification:", err);
        setError("Une erreur s'est produite lors de l'authentification");
      } finally {
        setLoading(false);
      }
    }

    handleAuthCallback();
  }, [router, searchParams, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Authentification en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => router.push('/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retour à la page de connexion
        </button>
      </div>
    );
  }

  return null;
}