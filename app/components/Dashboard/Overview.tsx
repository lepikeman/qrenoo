import React, { useEffect, useState } from "react";
import type { Appointment } from "./DashboardPage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MONTHS_FR = [
  "janv",
  "févr",
  "mars",
  "avr",
  "mai",
  "juin",
  "juil",
  "août",
  "sept",
  "oct",
  "nov",
  "déc",
];

export default function Overview({ proId }: { proId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      setError("");
      try {
        // Filtrage côté API : on ajoute le pro_id dans la requête
        const params = new URLSearchParams({ pro_id: proId });
        const res = await fetch(`/api/rendezvous?${params.toString()}`);
        if (!res.ok)
          throw new Error("Erreur lors du chargement des statistiques.");
        const data = await res.json();
        setAppointments(data || []);
       
      } catch (e: unknown) {
        setError(
          (e as Error).message || "Erreur lors du chargement des statistiques."
        );
      } finally {
        setLoading(false);
      }
    }
    if (proId) fetchAppointments();
  }, [proId]);

  // Helpers pour stats
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toDateStr = (d: Date) => d.toISOString().slice(0, 10);

  const total = appointments.length;
  const thisMonth = appointments.filter((rdv) => {
    if (!rdv.date_jour) return false;
    try {
      return toDateStr(new Date(rdv.date_jour)) >= toDateStr(startOfMonth);
    } catch {
      return false;
    }
  }).length;
  const timeSavedMin = total * 10;
  const timeSavedH = Math.floor(timeSavedMin / 60);
  const timeSavedR = timeSavedMin % 60;

  // 1. Taux de validation des rendez-vous
  const validatedCount = appointments.filter((rdv) => rdv.is_validated).length;
  const validationRate =
    total > 0 ? Math.round((validatedCount / total) * 100) : 0;

  // 2. Nombre de nouveaux clients ce mois-ci (clients uniques par email ou téléphone)
  const clientsThisMonth = appointments.filter((rdv) => {
    if (!rdv.date_jour) return false;
    try {
      return toDateStr(new Date(rdv.date_jour)) >= toDateStr(startOfMonth);
    } catch {
      return false;
    }
  });
  const uniqueClientsThisMonth = Array.from(
    new Set(clientsThisMonth.map((rdv) => rdv.client_email || rdv.client_phone))
  ).length;

  // 3. Nombre de clients récurrents (ayant pris >1 RDV)
  const clientCounts: Record<string, number> = {};
  appointments.forEach((rdv) => {
    const key = rdv.client_email || rdv.client_phone;
    if (key) clientCounts[key] = (clientCounts[key] || 0) + 1;
  });
  const recurringClients = Object.values(clientCounts).filter(
    (c) => c > 1
  ).length;

  // 5. Heures de réservation les plus populaires (histogramme)
  const hourCounts: Record<string, number> = {};
  appointments.forEach((rdv) => {
    if (rdv.heure) {
      const hour = rdv.heure.slice(0, 2) + "h";
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
  });
  const hourChart = Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  // Génère les jours du mois courant
  const daysInMonth = endOfMonth.getDate();
  const monthNum = now.getMonth();
  const monthLabel = MONTHS_FR[monthNum];
  const days: string[] = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), i + 1);
    return toDateStr(d);
  });

  // Prépare les données pour le graphique
  const rdvByDay: { date: string; nbRdv: number }[] = days.map((dateStr) => {
    const day = parseInt(dateStr.slice(-2), 10);
    return {
      date: `${day} ${monthLabel}`,
      nbRdv: appointments.filter((rdv) => {
        if (!rdv.date_jour) return false;
        try {
          return toDateStr(new Date(rdv.date_jour)) === dateStr;
        } catch {
          return false;
        }
      }).length,
    };
  });

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 border border-[#ded9cb] mt-10">
      <h1 className="text-3xl font-extrabold text-[#29381a] mb-8">
        Statistiques
      </h1>
      {loading ? (
        <div className="text-center py-8 text-lg">Chargement...</div>
      ) : error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-[#29381a]">
                {thisMonth}
              </span>
              <span className="text-[#888] mt-2">RDV ce mois</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-[#29381a]">
                {validationRate}%
              </span>
              <span className="text-[#888] mt-2">Taux de validation</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-[#29381a]">
                {uniqueClientsThisMonth}
              </span>
              <span className="text-[#888] mt-2">Nouveaux clients ce mois</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-[#29381a]">
                {recurringClients}
              </span>
              <span className="text-[#888] mt-2">Clients récurrents</span>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-xl font-semibold text-[#29381a] mb-4">
                Évolution des RDV ce mois-ci
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={rdvByDay}
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 13 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                  <Tooltip
                    formatter={(value) => `${value} Rdv`}
                    labelFormatter={(label) => `Jour : ${label}`}
                  />
                  <Bar
                    dataKey="nbRdv"
                    fill="#29381a"
                    radius={[6, 6, 0, 0]}
                    name="Rendez-vous"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="text-xl font-semibold text-[#29381a] mb-4">
                Heures de réservation les plus populaires
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={hourChart}
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tick={{ fontSize: 13 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                  <Tooltip
                    formatter={(value) => `${value} Rdv`}
                    labelFormatter={(label) => `Heure : ${label}`}
                  />
                  <Bar
                    dataKey="count"
                    fill="#689f38"
                    radius={[6, 6, 0, 0]}
                    name="RDV"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {!loading && !error && (
            <div className="mt-12 flex flex-col items-center">
              <div className="text-xl font-semibold text-[#29381a] mb-2">
                Temps gagné grâce aux RDV en ligne
              </div>
              <div className="text-3xl font-bold text-green-700">
                {timeSavedH > 0 && `${timeSavedH}h `}
                {timeSavedR} min
              </div>
              <div className="text-[#888] mt-2 text-center">
                (10 minutes économisées par RDV pris)
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
