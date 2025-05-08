/**
 * DashboardPage.tsx
 *
 * Page principale du dashboard. Gère l'état global, les rendez-vous, la vue calendrier, et intègre le layout principal.
 *
 * Props :
 *   - profileForm: données du profil utilisateur
 *   - setProfileForm: fonction pour modifier le profil
 *   - handleUpdateProfile: fonction pour sauvegarder le profil
 *   - profileLoading: booléen de chargement du profil
 *   - proId: identifiant du professionnel
 *
 * Affiche le calendrier, les rendez-vous, les modales et le layout global du dashboard.
 */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import type { Profile } from "@/app/types/Profile";
import CalendarHeader from "./CalendarHeader";
import DashboardLayout from "./DashboardLayout"; // Import de DashboardLayout
import CalendarGrid from "./CalendarGrid";
import AppointmentDetailsPanel from "./AppointmentDetailsPanel"; // Import du composant AppointmentDetailsPanel
import SettingsTabs from "./SettingsTabs"; // Import du composant SettingsTabs
import { supabase } from "@/utils/supabase/client";
import Overview from "./Overview";

// Types
export interface Appointment {
  duree: string;
  id: string;
  client_nom: string;
  client_email?: string;
  client_phone: string;
  date_jour: string;
  heure: string;
  message?: string;
  is_validated?: boolean;
  pro_id: string; // <-- identifiant du professionnel
  selected?: boolean;
}

interface DashboardPageProps {
  profileForm: Profile;
  setProfileForm: (form: Profile | ((prev: Profile) => Profile)) => void;
  handleUpdateProfile: (profile: Profile) => void;
  profileLoading?: boolean;
  proId: string;
}

