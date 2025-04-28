import { Profile } from "@/app/types/Profile";
import React from "react";

interface SettingsPanelProps {
  proProfile: Profile;
  onProfileChange: (
    field: keyof Profile | "full",
    value: string | number | Partial<Profile>
  ) => void;
  onSave: () => void;
  saving: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  proProfile,
  onProfileChange,
  onSave,
  saving,
}) => {
  // Clean prod: commentaire dev supprimé
  return (
    <div className="flex flex-col h-full bg-[#f6f8f2]">
      {/* Header sticky */}
      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col items-center">
        <div className="w-full bg-white rounded-xl shadow-xl p-6 border border-[#ded9cb] grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <h1 className="text-3xl font-extrabold text-[#29381a] col-span-1 md:col-span-2 mb-6">
            Profil Public
          </h1>
          {/* Ce composant ne doit plus afficher la section mot de passe/email directement,
          il doit afficher uniquement les champs "profil" (identité, métier, bio, adresse, etc)
          Pour la section email/mdp, voir SettingsTabs (onglet "Informations") */}
          <div className="flex flex-col">
            <label className="block font-semibold mb-1 text-[#29381a]">
              Nom affiché
            </label>
            <input
              type="text"
              className="dashboard-profile-input text-lg py-3 px-2"
              value={proProfile.nom ?? ""}
              onChange={(e) => onProfileChange("nom", e.target.value)}
              placeholder="Votre nom ou nom du cabinet"
            />
          </div>
          <div className="flex flex-col">
            <label className="block font-semibold mb-1 text-[#29381a]">
              Profession
            </label>
            <input
              type="text"
              className="dashboard-profile-input text-lg py-3 px-4"
              value={proProfile.profession ?? ""}
              onChange={(e) => onProfileChange("profession", e.target.value)}
              placeholder="Ex: Kinésithérapeute"
            />
          </div>
          <div className="flex flex-col">
            <label className="block font-semibold mb-1 text-[#29381a]">
              Site web
            </label>
            <input
              type="url"
              className="dashboard-profile-input text-lg py-3 px-4"
              value={proProfile.site_web ?? ""}
              onChange={(e) => onProfileChange("site_web", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col">
            <label className="block font-semibold mb-1 text-[#29381a]">
              LinkedIn
            </label>
            <input
              type="url"
              className="dashboard-profile-input text-lg py-3 px-4"
              value={proProfile.linkedin ?? ""}
              onChange={(e) => onProfileChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="flex flex-col">
            <label className="block font-semibold mb-1 text-[#29381a]">
              Spécialité
            </label>
            <input
              type="text"
              className="dashboard-profile-input text-lg py-3 px-4"
              value={proProfile.specialite ?? ""}
              onChange={(e) => onProfileChange("specialite", e.target.value)}
              placeholder="Ex: Rééducation du sport"
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="block font-semibold mb-1 text-[#29381a]">
              Présentation / Bio
            </label>
            <textarea
              className="dashboard-profile-input text-lg py-2 px-4 min-h-[80px] max-h-[120px] w-[400px]"
              value={proProfile.bio ?? ""}
              onChange={(e) => onProfileChange("bio", e.target.value)}
              placeholder="Quelques mots sur vous, votre parcours, votre approche..."
              rows={2}
            />
          </div>
          <div className="flex flex-col">
            <label className="block font-semibold mb-1 text-[#29381a]">
              Adresse postale
            </label>
            <input
              type="text"
              className="dashboard-profile-input text-lg py-3 px-4"
              value={proProfile.adresse_postale ?? ""}
              onChange={(e) => onProfileChange("adresse_postale", e.target.value)}
              placeholder="Ex: 12 rue de la Santé"
            />
          </div>
          <div className="flex flex-col">
            <label className="block font-semibold mb-1 text-[#29381a]">
              Code postal
            </label>
            <input
              type="text"
              className="dashboard-profile-input text-lg py-3 px-4"
              value={proProfile.code_postal ?? ""}
              onChange={(e) => onProfileChange("code_postal", e.target.value)}
              placeholder="75001"
              maxLength={5}
              inputMode="numeric"
              pattern="[0-9]{5}"
              autoComplete="postal-code"
            />
          </div>
          <div className="flex flex-col">
            <label className="block font-semibold mb-1 text-[#29381a]">
              Ville
            </label>
            <input
              type="text"
              className="dashboard-profile-input text-lg py-3 px-4"
              value={proProfile.ville ?? ""}
              onChange={(e) => onProfileChange("ville", e.target.value)}
              placeholder="Paris"
            />
          </div>
        </div>
        <button
          className="dashboard-profile-btn bg-[#29381a] text-white font-semibold rounded-lg px-6 py-2 mt-10 hover:brightness-105 transition w-full md:w-auto cursor-pointer"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
        </button>
        <div className="col-span-1 md:col-span-2 flex md:justify-start justify-center"></div>
      </div>
    </div>
  );
};

export default SettingsPanel;
