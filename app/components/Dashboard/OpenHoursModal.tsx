/**
 * OpenHoursModal.tsx
 *
 * Modale pour éditer les horaires d'ouverture du professionnel dans le dashboard.
 *
 * Props :
 *   - profileForm (Profile) : Formulaire de profil du professionnel
 *   - setProfileForm (function) : Fonction pour mettre à jour le formulaire de profil
 *   - onClose (function) : Fonction pour fermer la modale
 *   - onSave (function) : Fonction pour enregistrer les horaires
 *   - open (boolean) : Indicateur d'ouverture de la modale
 *
 * Affiche une fenêtre modale pour éditer les horaires d'ouverture.
 */

import React from "react";
import type { Profile, HorairesJours } from "@/app/types/Profile";
import { supabase } from "@/utils/supabase/client";

interface OpenHoursModalProps {
  profileForm: Profile;
  setProfileForm: (val: Profile) => void;
  onClose: () => void;
  onSave: (val: Profile) => void;
  open?: boolean; // nouvelle prop pour contrôle explicite
}

const OpenHoursModal: React.FC<OpenHoursModalProps> = ({
  profileForm,
  onClose,
  onSave,
  open = true, // valeur par défaut pour rétrocompatibilité
}) => {
  const [ouverture, setOuverture] = React.useState<string>(
    profileForm.ouverture || "08:00"
  );
  const [fermeture, setFermeture] = React.useState<string>(
    profileForm.fermeture || "18:00"
  );
  const [intervalleCreneau, setIntervalleCreneau] = React.useState<number>(
    Number(profileForm.intervalle_creneau) || 30
  );
  const [horairesJours, setHorairesJours] = React.useState<HorairesJours>(
    profileForm.horaires_jours || {
      lundi: null,
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null,
    }
  );
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  // Synchronisation à chaque ouverture de la modale
  React.useEffect(() => {
    if (open) {
      setOuverture(profileForm.ouverture || "08:00");
      setFermeture(profileForm.fermeture || "18:00");
      setIntervalleCreneau(Number(profileForm.intervalle_creneau) || 30);
      setHorairesJours(
        profileForm.horaires_jours || {
          lundi: null,
          mardi: null,
          mercredi: null,
          jeudi: null,
          vendredi: null,
          samedi: null,
          dimanche: null,
        }
      );
    }
  }, [open, profileForm]);

  // --- Correction : synchroniser local state avec props quand profileForm change (évite stale state) ---
  React.useEffect(() => {
    console.log("[OpenHoursModal] profileForm changed", profileForm);
    setOuverture(profileForm.ouverture || "08:00");
    setFermeture(profileForm.fermeture || "18:00");
    setIntervalleCreneau(Number(profileForm.intervalle_creneau) || 30);
    setHorairesJours(
      profileForm.horaires_jours || {
        lundi: null,
        mardi: null,
        mercredi: null,
        jeudi: null,
        vendredi: null,
        samedi: null,
        dimanche: null,
      }
    );
  }, [profileForm]);

  React.useEffect(() => {
    async function fetchProfileHours() {
      setLoading(true);
      setError("");
      try {
        // Utilise id prioritairement, puis user_id si pas d'id (aligné avec la logique update)
        const id = profileForm.id || profileForm.user_id;
        if (!id) throw new Error("ID du profil manquant");
        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("ouverture, fermeture, intervalle_creneau, horaires_jours")
          .eq("id", id)
          .single();
        if (fetchError) throw new Error(fetchError.message);
        setOuverture(data?.ouverture || "08:00");
        setFermeture(data?.fermeture || "18:00");
        setIntervalleCreneau(Number(data?.intervalle_creneau) || 30);
        setHorairesJours(
          data?.horaires_jours || {
            lundi: null,
            mardi: null,
            mercredi: null,
            jeudi: null,
            vendredi: null,
            samedi: null,
            dimanche: null,
          }
        );
      } catch (err: unknown) {
        setError(
          "Erreur lors du chargement des horaires : " + (err as Error).message
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProfileHours();
    // eslint-disable-next-line
  }, []);

  // Helper pour générer les horaires selon un intervalle donné
  function generateHoraires(intervalle: number) {
    const horaires: string[] = [];
    for (let h = 1 * 60; h <= 24 * 60; h += intervalle) {
      const hh = Math.floor(h / 60)
        .toString()
        .padStart(2, "0");
      const mm = (h % 60).toString().padStart(2, "0");
      horaires.push(`${hh}:${mm}`);
    }
    return horaires;
  }

  const jours = [
    { label: "Lundi", key: "lundi" },
    { label: "Mardi", key: "mardi" },
    { label: "Mercredi", key: "mercredi" },
    { label: "Jeudi", key: "jeudi" },
    { label: "Vendredi", key: "vendredi" },
    { label: "Samedi", key: "samedi" },
    { label: "Dimanche", key: "dimanche" },
  ];

  // --- Correction : forcer la sérialisation du champ intervalle_creneau en number partout ---
  const handleDayChange = (
    day: string,
    field: "ouverture" | "fermeture",
    value: string
  ) => {
    setHorairesJours((prev: HorairesJours) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [field]: value,
        intervalle_creneau: Number(
          (prev[day]?.intervalle_creneau ?? intervalleCreneau) ||
            intervalleCreneau
        ),
      },
    }));
  };

  const handleIntervalChange = (day: string, value: number) => {
    setHorairesJours((prev: HorairesJours) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        intervalle_creneau: Number(value),
      },
    }));
  };

  const handleDayClosed = (day: string) => {
    setHorairesJours((prev: HorairesJours) => ({
      ...prev,
      [day]: null,
    }));
  };

  // --- Correction principale : ne pas reseter les horaires après sauvegarde, et mettre à jour parent/local immédiatement ---
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updateData: Partial<Profile> = {
        ouverture,
        fermeture,
        intervalle_creneau: intervalleCreneau,
        horaires_jours: horairesJours,
      };
      const id = profileForm.id || profileForm.user_id;
      if (!id) throw new Error("ID du profil manquant");
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", id);
      if (updateError) throw new Error(updateError.message);
      const newProfile = { ...profileForm, ...updateData };
      console.log("[OpenHoursModal] onSave called with:", newProfile);
      if (typeof onSave === "function") onSave(newProfile);
      if (typeof window !== "undefined") {
        // Optionnel : feedback visuel
        window.dispatchEvent(new CustomEvent("profile-hours-saved"));
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8 border border-[#ded9cb] relative">
        <h1 className="text-3xl font-extrabold text-[#29381a] col-span-1 md:col-span-2 mb-6">
          Horaires & Intervalles
        </h1>
        {loading ? (
          <div className="text-center py-8 text-lg">Chargement...</div>
        ) : error ? (
          <div className="text-red-600 mb-4">{error}</div>
        ) : (
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6 relative"
            onSubmit={handleSave}
          >
            <div className="flex flex-col">
              <label className="block font-semibold mb-1 text-[#29381a]">
                Heure d&apos;ouverture
              </label>
              <select
                className="dashboard-profile-input text-lg py-3 px-4"
                value={ouverture}
                onChange={(e) => setOuverture(e.target.value)}
              >
                {generateHoraires(Number(intervalleCreneau)).map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="block font-semibold mb-1 text-[#29381a]">
                Heure de fermeture
              </label>
              <select
                className="dashboard-profile-input text-lg py-3 px-4"
                value={fermeture}
                onChange={(e) => setFermeture(e.target.value)}
              >
                {generateHoraires(Number(intervalleCreneau)).map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="block font-semibold mb-1 text-[#29381a]">
                Intervalle entre les créneaux (minutes)
              </label>
              <select
                className="dashboard-profile-input text-lg py-3 px-4"
                value={intervalleCreneau}
                onChange={(e) => setIntervalleCreneau(Number(e.target.value))}
              >
                {[30, 60].map((val) => (
                  <option key={val} value={val}>
                    {val} min
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 mb-4">
              <label className="block font-semibold mb-1 text-[#29381a]">
                Horaires détaillés par jour
              </label>
              <div className="bg-[#f6f8f2] rounded-lg p-4 border border-[#ded9cb]">
                <table className="w-full text-left text-xs md:text-base">
                  <tbody>
                    {jours.map(({ label, key }) => {
                      const jour = horairesJours[key];
                      if (jour === null) {
                        // Jour fermé
                        return (
                          <tr key={key}>
                            <td className="pr-2 py-1 font-semibold">{label}</td>
                            <td className="py-1 text-gray-500">
                              Fermé
                              <button
                                className="ml-2 text-xs text-green-700 hover:underline"
                                type="button"
                                onClick={() =>
                                  setHorairesJours((prev) => ({
                                    ...prev,
                                    [key]: {
                                      ouverture: ouverture,
                                      fermeture: fermeture,
                                      intervalle_creneau: intervalleCreneau,
                                    },
                                  }))
                                }
                              >
                                Ouvrir
                              </button>
                            </td>
                          </tr>
                        );
                      }
                      const horaires = generateHoraires(
                        Number(jour?.intervalle_creneau ?? intervalleCreneau)
                      );
                      return (
                        <tr key={key}>
                          <td className="pr-2 py-1 font-semibold">{label}</td>
                          <td className="py-1 flex flex-wrap items-center gap-2">
                            <select
                              className="dashboard-profile-input w-[90px]"
                              value={jour?.ouverture ?? ""}
                              onChange={(e) =>
                                handleDayChange(
                                  key,
                                  "ouverture",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">--</option>
                              {horaires.map((h) => (
                                <option key={h} value={h}>
                                  {h}
                                </option>
                              ))}
                            </select>
                            {" - "}
                            <select
                              className="dashboard-profile-input w-[90px]"
                              value={jour?.fermeture ?? ""}
                              onChange={(e) =>
                                handleDayChange(
                                  key,
                                  "fermeture",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">--</option>
                              {horaires.map((h) => (
                                <option key={h} value={h}>
                                  {h}
                                </option>
                              ))}
                            </select>
                            <select
                              className="dashboard-profile-input w-[80px]"
                              value={Number(
                                jour?.intervalle_creneau ?? intervalleCreneau
                              )}
                              onChange={(e) =>
                                handleIntervalChange(
                                  key,
                                  Number(e.target.value)
                                )
                              }
                            >
                              {[30, 60].map((val) => (
                                <option key={val} value={val}>
                                  {val} min
                                </option>
                              ))}
                            </select>
                            <button
                              className="ml-2 text-xs text-red-600 hover:underline"
                              type="button"
                              onClick={() => handleDayClosed(key)}
                            >
                              Fermé
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex gap-2 md:col-span-2 mt-6 justify-end">
              <button
                type="button"
                className="dashboard-profile-btn bg-gray-200 text-gray-700 font-semibold rounded-lg px-6 py-2 w-full md:w-auto"
                onClick={onClose}
                disabled={saving}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="dashboard-profile-btn bg-[#29381a] text-white font-semibold rounded-lg px-6 py-2 hover:brightness-105 transition w-full md:w-auto"
                disabled={saving}
              >
                {saving ? "Sauvegarde..." : "Enregistrer les horaires"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OpenHoursModal;
