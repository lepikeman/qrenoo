/**
 * Sidebar.tsx
 *
 * Composant de menu latéral pour la navigation principale du dashboard.
 *
 * Props :
 *   - active?: string (onglet actif)
 *   - setActiveTab?: (tab: SidebarProps["active"]) => void
 *   - appointments?: Appointment[] (liste des rendez-vous)
 *   - proProfile?: Profile (profil professionnel pour l'envoi de mail)
 *   - onReloadCalendar?: () => void (rafraîchir le calendrier après annulation)
 *
 * Affiche le menu de navigation du dashboard avec les différentes sections (overview, calendar, settings, etc).
 */
import React from "react";
import { RippleButton } from "./RippleButton";
import "./ripple.css";
import { parseISO } from "date-fns";
import type { Appointment } from "../DashboardPage";
import Image from "next/image";
import type { Profile } from "@/app/types/Profile";
import QRCodeModal from "./QRCodeModal";

interface SidebarProps {
  active?: "overview" | "calendar" | "settings";
  appointments?: Appointment[];
  proProfile?: Profile;
  onReloadCalendar?: () => void;
}

const menuItems = [
  {
    key: "overview",
    label: "Aperçu",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="3"
          stroke="#b6b1a3"
          strokeWidth="2"
        />
        <path d="M3 9h18" stroke="#b6b1a3" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: "calendar",
    label: "Calendrier",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect
          x="5"
          y="6"
          width="14"
          height="12"
          rx="2"
          stroke="#b6b1a3"
          strokeWidth="2"
        />
        <path d="M8 10h8M8 14h5" stroke="#b6b1a3" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Paramètres",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M12 15v2M12 11v2M12 7v2" stroke="#b6b1a3" strokeWidth="2" />
        <circle cx="12" cy="12" r="10" stroke="#b6b1a3" strokeWidth="2" />
      </svg>
    ),
  },
];

const Sidebar: React.FC<
  SidebarProps & {
    setActiveTab?: (tab: SidebarProps["active"] | undefined) => void;
  }
