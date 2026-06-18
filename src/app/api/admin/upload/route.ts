//  src/app/api/admin/upload/route.ts

import { supabase } from "@/lib/supabase/server"
import { auth } from "@/lib/auth/config"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "Keine Datei gefunden" }, { status: 400 })
    }

    // Datei validieren
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Nur JPEG, PNG und WEBP sind erlaubt" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Datei darf maximal 5MB groß sein" }, { status: 400 })
    }

    // Dateiname generieren
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `products/${fileName}`

    // Datei in Buffer umwandeln
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Zu Supabase Storage hochladen
    const { data, error } = await supabase.storage
      .from("products")
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      console.error("Upload Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Öffentliche URL generieren
    const { data: { publicUrl } } = supabase.storage
      .from("products")
      .getPublicUrl(filePath)

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      path: filePath
    })
  } catch (error) {
    console.error("Upload Error:", error)
    return NextResponse.json({ error: "Fehler beim Upload" }, { status: 500 })
  }
}

// DELETE - Bild löschen
export async function DELETE(request: NextRequest) {
  const session = await auth()
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")

    if (!path) {
      return NextResponse.json({ error: "Pfad fehlt" }, { status: 400 })
    }

    const { error } = await supabase.storage
      .from("products")
      .remove([path])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 })
  }
}