import { supabase } from "@/utils/supabase/client";

// Fonction pour récupérer le profil public d'un professionnel (version LinkedIn)
export async function getProPublicProfile(id: string) {
  // Recherche sur user_id puis id
  let { data, error } = await supabase
    .from("profiles")
    .select("id, profession, bio, photoUrl, specialite, site_web, linkedin, phone, adresse_postale, code_postal, ville, ouverture, fermeture, intervalle_creneau, horaires_jours")
    .eq("user_id", id)
    .single();
  console.log("[getProPublicProfile] user_id", id, "data:", data, "error:", error);
  if (!data) {
    // Si rien trouvé, tente sur id (robustesse)
    const res = await supabase
      .from("profiles")
      .select("id, profession, bio, photoUrl, specialite, site_web, linkedin, phone, adresse_postale, code_postal, ville, ouverture, fermeture, intervalle_creneau, horaires_jours")
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