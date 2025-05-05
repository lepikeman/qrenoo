"use client";

import { AuthProvider } from "./context/AuthContext";
import type { Session } from "@supabase/auth-helpers-nextjs";

export default function ClientProviders({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
}) {
  return (
    <AuthProvider initialSession={initialSession}>{children}</AuthProvider>
  );
}
