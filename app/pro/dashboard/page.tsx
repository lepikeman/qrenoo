"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import type { Profile } from "@/app/types/Profile";
import DashboardPage from "@/app/components/Dashboard/DashboardPage";
import { useProfile } from "@/app/hooks/useProfile";
import { supabase } from "@/utils/supabase/client";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const [reloadProfile, setReloadProfile] = useState(0);

  // Ne tente pas de charger le profil tant que la session n'est pas prête
  const userId = user?.id || "";
  const {
    profile,
    loading: profileLoading,
    error,
    setProfile,
  } = useProfile(userId && !loading ? userId : "", reloadProfile);

  // Gestion du formulaire de profil (édition)
  const [profileForm, setProfileForm] = useState<Profile>(() =>
    profile ? { ...profile } : ({} as Profile)
  );

  // Synchronise le formulaire avec le profil dès qu'il change
  useEffect(() => {
    if (profile) {
      setProfileForm({ ...profile });
    }
  }, [profile]);

  // Création du profil si inexistant
  const createProfileIfMissing = useCallback(async () => {
    // APRÈS: Utilisation de getUser()
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) return;
    setCreatingProfile(true);
    setErrorProfile(null);
    try {
      const { data: existing } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", userId)
        .single();
      if (!existing) {
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            user_id: userId,
            profession: "",
            bio: "",
            photoUrl: "",
            specialite: "",
            site_web: "",
            linkedin: "",
            phone: "",
            adresse_postale: "",
            code_postal: "",
            ville: "",
            ouverture: "",
            fermeture: "",
            intervalle_creneau: "",
            nom: "",
          },
        ]);
        if (insertError) throw insertError;
        setReloadProfile((k) => k + 1);
      }
    } catch (err: unknown) {
      setErrorProfile(
        "Impossible de créer le profil : " +
          (err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Une erreur inconnue est survenue.")
      );
    } finally {
      setCreatingProfile(false);
    }
  }, []);

  useEffect(() => {
    if (user && !profile && !creatingProfile && !loading) {
      createProfileIfMissing();
    }
  }, [user, profile, creatingProfile, loading, createProfileIfMissing]);

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] text-lg text-blue-700">
        Chargement du dashboard...
      </div>
    );
  }
  if (!user) {
    return <div className="text-red-600 font-bold p-8">Non autorisé</div>;
  }
  if (errorProfile || error) {
    return (
      <div className="text-red-600 font-bold p-8">{errorProfile || error}</div>
    );
  }
  if (!profile) {
    return (
      <div className="text-gray-500 p-8">
        Aucun profil trouvé. Merci de réessayer plus tard.
      </div>
    );
  }

  // Fonction de sauvegarde du profil
  const handleUpdateProfile = async (profileFormToSave: Profile) => {
    if (!user) return;
    const payload: Record<string, unknown> = {};
    [
      "profession",
      "bio",
      "photoUrl",
      "specialite",
      "site_web",
      "linkedin",
      "phone",
      "adresse_postale",
      "code_postal",
      "ville",
      "ouverture",
      "fermeture",
      "nom",
    ].forEach((key) => {
      const value = profileFormToSave[key as keyof typeof profileFormToSave];
      if (typeof value === "string" && value.trim() !== "") {
        payload[key] = value;
      }
    });
    if (
      profileFormToSave.intervalle_creneau !== undefined &&
      profileFormToSave.intervalle_creneau !== null &&
      profileFormToSave.intervalle_creneau !== "" &&
      !isNaN(Number(profileFormToSave.intervalle_creneau))
    ) {
      payload.intervalle_creneau = Number(profileFormToSave.intervalle_creneau);
    }
    if (Object.keys(payload).length === 0) {
      setErrorProfile("Aucune donnée à mettre à jour.");
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("user_id", user.id);
    if (error) {
      setErrorProfile(
        "Erreur lors de la sauvegarde du profil: " + error.message
      );
    } else {
      setProfile({ ...profile, ...profileFormToSave });
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--main-bg)" }}>
      <main
        className="flex-1 flex flex-col min-h-screen"
        style={{ background: "var(--main-bg)" }}
      >
        <DashboardPage
          profileForm={profileForm}
          setProfileForm={setProfileForm}
          handleUpdateProfile={handleUpdateProfile}
          profileLoading={profileLoading}
          proId={profile?.id || ""}
        />
      </main>
    </div>
  );
}
