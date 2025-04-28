import { createClient } from "@supabase/supabase-js";
import type { Profile } from "@/app/types/Profile";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Récupère le profil professionnel à partir de la table "profiles" via l'user_id.
 * @param userId string | undefined
 */
export async function getProProfile(userId?: string): Promise<Profile | null> {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) {
    console.error("Erreur lors du fetch du profil professionnel:", error.message);
    return null;
  }
  return data as Profile;
}
