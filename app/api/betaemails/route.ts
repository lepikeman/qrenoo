import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "contact@qrenoo.com";

function generateCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { error: "Email manquant ou invalide" },
      { status: 400 }
    );
  }

  // Stocker l'email dans beta_emails seulement s'il n'existe pas déjà
  await supabase
    .from("beta_emails")
    .upsert([{ email }], { onConflict: "email" });

  // Vérifier le nombre de testeurs déjà inscrits
  const { count } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });
  if (count !== null && count >= 10) {
    return NextResponse.json(
      { error: "Le nombre maximum de testeurs est atteint." },
      { status: 403 }
    );
  }

  // Générer et stocker (ou mettre à jour) le code
  const code = generateCode();
  const expiresAt = new Date(
    Date.now() + 14 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Utilise upsert pour remplacer l'ancien code si l'email existe déjà
  await supabase
    .from("access_codes")
    .upsert(
      [{ email, code, expires_at: expiresAt, used: false }],
      { onConflict: "email" }
    );

  // Envoyer le code par email
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Votre code d'accès à la beta Qrenoo",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#f9f9f9;padding:24px;border-radius:12px;">
      <div style="text-align:center;margin-bottom:24px;">
      <img src="https://qrenoo.com/assets/logo.png" alt="Logo Qrenoo" style="width:100px;height:auto;margin-bottom:16px;">  
      <h2 style="color:#2b6cb0;">Bienvenue sur Qrenoo 👋</h2>
        <p>Merci de votre intérêt pour la beta !</p>
        <p>Voici votre code d'accès valable <b>2 semaines</b> :</p>
        <div style="font-size:2rem;font-weight:bold;letter-spacing:2px;background:#e2e8f0;padding:12px 0;border-radius:8px;text-align:center;color:#2b6cb0;">
          ${code}
        </div>
        <p style="margin-top:24px;font-size:0.95rem;color:#555;">
          Utilisez ce code pour vous inscrire sur notre site et découvrir toutes les fonctionnalités de Qrenoo.
        </p>
        <p style="margin-top:24px;font-size:0.95rem;color:#555;">
        <a href="http://localhost:3001/register?code=${code}" target="_blank" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#2b6cb0;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
          Cliquez sur le bouton ci-dessous pour vous inscrire :
        </p>
        <p style="margin-top:24px;font-size:0.95rem;color:#555;">
          Ce code est valable jusqu'au <b>${new Date(
            expiresAt
          ).toLocaleDateString("fr-FR")}</b>.
        </p>
        <p style="margin-top:24px;font-size:0.95rem;color:#555;">
          Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
        </p>
      </div>
    `,
  });

  // après l'envoi du code à l'utilisateur...
  await resend.emails.send({
    from: FROM_EMAIL,
    to: "contact.qrenoo@gmail.com", // notification à toi-même
    subject: "Nouvelle inscription à la beta Qrenoo",
    html: `
      <div>
        <p>Nouvelle inscription à la beta :</p>
        <ul>
          <li><b>Email :</b> ${email}</li>
          <li><b>Date :</b> ${new Date().toLocaleString("fr-FR")}</li>
        </ul>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
