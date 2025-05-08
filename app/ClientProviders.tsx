"use client";

import { AuthProvider } from "./context/AuthContext";
import type { User } from "@supabase/auth-helpers-nextjs";

import { PlanFeaturesProvider } from "./context/PlanFeaturesContext";

// import type { Session } from "@supabase/auth-helpers-nextjs";

export default function ClientProviders({ 
  children, 
  initialUser,
  // initialSession
}: { 
  children: React.ReactNode;
  initialUser: User | null;
  // initialSession: Session | null;
}) {
  return (
    <PlanFeaturesProvider>

    <AuthProvider initialUser={initialUser}>
      {children}
    </AuthProvider>
    </PlanFeaturesProvider>

  );
}
