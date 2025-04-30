/**
 * AppointmentDetailsPanel.tsx
 *
 * Composant d'affichage des détails d'un rendez-vous sélectionné dans le dashboard.
 *
 * Props :
 *   - rdv : l'objet Appointment à afficher
 *   - onClose : la fonction à appeler pour fermer le panneau
 *   - userEmail : l'email de l'utilisateur (à passer en prop si besoin)
 *
 * Affiche les détails complets d'un rendez-vous et les actions associées.
 */
import React, { useEffect, useState } from "react";
import type { Appointment } from "./DashboardPage";
import type { Profile } from "@/app/types/Profile";

interface AppointmentDetailsPanelProps {
  rdv: Appointment | null;
  onClose: () => void;
  userEmail: string; // Ajout de la prop userEmail
}

const AppointmentDetailsPanel: React.FC<AppointmentDetailsPanelProps> = ({
  rdv,
  onClose,
  userEmail, // Utilisation de la prop userEmail
}) => {
  const [proProfile, setProProfile] = useState<Profile | null>(null);
  const [loadingPro, setLoadingPro] = useState(false);
  const [errorPro, setErrorPro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPro() {
      if (!rdv || !rdv.pro_id) {
        console.log(
          "[AppointmentDetailsPanel] Pas de rdv ou de pro_id pour charger le profil pro",
          rdv
        );
        return;
      }
      setLoadingPro(true);
      setErrorPro(null);
      try {
        console.log(
          `[AppointmentDetailsPanel] Fetching /api/proinfo?pro_id=${rdv.pro_id}`
        );
        const res = await fetch(`/api/proinfo?pro_id=${rdv.pro_id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement du profil pro");
        const data = await res.json();
        console.log("[AppointmentDetailsPanel] Profil pro reçu:", data);
        setProProfile(data);
      } catch (e: unknown) {
        console.error("[AppointmentDetailsPanel] Erreur fetch profil pro:", e);
        setErrorPro((e as Error).message || "Erreur inconnue");
      } finally {
        setLoadingPro(false);
      }
    }
    fetchPro();
  }, [rdv]);

  if (!rdv) return null;
  const d = new Date(`${rdv.date_jour}T${rdv.heure}`);

  // Affichage loading ou erreur profil pro
  if (loadingPro) return <div>Chargement des infos du professionnel...</div>;
  if (errorPro) return <div className="text-red-500">{errorPro}</div>;

  // Sécurité : fallback si profil non trouvé
  const clientEmail: string | undefined =
    rdv.client_email &&
    typeof rdv.client_email === "string" &&
    rdv.client_email.includes("@")
      ? rdv.client_email
      : undefined;

  const proJob: string = proProfile?.profession || "votre professionnel";
  const proNom: string = proProfile?.nom || "";
  const proPhone: string = proProfile?.phone || "[Numéro non renseigné]";
  const proAdresse: string = proProfile?.adresse_postale
    ? `${proProfile.adresse_postale}, ${proProfile.code_postal || ""} ${proProfile.ville || ""}`
    : "[Adresse non renseignée]";
  // Remplace l'accès à proProfile.adresse_mail par l'email du user (à récupérer via une API ou à passer en prop si besoin)
  const proEmail: string = userEmail; // Utilisation de la prop userEmail

  const rdvDate: string = d.toLocaleDateString();
  const rdvHeure: string = rdv.heure.slice(0, 5);

  const clientPrenom: string = rdv.client_nom.split(" ")[0];

  return (
    <div className="fixed top-0 right-0 h-full w-[350px] max-w-full bg-white shadow-2xl border-l border-[#e6e2d6] z-50 p-6 flex flex-col gap-4 animate-slide-in">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-bold text-[#222]">Rendez-vous</div>
        <button
          onClick={onClose}
          className="text-[#888] hover:text-[#1c3917] text-xl font-bold"
        >
          ×
        </button>
      </div>
      <div className="text-[15px] text-[#444]">
        <span className="font-semibold">
          {rdvDate} à {rdvHeure}
        </span>
      </div>
      <div className="text-[15px]">
        <span className="text-[#888]">Client :</span> <b>{rdv.client_nom} </b>
      </div>
      <div className="text-[15px]">
        <span className="text-[#888]">Téléphone :</span>
        {rdv.client_phone}
      </div>
      <div className="text-[15px]">
        <span className="text-[#888]">Email :</span>
        {clientEmail ? (
          <span className="ml-1">{clientEmail}</span>
        ) : (
          <span className="ml-1 italic text-gray-400">Non renseigné</span>
        )}
      </div>
      {rdv.message && (
        <div className="text-[15px]">
          <span className="text-[#888]">Message :</span> {rdv.message}
        </div>
      )}
      {rdv.is_validated === false && (
        <div className="text-[14px] text-red-500">Non confirmé</div>
      )}
      <div className="flex gap-2 mt-6">
        <button
          className="flex-1 bg-[#1c3917] text-white rounded-full py-2 text-[15px] font-semibold shadow-sm hover:brightness-110 transition"
          onClick={async () => {
            if (!proProfile) {
              console.warn(
                "[AppointmentDetailsPanel] Tentative d'envoi mail sans profil pro chargé",
                proProfile
              );
              alert(
                "Informations du professionnel non chargées. Veuillez réessayer."
              );
              return;
            }
            console.log(
              "[AppointmentDetailsPanel] Envoi mail avec proProfile:",
              proProfile
            );
            const email = clientEmail;
            if (email) {
              const subject = "Confirmation de votre rendez-vous";
              const body = `<table border="0" width="100%" cellspacing="0" cellpadding="0" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <tr>
    <td align="center" valign="top" style="border-collapse: collapse;">
      <!-- CONTENEUR PRINCIPAL -->
      <table border="0" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto;">
        <tr>
          <td style="padding: 30px 0; text-align: center;">
            <img src="https://qrenoo.com/assets/logo.png" alt="Qrenoo" width="200" style="display: block; margin: 0 auto 15px;">
            <h1 style="color: #2F3E2E; margin: 0; font-size: 24px;">Confirmation de votre rendez-vous</h1>
          </td>
        </tr>
        <!-- CARD CONTENT -->
        <tr>
          <td style="background-color: #F4E8D4; border-radius: 10px; padding: 30px;">
            <!-- MESSAGE DE CONFIRMATION -->
            <table width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="color: #2F3E2E; line-height: 1.6; padding-bottom: 15px;">
                  <p>Bonjour ${clientPrenom},</p>
                  <p>Votre rendez-vous avec <strong>${proNom}</strong> (${proJob}) a bien été confirmé.</p>
                  <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                    <p style="font-size: 18px; margin: 0 0 10px 0; color: #2F3E2E;"><strong>Détails du rendez-vous</strong></p>
                    <p style="margin: 8px 0; font-size: 16px;">📅 <strong>Date :</strong> ${rdvDate}</p>
                    <p style="margin: 8px 0; font-size: 16px;">⏰ <strong>Heure :</strong> ${rdvHeure}</p>
                    <p style="margin: 8px 0; font-size: 16px;">📍 <strong>Lieu :</strong> ${proAdresse}</p>
                  </div>
                </td>
              </tr>
            </table>
            <!-- FOOTER -->
            <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px;">
              <tr>
                <td style="text-align: center; color: #666; font-size: 14px; line-height: 1.5;">
                  <p>Besoin d'aide ? Contactez votre professionnel :</p>
                  <p>📞 <a href="tel:${proPhone}" style="color: #2F3E2E; text-decoration: none;">${proPhone}</a> | ✉️ <a href="mailto:${proEmail}" style="color: #2F3E2E; text-decoration: none;">${proEmail}</a></p>
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
              console.log("[AppointmentDetailsPanel] Appel API /api/sendmail", {
                to: email,
                subject,
                body,
              });
              try {
                const res = await fetch("/api/sendmail", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ to: email, subject, body }),
                });
                const result = await res.json();
                console.log(
                  "[AppointmentDetailsPanel] Résultat API /api/sendmail:",
                  result
                );
                if (res.ok) {
                  alert("Email de confirmation envoyé avec succès !");
                } else {
                  alert(
                    "Erreur lors de l'envoi : " + (result.error || res.status)
                  );
                }
              } catch (e) {
                console.error(
                  "[AppointmentDetailsPanel] Erreur réseau lors de l'envoi:",
                  e
                );
                alert("Erreur réseau lors de l'envoi");
              }
            }
          }}
          disabled={!clientEmail || !proProfile}
          title={
            !proProfile
              ? "Chargement des infos pro..."
              : clientEmail
                ? "Envoyer un mail de confirmation"
                : "Aucun email renseigné"
          }
        >
          Envoyer mail
        </button>
        <button
          className="flex-1 border border-[#b6b1a3] rounded-full py-2 text-[15px] text-[#222] hover:bg-[#f5f5f5] transition"
          onClick={async () => {
            if (!rdv?.id) return;
            // 1. Suppression du rendez-vous dans la BDD
            try {
              const resCancel = await fetch("/api/rendezvous/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: rdv.id }),
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
            // 2. Envoi de l’email d’annulation (existant)
            const email = clientEmail;
            if (email) {
              const subject = "Annulation de votre rendez-vous";
              const body = `<table border="0" width="100%" cellspacing="0" cellpadding="0" style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <tr>
    <td align="center" valign="top" style="border-collapse: collapse;">
      <table border="0" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto;">
        <tr>
          <td style="padding: 30px 0; text-align: center;">
            <img src="https://qrenoo.com/assets/logo.png" alt="Qrenoo" width="200" style="display: block; margin: 0 auto 15px;">
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
                  <p>Nous vous informons que votre rendez-vous initialement prévu avec <strong>${proNom}</strong> (${proJob}) a été annulé.</p>
                  </div>
                  <div style="margin-top: 20px; text-align: center;">
                    <a href="https://www.qrenoo.com/pro/profile/${proProfile?.id || rdv.pro_id}" style="display: inline-block; padding: 12px 28px; background-color: #1c3917; color: #fff; border-radius: 6px; font-size: 16px; font-weight: bold; text-decoration: none; box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04); margin-bottom: 8px;" target="_blank" rel="noopener noreferrer">Reprendre rendez-vous avec ce professionnel</a>
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
                  <p>📞 <a href="tel:${proPhone}" style="color: #2F3E2E; text-decoration: none;">${proPhone}</a> | ✉️ <a href="mailto:${proEmail}" style="color: #2F3E2E; text-decoration: none;">${proEmail}</a></p>
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
              console.log("[AppointmentDetailsPanel] Appel API /api/sendmail", {
                to: email,
                subject,
                body,
              });
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
            // 3. Fermer le panneau ou rafraîchir la liste
            onClose();
          }}
          disabled={!clientEmail || !proProfile}
          title={
            !proProfile
              ? "Chargement des infos pro..."
              : clientEmail
                ? "Annuler le rendez-vous et prévenir le client"
                : "Aucun email renseigné"
          }
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetailsPanel;
