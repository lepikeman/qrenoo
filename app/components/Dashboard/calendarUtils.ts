/**
 * calendarUtils.ts
 *
 * Fonctions utilitaires pour la gestion des dates et du calendrier dans le dashboard.
 *
 * Fournit des helpers pour manipuler les jours, semaines, etc.
 */

// Utilitaires pour le calendrier (jours/semaine, index, etc.)

export const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function getDayIdx(date: string) {
  const d = new Date(date);
  const idx = d.getDay();
  return idx === 0 ? 6 : idx - 1; // 0 = lundi, 6 = dimanche
}

export function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1); // Lundi
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
