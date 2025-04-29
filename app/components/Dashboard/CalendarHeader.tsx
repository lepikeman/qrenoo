/**
 * CalendarHeader.tsx
 *
 * En-tête du calendrier du dashboard, avec navigation (semaine/jour) et actions.
 *
 * Props :
 *   - selectedDate: Date actuellement sélectionnée
 *   - setSelectedDate: Fonction pour mettre à jour la date sélectionnée
 *   - interval: Intervalle des créneaux
 *   - setInterval: Fonction pour mettre à jour l'intervalle des créneaux
 *   - startHour: Heure de début
 *   - setStartHour: Fonction pour mettre à jour l'heure de début
 *   - endHour: Heure de fin
 *   - setEndHour: Fonction pour mettre à jour l'heure de fin
 *   - onReloadCalendar: Fonction pour recharger le calendrier
 *
 * Affiche les contrôles de navigation du calendrier et les actions principales.
 */

import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import AddEventModal from "./AddEventModal";
import type { Appointment } from "./DashboardPage"; // Uncomment if not already imported

// Petit calendrier inline (custom minimal)
function SimpleCalendar({
  selected,
  onSelect,
  onClose,
}: {
  selected: Date;
  onSelect: (d: Date) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [internalDate, setInternalDate] = useState(selected);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Génère le mois courant
  const month = internalDate.getMonth();
  const year = internalDate.getFullYear();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  const startWeekDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Lundi = 0

  // Navigation mois
  function handlePrevMonth() {
    setInternalDate(new Date(year, month - 1, 1));
  }
  function handleNextMonth() {
    setInternalDate(new Date(year, month + 1, 1));
  }

  return (
    <div
      ref={ref}
      className="absolute left-0 top-[110%] z-50 bg-white border border-[#ded9cb] rounded-lg shadow-lg p-3 select-none max-w-xs min-w-[220px]"
      style={{ minWidth: 220 }}
    >
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={handlePrevMonth}
          className="p-1 text-gray-500 hover:bg-[#fdf3df] rounded-full"
          aria-label="Mois précédent"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M15 18l-6-6 6-6"
              stroke="#888"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="font-semibold text-sm">
          {format(internalDate, "MMMM yyyy", { locale: fr })}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-1 text-gray-500 hover:bg-[#fdf3df] rounded-full"
          aria-label="Mois suivant"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M9 6l6 6-6 6"
              stroke="#888"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs text-center mb-1">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={d + i} className="font-semibold text-gray-500">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(startWeekDay)
          .fill(null)
          .map((_, i) => (
            <div key={"empty-" + i}></div>
          ))}
        {days.map((d) => (
          <button
            key={d.toISOString()}
            className={`rounded-full w-7 h-7 flex items-center justify-center ${d.toDateString() === selected.toDateString() ? "bg-[#1c3917] text-white" : "hover:bg-[#fdf3df]"}`}
            onClick={() => {
              onSelect(d);
              onClose();
            }}
          >
            {d.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}

// Nouveau composant FilterPopover
function FilterPopover({
  interval,
  onIntervalChange,
  startHour,
  onStartHourChange,
  endHour,
  onEndHourChange,
  onClose,
}: {
  interval: number;
  onIntervalChange: (n: number) => void;
  startHour: string;
  onStartHourChange: (s: string) => void;
  endHour: string;
  onEndHourChange: (s: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Liste des intervalles disponibles
  const intervals = [30, 60];

  const hours = Array.from({ length: 24 }, (_, i) => i).map(
    (h) => h.toString().padStart(2, "0") + ":00"
  );
  return (
    <div
      ref={ref}
      className="absolute top-12 right-0 z-50 bg-white border border-[#ded9cb] rounded-xl shadow-lg p-4 min-w-[220px]"
    >
      <div className="mb-3">
        <label className="block text-xs font-semibold text-[#888] mb-1">
          Intervalle
        </label>
        <div className="flex gap-2">
          {intervals.map((val) => (
            <button
              key={val}
              className={`px-3 py-1 rounded-full border ${interval === val ? "bg-[#1c3917] text-white border-[#1c3917]" : "bg-white text-[#222] border-[#ded9cb]"}`}
              onClick={() => onIntervalChange(val)}
            >
              {val === 30 ? "30 min" : val === 60 ? "1h" : val + " min"}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-semibold text-[#888] mb-1">
          Heure de début
        </label>
        <select
          className="w-full border border-[#ded9cb] rounded px-2 py-1"
          value={startHour}
          onChange={(e) => onStartHourChange(e.target.value)}
        >
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-semibold text-[#888] mb-1">
          Heure de fin
        </label>
        <select
          className="w-full border border-[#ded9cb] rounded px-2 py-1"
          value={endHour}
          onChange={(e) => onEndHourChange(e.target.value)}
        >
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        <button
          className="px-4 py-1 rounded-full bg-[#1c3917] text-white font-medium"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

interface CalendarHeaderProps {
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  interval: number;
  setInterval: (n: number) => void;
  startHour: string;
  setStartHour: (s: string) => void;
  endHour: string;
  setEndHour: (s: string) => void;
  profileForm: import("@/app/types/Profile").Profile;
  onReloadCalendar: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedDate,
  setSelectedDate,
  interval,
  setInterval,
  startHour,
  setStartHour,
  endHour,
  setEndHour,
  profileForm,
  onReloadCalendar,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Fermer calendrier si scroll (évite débordement)
  useEffect(() => {
    if (!calendarOpen) return;
    function handleScroll() {
      setCalendarOpen(false);
    }
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [calendarOpen]);

  // Placeholder: replace with real save logic
  async function handleAddEventSave(
    event: Omit<Appointment, "id" | "is_validated"> & { client_email: string }
  ) {
    setAppointments((prev) => [
      ...prev,
      {
        ...event,
        id: Math.random().toString(),
        is_validated: false,
      } as Appointment,
    ]);
  }

  return (
    <header
      className="calendar-header sticky top-0 z-30 flex items-center justify-between w-full bg-[#FDF3DF] border-b border-[#ded9cb] px-8 py-8 min-h-[56px] h-[70px] shadow-sm"
      style={{ height: 56, minHeight: 56 }}
    >
      {/* Bloc gauche : date picker */}
      <div className="flex items-center gap-5 relative">
        <button
          className="bg-white border border-[#ded9cb] rounded-full px-6 py-2 text-[16px] font-medium shadow-[0_1px_4px_0_rgba(0,0,0,0.05)] flex items-center gap-2 min-w-[130px] h-[38px] focus:outline-none focus:ring-2 focus:ring-[#ded9cb]"
          onClick={() => setCalendarOpen((v) => !v)}
        >
          {format(selectedDate, "dd MMM yy", { locale: fr })}
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path
              d="M6 9l6 6 6-6"
              stroke="#444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {calendarOpen && (
          <SimpleCalendar
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
            onClose={() => setCalendarOpen(false)}
          />
        )}
        {/* Bouton de rafraîchissement du calendrier */}
        <button
          className="ml-2 flex items-center gap-1 border border-[#ded9cb] bg-white text-[#1c3917] rounded-full px-3 py-2 font-medium shadow-[0_1px_4px_0_rgba(0,0,0,0.05)] hover:bg-[#e9f4e3] transition h-[38px] focus:outline-none"
          title="Rafraîchir le calendrier"
          onClick={onReloadCalendar}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path
              d="M4 4v5h.582M20 20v-5h-.581"
              stroke="#1c3917"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.003 9A9 9 0 1 1 12 21a8.96 8.96 0 0 1-6.418-2.648"
              stroke="#1c3917"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Rafraîchir
        </button>
      </div>
      {/* Bloc droit : filter + add event */}
      <div className="flex items-center gap-3 relative">
        <button
          className="flex items-center gap-2 border border-[#ded9cb] bg-white text-[#222] rounded-full px-5 py-2 font-medium shadow-[0_1px_4px_0_rgba(0,0,0,0.05)] hover:bg-[#f3f3f3] transition h-[38px] focus:outline-none"
          onClick={() => setFilterOpen((v) => !v)}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M4 6h16M6 12h12M10 18h4"
              stroke="#222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Filter
        </button>
        {filterOpen && (
          <FilterPopover
            interval={interval}
            onIntervalChange={setInterval}
            startHour={startHour}
            onStartHourChange={setStartHour}
            endHour={endHour}
            onEndHourChange={setEndHour}
            onClose={() => setFilterOpen(false)}
          />
        )}
        <button
          className="flex items-center gap-2 bg-[#1c3917] text-white rounded-full px-6 py-2 font-medium shadow-[0_1px_4px_0_rgba(0,0,0,0.09)] hover:bg-[#20491a] transition h-[38px] focus:outline-none"
          onClick={() => setAddEventOpen(true)}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
            <path
              d="M12 8v8M8 12h8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add Event
        </button>
        <AddEventModal
          open={addEventOpen}
          onClose={() => setAddEventOpen(false)}
          onSave={handleAddEventSave}
          selectedDate={selectedDate}
          existingAppointments={appointments}
          ouverture={startHour}
          fermeture={endHour}
          intervalle_creneau={interval}
          proId={profileForm?.id || profileForm?.user_id || profileForm?.pro_id}
        />
      </div>
    </header>
  );
};

export default CalendarHeader;