> = ({
  active = "calendar",
  setActiveTab,
  appointments,
  proProfile,
  onReloadCalendar,
}) => {
  // --- Plus de fetch local, on utilise les RDV passés en prop ---
  const now = new Date();

  // --- Filtrage robuste ---
  // Affiche toujours le prochain rendez-vous (date+heure > maintenant)
  const nextAppointment = (appointments || [])
    .filter((rdv) => {
      if (!rdv.date_jour || !rdv.heure) return false;
      // Ajoute les secondes si absentes
      const heureNorm = rdv.heure.length === 5 ? rdv.heure + ":00" : rdv.heure;
      // On considère le RDV "après maintenant" si sa date+heure > now
      let dt: Date;
      try {
        dt = parseISO(rdv.date_jour + "T" + heureNorm);
        if (isNaN(dt.getTime())) throw new Error("Invalid date");
      } catch {
        dt = new Date(rdv.date_jour + "T" + heureNorm);
      }
      return dt.getTime() > now.getTime();
    })
    .sort((a, b) => {
      const ha = a.heure.length === 5 ? a.heure + ":00" : a.heure;
      const hb = b.heure.length === 5 ? b.heure + ":00" : b.heure;
      let da: Date, db: Date;
      try {
        da = parseISO(a.date_jour + "T" + ha);
        if (isNaN(da.getTime())) throw new Error("Invalid date");
      } catch {
        da = new Date(a.date_jour + "T" + ha);
      }
      try {
        db = parseISO(b.date_jour + "T" + hb);
        if (isNaN(db.getTime())) throw new Error("Invalid date");
      } catch {
        db = new Date(b.date_jour + "T" + hb);
      }
      return da.getTime() - db.getTime();
    })[0];

  const [showQR, setShowQR] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Génère l'URL publique du profil (à adapter selon le routing)
  const publicUrl = proProfile?.id
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/pro/profile/${proProfile.id}`
    : "";

  const handleCopy = async () => {
    if (publicUrl) {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <aside className="flex flex-col justify-between w-[270px] min-w-[220px] max-w-[320px] h-full max-h-screen bg-[#fdf6e3] border-r border-[#23283a] shadow-xl fixed top-0 left-0 z-40 overflow-hidden p-0 transition-all duration-500 rounded-none">
      {/* Logo & Toggle */}
      <div className="flex items-center justify-center -my-8  px-7 shrink-0 cursor-pointer">
        <Image
          src="/assets/logo.png"
          alt="Qrenoo"
          width={200}
          height={200}
          onClick={() => (window.location.href = "/")}
        />
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-6 px-4 pt-4">
        {menuItems.map((item) => (
          <RippleButton
            key={item.key}
            className={`group cursor-pointer flex items-center gap-4 px-0 py-0 rounded-[16px] text-[20px] font-normal transition-all duration-200 focus:outline-none border-none w-full bg-transparent relative
              ${
                active === item.key
                  ? "bg-white shadow-[0_2px_6px_0_rgba(0,0,0,0.10)] text-[#222] px-4 py-2 font-medium"
                  : "hover:bg-[#fff6e6] text-[#222] px-4 py-2"
              }
            `}
            style={{
              position: active === item.key ? "relative" : undefined,
              boxShadow:
                active === item.key ? "0 2px 6px 0 #e2e2e2" : undefined,
            }}
            onClick={() =>
              setActiveTab && setActiveTab(item.key as SidebarProps["active"])
            }
          >
            <span className="flex items-center w-8 h-8 rounded-xl transition text-[22px]">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </RippleButton>
        ))}
      </nav>
      <div className="mt-8 flex flex-col gap-3 px-4">
        <div className="flex gap-2 h-[40px]">
          <button
            className="w-full flex items-center gap-2 px-4 py-2 bg-[#f6f8f2] cursor-pointer border border-[#ded9cb] rounded-lg font-semibold hover:bg-[#e5e9e0] transition"
            onClick={() => window.open(publicUrl, "_blank")}
            disabled={!proProfile?.id}
          >
            Voir le profil public
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#f6f8f2] cursor-pointer border border-[#ded9cb] rounded-lg font-semibold hover:bg-[#e5e9e0] transition"
            onClick={handleCopy}
            disabled={!proProfile?.id}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path
                d="M5 5V3.5A1.5 1.5 0 0 1 6.5 2h7A1.5 1.5 0 0 1 15 3.5v11A1.5 1.5 0 0 1 13.5 16H12"
                stroke="#29381a"
                strokeWidth="1.5"
              />
              <rect
                x="3"
                y="7"
                width="10"
                height="10"
                rx="2"
                stroke="#29381a"
                strokeWidth="1.5"
              />
            </svg>
            {copied && (
              <span className="ml-2 text-green-600 text-xs">Lien copié !</span>
            )}
          </button>
        </div>
        <button
          className="w-full flex items-center gap-2 px-4 py-2 bg-[#f6f8f2] cursor-pointer border border-[#ded9cb] rounded-lg font-semibold hover:bg-[#e5e9e0] transition"
          onClick={() => setShowQR(true)}
          disabled={!proProfile?.id}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <rect
              x="2"
              y="2"
              width="16"
              height="16"
              rx="3"
              stroke="#29381a"
              strokeWidth="1.5"
            />
            <path
              d="M7 7h2v2H7V7zm4 0h2v2h-2V7zm0 4h2v2h-2v-2z"
              fill="#29381a"
            />
          </svg>
          Générer QR Code
        </button>
      </div>
      {showQR && proProfile?.id && (
        <QRCodeModal url={publicUrl} onClose={() => setShowQR(false)} />
      )}
      {/* Footer modern card */}
      <div className="flex items-center justify-center pb-8 pt-2 shrink-0">
        <div className="w-[95%] max-w-[340px] rounded-2xl bg-white shadow-md px-5 py-4 flex flex-col items-start border border-[#ece6d7] animate-fade-in transition-all duration-500">
          {/* Bloc RDV Sidebar */}

          {nextAppointment ? (
            <div className="mb-2">
              <div className="font-semibold text-[15px] text-[#222] truncate w-full">
                {nextAppointment.client_nom}
              </div>
              <div className="text-xs text-[#888]">
                {nextAppointment.date_jour} à{" "}
                {nextAppointment.heure.slice(0, 5)}
              </div>
              {nextAppointment.message && (
                <div className="text-xs text-[#666] truncate w-full">
                  {nextAppointment.message}
                </div>
              )}
            </div>
          ) : (
            <span className="text-xs text-[#888]">
              Pas de rendez-vous prévu
            </span>
          )}
          <RippleButton
            disabled={true}
            className="w-full bg-[#29381a] disabled:opacity-50 text-white rounded-full py-1 text-[15px] font-semibold my-1 shadow-sm hover:brightness-110 transition"
          >
            Rappeler
          </RippleButton>
          <RippleButton
            className="w-full border border-[#b6b1a3] cursor-pointer rounded-full py-1 text-[15px] text-[#222] hover:bg-[#f5f5f5] transition"
            onClick={async () => {
              if (!nextAppointment?.id) return;
              // 1. Suppression du rendez-vous dans la BDD
              try {
                const resCancel = await fetch("/api/rendezvous/cancel", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: nextAppointment.id }),
                });
                if (!resCancel.ok) {
                  const result = await resCancel.json();
                  alert(
                    "Erreur lors de la suppression du rendez-vous : " +
                      (result.error || resCancel.status)
                  );
                  return;
                }
              } catch (e) {
                alert("Erreur réseau lors de la suppression du rendez-vous");
                console.error(e);
                return;
              }
              // 2. Envoi de l’email d’annulation (même logique que AppointmentDetailsPanel)
              const email = nextAppointment.client_email;
              const clientPrenom =
                nextAppointment.client_nom?.split(" ")[0] || "";
              const proNom = proProfile?.nom || "votre professionnel";
              const proPhone = proProfile?.phone || "";
              // const proEmail = proProfile?.adresse_mail || ""; // supprimé, colonne supprimée
              const proId = proProfile?.id || "";
              const rdvId = nextAppointment.id || "";
              const rdvDate = nextAppointment.date_jour;
              const rdvHeure = nextAppointment.heure;
              const subject = "Annulation de votre rendez-vous";
              const body = `<table border="0" width="100%" cellspacing="0" cellpadding="0" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <tr>
    <td align="center" valign="top" style="border-collapse: collapse;">
      <table border="0" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto;">
        <tr>
          <td style="padding: 30px 0; text-align: center;">
            <img src="public/D408A4A9-5703-46D3-8C96-A80AC91ABB3A.png" alt="Qrenoo" width="120" style="display: block; margin: 0 auto 15px;">
            <h1 style="color: #a94442; margin: 0; font-size: 24px;">Annulation de votre rendez-vous</h1>
          </td>
        </tr>
        <tr>
          <td style="background-color: #F4E8D4; border-radius: 10px; padding: 30px;">
            <table width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="color: #2F3E2E; line-height: 1.6; padding-bottom: 15px;">
                    <div style="color: #2F3E2E;">
                      <p>Bonjour ${clientPrenom},</p>
                      <p>Nous vous informons que votre rendez-vous initialement prévu avec <strong>${proNom}</strong> a été annulé.</p>
                    </div>
                    <div style="margin-top: 20px; text-align: center;">
                      <a href="https://www.qrenoo.com/pro/profile/${proId || rdvId}" style="display: inline-block; padding: 12px 28px; background-color: #1c3917; color: #fff; border-radius: 6px; font-size: 16px; font-weight: bold; text-decoration: none; box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04); margin-bottom: 8px;" target="_blank" rel="noopener noreferrer">Reprendre rendez-vous avec ce professionnel</a>
                      <div style="margin-top: 8px; color: #2F3E2E;">
                        Si vous souhaitez <strong>déplacer</strong> votre rendez-vous, il vous suffit de contacter directement votre professionnel, ou de réserver un nouveau rendez-vous via Qrenoo.
                      </div>
                    </div>
                    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                      <p style="margin: 8px 0; font-size: 16px;">📅 <strong>Date :</strong> ${rdvDate}</p>
                      <p style="margin: 8px 0; font-size: 16px;">⏰ <strong>Heure :</strong> ${rdvHeure}</p>
                      <p style="font-size: 16px; margin: 0 0 10px 0; color: #a94442;"><strong>Ce rendez-vous est annulé.</strong></p>
                    </div>
                </td>
              </tr>
            </table>
            <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px;">
              <tr>
                <td style="text-align: center; color: #666; font-size: 14px; line-height: 1.5;">
                  <p>Besoin d'aide ? Contactez votre professionnel :</p>
                  <p>📞 <a href="tel:${proPhone}" style="color: #2F3E2E; text-decoration: none;">${proPhone}</a> | ✉️ <a href="mailto:contact.qrenoo@gmail.com" style="color: #2F3E2E; text-decoration: none;">contact.qrenoo@gmail.com</a></p>
                  <p>Contacter le support : <a href="mailto:contact.qrenoo@gmail.com" style="color: #2F3E2E; text-decoration: none;">contact.qrenoo@gmail.com</a></p>
                  <p style="font-size: 12px; margin-top: 15px;">Cet email a été envoyé via Qrenoo • <a href="www.qrenoo.com" style="color: #666;">www.qrenoo.com</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
              if (email) {
                try {
                  const res = await fetch("/api/sendmail", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ to: email, subject, body }),
                  });
                  const result = await res.json();
                  if (res.ok) {
                    alert(
                      "Rendez-vous annulé et email d'annulation envoyé avec succès !"
                    );
                  } else {
                    alert(
                      "Rendez-vous annulé, mais erreur lors de l'envoi du mail : " +
                        (result.error || res.status)
                    );
                  }
                } catch (e) {
                  alert(
                    "Rendez-vous annulé, mais erreur réseau lors de l'envoi du mail"
                  );
                  console.error(e);
                }
              } else {
                alert("Rendez-vous annulé (pas d'email client renseigné)");
              }
              // Rafraîchit le calendrier automatiquement si demandé
              if (onReloadCalendar) onReloadCalendar();
            }}
            disabled={!nextAppointment?.client_email || !proProfile}
            title={
              !proProfile
                ? "Chargement des infos pro..."
                : nextAppointment?.client_email
                  ? "Annuler le rendez-vous et prévenir le client"
                  : "Aucun email renseigné"
            }
          >
            Annuler
          </RippleButton>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
