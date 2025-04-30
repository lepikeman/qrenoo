import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Remplace ces valeurs par tes variables d'environnement ou ta config locale
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const data = await request.json();
  console.log("Données reçues dans l'API:", data);
  const { client_nom, client_email, client_phone, date_jour, heure, message, pro_id, is_validated } = data;
  if (!client_nom || !date_jour || !heure || !pro_id) {
    return NextResponse.json({ error: "Champs manquants", debug: { client_nom, client_email, client_phone, date_jour, heure, pro_id } }, { status: 400 });
  }
  
  // Génère un code de validation à 6 chiffres UNIQUEMENT si non validé
  const validation_code = is_validated ? null : Math.floor(100000 + Math.random() * 900000);
  // Insère le RDV avec validation immédiate ou non
  const { data: insertData, error } = await supabase.from("rendezvous").insert([
    { client_nom, client_email, client_phone, date_jour, heure, message, pro_id, validation_code, is_validated: is_validated === true },
  ]).select();

  if (error) {
    console.error("Erreur Supabase (insert rendez-vous):", error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }
  
  const { data: proData, error: proError } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", pro_id)
  .single();
  if (proError) {
    console.error("Erreur fetch profil pro:", proError);
    return NextResponse.json({ error: proError.message, details: proError }, { status: 500 });
  }
  
  // Envoie l'email de validation si email fourni ET si non validé
  if (client_email && !is_validated) {
    console.log("[DEBUG proData]", JSON.stringify(proData));
    await resend.emails.send({
      from: "contact@qrenoo.com",
      to: client_email,
      subject: "Votre code de confirmation de rendez-vous Qrenoo",
      html: `
<table border="0" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F4E8D4;width:100%;max-width:600px;margin:auto;border-radius:8px;">
  <tr>
    <td align="center" valign="top">
      <table border="0" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F4E8D4;width:100%;max-width:600px;margin:auto;border-radius:8px;">
        <tr>
          <td>
            <!-- En-tête -->
            <table width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="background-color:#2F3E2E;color:#fff;padding:20px;border-radius:6px 6px 0 0;text-align:center;font-size:22px;font-weight:bold;">
                  <img src="https://qrenoo.com/assets/logo.png" alt="Qrenoo" width="200" style="display:block;margin:0 auto 15px;">
                  Confirmation de votre rendez-vous
                </td>
              </tr>
            </table>
            <!-- Contenu -->
            <table width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="color:#2F3E2E;padding:25px;line-height:1.6;font-family:Arial,sans-serif;">
                <div style="color:#2F3E2E;">
                  <p>Bonjour ${client_nom},</p>
                  <p>Merci d'avoir pris rendez-vous avec Mme/Mr  <strong>${proData?.nom ?? ""}</strong> <strong>${proData?.profession ?? "votre praticien"}</strong> via Qrenoo !</p>
                  </div>
                  <div style="background-color:#fff;border-radius:8px;padding:15px;margin:20px 0;">
                    <p><strong>📅 Date :</strong> ${date_jour}</p>
                    <p><strong>⏰ Heure :</strong> ${heure}</p>
                    <p><strong>📍 Lieu :</strong> ${proData?.adresse_postale ?? "Non renseignée"}</p>
                  </div>
                  <div style="color:#2F3E2E;">
                  <p>Votre code de confirmation unique : (le code expirera dans <strong>15 minutes</strong>)</p>
                  </div>
                  <div style="background-color:#fff;border:2px dashed #2F3E2E;border-radius:8px;padding:15px;text-align:center;font-size:28px;font-weight:bold;letter-spacing:3px;margin:25px 0;color:#2F3E2E;">
                    ${validation_code}
                  </div>
                  <div style="color:#2F3E2E;">
                  <p><strong>Pour votre tranquillité :</strong></p>
                  <ul>
                    <li>Vous recevrez un rappel 24h avant votre rendez-vous</li>
                    <li>Ce code vous sera demandé à votre arrivée</li>
                    <li>En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance</li>
                  </ul>
                  </div>
                  <div style="margin-top:30px;font-size:14px;color:#666;text-align:center;">
                    <p>Besoin d'aide ? Contactez ${proData?.nom ?? "le professionnel"} :</p>
                    <p>
                      ${proData?.profession ? `<strong>${proData.profession}</strong><br/>` : ""}
                      ${proData?.adresse_mail ? `✉️<strong>${proData.adresse_mail}</strong><br/>` : ""}
                      ${proData?.phone ? `📞<strong>${proData.phone}</strong><br/>` : ""}
                      ${proData?.adresse_postale ? `<span>${proData.adresse_postale}</span><br/>` : ""}
                    </p>
                    <div style="color:#2F3E2E;margin-top:30px;border-top:1px solid #ddd;padding-top:20px;">
                      <p><small>Cet email a été envoyé via Qrenoo - Solution de gestion de rendez-vous intelligente</small></p>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
    });
  }
  // Retourne l'id du RDV pour la vérification côté front
  return NextResponse.json({ success: true, rdv_id: insertData?.[0]?.id });
}

export async function GET(request: Request) {
  // Récupère le pro_id et days éventuel (filtrage côté API)
  const { searchParams } = new URL(request.url);
  const pro_id = searchParams.get("pro_id");
  const days = searchParams.get("days");

  let query = supabase
    .from("rendezvous")
    .select("id, client_nom, client_email, client_phone, date_jour, heure, message, is_validated, pro_id");

  if (pro_id) query = query.eq("pro_id", pro_id);
  if (days) {
    const daysArr = days.split(",");
    query = query.in("date_jour", daysArr);
  }

  query = query.order("date_jour", { ascending: true }).order("heure", { ascending: true });

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}