// Hook personnalisé pour la gestion des rendez-vous
function useAppointments(
  profileForm: Profile,
  days: string[],
  reloadKey: number
) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  // Mémorise l'ID du profil pour éviter des re-renders inutiles
  const profileId = useMemo(() => profileForm?.id || "", [profileForm?.id]);

  useEffect(() => {
    let isMounted = true;

    async function fetchAppointments() {
      // Ne fait pas de fetch si pas d'ID
      if (!profileId) {
        setAppointments([]);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams({
          days: days.join(","),
          pro_id: profileId,
        });

        const res = await fetch(`/api/rendezvous?${params.toString()}`);
        if (!res.ok)
          throw new Error("Erreur lors du chargement des rendez-vous");

        const fetched: Appointment[] = await res.json();
        if (isMounted) {
          setAppointments(fetched);
        }
      } catch (error) {
        console.error("Erreur fetch appointments:", error);
        if (isMounted) {
          setAppointments([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, [profileId, days, reloadKey]); // Utilise profileId au lieu de profileForm.id

  return { appointments, loading };
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  profileForm,
  setProfileForm,
  profileLoading: initialProfileLoading,
}) => {
  // États
  const [selectedRdv, setSelectedRdv] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userEmail, setUserEmail] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "calendar" | "settings"
  >("calendar");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [calendarReloadKey, setCalendarReloadKey] = useState(0);

  // Gestion des heures et intervals
  const [interval, setInterval] = useState(() => {
    if (profileForm?.intervalle_creneau) {
      const parsedInterval = Number(profileForm.intervalle_creneau);
      return isNaN(parsedInterval) ? 30 : parsedInterval;
    }
    return 30;
  });

  const [startHour, setStartHour] = useState(
    () => profileForm?.ouverture || "06:00"
  );
  const [endHour, setEndHour] = useState(
    () => profileForm?.fermeture || "22:00"
  );

  // Callbacks mémorisés (AVANT les conditions)
  const handleReloadCalendar = useCallback(() => {
    setCalendarReloadKey((k) => k + 1);
  }, []);

  const handleProfileChange = useCallback(
    (
      field: keyof Profile | "full",
      value: Profile[keyof Profile] | Partial<Profile>
    ) => {
      if (field === "full" && typeof value === "object") {
        setProfileForm((prev: Profile) => ({ ...prev, ...(value as Profile) }));
      } else {
        setProfileForm(
          (prev: Profile) => ({ ...prev, [field]: value }) as Profile
        );
      }
    },
    [setProfileForm]
  );

  const handleAppointmentSelect = useCallback((rdv: Appointment) => {
    setSelectedRdv((prev) => {
      // Ne met à jour que si c'est un rdv différent
      if (prev?.id === rdv.id) return prev;
      return rdv;
    });
  }, []);

  const getNextDays = (date: Date, days: number) => {
    const nextDays = [];
    for (let i = 0; i < days; i++) {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + i);
      nextDays.push(nextDate.toISOString().split("T")[0]);
    }
    return nextDays;
  };

  const handleSaveProfile = useCallback(
    async (profileFormToSave: Profile) => {
      try {
        const { error } = await supabase
          .from("profiles")
          .update(profileFormToSave)
          .eq("user_id", profileFormToSave.user_id);

        if (error) throw error;
        setProfileForm(profileFormToSave);
        return true;
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du profil:", error);
        return false;
      }
    },
    [setProfileForm]
  );

  // Valeurs mémorisées
  const days = useMemo(() => getNextDays(selectedDate, 7), [selectedDate]);
  const { appointments, loading } = useAppointments(
    profileForm,
    days,
    calendarReloadKey
  );

  // Mémorise aussi les appointments filtrés
  const filteredAppointments = useMemo(() => {
    if (!appointments?.length) return [];
    return appointments.filter((rdv) => rdv.pro_id === profileForm?.id);
  }, [appointments, profileForm?.id]);

  const memoizedCalendarHeader = useMemo(
    () => (
      <CalendarHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        interval={interval}
        setInterval={setInterval}
        startHour={startHour}
        setStartHour={setStartHour}
        endHour={endHour}
        setEndHour={setEndHour}
        profileForm={profileForm}
        onReloadCalendar={handleReloadCalendar}
      />
    ),
    [
      selectedDate,
      interval,
      startHour,
      endHour,
      profileForm,
      handleReloadCalendar,
    ]
  );

  // Effets
  useEffect(() => {
    if (profileForm?.intervalle_creneau)
      setInterval(Number(profileForm.intervalle_creneau));
    if (profileForm?.ouverture) setStartHour(profileForm.ouverture);
    if (profileForm?.fermeture) setEndHour(profileForm.fermeture);
  }, [
    profileForm?.intervalle_creneau,
    profileForm?.ouverture,
    profileForm?.fermeture,
  ]);

  useEffect(() => {
    if (!profileForm?.user_id) return;

    let isMounted = true;

    async function initProfileData() {
      // APRÈS: Utilisation de getUser()
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!isMounted) return;

      if (user?.email) {
        setUserEmail(user.email);
      }
    }

    initProfileData();

    return () => {
      isMounted = false;
    };
  }, [profileForm?.user_id]);

  // Vérifications après les hooks
  if (initialProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
      </div>
    );
  }

  if (!profileForm?.id && !profileForm?.user_id) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] text-red-600">
        Erreur de chargement du profil
      </div>
    );
  }

  // --- Nouvelle logique d'affichage central selon la sidebar ---
  let mainContent = null;
  if (activeTab === "overview") {
    mainContent = (
      <Overview proId={profileForm.id || profileForm.user_id || ""} />
    );
  } else if (activeTab === "calendar") {
    mainContent = (
      <>
        {memoizedCalendarHeader}
        <CalendarGrid
          key={calendarReloadKey}
          appointments={filteredAppointments}
          selectedDate={selectedDate}
          interval={interval}
          startHour={startHour}
          endHour={endHour}
          onSelectAppointment={handleAppointmentSelect}
          loading={loading}
          proId={profileForm.id}
        />
        {/* Affiche le panneau latéral si un RDV est sélectionné */}
        {selectedRdv && (
          <AppointmentDetailsPanel
            rdv={selectedRdv}
            onClose={() => setSelectedRdv(null)}
            userEmail={userEmail}
          />
        )}
      </>
    );
  } else if (activeTab === "settings") {
    mainContent = (
      <SettingsTabs
        proProfile={profileForm}
        onProfileChange={(field, value) => {
          console.log("[DashboardPage] onProfileChange", field, value);
          handleProfileChange(
            field as keyof Profile,
            value as Profile[keyof Profile]
          );
        }}
        onSave={async (profileFormToSave: Profile) => {
          const success = await handleSaveProfile(profileFormToSave);
          return success;
        }}
        saving={initialProfileLoading ?? false}
      />
    );
  }

  return (
    <DashboardLayout
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
      activeTab={activeTab}
      setActiveTab={(tab) =>
        setActiveTab(tab as "overview" | "calendar" | "settings")
      }
      appointments={filteredAppointments}
      proProfile={profileForm}
      onReloadCalendar={handleReloadCalendar}
    >
      {initialProfileLoading && (
        <div className="flex justify-center items-center h-full">
          <span>Chargement du profil...</span>
        </div>
      )}
      {mainContent}
    </DashboardLayout>
  );
};

export default DashboardPage;
