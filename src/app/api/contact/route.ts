// src/app/api/contact/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validierung
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Bitte fülle alle Felder aus" },
        { status: 400 },
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Bitte gib eine gültige Email-Adresse ein" },
        { status: 400 },
      );
    }

    // Email an Admin senden
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // 🧪 Resends Standard-Absender
      to: "songhau0611@gmail.com", //  🧪 eigene Email
      // from: process.env.EMAIL_FROM || "noreply@resend.dev",
      // to: process.env.ADMIN_EMAIL || "info@eshop.com",

      replyTo: email,
      subject: `Kontaktanfrage: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #4b5563; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Neue Kontaktanfrage</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">Betreff:</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Nachricht:</div>
                <div class="value">${message.replace(/\n/g, "<br>")}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Email error:", error);
      return NextResponse.json(
        { error: "Fehler beim Senden der Nachricht" },
        { status: 500 },
      );
    }

    // Automatische Bestätigungsemail an den Absender (optional)
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@resend.dev",
      to: email,
      subject: `Wir haben deine Nachricht erhalten - E-Shop`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2>Vielen Dank für deine Nachricht!</h2>
          <p>Wir haben deine Anfrage erhalten und werden uns schnellstmöglich bei dir melden.</p>
          <br>
          <p>Deine Nachricht:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
            <strong>Betreff:</strong> ${subject}<br>
            <strong>Nachricht:</strong><br>${message}
          </div>
          <br>
          <p>Viele Grüße,<br>Dein E-Shop Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Nachricht gesendet" });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 },
    );
  }
}
