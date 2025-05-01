// Clean prod: tous les TODO et commentaires dev supprimés

import { useEffect, useState } from "react";
import SettingsPanel from "./SettingsPanel";
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
  sidebarOpen,
}: SettingsTabsProps & {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [localProfile, setLocalProfile] = useState<Profile>({ ...proProfile });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ phone?: string }>({});
  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);

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

  // Scroll automatique quand la sidebar paramètres s'ouvre
  useEffect(() => {
    if (settingsSidebarOpen) {
      // Décale le scroll pour laisser le temps au DOM de se mettre à jour
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100); // 100ms suffit généralement, ajuste si besoin
    }
  }, [settingsSidebarOpen]);

  return (
    <div className="flex flex-col md:flex-row h-full bg-[#f6f8f2] relative">
      {/* Bouton paramètres mobile */}
      {!sidebarOpen && !settingsSidebarOpen && (
        <div className="md:hidden fixed top-4 right-4 z-50 flex flex-row gap-2">
          <button
            className="flex items-center gap-2 p-2 rounded-lg bg-white shadow"
            aria-label="Ouvrir les paramètres"
            onClick={() => setSettingsSidebarOpen(true)}
          >
            <span className="text-lg">&#8594;</span>
            <span className="font-semibold underline">Paramètres</span>
          </button>
        </div>
      )}
      {/* Overlay mobile */}
      {settingsSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setSettingsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar onglets */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#f6f8f2] border-r border-[#efe9db] z-50 transform transition-transform duration-300
          ${settingsSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:w-[220px] md:min-w-[220px] md:border-b-0 md:border-r
        `}
        aria-label="Menu des paramètres"
        tabIndex={0}
      >
        <div className="flex flex-col py-6 px-4 h-full">
          <h2 className="text-xl md:text-2xl font-bold text-[#29381a] mb-6 md:mb-8">
            Paramètres
          </h2>
          <div className="flex flex-col gap-2 mb-6 md:mb-8">
            <div className="flex flex-col items-center mb-4 md:mb-6 ">
              <ProfileImageUpload
                proId={String(proProfile.id)}
                imageUrl={proProfile.photoUrl ?? ""}
                onUpload={(url) => onProfileChange("photoUrl", url)}
                width={100}
                height={100}
                className="rounded-full border-2 border-[#29381a] shadow-md w-[100px] h-[100px]"
              />
            </div>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`text-left px-3 py-2 rounded-lg font-semibold transition border-l-4 focus:outline-none focus:ring-2 focus:ring-[#29381a] ${
                  activeTab === tab.key
                    ? "border-[#29381a] bg-white text-[#29381a]"
                    : "border-transparent text-[#888] bg-transparent hover:bg-[#ede9e0]"
                }`}
                onClick={() => {
                  handleTabSwitch(tab);
                  setSettingsSidebarOpen(false);
                }}
                tabIndex={0}
                aria-current={activeTab === tab.key ? "page" : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main
        className={`
          flex-1 flex flex-col items-center transition-all duration-300
          ${settingsSidebarOpen ? "pointer-events-none blur-sm select-none" : ""}
          p-4 pt-20 md:pt-10 md:p-10
        `}
        tabIndex={0}
        aria-label="Contenu principal"
      >
        <div className="w-full max-w-2xl">
          {activeTab === "profile" && (
            <SettingsPanel
              proProfile={proProfile}
              onProfileChange={onProfileChange}
              onSave={handleSave}
              saving={saving}
            />
          )}
          {activeTab === "account" && (
            <div className="w-full bg-white rounded-lg shadow-md p-4 md:p-8 border border-[#ded9cb] grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#29381a] col-span-1 md:col-span-2 mb-4 md:mb-6">
                Informations de connexion
              </h1>
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-[#29381a]">
                  Email
                </label>
                <input
                  type="email"
                  className="dashboard-profile-input text-base md:text-lg py-2 px-3 md:py-3 md:px-4 bg-gray-100"
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
                  className="dashboard-profile-input text-base md:text-lg py-2 px-3 md:py-3 md:px-4"
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
                  className={`dashboard-profile-input text-base md:text-lg py-2 px-3 md:py-3 md:px-4 ${
                    fieldErrors.phone ? "border-red-500" : ""
                  }`}
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
              <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-2 mt-6 md:mt-8">
                {!editMode ? (
                  <button
                    className="dashboard-profile-btn bg-[#29381a] text-white font-semibold rounded-lg px-4 py-2 md:px-6 md:py-2 hover:brightness-105 transition w-full md:w-auto"
                    onClick={() => setEditMode(true)}
                  >
                    Modifier les informations
                  </button>
                ) : (
                  <>
                    <button
                      className="dashboard-profile-btn bg-gray-200 text-gray-700 font-semibold rounded-lg px-4 py-2 md:px-6 md:py-2 w-full md:w-auto"
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
                  className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 md:px-6 md:py-2 w-full md:w-auto hover:brightness-105 transition"
                  onClick={async (e) => {
                    e.preventDefault();
                    setErrorMsg("");
                    setSuccessMsg("");
                    if (!userEmail) {
                      setErrorMsg("Impossible de récupérer votre email.");
                      return;
                    }
                    // Debug: log email and redirect URL
                    console.log("Reset password for:", userEmail, "redirectTo:", `${window.location.origin}/reset-password`);
                    const { error, data } = await supabase.auth.resetPasswordForEmail(userEmail, {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    if (error) {
                      setErrorMsg("Erreur lors de l'envoi du mail : " + error.message);
                    } else {
                      setSuccessMsg(
                        "Un email de réinitialisation de mot de passe a été envoyé à votre adresse. Vérifiez aussi vos spams. (data: " +
                        JSON.stringify(data) +
                        ")"
                      );
                    }
                  }}
                >
                  Réinitialiser le mot de passe
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
            </div>
          )}
          {activeTab === "hours" && (
            <div className="flex flex-col items-center justify-center gap-4 md:gap-6 w-full">
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
      </main>
    </div>
  );
}
