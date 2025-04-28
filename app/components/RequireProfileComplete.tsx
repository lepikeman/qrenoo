"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function RequireProfileComplete({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setTimeout(async () => {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("is_profile_complete")
            .eq("user_id", user.id)
            .maybeSingle();
          console.log("Profile check:", profile, error);
          if (!profile || !profile.is_profile_complete) {
            if (window.location.pathname !== "/profile-setup") {
              router.push("/profile-setup");
            }
          }
        }, 200);
      }
    };
    checkProfile();
  }, [router]);

  return <>{children}</>;
}
