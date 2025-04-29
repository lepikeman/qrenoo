import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "contact@qrenoo.com";

export async function POST(request: Request) {
  const data = await request.json();
  const { to, subject, body } = data;
  if (!to || !subject || !body) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: `<p>${body.replace(/\n/g, "<br>")}</p>`,
      text: body
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
