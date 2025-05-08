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
import { lazy, Suspense, useState } from "react";
import type { Appointment } from "./DashboardPage";
import type { Profile } from "@/app/types/Profile";

interface DashboardLayoutProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeTab: "overview" | "calendar" | "settings" | undefined;
  setActiveTab: (tab: "overview" | "calendar" | "settings" | undefined) => void;
  children: React.ReactNode;
  appointments?: Appointment[];
  proProfile?: Profile;
  onReloadCalendar?: () => void;
}

const Sidebar = lazy(() => import("./Sidebar/Sidebar"));

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  setActiveTab,
  children,
  appointments,
  proProfile,
  onReloadCalendar,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handler pour mobile : ferme la sidebar quand on clique sur un onglet
  const handleSetActiveTab = (
    tab: "overview" | "calendar" | "settings" | undefined
  ) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#fdf3df] relative">
      {/* Sidebar */}
      {/* Hamburger bouton mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow-md border border-[#ded9cb] focus:outline-none"
        onClick={() => setSidebarOpen(true)}
        aria-label="Ouvrir le menu"
        type="button"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <rect x="4" y="6" width="16" height="2" rx="1" fill="#222" />
          <rect x="4" y="11" width="16" height="2" rx="1" fill="#222" />
          <rect x="4" y="16" width="16" height="2" rx="1" fill="#222" />
        </svg>
      </button>

      {/* Sidebar mobile (overlay) */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Sidebar */}
          <div className="fixed top-0 left-0 z-50 h-full w-[270px] bg-[#fdf6e3] shadow-xl border-r border-[#23283a] transition-transform duration-300 md:hidden">
            <Suspense fallback={<div>Chargement...</div>}>
              <Sidebar
                active={activeTab}
                setActiveTab={handleSetActiveTab}
                appointments={appointments}
                proProfile={proProfile}
                onReloadCalendar={onReloadCalendar}
              />
            </Suspense>
          </div>
        </>
      )}

      {/* Sidebar desktop */}
      <Suspense fallback={<div>Chargement...</div>}>
        <div className="hidden md:flex">
          <Sidebar
            active={activeTab}
            setActiveTab={setActiveTab}
            appointments={appointments}
            proProfile={proProfile}
            onReloadCalendar={onReloadCalendar}
          />
        </div>
      </Suspense>
      {/* Main content */}
      <main className="flex-1 w-full min-w-0 h-screen flex flex-col">
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0 px-0 md:pl-0">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
