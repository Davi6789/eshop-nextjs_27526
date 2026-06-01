// src/app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { z } from "zod";

// Supabase Client mit Service Role Key (für Admin-Operationen)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Registrierungsversuch für:", body.email);

    // Validiere Input
    const validatedData = registerSchema.parse(body);

    // Prüfe ob Email bereits existiert
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", validatedData.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Diese Email ist bereits registriert" },
        { status: 400 },
      );
    }

    // if (password.length < 6) {
    //   console.log("Fehler: Passwort zu kurz");
    //   return NextResponse.json(
    //     { error: "Passwort muss mindestens 6 Zeichen lang sein" },
    //     { status: 400 }
    //   );
    // }

    // ✅ SICHER - nur auf dem Server ausgeführt. Passwort hashen
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    console.log("Passwort gehasht");

    // Prüfen ob Benutzer bereits existiert
    // const { data: existingUser, error: findError } = await supabase
    //   .from("users")
    //   .select("id")
    //   .eq("email", email)
    //   .single();

    // if (existingUser) {
    //   console.log("Fehler: Benutzer existiert bereits");
    //   return NextResponse.json(
    //     { error: "Ein Benutzer mit dieser Email existiert bereits" },
    //     { status: 400 }
    //   );
    // }


    // Benutzer erstellen
    // const { data: user, error: insertError } = await supabase
    //   .from("users")
    //   .insert({
    //     email: email,
    //     password: hashedPassword, // Achtung: Spaltenname muss mit dem in der DB übereinstimmen!
    //     name: name || null,
    //     role: "customer",
    //     created_at: new Date().toISOString(),
    //   })

    // ✅ SICHER - nur auf dem Server ausgeführt
    // ✅ WICHTIG: Spalte heißt "password_hash" nicht "password"!
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        email: validatedData.email,
        name: validatedData.name,
        password_hash: hashedPassword,  // ✅ RICHTIG!
        role: "customer",
        email_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

      if (createError) {
      console.error("Supabase error:", createError)
      return NextResponse.json(
        { error: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut." },
        { status: 500 }
      )
    }
    // if (insertError) {
    //   console.error("Supabase Insert Fehler:", insertError);
    //   return NextResponse.json(
    //     {
    //       error: "Fehler beim Erstellen des Benutzers: " + insertError.message,
    //     },
    //     { status: 500 },
    //   );
    // }

    console.log("Benutzer erfolgreich erstellt:", user.id);

    return NextResponse.json(
      {
        message: "Registrierung erfolgreich",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validierungsfehler", details: error.errors },
        { status: 400 }
      )
    }
 
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    )
  }
}