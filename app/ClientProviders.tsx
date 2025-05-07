"use client";

import { AuthProvider } from "./context/AuthContext";
import type { User } from "@supabase/auth-helpers-nextjs";

export default function ClientProviders({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  return <AuthProvider initialUser={initialUser}>{children}</AuthProvider>;
}
