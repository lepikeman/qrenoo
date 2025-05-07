"use client";

import { AuthProvider } from "./context/AuthContext";
import type { User } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/auth-helpers-nextjs";

export default function ClientProviders({ 
  children, 
  initialUser,
  initialSession
}: { 
  children: React.ReactNode;
  initialUser: User | null;
  initialSession: Session | null;
}) {
  return (
    <AuthProvider initialUser={initialUser} initialSession={initialSession}>
      {children}
    </AuthProvider>
  );
}
