"use client";

import { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Utilisez un identifiant unique pour tracer les rendus
  // eslint-disable-next-line react-hooks/exhaustive-deps
  

  // Utilisez useCallback pour éviter une boucle infinie
  const checkAdmin = useCallback(async () => {
    // Évitez de multiples vérifications
    if (isAdmin !== null) return;
    
    if (!user) {
      console.log("[Layout] Pas d'utilisateur connecté, redirection vers login");
      router.push("/login?redirect=/admin");
      return;
    }

    console.log("[Layout] Vérification des droits admin:", user.id);

    try {
      // Utiliser la table profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("user_id", user.id)
        .single();

      console.log("[Layout] Résultat requête admin:", data, error);

      if (error) {
        console.warn("[Layout] Erreur lors de la vérification admin:", error);
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }

      if (data && data.is_admin === false) {
        console.log("[Layout] L'utilisateur n'est pas admin, redirection");
        router.push("/");
        return;
      }

      setIsAdmin(data?.is_admin === true);
      console.log("[Layout] Admin check completed:", data?.is_admin);
    } catch (e) {
      console.error("[Layout] Erreur inattendue:", e);
      setIsAdmin(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  }, [user, router, supabase]); // N'incluez PAS isAdmin ici

  useEffect(() => {
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, supabase]); // N'incluez PAS checkAdmin ici pour éviter des runs multiples

  // Afficher un écran de chargement pendant la vérification
  if (isCheckingAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#29381a]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-[#29381a]">
                  Administration
                </Link>
              </div>
              <div className="ml-10 flex items-center space-x-4">
                <Link 
                  href="/admin" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/subscriptions" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Abonnements
                </Link>
                <Link 
                  href="/admin/users" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Utilisateurs
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                Retour au site
              </Link>
              {!isAdmin && (
                <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
                  Non Admin
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
