/**
 * DashboardProfileInfo.tsx
 *
 * Composant d'affichage des informations détaillées du profil utilisateur dans le dashboard.
 *
 * Props :
 *   - profileForm (Profile) : Formulaire de profil à afficher
 *   - onChange (function) : Fonction appelée lors d'un changement de valeur dans le formulaire
 *   - onSave (function) : Fonction appelée pour sauvegarder les modifications du profil
 *   - saving (boolean) : État de sauvegarde en cours
 *   - visible (boolean) : Visibilité du formulaire (facultatif, par défaut true)
 *
 * Affiche les informations détaillées du profil professionnel.
 */

import React from "react";
import type { Profile } from "@/app/types/Profile";

interface DashboardProfileInfoProps {
  profileForm: Profile;
  onChange: (field: keyof Profile, value: string | number) => void;
  onSave: (profileForm: Profile) => Promise<void> | void;
  saving: boolean;
  visible?: boolean;
}

const DashboardProfileInfo: React.FC<DashboardProfileInfoProps> = ({
  profileForm,
  onChange,
  onSave,
  saving,
  visible = true,
}) => {
  // Toujours déclarer les hooks en haut du composant !
  const [error, setError] = React.useState<string>("");

  if (!visible) return null;

  function capitalizeWords(str: string) {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        // Validation code postal : 5 chiffres obligatoires
        if (!/^\d{5}$/.test(profileForm.code_postal ?? "")) {
          setError("Le code postal doit comporter exactement 5 chiffres.");
          return;
        }
        // Capitalisation de chaque mot pour ville et adresse_postale
        const ville = capitalizeWords((profileForm.ville ?? "").trim());
        const adresse_postale = capitalizeWords(
          (profileForm.adresse_postale ?? "").trim()
        );
        await onSave({
          ...profileForm,
          ville,
          adresse_postale,
        });
      }}
    >
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
      )}
      <div>
        <label>Profession</label>
        <input
          type="text"
          value={profileForm.profession}
          onChange={(e) => onChange("profession", e.target.value)}
        />
      </div>
      <div>
        <label>Spécialité</label>
        <input
          type="text"
          value={profileForm.specialite || ""}
          onChange={(e) => onChange("specialite", e.target.value)}
        />
      </div>
      <div>
        <label>Bio</label>
        <textarea
          value={profileForm.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          rows={3}
        />
      </div>
      <div>
        <label>Site web</label>
        <input
          type="url"
          value={profileForm.site_web || ""}
          onChange={(e) => onChange("site_web", e.target.value)}
        />
      </div>
      <div>
        <label>LinkedIn</label>
        <input
          type="url"
          value={profileForm.linkedin || ""}
          onChange={(e) => onChange("linkedin", e.target.value)}
        />
      </div>
      <div>
        <label>Numéro de téléphone</label>
        <input
          type="tel"
          value={profileForm.phone || ""}
          onChange={(e) => {
            // Ajoute des espaces automatiquement (format xx xx xx xx xx)
            let val = e.target.value.replace(/\D/g, "").slice(0, 10);
            val = val.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
            onChange("phone", val);
          }}
          placeholder="06 12 34 56 78"
          maxLength={14}
        />
      </div>
      {/* Champ adresse_mail supprimé car la colonne n'existe plus dans la table profiles */}
      <div>
        <label>Adresse postale (pour la base)</label>
        <input
          type="text"
          value={profileForm.adresse_postale || ""}
          onChange={(e) => onChange("adresse_postale", e.target.value)}
          placeholder="123 rue Exemple, 75000 Paris"
        />
      </div>
      <div>
        <label>Code postal</label>
        <input
          type="text"
          value={profileForm.code_postal ?? ""}
          onChange={(e) => {
            const raw = e.target.value;
            const codePostal = raw.replace(/\D/g, "").slice(0, 5);
            onChange("code_postal", codePostal);
          }}
          placeholder="75001"
          maxLength={5}
          inputMode="numeric"
          pattern="[0-9]{5}"
          autoComplete="postal-code"
        />
      </div>
      <div>
        <label>Ville</label>
        <input
          type="text"
          value={profileForm.ville ?? ""}
          onChange={(e) => onChange("ville", e.target.value)}
          placeholder="Paris"
        />
      </div>
      {/* Champs horaires et intervalle déplacés dans la modale dédiée */}
      <button type="submit" disabled={saving}>
        {saving ? "Sauvegarde..." : "Sauvegarder"}
      </button>
    </form>
  );
};

export default DashboardProfileInfo;

/*
.dashboard-profile-form { display: flex; flex-direction: column; gap: 1.2em; width: 100%; }
.dashboard-profile-row { display: flex; flex-direction: column; gap: 0.2em; }
.dashboard-profile-label { font-weight: 600; margin-bottom: 0.2em; color: var(--primary); }
.dashboard-profile-input { width: 100%; font-size: 1em; padding: 0.7em 1em; border-radius: 8px; border: 1px solid #d1d5db; }
.dashboard-profile-btn { margin-top: 1.5em; width: 100%; max-width: 260px; align-self: flex-end; }
@media (max-width: 600px) { .dashboard-profile-btn { width: 100%; max-width: none; } }
*/
