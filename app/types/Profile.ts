// Type strict pour les horaires par jour
export type HorairesJours = {
  [key: string]: {
    intervalle_creneau: string | number | undefined; ouverture?: string; fermeture?: string 
} | null;
};

export interface Profile {
  horaires_jours: HorairesJours;
  id?: string;
  user_id?: string;
  pro_id?: string;
  profession: string;
  bio?: string;
  photoUrl?: string;
  specialite?: string;
  site_web?: string;
  linkedin?: string;
  presentation?: string;
  nom?: string;
  phone?: string;
  adresse_postale?: string;
  code_postal?: string;
  ville?: string;
  // Ajout pour horaires d'ouverture et intervalle de créneau
  ouverture?: string; // format "HH:mm"
  fermeture?: string; // format "HH:mm"
  intervalle_creneau?: number | string; // en minutes
}
