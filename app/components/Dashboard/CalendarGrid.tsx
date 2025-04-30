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

import React, { useRef, useEffect, useMemo } from "react";
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

const CalendarGrid: React.FC<CalendarGridProps> = ({
  appointments = [],
  onSelectAppointment,
  loading,
  selectedDate,
  interval,
  startHour,
  endHour,
  proId,
}) => {
  // Définir la hauteur des cellules AVANT tout usage
  const CELL_HEIGHT = interval === 60 ? 160 : 96;

  // Filtrage des rendez-vous par professionnel si proId fourni
  const filteredAppointments = useMemo(() => {
    if (!appointments || appointments.length === 0) return [];
    if (!proId) return [];
    return appointments.filter((rdv) => rdv.pro_id === proId);
  }, [appointments, proId]);

  // Génère dynamiquement les 7 jours à partir de selectedDate
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + i);
      // Format AAAA-MM-JJ pour compatibilité avec appointments et rendering
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, "0");
      const da = d.getDate().toString().padStart(2, "0");
      return `${y}-${m}-${da}`;
    });
  }, [selectedDate]);

  // Génère dynamiquement les horaires selon interval, startHour, endHour
  const dynamicHours = useMemo(() => {
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
  }, [interval, startHour, endHour]);

  // Helper pour parser "HH:mm" en minutes
  function parseHourToMinutes(h: string) {
    const [hh, mm] = h.split(":").map(Number);
    return hh * 60 + mm;
  }

  const nowDisplay = useMemo(() => {
    if (!dynamicHours.length)
      return {
        pos: 0,
        hourStr: "",
        idx: 0,
        percent: 0,
        todayISO: new Date().toISOString().slice(0, 10),
      };
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, "0");
    const mm = now.getMinutes().toString().padStart(2, "0");
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    const hourMinutes = dynamicHours.map((h) => {
      const [h1, m1] = h.split(":");
      return parseInt(h1) * 60 + parseInt(m1 || "0");
    });
    if (totalMinutes <= hourMinutes[0]) {
      return {
        pos: 0,
        hourStr: `${hh}:${mm}`,
        idx: 0,
        percent: 0,
        todayISO: now.toISOString().slice(0, 10),
      };
    }
    if (totalMinutes >= hourMinutes[hourMinutes.length - 1]) {
      return {
        pos: (hourMinutes.length - 1) * CELL_HEIGHT,
        hourStr: `${hh}:${mm}`,
        idx: hourMinutes.length - 1,
        percent: 1,
        todayISO: now.toISOString().slice(0, 10),
      };
    }
    let idx = 0;
    for (let i = 0; i < hourMinutes.length - 1; i++) {
      if (totalMinutes >= hourMinutes[i] && totalMinutes < hourMinutes[i + 1]) {
        idx = i;
        break;
      }
    }
    const minStart = hourMinutes[idx];
    const minEnd = hourMinutes[idx + 1];
    const percent = (totalMinutes - minStart) / (minEnd - minStart);
    const pos = idx * CELL_HEIGHT + percent * CELL_HEIGHT;
    return {
      pos,
      hourStr: `${hh}:${mm}`,
      idx,
      percent,
      todayISO: now.toISOString().slice(0, 10),
    };
  }, [CELL_HEIGHT, dynamicHours]);

  const scrollableRef = useRef<HTMLDivElement>(null);
  const currentHourRef = useRef<HTMLDivElement>(null);
  const joinedHours = dynamicHours.join(",");
  const joinedDays = weekDays.join(",");
  useEffect(() => {
    if (currentHourRef.current && scrollableRef.current) {
      scrollIntoView(currentHourRef.current, {
        behavior: "smooth",
        block: "center",
        scrollMode: "if-needed",
        boundary: scrollableRef.current,
      });
    }
  }, [nowDisplay.idx, joinedHours, joinedDays, filteredAppointments.length]);

  const [selectedDayIdx, setSelectedDayIdx] = React.useState(0);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const visibleDays = isMobile ? [weekDays[selectedDayIdx]] : weekDays;

  function handlePrevDay() {
    setSelectedDayIdx((idx) => Math.max(0, idx - 1));
  }
  function handleNextDay() {
    setSelectedDayIdx((idx) => Math.min(weekDays.length - 1, idx + 1));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a259ff]"></div>
        <span className="ml-4 text-[#a259ff] font-semibold">
          Chargement du calendrier…
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow border border-[#e6e2d6] p-0 relative">
      <div
        className="flex w-full relative overflow-y-auto"
        style={{ height: "calc(100vh - 56px - 32px)" }}
        ref={scrollableRef}
      >
        {/* Colonne heures sticky à gauche */}
        <div className="flex flex-col w-18 min-w-[60px] sticky left-0 z-20 bg-white border-r border-[#e6e2d6] rounded-bl-2xl">
          <div className="h-[60px] border-b border-[#e6e2d6] bg-white" />
          {dynamicHours.map((h, i) => (
            <div
              key={h}
              ref={i === nowDisplay.idx ? currentHourRef : undefined}
              className={`py-0 px-0 text-xs text-[#888] border-b border-[#e6e2d6] bg-white text-right pr-2 flex items-center justify-end${i === nowDisplay.idx ? " border-l-4 border-[#a259ff] bg-[#f8f5ff]" : ""}`}
              style={{
                position: "relative",
                minHeight: CELL_HEIGHT,
                height: CELL_HEIGHT,
              }}
            >
              <span
                className={`ml-auto ${i === nowDisplay.idx ? "text-[#a259ff] font-bold" : ""}`}
              >
                {h}
              </span>
              {i === nowDisplay.idx && (
                <span
                  className="ml-2 text-xs text-[#a259ff] font-bold bg-[#f8f5ff] px-2 py-1 rounded shadow"
                  style={{ minWidth: 40, textAlign: "right" }}
                >
                  {nowDisplay.hourStr}
                </span>
              )}
            </div>
          ))}
        </div>
        {/* Grille principale */}
        <div
          className={`
          w-full grid
          ${isMobile ? "grid-cols-1" : "grid-cols-7"}
          md:grid-cols-7
        `}
        >
          {visibleDays.map((day) => (
            <div key={day} className="flex flex-col flex-1">
              {/* Header de colonne : jour + date */}
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
              {/* Cellules horaires */}
              {dynamicHours.map((h, i) => (
                <div
                  key={h + i}
                  className="calendar-cell bg-white flex flex-col items-stretch justify-start p-0.5 border border-[#e6e2d6] relative"
                  style={{
                    minHeight: CELL_HEIGHT,
                    height: CELL_HEIGHT,
                    boxSizing: "border-box",
                  }}
                >
                  {filteredAppointments
                    .filter((rdv) => rdv.date_jour === day)
                    .filter((rdv) => {
                      const rdvMin = parseHourToMinutes(rdv.heure.slice(0, 5));
                      const cellMin = parseHourToMinutes(h);
                      return rdvMin >= cellMin && rdvMin < cellMin + interval;
                    })
                    .map((rdv) => {
                      const rdvMin = parseHourToMinutes(rdv.heure.slice(0, 5));
                      const cellMin = parseHourToMinutes(h);
                      const ratio = (rdvMin - cellMin) / interval;
                      const duration = 30;
                      const height = Math.max((duration / interval) * 100, 40);
                      return (
                        <div
                          key={rdv.id}
                          style={{
                            position: "absolute",
                            top: `${ratio * 100}%`,
                            left: 4,
                            right: 4,
                            height: `${height}%`,
                            zIndex: 2,
                          }}
                        >
                          <AppointmentCard
                            rdv={rdv}
                            onSelect={onSelectAppointment}
                          />
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          ))}
          {/* Flèches navigation mobile */}
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
    </div>
  );
};

export default CalendarGrid;
