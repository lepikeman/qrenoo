/**
 * AppointmentCard.tsx
 *
 * Composant d'affichage d'une carte de rendez-vous dans le dashboard.
 *
 * Props :
 *   - rdv (Appointment) : l'objet rendez-vous à afficher
 *   - onSelect (function) : fonction appelée lors d'un clic sur la carte
 *
 * Affiche les informations principales d'un rendez-vous.
 */
import React from "react";
import type { Appointment } from "./DashboardPage";

const AppointmentCard: React.FC<{ rdv: Appointment; onSelect?: (rdv: Appointment) => void }> = ({
  rdv,
  onSelect,
}) => {
  // Détection des états
  const isNotConfirmed = rdv.is_validated === false;
  const isValidated = rdv.is_validated === true;

  // Couleurs de bordure selon état
  let borderColor: string = "border-[#b6b1a3]";
  if (isNotConfirmed) borderColor = "border-red-500";
  else if (isValidated) borderColor = "border-[#3cb371]";
  if (rdv.selected) borderColor = "border-blue-500";

  return (
    <div
      className={`appointment-card bg-[#f6f8f2] border ${borderColor} rounded-lg px-2 py-1 mb-1 shadow-sm cursor-pointer flex flex-col items-start justify-between transition-all duration-200 h-full min-h-0`}
      onClick={() => onSelect && onSelect(rdv)}
    >
      <div className="font-semibold text-[15px] text-[#222] truncate w-full">
        {rdv.client_nom}
      </div>
      <div className="text-xs text-[#888]">{rdv.heure.slice(0,5)}</div>
      {rdv.message && (
        <div className="text-xs text-[#666] truncate w-full">{rdv.message}</div>
      )}
      {/* Boutons supprimés, tout est dans le panel latéral */}
    </div>
  );
};

export default AppointmentCard;
