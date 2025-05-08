import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import type { Profile } from "@/app/types/Profile";

export function useProfile(userId: string, reloadTrigger?: number) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      if (!userId) {
        setProfile(null);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (!isMounted) return;
        if (error) {
          setError(error.message);
          setProfile(null);
        } else if (data) {
          setProfile(data as Profile);
        } else {
          setProfile(null);
        }
      } catch (err) {
        if (isMounted) setError(String(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [userId, reloadTrigger]);

  return { profile, loading, error, setProfile };
}
