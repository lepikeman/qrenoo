/**
 * DashboardLayout.tsx
 *
 * Ancien composant de layout du dashboard. Peut être remplacé par DashboardShell.
 *
 * Props :
 *   - sidebarCollapsed: état de la sidebar (ouverte/fermée)
 *   - setSidebarCollapsed: fonction pour modifier l'état de la sidebar
 *   - activeTab: onglet actif
 *   - setActiveTab: fonction pour changer d'onglet
 *   - children: contenu principal du dashboard
 *   - appointments: liste des rendez-vous (optionnel)
 *   - proProfile: profil professionnel (optionnel)
 *   - onReloadCalendar: fonction pour recharger le calendrier (optionnel)
 *
 * Affiche la structure principale du dashboard avec sidebar et contenu central.
 */
import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import type { Appointment } from "./DashboardPage";
import type { Profile } from "@/app/types/Profile"; // Corrige l'import du type Profile

interface DashboardLayoutProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeTab: "overview" | "calendar" | "settings" | undefined;
  setActiveTab: (tab: "overview" | "calendar" | "settings" | undefined) => void;
  children: React.ReactNode;
  appointments?: Appointment[]; // Ajout pour la Sidebar
  proProfile?: Profile; // Ajout de la prop proProfile
  onReloadCalendar?: () => void; // Ajoute la prop onReloadCalendar pour la Sidebar
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  setActiveTab,
  children,
  appointments,
  proProfile,
  onReloadCalendar,
}) => (
  <div className="flex h-screen bg-[#fdf3df]">
    <Sidebar
      active={activeTab}
      setActiveTab={setActiveTab}
      appointments={appointments} // Passage à Sidebar
      proProfile={proProfile}
      onReloadCalendar={onReloadCalendar}
    />
    <main className="flex-1 ml-[260px] h-screen px-0 pb-0 flex flex-col">
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {/* Le calendrier doit être passé ici comme children */}
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </div>
    </main>
  </div>
);

export default DashboardLayout;
