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
import React, { useState, useEffect } from "react";
import type { Profile } from "@/app/types/Profile";
import { useMediaQuery } from "react-responsive";
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
  setProfileForm: (form: Profile) => void;
  handleUpdateProfile: (profile: Profile) => void;
  profileLoading?: boolean;
  proId: string;
}

// Hook personnalisé pour la gestion des rendez-vous
function useAppointments(profileForm: Profile, days: string[]) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchAppointments() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          days: days.join(","),
          pro_id: profileForm.id || "",
        });
        const res = await fetch(`/api/rendezvous?${params.toString()}`);
        const fetched: Appointment[] = res.ok ? await res.json() : [];
        if (isMounted) setAppointments(fetched);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchAppointments();
    return () => {
      isMounted = false;
    };
  }, [profileForm.id, days]);

  return { appointments, loading };
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  profileForm,
  setProfileForm,
  profileLoading: initialProfileLoading,
}) => {
  const [selectedRdv, setSelectedRdv] = useState<Appointment | null>(null);

  const [selectedDate, setSelectedDate] = useState(new Date()); // <<--- AJOUT

  const currentDate = new Date();
  const view: "week" | "day" = "week";

  // Sidebar navigation state
  const [activeTab, setActiveTab] = useState<
    "overview" | "calendar" | "settings"
  >("calendar");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Responsive : collapse auto sur mobile
  const isMobile = useMediaQuery({ maxWidth: 768 });
  useEffect(() => {
    setSidebarCollapsed(isMobile);
  }, [isMobile]);

  // --- Helpers pour la comparaison de dates (format AAAA-MM-JJ) ---
  function isSameDay(dateStr1: string, dateStr2: string) {
    return dateStr1 === dateStr2;
  }

  // Génère une liste de 7 jours consécutifs à partir de la date sélectionnée (pour la semaine affichée)
  function getNextDays(startDate: Date, n: number): string[] {
    const days: string[] = [];
    const d = new Date(startDate);
    for (let i = 0; i < n; i++) {
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, "0");
      const da = d.getDate().toString().padStart(2, "0");
      days.push(`${y}-${m}-${da}`);
      d.setDate(d.getDate() + 1);
    }
    return days;
  }

  // Correction : calculer les jours de la semaine à partir de la date sélectionnée
  const days = React.useMemo(
    () => getNextDays(selectedDate, 7),
    [selectedDate]
  ); // 7 jours à partir de la date sélectionnée
  const todayStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;

  const [calendarReloadKey, setCalendarReloadKey] = useState(0);
  const { appointments, loading } = useAppointments(profileForm, days);

  function handleReloadCalendar() {
    setCalendarReloadKey((k) => k + 1);
  }

  // Liste des heures à afficher
  const [interval, setInterval] = useState(() => {
    if (profileForm.intervalle_creneau)
      return Number(profileForm.intervalle_creneau);
    return 30;
  });
  const [startHour, setStartHour] = useState(
    () => profileForm.ouverture || "06:00"
  );
  const [endHour, setEndHour] = useState(
    () => profileForm.fermeture || "20:00"
  );

  useEffect(() => {
    if (profileForm.intervalle_creneau)
      setInterval(Number(profileForm.intervalle_creneau));
    if (profileForm.ouverture) setStartHour(profileForm.ouverture);
    if (profileForm.fermeture) setEndHour(profileForm.fermeture);
  }, [
    profileForm.intervalle_creneau,
    profileForm.ouverture,
    profileForm.fermeture,
  ]);

  // Filtrage des rendez-vous selon la vue (jour/semaine) et la date sélectionnée
  const filteredAppointments: Appointment[] = appointments.filter((rdv) => {
    if (!rdv.date_jour) return false;
    if (view === "week") {
      // Affiche tous les RDV de la semaine affichée
      return days.includes(rdv.date_jour);
    } else {
      // Affiche les RDV du jour sélectionné
      return isSameDay(rdv.date_jour, todayStr);
    }
  });

  // Ajoute le state profileLoading pour gérer l'état de chargement du profil
  const [profileLoading, setProfileLoading] = useState(initialProfileLoading);

  // Synchronise l'email du profil avec celui du user connecté (Supabase)
  useEffect(() => {
    async function syncProfileEmail() {
      if (!profileForm || !profileForm.user_id) return;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && user.email && profileForm.user_id === user.id) {
        // adresse_mail supprimé du PATCH (plus de colonne dans la table)
        // await supabase
        //   .from("profiles")
        //   .update({ adresse_mail: user.email })
        //   .eq("user_id", user.id);
      }
    }
    syncProfileEmail();
  }, [profileForm]);

  // Ajoute la récupération de l'email du user pour le passer à AppointmentDetailsPanel
  const [userEmail, setUserEmail] = useState<string>("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.email) setUserEmail(user.email);
    });
  }, []);

  // Correction du scope : déclare isLoading AVANT le return pour qu'il soit visible partout
  const isLoading = Boolean(profileLoading);

  // Correction de setProfileForm pour respecter le type attendu (Profile)
  function handleProfileChange(
    field: keyof Profile | "full",
    value: Profile[keyof Profile] | Partial<Profile>
  ) {
    if (field === "full" && typeof value === "object") {
      setProfileForm({ ...(value as Profile) });
    } else {
      setProfileForm({ ...profileForm, [field]: value });
    }
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
        <CalendarGrid
          key={calendarReloadKey}
          appointments={filteredAppointments}
          selectedDate={selectedDate}
          interval={interval}
          startHour={startHour}
          endHour={endHour}
          onSelectAppointment={setSelectedRdv}
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
          setProfileLoading(true);
          const { error } = await supabase
            .from("profiles")
            .update(profileFormToSave)
            .eq("user_id", profileFormToSave.user_id);
          if (!error) {
            console.log(
              "[DashboardPage] setProfileForm (after save)",
              profileFormToSave
            );
            setProfileForm({ ...profileFormToSave }); // force une nouvelle référence pour déclencher le rerender
          }
          setProfileLoading(false);
          return !error;
        }}
        saving={isLoading}
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
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <span>Chargement du profil...</span>
        </div>
      )}
      {mainContent}
    </DashboardLayout>
  );
};

export default DashboardPage;
