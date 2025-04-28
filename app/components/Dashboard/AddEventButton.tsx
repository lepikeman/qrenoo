/**
 * AddEventButton.tsx
 *
 * Bouton pour ajouter un événement dans le dashboard.
 *
 * Props :
 *   - onClick?: fonction appelée lors du clic
 *   - className?: classes CSS supplémentaires
 *
 * Affiche un bouton stylisé pour déclencher l'ajout d'un événement.
 */

import React from "react";

interface AddEventButtonProps {
  onClick?: () => void;
  className?: string;
}

const AddEventButton: React.FC<AddEventButtonProps> = ({ onClick, className }) => (
  <button
    className={`px-6 py-2 rounded-full bg-[var(--primary)] text-white font-bold text-lg shadow hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${className || ""}`}
    onClick={onClick}
  >
    + Add Event
  </button>
);

export default AddEventButton;
