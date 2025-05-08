/**
 * CalendarGrid.tsx
 *
 * Grille principale du calendrier du dashboard, affiche les rendez-vous par jour/heure.
 *
 * Props :
 *   - appointments: tableau d'objets Appointment représentant les rendez-vous
 *   - selectedDate: objet Date représentant la date sélectionnée
 *   - interval: nombre représentant l'intervalle entre les heures
 *   - startHour: chaîne de caractères représentant l'heure de début
 *   - endHour: chaîne de caractères représentant l'heure de fin
 *   - onSelectAppointment: fonction optionnelle appelée lors de la sélection d'un rendez-vous
 *   - loading: booléen optionnel pour afficher un spinner de chargement
 *   - proId: identifiant du professionnel (optionnel)
 *
 * Affiche la structure du calendrier avec les créneaux horaires et les rendez-vous.
 */

import React, { useRef, useEffect, useMemo, memo, useCallback } from "react";
import type { Appointment } from "./DashboardPage";
import AppointmentCard from "./AppointmentCard"; // Import de AppointmentCard
import scrollIntoView from "scroll-into-view-if-needed";

interface CalendarGridProps {
  appointments: Appointment[];
  selectedDate: Date;
  interval: number;
  startHour: string;
  endHour: string;
  onSelectAppointment?: (rdv: Appointment) => void;
  loading?: boolean;
  proId?: string; // Identifiant du professionnel (doit être string comme pro_id dans Appointment)
}

function generateHours(
  startHour: string,
  endHour: string,
  interval: number
): string[] {
  const [startH, startM] = startHour.split(":").map(Number);
  const [endH, endM] = endHour.split(":").map(Number);
  const start = startH * 60 + startM;
  const end = endH * 60 + endM;
  const arr: string[] = [];
  for (let t = start; t <= end; t += interval) {
    const h = Math.floor(t / 60)
      .toString()
      .padStart(2, "0");
    const m = (t % 60).toString().padStart(2, "0");
    arr.push(`${h}:${m}`);
  }
  return arr;
}

// Modifie la fonction isInCurrentWeek
function isInCurrentWeek(date: string, selectedDate: Date): boolean {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(selectedDate);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return d >= startOfWeek && d <= endOfWeek;
}

const AppointmentSlot = memo(
  ({
    appointments,
    day,
    hour,
    onSelectAppointment,
    interval,
  }: {
    appointments: Appointment[];
    day: string;
    hour: string;
    onSelectAppointment?: (rdv: Appointment) => void;
    interval: number;
  }) => {
    const rdvsForSlot = appointments.filter((rdv) => {
      const matchDay = rdv.date_jour === day;
      const matchHour = rdv.heure.startsWith(hour);
      return matchDay && matchHour;
    });

    // Nouvelle logique pour la tranche d'intervalle
    const isCurrentTimeSlot = useMemo(() => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      if (day !== today) return false;

      const [slotH, slotM] = hour.split(":").map(Number);
      const slotStart = slotH * 60 + slotM;
      const slotEnd = slotStart + interval;
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      return nowMinutes >= slotStart && nowMinutes < slotEnd;
    }, [day, hour, interval]);

    return (
      <div
        className={`relative w-full h-full ${
          isCurrentTimeSlot ? "border-2 border-[#a259ff]" : ""
        }`}
      >
        {rdvsForSlot.map((rdv) => (
          <AppointmentCard
            key={rdv.id}
            rdv={rdv}
            onSelect={onSelectAppointment}
          />
        ))}
      </div>
    );
  }
);

AppointmentSlot.displayName = "AppointmentSlot";

