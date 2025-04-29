import { NextResponse } from "next/server";
import { storeBetaEmail, readAllBetaEmails} from "./store";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "contact@qrenoo.com";
const TO_EMAIL = "contact.qrenoo@gmail.com";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email manquant ou invalide" }, { status: 400 });
  }
  await storeBetaEmail(email);
  // Envoi immédiat de l'email à l'admin
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: "Nouvelle inscription beta Qrenoo",
      html: `
        <div style="background:#f6f8fa;padding:32px 0;min-height:100vh;font-family:sans-serif;color:#1E3518;">
          <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 12px #e2d6b7;padding:32px 24px;">
            <img src="https://qrenoo.com/assets/logo.png" alt="Qrenoo" style="width:64px;height:64px;object-fit:contain;margin-bottom:18px;display:block;margin-left:auto;margin-right:auto;" />
            <h2 style="color:#0B5FFF;font-weight:700;margin-bottom:12px;">Nouvelle inscription à la beta Qrenoo</h2>
            <p style="font-size:1.1rem;margin-bottom:16px;">Un utilisateur vient de s'inscrire à la beta :</p>
            <div style="background:#f6e6c2;padding:12px 20px;border-radius:8px;display:inline-block;font-size:1.15rem;font-weight:600;letter-spacing:0.5px;">${email}</div>
            <p style="margin-top:28px;color:#888;font-size:0.95rem;">Qrenoo - Gestion intelligente pour professionnels</p>
          </div>
        </div>
      `
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// Pour l'envoi manuel ou CRON
export async function GET() {
  const emails = await readAllBetaEmails();
  return NextResponse.json({ emails });
}
