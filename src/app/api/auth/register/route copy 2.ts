// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import { registerSchema } from "@/lib/validations/auth"
import { z } from "zod"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validiere Input
    const validatedData = registerSchema.parse(body)

    // Prüfe ob Email bereits existiert
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", validatedData.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: "Diese Email ist bereits registriert" },
        { status: 400 }
      )
    }

    // ✅ SICHER - nur auf dem Server ausgeführt
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // ✅ SICHER - nur auf dem Server ausgeführt
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        email: validatedData.email,
        name: validatedData.name,
        password_hash: hashedPassword,
        role: "customer",
        email_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (createError) {
      console.error("Supabase error:", createError)
      return NextResponse.json(
        { error: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut." },
        { status: 500 }
      )
    }

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
        { error: "Validierungsfehler", details: error.issues },
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