const CalendarGrid: React.FC<CalendarGridProps> = ({
  appointments,
  onSelectAppointment,
  loading,
  selectedDate,
  interval,
  startHour,
  endHour,
  proId,
}) => {
  // 1. Déclare tous les hooks d'état en premier
  const [selectedDayIdx, setSelectedDayIdx] = React.useState(0);

  // 2. Refs ensuite
  const scrollableRef = useRef<HTMLDivElement>(null);
  const currentHourRef = useRef<HTMLDivElement>(null);

  // 3. Valeurs mémorisées
  const dynamicHours = useMemo(
    () => generateHours(startHour, endHour, interval),
    [startHour, endHour, interval]
  );

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + i);
      // Assure-toi que le format correspond à celui des rdv.date_jour
      return d.toISOString().split("T")[0];
    });
  }, [selectedDate]);

  // Modifie le filtrage des rendez-vous
  const filteredAppointments = useMemo(() => {
    if (!appointments?.length) return [];

    return appointments.filter(
      (rdv) =>
        isInCurrentWeek(rdv.date_jour, selectedDate) && rdv.pro_id === proId
    );
  }, [appointments, selectedDate, proId]);

  // Modifie la fonction getCurrentHourIndex
  const getCurrentHourIndex = useCallback(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return dynamicHours.findIndex((hour) => {
      const [h, m] = hour.split(":").map(Number);
      const timeInMinutes = h * 60 + m;
      return timeInMinutes >= currentTime;
    });
  }, [dynamicHours]);
  
  // 4. Effets
  useEffect(() => {
    if (!scrollableRef.current) return;

    // Ajoute un petit délai pour laisser le temps au composant de se monter
    const timeoutId = setTimeout(() => {
      const currentIndex = getCurrentHourIndex();
      if (currentIndex === -1) return;

      const cells = scrollableRef.current?.querySelectorAll(".calendar-cell");
      if (!cells) return;

      const targetCell = cells[Math.max(0, currentIndex - 2)]; // Scroll 2 cellules avant l'heure actuelle
      if (targetCell) {
        scrollIntoView(targetCell, {
          behavior: "smooth",
          block: "start",
          scrollMode: "if-needed",
          boundary: scrollableRef.current,
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [getCurrentHourIndex]);

  // 5. Computed values
  const CELL_HEIGHT = 160 * (interval / 60);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const visibleDays = isMobile ? [weekDays[selectedDayIdx]] : weekDays;

  // 6. Event handlers
  const handlePrevDay = useCallback(() => {
    setSelectedDayIdx((idx) => Math.max(0, idx - 1));
  }, []);

  const handleNextDay = useCallback(() => {
    setSelectedDayIdx((idx) => Math.min(weekDays.length - 1, idx + 1));
  }, [weekDays.length]);

  // 7. Guards conditions
  if (!proId) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="text-gray-500">Aucun profil sélectionné</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a259ff]" />
        <span className="ml-4 text-[#a259ff] font-semibold">
          Chargement du calendrier…
        </span>
      </div>
    );
  }

  // 8. Main render...
  return (
    <div className="w-full bg-white rounded-2xl shadow border border-[#e6e2d6] p-0 relative">
      <div
        className="flex w-full relative overflow-x-auto overflow-y-auto"
        style={{ height: "calc(100vh - 56px - 32px)" }}
        ref={scrollableRef}
      >
        <div className="flex flex-col w-18 min-w-[60px] sticky left-0 z-20 mt-[60px] bg-white border-r border-[#e6e2d6]">
          <div className="h-[60px] border-b border-[#e6e2d6] bg-white" />
          {dynamicHours.map((h, i) => (
            <div
              key={h}
              ref={i === 0 ? currentHourRef : undefined}
              className={`py-0 px-0 text-xs text-[#888] border-b border-[#e6e2d6] bg-white text-right pr-2 flex items-center justify-end`}
              style={{
                position: "relative",
                minHeight: CELL_HEIGHT,
                height: CELL_HEIGHT,
              }}
            >
              <span className="ml-auto">{h}</span>
            </div>
          ))}
        </div>
        <div className="relative flex-1">
          <div
            className={`
            w-full grid
            ${isMobile ? "grid-cols-1" : "grid-cols-7"}
            md:grid-cols-7
          `}
          >
            {visibleDays.map((day) => (
              <div key={day} className="flex flex-col flex-1">
                <div className="flex flex-col items-center justify-center h-[60px] border-b border-[#e6e2d6] bg-white sticky top-0 z-30">
                  <span className="text-xs font-semibold text-[#888]">
                    {(() => {
                      const dObj = new Date(day);
                      return dObj.toLocaleDateString("fr-FR", {
                        weekday: "long",
                      });
                    })()}
                  </span>
                  <span className="text-[15px] font-bold text-[#222]">
                    {(() => {
                      const [, m, d] = day.split("-");
                      return `${d}/${m}`;
                    })()}
                  </span>
                </div>
                <div className="flex-1 relative">
                  {dynamicHours.map((hour) => {
                    const now = new Date();
                    const isCurrentSlot =
                      day === now.toISOString().split("T")[0] &&
                      hour ===
                        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`.slice(
                          0,
                          5
                        );

                    return (
                      <div
                        key={hour}
                        className={`calendar-cell bg-white relative p-0 border ${
                          isCurrentSlot
                            ? "border-[#a259ff] border-2"
                            : "border-[#e6e2d6]"
                        }`}
                        style={{
                          minHeight: CELL_HEIGHT,
                          height: CELL_HEIGHT,
                          boxSizing: "border-box",
                        }}
                      >
                        <AppointmentSlot
                          appointments={filteredAppointments}
                          day={day}
                          hour={hour}
                          onSelectAppointment={onSelectAppointment}
                          interval={interval}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        {isMobile && (
          <>
            <button
              className="fixed left-2 top-1/2 -translate-y-1/2 z-50 bg-white/90 rounded-full p-1 shadow border border-[#ded9cb]"
              onClick={handlePrevDay}
              disabled={selectedDayIdx === 0}
              style={{ touchAction: "manipulation" }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="fixed right-2 top-1/2 -translate-y-1/2 z-50 bg-white/90 rounded-full p-1 shadow border border-[#ded9cb]"
              onClick={handleNextDay}
              disabled={selectedDayIdx === weekDays.length - 1}
              style={{ touchAction: "manipulation" }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarGrid;
