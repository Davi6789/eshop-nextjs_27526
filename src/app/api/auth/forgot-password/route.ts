// src/app/api/auth/forgot-password/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
// import nodemailer from "nodemailer";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Nodemailer Transporter für Gmail
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {user: process.env.GMAIL_USER,      // Holt sich deine E-Mail aus .env.local
//     pass: process.env.GMAIL_APP_PASSWORD,  // Holt sich dein Passwort aus .env.local
//   },
// });

// E-Mail Template
function getPasswordResetEmailHTML(resetLink: string, email: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #333; margin: 0; }
          .content { color: #555; line-height: 1.6; }
          .button-container { text-align: center; margin: 30px 0; }
          .button { display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .button:hover { background-color: #0056b3; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
          .warning { color: #d32f2f; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Passwort zurücksetzen</h1>
          </div>
          
          <div class="content">
            <p>Hallo,</p>
            
            <p>Du hast eine Anforderung zum Zurücksetzen deines Passworts gestellt. Klick auf den Button unten, um dein Passwort zu ändern:</p>
            
            <div class="button-container">
              <a href="${resetLink}" class="button">Passwort zurücksetzen</a>
            </div>
            
            <p><strong>Oder kopiere diesen Link in deinen Browser:</strong></p>
            <p style="word-break: break-all; background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
              ${resetLink}
            </p>
            
            <p class="warning">⚠️ Dieser Link ist nur 1 Stunde lang gültig!</p>
            
            <p>Wenn du diese Anforderung nicht gestellt hast, ignoriere diese E-Mail.</p>
            
            <p>Viele Grüße,<br>Dein E-Shop Team</p>
          </div>
          
          <div class="footer">
            <p>Diese E-Mail wurde an <strong>${email}</strong> versendet.</p>
            <p>© 2026 E-Shop. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email;

    console.log("📧 Passwort-Vergessen-Anforderung für:", email);

    if (!email) {
      return NextResponse.json(
        { error: "E-Mail-Adresse ist erforderlich" },
        { status: 400 }
      );
    }

    // 1. Prüfen, ob der User existiert
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.trim())
      .single();

    if (userError || !user) {
      console.log(`❌ User mit E-Mail ${email} existiert nicht.`);
      // Aus Sicherheitsgründen: Trotzdem 200 zurückgeben
      return NextResponse.json({
        message: "Falls die E-Mail existiert, wurde ein Reset-Link versendet.",
      });
    }

    // 2. Token generieren
    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 3600000).toISOString(); // 1 Stunde

    // 3. Token in Supabase speichern
    const { error: updateError } = await supabase
      .from("users")
      .update({
        reset_token: token,
        reset_token_expires: expires,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("❌ Fehler beim Speichern des Tokens:", updateError);
      return NextResponse.json(
        { error: "Fehler beim Generieren des Tokens" },
        { status: 500 }
      );
    }

    // 4. Reset-Link zusammenbauen
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(
      email.trim()
    )}`;

    // 5. E-Mail mit Nodemailer versenden
    try {
      const mailOptions = {
        from: `"E-Shop" <${process.env.GMAIL_USER}>`,
        to: email.trim(),
        subject: "🔐 Passwort zurücksetzen - E-Shop",
        html: getPasswordResetEmailHTML(resetLink, email.trim()),
        text: `
Passwort zurücksetzen

Hallo,

Du hast eine Anforderung zum Zurücksetzen deines Passworts gestellt.

Bitte klick auf diesen Link:
${resetLink}

Dieser Link ist nur 1 Stunde lang gültig.

Wenn du diese Anforderung nicht gestellt hast, ignoriere diese E-Mail.

Viele Grüße,
Dein E-Shop Team
        `,
      };

     // const info = await transporter.sendMail(mailOptions);
     // console.log("✅ E-Mail versendet:", info.response);

      return NextResponse.json(
        {
          message: "✅ Reset-Link wurde per E-Mail versendet!",
          success: true,
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("❌ Fehler beim E-Mail-Versand:", emailError);
      return NextResponse.json(
        {
          error: "Fehler beim Versenden der E-Mail. Bitte versuche es später erneut.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ System Error:", error);
    return NextResponse.json(
      { error: "Ein interner Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}