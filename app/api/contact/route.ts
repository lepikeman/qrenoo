import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();
    
    // Validation basique
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Envoi d'email avec Resend
    const { error } = await resend.emails.send({
      from: "Qrenoo Contact <contact@qrenoo.com>",
      to: ["contact.qrenoo@gmail.com"],
      subject: `Nouveau message: ${subject}`,
      html: `
        <div>
          <h2>Nouveau message de ${name}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Sujet:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}