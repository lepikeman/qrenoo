"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

interface HorairesJour {
  ouverture?: string;
  fermeture?: string;
  intervalle_creneau?: string | number;
}
type HorairesJours = {
  [key: string]: HorairesJour | null;
};

interface ReservationProps {
  proId?: string;
  horaires_jours?: HorairesJours;
  intervalle_creneau?: string | number;
}

function getWeekDays(startDate: Date) {
  // Retourne un tableau de 7 dates (lundi à dimanche) à partir de startDate
  const start = new Date(startDate);
  const day = start.getDay();
  // 0 = dimanche, 1 = lundi...
  const monday = new Date(start);
  monday.setDate(start.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function Reservation({
  proId,
  horaires_jours,
  intervalle_creneau,
}: ReservationProps) {
  const pro_id = proId;
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [busyTimes, setBusyTimes] = useState<
    Record<string, { heure: string; is_validated: boolean }[]>
  >({});
  const [modalOpen, setModalOpen] = useState(false);
  const [weekStart, setWeekStart] = useState(new Date());

  // Onglet jour sélectionné (index dans la semaine)
  const [selectedDayIdx, setSelectedDayIdx] = useState(
    (new Date().getDay() + 6) % 7
  );
  const [visibleDayIdx, setVisibleDayIdx] = useState(0); // index du premier jour affiché
  const daysPerPage = 3;
  const weekDays = getWeekDays(weekStart);
  const visibleDays = weekDays.slice(
    visibleDayIdx,
    visibleDayIdx + daysPerPage
  );
  const selectedDay = weekDays[selectedDayIdx];
  const selectedDayStr = selectedDay.toISOString().slice(0, 10);

  // --- NOUVELLE LOGIQUE : horaires dynamiques par jour ---
  // Récupère le nom du jour (lundi, mardi, ...)
  const jours = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];
  const dayKey = jours[selectedDay.getDay()];
  const horairesJour = horaires_jours?.[dayKey];

  let ouvertureValue = "09:00";
  let fermetureValue = "18:00";
  let intervalle = Number(intervalle_creneau) || 30;
  if (horairesJour && horairesJour.ouverture && horairesJour.fermeture) {
    ouvertureValue = horairesJour.ouverture;
    fermetureValue = horairesJour.fermeture;
    intervalle = Number(horairesJour.intervalle_creneau) || intervalle;
  } else if (horairesJour === null) {
    // Jour fermé
    ouvertureValue = "";
    fermetureValue = "";
    intervalle = 0;
  }

  function generateSlots(
    ouverture: string,
    fermeture: string,
    intervalle: number
  ) {
    if (!ouverture || !fermeture || !intervalle) return [];
    const [hStart, mStart] = ouverture.split(":").map(Number);
    const [hEnd, mEnd] = fermeture.split(":").map(Number);
    const startMins = hStart * 60 + mStart;
    const endMins = hEnd * 60 + mEnd;
    const slots: string[] = [];
    for (let mins = startMins; mins <= endMins; mins += intervalle) {
      const hh = Math.floor(mins / 60)
        .toString()
        .padStart(2, "0");
      const mm = (mins % 60).toString().padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
    return slots;
  }

  const dynamicSlots = generateSlots(
    ouvertureValue,
    fermetureValue,
    intervalle
  );

  // Regroupe les créneaux en matin, après-midi, soir
  function groupSlots(slots: string[]) {
    const matin: string[] = [];
    const apresmidi: string[] = [];
    const soir: string[] = [];
    slots.forEach((time) => {
      const [h, m] = time.split(":").map(Number);
      const total = h * 60 + m;
      if (total < 12 * 60) {
        matin.push(time);
      } else if (total < 18 * 60) {
        apresmidi.push(time);
      } else {
        soir.push(time);
      }
    });
    return [
      { label: "Matin", hours: matin },
      { label: "Après-midi", hours: apresmidi },
      { label: "Soir", hours: soir },
    ];
  }

  const groupedSlots = groupSlots(dynamicSlots);

  // Navigation semaines
  const handlePrevWeek = () => {
    setWeekStart(new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000));
    setVisibleDayIdx(0);
    setSelectedDayIdx(0);
  };
  const handleNextWeek = () => {
    setWeekStart(new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000));
    setVisibleDayIdx(0);
    setSelectedDayIdx(0);
  };

  // Navigation jours (pagination)
  const handlePrevDays = () => {
    setVisibleDayIdx(Math.max(0, visibleDayIdx - 1));
  };
  const handleNextDays = () => {
    setVisibleDayIdx(
      Math.min(weekDays.length - daysPerPage, visibleDayIdx + 1)
    );
  };

  // Récupère les créneaux pris de toute la semaine affichée
  useEffect(() => {
    if (!pro_id) return;
    const weekDaysStr = getWeekDays(weekStart).map((d) =>
      d.toISOString().slice(0, 10)
    );
    supabase
      .from("rendezvous")
      .select("date_jour, heure, is_validated")
      .eq("pro_id", pro_id)
      .in("date_jour", weekDaysStr)
      .then(({ data, error }) => {
        if (!error && data) {
          const map: Record<
            string,
            { heure: string; is_validated: boolean }[]
          > = {};
          data.forEach(
            (rdv: {
              date_jour: string;
              heure: string;
              is_validated: boolean;
            }) => {
              if (!map[rdv.date_jour]) map[rdv.date_jour] = [];
              map[rdv.date_jour].push({
                heure: rdv.heure?.slice(0, 5),
                is_validated: rdv.is_validated,
              });
            }
          );
          setBusyTimes(map);
        } else {
          setBusyTimes({});
        }
      });
  }, [weekStart, pro_id]);

  const handleSlotClick = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setModalOpen(true);
  };

  // Ajoute un state contrôlé pour le téléphone formaté
  const [phoneInput, setPhoneInput] = useState("");

  // Fonction de formatage téléphone xx xx xx xx xx
  function formatPhoneInput(value: string) {
    // Retire tout sauf les chiffres
    const digits = value.replace(/\D/g, "").slice(0, 10);
    // Coupe en groupes de 2
    const formatted = digits.replace(/(\d{2})(?=\d)/g, "$1 ");
    return formatted;
  }

  // Ajoute un state pour l'étape de validation et l'id du RDV créé
  const [validationStep, setValidationStep] = useState<"form" | "code">("form");
  const [createdRdvId, setCreatedRdvId] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      client_nom: formData.get("name"),
      client_email: formData.get("email"),
      // Nettoie les espaces pour l'envoi à la BDD
      client_phone: phoneInput.replace(/\D/g, ""),
      date_jour: selectedDate,
      heure: selectedTime,
      message: formData.get("message"),
      pro_id,
    };
    if (!pro_id) {
      alert(
        "Erreur : Identifiant du professionnel (pro_id) manquant. Impossible d'enregistrer le rendez-vous."
      );
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert("Veuillez sélectionner un créneau dans le calendrier.");
      return;
    }
    if (!/^\d{10}$/.test(phoneInput.replace(/\D/g, ""))) {
      alert("Le numéro de téléphone doit contenir exactement 10 chiffres.");
      return;
    }
    const res = await fetch("/api/rendezvous", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok && result.rdv_id) {
      setCreatedRdvId(result.rdv_id);
      setValidationStep("code");
      // On ne ferme pas le modal, on passe à l'étape code
    } else {
      alert("Erreur lors de l'enregistrement du rendez-vous.");
    }
  };

  // Nouvelle fonction pour valider le code reçu par email
  const handleCodeValidation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCodeError("");
    if (!createdRdvId) return;
    const res = await fetch("/api/verify-rdv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rdv_id: createdRdvId, code: codeInput }),
    });
    if (res.ok) {
      alert("Rendez-vous confirmé ! Merci.");
      setPhoneInput("");
      setCodeInput("");
      setModalOpen(false);
      setValidationStep("form");
      setCreatedRdvId(null);
    } else {
      setCodeError("Code invalide. Vérifiez l'email reçu ou réessayez.");
    }
  };

  return (
    <div className="w-full max-w-vh">
      <h1>Réserver un créneau</h1>
      <div>
        {/* Navigation semaine */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevWeek}
            className="text-[#6e7b4d] font-bold px-2 py-1 rounded hover:bg-[#f6f8f2] text-xs md:text-base"
          >
            &lt; Semaine précédente
          </button>
          <span className="font-semibold text-[#29381a] text-xs md:text-base">
            Semaine du {weekDays[0].toLocaleDateString()} au{" "}
            {weekDays[6].toLocaleDateString()}
          </span>
          <button
            onClick={handleNextWeek}
            className="text-[#6e7b4d] font-bold px-2 py-1 rounded hover:bg-[#f6f8f2] text-xs md:text-base"
          >
            Semaine suivante &gt;
          </button>
        </div>
        {/* Onglets jours visibles (max 3) */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          <button
            onClick={handlePrevDays}
            disabled={visibleDayIdx === 0}
            className="rounded-full px-2 py-1 text-[#6e7b4d] hover:bg-[#f6f8f2] disabled:opacity-50 text-xs md:text-base"
          >
            &lt;
          </button>
          {visibleDays.map((day, idx) => {
            const globalIdx = visibleDayIdx + idx;
            return (
              <button
                key={globalIdx}
                onClick={() => setSelectedDayIdx(globalIdx)}
                className={`px-3 md:px-4 py-2 rounded-xl font-semibold transition border-2 text-xs md:text-base ${selectedDayIdx === globalIdx ? "bg-[#e5e9e0] border-[#6e7b4d] text-[#29381a]" : "bg-[#f6f8f2] border-transparent text-[#6e7b4d]"} hover:bg-[#e5e9e0]`}
              >
                {day.toLocaleDateString("fr-FR", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </button>
            );
          })}
          <button
            onClick={handleNextDays}
            disabled={visibleDayIdx >= weekDays.length - daysPerPage}
            className="rounded-full px-2 py-1 text-[#6e7b4d] hover:bg-[#f6f8f2] disabled:opacity-50 text-xs md:text-base"
          >
            &gt;
          </button>
        </div>
        {/* Créneaux façon drive */}
        <div className="flex flex-col gap-4 mb-4">
          {groupedSlots.map(
            (period) =>
              period.hours.length > 0 && (
                <div key={period.label}>
                  <div className="font-bold text-[#405c26] mb-2 text-xs md:text-base">
                    {period.label}
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-3 md:grid-cols-6">
                    {period.hours.map((time) => {
                      const isBusy = !!busyTimes[selectedDayStr]?.find(
                        (slot) => slot.heure === time
                      );
                      const isSelected =
                        selectedTime === time &&
                        selectedDate === selectedDayStr;
                      return (
                        <button
                          key={time}
                          disabled={isBusy}
                          onClick={() =>
                            !isBusy && handleSlotClick(selectedDayStr, time)
                          }
                          className={`flex flex-col items-center justify-center rounded-xl px-0 py-2 border-2 shadow-sm transition font-semibold text-xs md:text-base
                          ${
                            isBusy
                              ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
                              : isSelected
                                ? "bg-[#6e7b4d] border-[#405c26] text-white scale-105"
                                : "bg-white border-[#e5e9e0] text-[#29381a] hover:bg-[#f6f8f2] hover:border-[#6e7b4d]"
                          }
                        `}
                        >
                          <span>{time}</span>
                          {isBusy ? (
                            <FiXCircle className="mt-1 text-lg" />
                          ) : isSelected ? (
                            <FiCheckCircle className="mt-1 text-lg" />
                          ) : (
                            <FiClock className="mt-1 text-lg opacity-30" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
          )}
        </div>
        {/* Légende */}
        <div className="flex items-center gap-4 md:gap-6 mb-6 justify-center text-xs md:text-sm flex-wrap">
          <div className="flex items-center gap-1 text-[#405c26]">
            <FiClock className="opacity-30" /> Disponible
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <FiXCircle /> Indisponible
          </div>
          <div className="flex items-center gap-1 text-[#6e7b4d]">
            <FiCheckCircle /> Sélectionné
          </div>
        </div>
        {/* Modal réservation */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 w-[50vw] h-screen min-w-[320px] relative animate-fadeIn flex flex-col justify-center overflow-y-auto">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setValidationStep("form");
                  setCreatedRdvId(null);
                  setCodeInput("");
                  setCodeError("");
                }}
                className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-[#6e7b4d]"
              >
                &times;
              </button>
              {validationStep === "form" ? (
                <>
                  <h2 className="text-base md:text-xl font-bold text-[#29381a] mb-4">
                    Réserver le{" "}
                    <span className="text-[#6e7b4d]">{selectedDate}</span> à{" "}
                    <span className="text-[#6e7b4d]">{selectedTime}</span>
                  </h2>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label className="font-semibold text-xs md:text-base">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Votre nom"
                      className="input input-bordered border-[#6e7b4d] rounded-lg text-xs md:text-base placeholder:text-[#6e7b4d]"
                    />
                    <label className="font-semibold text-xs md:text-base">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Votre email"
                      required
                      autoComplete="off"
                      className="input input-bordered border-[#6e7b4d] rounded-lg text-xs md:text-base placeholder:text-[#6e7b4d]"
                    />
                    <label className="font-semibold text-xs md:text-base">
                      Téléphone (recommandé)
                    </label>
                    <input
                      type="text"
                      name="phone"
                      required
                      inputMode="numeric"
                      maxLength={14}
                      value={phoneInput}
                      onChange={(e) =>
                        setPhoneInput(formatPhoneInput(e.target.value))
                      }
                      placeholder="06 12 34 56 78"
                      autoComplete="tel"
                      className="input input-bordered border-[#6e7b4d] rounded-lg text-xs md:text-base placeholder:text-[#6e7b4d]"
                    />
                    <label className="font-semibold text-xs md:text-base">
                      Demande particulière (optionnel)
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="Votre message"
                      className="textarea border-[#6e7b4d] rounded-lg text-xs md:text-base placeholder:text-[#6e7b4d]"
                    ></textarea>
                    <button
                      type="submit"
                      className="btn btn-primary bg-[#6e7b4d] hover:bg-[#405c26] text-white font-bold rounded-lg mt-2 text-xs md:text-base"
                    >
                      Envoyer la demande
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-base md:text-xl font-bold text-[#29381a] mb-4">
                    Entrez le code reçu par email
                  </h2>
                  <form
                    onSubmit={handleCodeValidation}
                    className="flex flex-col gap-3"
                  >
                    <input
                      type="text"
                      value={codeInput}
                      onChange={(e) =>
                        setCodeInput(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      maxLength={6}
                      inputMode="numeric"
                      required
                      className="input input-bordered border-[#6e7b4d] rounded-lg text-center text-xl tracking-widest placeholder:text-[#6e7b4d]"
                    />
                    {codeError && (
                      <div className="text-red-500 font-semibold text-center">
                        {codeError}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary bg-[#6e7b4d] hover:bg-[#405c26] text-white font-bold rounded-lg mt-2 text-xs md:text-base h-[40px] mx-auto"
                    >
                      Valider le code
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
