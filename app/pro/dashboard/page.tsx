"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import type { Session } from "@supabase/supabase-js";
import type { Profile } from "@/app/types/Profile";
import DashboardPage from "@/app/components/Dashboard/DashboardPage";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  // Commentons la ligne qui utilise usePlanFeatures
  // const { hasAccess } = usePlanFeatures();
  
  // Créons une fonction de remplacement temporaire

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileForm, setProfileForm] = useState<Profile>({
    id: "",
    profession: "",
    bio: "",
    photoUrl: "",
    specialite: "",
    site_web: "",
    linkedin: "",
    phone: "",
    adresse_postale: "",
    user_id: "",
    code_postal: "",
    ville: "",
    ouverture: "",
    fermeture: "",
    intervalle_creneau: "",
    nom: "",
    horaires_jours: {
      lundi: null,
      mardi: null,
      mercredi: null,
      jeudi: null,
      vendredi: null,
      samedi: null,
      dimanche: null,
    },
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const router = useRouter();

  const createProfileIfMissing = useCallback(async (userId: string) => {
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
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setErrorProfile(
          "Impossible de créer le profil : " +
            (err as { message: string }).message
        );
      } else {
        setErrorProfile(
          "Impossible de créer le profil : Une erreur inconnue est survenue."
        );
      }
    } finally {
      setCreatingProfile(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    const checkAndCreateProfile = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", session.user.id)
        .single();
      if (!profileData) {
        await supabase.from("profiles").insert([
          {
            user_id: session.user.id,
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
      }
    };
    checkAndCreateProfile();
  }, [session]);

  useEffect(() => {
    async function fetchData() {
      if (session) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select(
            "id, profession, bio, user_id, photoUrl, specialite, site_web, linkedin, phone, adresse_postale, code_postal, ville, ouverture, fermeture, intervalle_creneau, nom, horaires_jours"
          )
          .eq("user_id", session.user.id)
          .single();
        setProfile(profileData as Profile);
        setProfileForm({
          id: profileData?.id || "",
          profession: profileData?.profession || "",
          bio: profileData?.bio || "",
          photoUrl: profileData?.photoUrl || "",
          specialite: profileData?.specialite || "",
          site_web: profileData?.site_web || "",
          linkedin: profileData?.linkedin || "",
          phone: profileData?.phone || "",
          adresse_postale: profileData?.adresse_postale || "",
          user_id: profileData?.user_id || "",
          code_postal: profileData?.code_postal
            ? String(profileData.code_postal)
            : "",
          ville: profileData?.ville ? String(profileData.ville) : "",
          ouverture: profileData?.ouverture || "",
          fermeture: profileData?.fermeture || "",
          intervalle_creneau: profileData?.intervalle_creneau || "",
          nom: profileData?.nom || "",
          horaires_jours: profileData?.horaires_jours || {
            lundi: null,
            mardi: null,
            mercredi: null,
            jeudi: null,
            vendredi: null,
            samedi: null,
            dimanche: null,
          },
        });
      }
    }
    fetchData();
  }, [session]);

  useEffect(() => {
    if (session && !profile && !creatingProfile) {
      createProfileIfMissing(session.user.id).then(async () => {
        const { data: profileData } = await supabase
          .from("profiles")
          .select(
            "id, profession, bio, user_id, photoUrl, specialite, site_web, linkedin, phone, adresse_postale, code_postal, ville, ouverture, fermeture, intervalle_creneau, nom, horaires_jours"
          )
          .eq("user_id", session.user.id)
          .single();
        setProfile(profileData as Profile);
        setProfileForm({
          id: profileData?.id || "",
          profession: profileData?.profession || "",
          bio: profileData?.bio || "",
          photoUrl: profileData?.photoUrl || "",
          specialite: profileData?.specialite || "",
          site_web: profileData?.site_web || "",
          linkedin: profileData?.linkedin || "",
          phone: profileData?.phone || "",
          adresse_postale: profileData?.adresse_postale || "",
          user_id: profileData?.user_id || "",
          code_postal: profileData?.code_postal
            ? String(profileData.code_postal)
            : "",
          ville: profileData?.ville ? String(profileData.ville) : "",
          ouverture: profileData?.ouverture || "",
          fermeture: profileData?.fermeture || "",
          intervalle_creneau: profileData?.intervalle_creneau || 30,
          nom: profileData?.nom || "",
          horaires_jours: profileData?.horaires_jours || {
            lundi: null,
            mardi: null,
            mercredi: null,
            jeudi: null,
            vendredi: null,
            samedi: null,
            dimanche: null,
          },
        });
      });
    }
  }, [session, profile, creatingProfile, createProfileIfMissing]);

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login?redirectTo=/pro/dashboard");
    }
  }, [loading, session, router]);

  const handleUpdateProfile = async (profileFormToSave = profileForm) => {
    setProfileLoading(true);
    if (!session) return;
    // Nettoyage robuste du payload selon la structure Supabase
    const payload: Record<string, unknown> = {};

    // Champs texte : on n'envoie que si non vide
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

    // Champ numérique (intervalle_creneau)
    if (
      profileFormToSave.intervalle_creneau !== undefined &&
      profileFormToSave.intervalle_creneau !== null &&
      profileFormToSave.intervalle_creneau !== "" &&
      !isNaN(Number(profileFormToSave.intervalle_creneau))
    ) {
      payload.intervalle_creneau = Number(profileFormToSave.intervalle_creneau);
    }

    if (Object.keys(payload).length === 0) {
      setProfileLoading(false);
      setErrorProfile("Aucune donnée à mettre à jour.");
      return;
    }

    // debug supprimé
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("user_id", session.user.id);
    setProfileLoading(false);
    if (error) {
      setErrorProfile(
        "Erreur lors de la sauvegarde du profil: " + error.message
      );
    } else {
      setProfile((prev) => (prev ? { ...prev, ...profileFormToSave } : prev));
    }
  };

  // Fonction universelle pour gérer la modification du profil depuis SettingsTabs/SettingsPanel
  const handleProfileFormChange = (
    arg1: keyof Profile | "full" | Profile,
    arg2?: string | number | Partial<Profile>
  ) => {
    if (typeof arg1 === "object" && arg2 === undefined) {
      // Appel direct avec un objet complet (Pattern legacy)
      setProfileForm(arg1 as Profile);
    } else if (typeof arg1 === "string") {
      const field = arg1;
      const value = arg2;
      if (
        value &&
        (value instanceof Event ||
          value instanceof HTMLElement ||
          (typeof value === "object" &&
            value.constructor &&
            value.constructor.name &&
            value.constructor.name.startsWith("SyntheticEvent")))
      ) {
        throw new Error(
          "[handleProfileFormChange] ERREUR: Un event ou un DOM node a été passé au setter !"
        );
      }
      if (field === "full" && typeof value === "object") {
        setProfileForm((prev) => ({ ...prev, ...value }));
      } else {
        setProfileForm((prev) => ({ ...prev, [field]: value }));
      }
    }
  };

  if (loading || creatingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-lg text-blue-700">
        Chargement du dashboard...
      </div>
    );
  }
  if (errorProfile) {
    return <div className="text-red-600 font-bold p-8">{errorProfile}</div>;
  }
  if (!profile) {
    return (
      <div className="text-gray-500 p-8">
        Aucun profil trouvé. Merci de réessayer plus tard.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--main-bg)" }}>
      {/* Main content */}
      <main
        className="flex-1 flex flex-col min-h-screen"
        style={{ background: "var(--main-bg)" }}
      >
        <DashboardPage
          profileForm={profileForm}
          setProfileForm={(form) => {
            if (typeof form === "function") {
              setProfileForm((prev) => form(prev));
            } else {
              handleProfileFormChange("full", form);
            }
          }}
          
          handleUpdateProfile={handleUpdateProfile}
          profileLoading={profileLoading}
          proId={profile?.id || ""}
        />
      </main>
    </div>
  );
}
