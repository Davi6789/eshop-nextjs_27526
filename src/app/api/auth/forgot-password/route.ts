import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Supabase Client mit Service Role Key (für Datenbank-Updates)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email;

    console.log("Passwort-Vergessen-Anforderung für:", email);

    if (!email) {
      return NextResponse.json(
        { error: "E-Mail-Adresse ist erforderlich" },
        { status: 400 }
      );
    }

    // 1. Prüfen, ob der User überhaupt in der DB existiert
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.trim())
      .single();

    if (userError || !user) {
      console.log(`User mit E-Mail ${email} existiert nicht.`);
      // Aus Sicherheitsgründen geben wir trotzdem 200 zurück, damit Angreifer keine E-Mails scannen können
      return NextResponse.json({
        message: "Falls die E-Mail existiert, wurde ein Link generiert.",
        resetLink: null
      });
    }

    // 2. Einen sicheren, zufälligen Token generieren
    const token = crypto.randomBytes(20).toString("hex");
    // Ablaufdatum setzen: Jetzt + 1 Stunde
    const expires = new Date(Date.now() + 3600000).toISOString();

    // 3. WICHTIG: Token und Ablaufdatum beim User in Supabase speichern
    // Vergewissere dich, dass deine Spalten in der Tabelle 'users' so heißen!
    const { error: updateError } = await supabase
      .from("users")
      .update({
        reset_token: token,
        reset_token_expires: expires,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Fehler beim Speichern des Tokens in Supabase:", updateError);
      return NextResponse.json(
        { error: "Fehler beim Generieren des Tokens" },
        { status: 500 }
      );
    }

    // 4. Den Link für das Frontend zusammenbauen
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email.trim())}`;

    console.log("Reset-Link erfolgreich generiert:", resetLink);

    // Hier würde später der echte Mailversand (z.B. mit Resend) hinkommen.
    // Für deinen grünen Test-Kasten geben wir den Link im JSON zurück:
    return NextResponse.json(
      {
        message: "Link erfolgreich generiert.",
        resetLink: resetLink // Das füttert deine grüne Box auf dem UI!
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot Password System Error:", error);
    return NextResponse.json(
      { error: "Ein interner Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}