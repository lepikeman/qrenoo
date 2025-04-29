// Clean prod: tous les TODO et commentaires dev supprimés

import React, { useState, useEffect } from "react";
import SettingsPanel from "./SettingsPanel";
import ChangePasswordModal from "./ChangePasswordModal";
import OpenHoursModal from "./OpenHoursModal";
import ProfileImageUpload from "@/app/components/ProfileImageUpload";
import type { Profile } from "@/app/types/Profile";
import { supabase } from "@/utils/supabase/client";

interface SettingsTabsProps {
  proProfile: Profile;
  onProfileChange: (
    field: keyof Profile | "full",
    value: string | number | Partial<Profile>
  ) => void;
  onSave: (profileFormToSave: Profile) => Promise<boolean>;
  saving: boolean;
  onOpenHours?: () => void;
}

const tabs = [
  { key: "profile", label: "Profil" },
  { key: "account", label: "Informations" },
  { key: "hours", label: "Horaires & Intervalles" },
  {
    key: "logout",
    label: "Déconnexion",
  },
];

export default function SettingsTabs({
  proProfile,
  onProfileChange,
  onSave,
  saving,
}: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false); // Peut être utilisé dans le futur
  const [localProfile, setLocalProfile] = useState<Profile>({ ...proProfile });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ phone?: string }>({});

  // --- Synchronise le state local avec toutes les props du profil parent à chaque changement ---
  useEffect(() => {
    setLocalProfile({ ...proProfile });
  }, [proProfile]);

  // Déconnexion
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  // Correction du bug de comparaison void/boolean
  function handleTabSwitch(tab: { key: string; label: string }) {
    if (tab.key === "logout") {
      handleLogout();
    } else {
      setActiveTab(tab.key);
    }
  }

  // Dans la logique d'enregistrement (bouton "Enregistrer")
  async function handleSave() {
    // Merge localProfile dans proProfile pour obtenir un objet complet (Profile)
    const fullProfile = { ...proProfile, ...localProfile };
    // Synchronise le state parent AVANT la sauvegarde
    onProfileChange("full" as const, fullProfile);
    setEditMode(false);
    if (onSave) {
      try {
        // Sanitize and log before saving
      } catch (err) {
        setErrorMsg(
          "Erreur de validation du profil: " +
            (err instanceof Error ? err.message : String(err))
        );
        return;
      }
      const res = await onSave(fullProfile);
      if (res === false) {
        setErrorMsg("Erreur lors de la sauvegarde. Veuillez réessayer.");
        return;
      }
      setSuccessMsg("Profil mis à jour !");
    }
  }

  // Ajoute une récupération de l'email Supabase Auth pour affichage
  const [userEmail, setUserEmail] = useState<string>("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.email) setUserEmail(user.email);
    });
  }, []);

  return (
    <div className="flex h-full bg-[#f6f8f2]">
      {/* Sidebar onglets */}
      <div className="flex flex-col py-10 px-6 min-w-[220px] bg-[#f6f8f2] border-r border-[#efe9db]">
        <h2 className="text-2xl font-bold text-[#29381a] mb-8">Paramètres</h2>
        <div className="flex flex-col gap-2 mb-8">
          {/* Bloc photo de profil */}
          <div className="flex flex-col items-center mb-6">
            <ProfileImageUpload
              proId={String(proProfile.id)}
              imageUrl={proProfile.photoUrl ?? ""}
              onUpload={(url) => onProfileChange("photoUrl", url)}
              width={150}
              height={150}
            />
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`text-left px-4 py-2 rounded-lg font-semibold transition border-l-4 ${activeTab === tab.key ? "border-[#29381a] bg-white text-[#29381a]" : "border-transparent text-[#888] bg-transparent hover:bg-[#ede9e0]"}`}
              onClick={() => handleTabSwitch(tab)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 overflow-hidden p-10 flex flex-col items-center">
        <div className="w-full">
          {activeTab === "profile" && (
            <SettingsPanel
              proProfile={proProfile}
              onProfileChange={onProfileChange}
              onSave={handleSave}
              saving={saving}
            />
          )}
          {activeTab === "account" && (
            <div className="w-full bg-white rounded-xl shadow-xl p-8 border border-[#ded9cb] grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <h1 className="text-3xl font-extrabold text-[#29381a] col-span-1 md:col-span-2 mb-6">
                Informations de connexion
              </h1>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-[#29381a]">
                  Email
                </label>
                <input
                  type="email"
                  className="dashboard-profile-input text-lg py-3 px-4 bg-gray-100"
                  value={userEmail}
                  disabled
                />
              </div>
              <div className="flex flex-col">
                <label className="block font-semibold mb-1 text-[#29381a]">
                  Nom
                </label>
                <input
                  type="text"
                  className="dashboard-profile-input text-lg py-3 px-4"
                  value={localProfile.nom}
                  disabled={!editMode}
                  onChange={(e) =>
                    setLocalProfile((p) => ({ ...p, nom: e.target.value }))
                  }
                  placeholder="Votre nom"
                />
              </div>
              <div className="flex flex-col">
                <label className="block font-semibold mb-1 text-[#29381a]">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  className={`dashboard-profile-input text-lg py-3 px-4 ${fieldErrors.phone ? "border-red-500" : ""}`}
                  value={localProfile.phone}
                  disabled={!editMode}
                  onChange={(e) =>
                    setLocalProfile((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="06 01 02 03 04"
                />
                {fieldErrors.phone && (
                  <div className="text-red-600 text-xs mt-1">
                    {fieldErrors.phone}
                  </div>
                )}
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-2 mt-8 md:justify-start justify-center">
                {!editMode ? (
                  <button
                    className="dashboard-profile-btn bg-[#29381a] text-white font-semibold rounded-lg px-6 py-2 hover:brightness-105 transition w-full md:w-auto"
                    onClick={() => setEditMode(true)}
                  >
                    Modifier les informations
                  </button>
                ) : (
                  <>
                    <button
                      className="dashboard-profile-btn bg-gray-200 text-gray-700 font-semibold rounded-lg px-6 py-2 w-full md:w-auto"
                      onClick={() => {
                        setEditMode(false);
                        setFieldErrors({});
                        setErrorMsg("");
                        setSuccessMsg("");
                        setLocalProfile({ ...proProfile });
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      className="dashboard-profile-btn"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? "Sauvegarde..." : "Enregistrer"}
                    </button>
                  </>
                )}
                <button
                  className="bg-blue-600 text-white font-semibold rounded-lg px-6 py-2 w-full md:w-auto hover:brightness-105 transition"
                  onClick={() => setShowPwdModal(true)}
                >
                  Modifier le mot de passe
                </button>
              </div>
              {successMsg && (
                <div className="text-green-600 text-sm mt-3 col-span-1 md:col-span-2">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="text-red-600 text-sm mt-3 col-span-1 md:col-span-2">
                  {errorMsg}
                </div>
              )}
              <ChangePasswordModal
                open={showPwdModal}
                onClose={() => setShowPwdModal(false)}
                email={userEmail}
              />
            </div>
          )}
          {activeTab === "hours" && (
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              <OpenHoursModal
                profileForm={proProfile}
                setProfileForm={(val) =>
                  onProfileChange("full" as const, {
                    ...proProfile,
                    ...val,
                  })
                }
                onClose={() => {}}
                onSave={(updatedProfile) => {
                  onProfileChange("full" as const, updatedProfile);
                }}
                open={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
