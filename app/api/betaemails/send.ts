import { NextResponse } from "next/server";
import { readAllBetaEmails, clearBetaEmails } from "./store";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const TO_EMAIL = "contact.qrenoo@gmail.com";

export async function POST() {
  const emails = await readAllBetaEmails();
  if (emails.length === 0) {
    return NextResponse.json({ success: false, message: "Aucun email à envoyer." });
  }
  const subject = "Nouvelles inscriptions beta Qrenoo";
  const body = `Liste des emails inscrits :\n\n${emails.join("\n")}`;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject,
      html: `<p>${body.replace(/\n/g, "<br>")}</p>`,
      text: body
    });
    await clearBetaEmails();
    return NextResponse.json({ success: true, sent: emails.length });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
