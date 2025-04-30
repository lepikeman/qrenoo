import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour récupérer le profil public d'un professionnel (version LinkedIn)
export async function getProPublicProfile(id: string) {
  // Recherche sur user_id puis id
  let { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", id)
    .single();
  console.log("[getProPublicProfile] user_id", id, "data:", data, "error:", error);
  if (!data) {
    // Si rien trouvé, tente sur id (robustesse)
    const res = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    data = res.data;
    error = res.error;
    console.log("[getProPublicProfile] id", id, "data:", data, "error:", error, "not found");
  }
  if (error) {
    console.error('[getProPublicProfile] fetch error:', error);
    return {
      id: '',
      profession: '',
      bio: '',
      photoUrl: '',
      nom: '',
      specialite: '',
      site_web: '',
      linkedin: '',
      phone: '',
      adresse_postale: '',
      code_postal: '',
      ville: '',
      ouverture: '',
      fermeture: '',
      intervalle_creneau: '',
      horaires_jours: {
        lundi: null,
        mardi: null,
        mercredi: null,
        jeudi: null,
        vendredi: null,
        samedi: null,
        dimanche: null,
      },
      _error: error.message || 'Erreur inconnue',
    };
  }
  if (!data) {
    // Retourne un profil vide si rien trouvé
    return {
      id: '',
      profession: '',
      bio: '',
      photoUrl: '',
      nom: '',
      specialite: '',
      site_web: '',
      linkedin: '',
      phone: '',
      adresse_postale: '',
      code_postal: '',
      ville: '',
      ouverture: '',
      fermeture: '',
      intervalle_creneau: '',
      horaires_jours: {
        lundi: null,
        mardi: null,
        mercredi: null,
        jeudi: null,
        vendredi: null,
        samedi: null,
        dimanche: null,
      },
      _error: 'Profil non trouvé',
    };
  }
  // Retourne l'objet tel quel
  return data;
}