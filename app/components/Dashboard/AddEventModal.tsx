/**
 * AddEventModal.tsx
 *
 * Modal for adding a new event (appointment) in the dashboard calendar.
 * - Replaces "Add People" with inputs for "Add Email" and "Add Phone Number"
 * - Changes "Description" to "Message"
 * - Implements logic to save event, preventing double bookings
 */
import React, { useState, useEffect, useRef } from "react";
import type { Appointment } from "./DashboardPage";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Inline date selector styled like the filter popover
function DateSelector({
  value,
  onChange,
}: {
  value: Date;
  onChange: (d: Date) => void;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const month = value.getMonth();
  const year = value.getFullYear();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  const startWeekDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  function handlePrevMonth() {
    onChange(new Date(year, month - 1, 1));
  }
  function handleNextMonth() {
    onChange(new Date(year, month + 1, 1));
  }
  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-2 border border-[#ded9cb] bg-white text-[#222] rounded-full px-5 py-2 font-medium shadow-[0_1px_4px_0_rgba(0,0,0,0.05)] hover:bg-[#f3f3f3] transition h-[38px] focus:outline-none"
        onClick={() => setCalendarOpen((v) => !v)}
      >
        {format(value, "dd MMM yyyy", { locale: fr })}
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
        <div className="absolute left-0 top-[110%] z-50 bg-white border border-[#ded9cb] rounded-lg shadow-lg p-3 select-none max-w-xs min-w-[220px]">
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
              {format(value, "MMMM yyyy", { locale: fr })}
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
                className={`rounded-full w-7 h-7 flex items-center justify-center ${d.toDateString() === value.toDateString() ? "bg-[#1c3917] text-white" : "hover:bg-[#fdf3df]"}`}
                onClick={() => {
                  onChange(d);
                  setCalendarOpen(false);
                }}
              >
                {d.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    event: Omit<Appointment, "id" | "is_validated"> & { client_email: string }
  ) => Promise<void>;
  selectedDate: Date;
  existingAppointments: Appointment[];
  ouverture?: string;
  fermeture?: string;
  intervalle_creneau?: number;
  proId?: string;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  open,
  onClose,
  onSave,
  selectedDate,
  existingAppointments,
  ouverture = "08:00",
  fermeture = "18:00",
  intervalle_creneau = 30,
  proId,
}) => {
  const [client_nom, setClientNom] = useState("");
  const [client_email, setClientEmail] = useState("");
  const [client_phone, setClientPhone] = useState("");
  const [heure, setHeure] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState<Date>(selectedDate);
  const [duree] = useState(intervalle_creneau); // Default duration matches the slot interval

  // Correction bug date_jour : toujours en timezone locale (évite le décalage d'un jour)
  function formatDateLocal(date: Date) {
    // Renvoie YYYY-MM-DD en local, pas UTC
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Validation helpers
  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePhone(phone: string) {
    // Accepts 10 digits, allows spaces
    return /^\d{10}$/.test(phone.replace(/\D/g, ""));
  }

  // Generate slots using Reservation logic
  function generateSlots(): string[] {
    // Use opening hours & interval from props
    const [hStart, mStart] = ouverture.split(":").map(Number);
    const [hEnd, mEnd] = fermeture.split(":").map(Number);
    const start = hStart * 60 + mStart;
    const end = hEnd * 60 + mEnd;
    const interval = Number(intervalle_creneau) || 30;
    const slots: string[] = [];
    for (let m = start; m < end; m += interval) {
      const h = Math.floor(m / 60).toString().padStart(2, "0");
      const min = (m % 60).toString().padStart(2, "0");
      slots.push(`${h}:${min}`);
    }
    // Correction : filtre les RDV du jour avec la date locale
    const booked = existingAppointments
      .filter((a) => a.date_jour === formatDateLocal(date))
      .map((a) => a.heure);
    return slots.filter((s) => !booked.includes(s));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!client_nom || !heure) {
      setError("Le nom et l'heure sont requis.");
      return;
    }
    if (client_email && !validateEmail(client_email)) {
      setError("Email invalide.");
      return;
    }
    if (client_phone && !validatePhone(client_phone)) {
      setError("Le téléphone doit contenir 10 chiffres.");
      return;
    }
    if (!proId) {
      setError("Erreur technique : identifiant professionnel manquant.");
      return;
    }
    setSaving(true);
    try {
      const data = {
        date_jour: formatDateLocal(date), // Utilise la date locale !
        heure,
        client_nom,
        client_email,
        client_phone,
        message,
        pro_id: proId,
        duree: duree.toString(), // Convert number to string
        is_validated: true, // Validation directe
      };

      const res = await fetch("/api/rendezvous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Erreur lors de la sauvegarde.");
      }
      await onSave(data);
      onClose();
      setClientNom("");
      setClientEmail("");
      setClientPhone("");
      setHeure("");
      setMessage("");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || "Erreur lors de la sauvegarde.");
      } else {
        setError("Erreur lors de la sauvegarde.");
      }
    }
    setSaving(false);
  }

  // Gestion fermeture au clic extérieur + position sous CalendarHeader
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none bg-black/30"
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={ref}
        className="absolute left-1/2 -translate-x-1/2 top-[70px] bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs pointer-events-auto border border-[#ded9cb] animate-fade-in"
        style={{ minWidth: 340 }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-400 hover:text-gray-700"
          aria-label="Fermer"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-3">Ajouter un événement</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            Date
            <DateSelector value={date} onChange={setDate} />
          </label>
          <label className="flex flex-col gap-1">
            Nom
            <input
              type="text"
              value={client_nom}
              onChange={(e) => setClientNom(e.target.value)}
              className="border rounded px-2 py-1"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            Email
            <input
              type="email"
              value={client_email}
              onChange={(e) => setClientEmail(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </label>
          <label className="flex flex-col gap-1">
            Téléphone
            <input
              type="tel"
              value={client_phone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </label>
          <label className="flex flex-col gap-1">
            Heure
            <select
              value={heure}
              onChange={(e) => setHeure(e.target.value)}
              className="border rounded px-2 py-1"
              required
            >
              <option value="">Choisir une heure</option>
              {generateSlots().map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border rounded px-2 py-1"
              rows={2}
            />
          </label>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-[var(--primary)] text-white px-4 py-2 rounded mt-2"
            disabled={saving}
          >
            {saving ? "Ajout..." : "Ajouter l'événement"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
