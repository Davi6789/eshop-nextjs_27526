 //  src/app/api/admin/upload/batch/route.ts

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
    const files = formData.getAll("files") as File[]
    
    const uploadedUrls: string[] = []
    const errors: string[] = []

    for (const file of files) {
      // Validierung
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name}: Kein Bild`)
        continue
      }

      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name}: Zu groß (max 5MB)`)
        continue
      }

      // Dateiname generieren
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `products/${fileName}`

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const { error } = await supabase.storage
        .from("products")
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: "3600",
        })

      if (error) {
        errors.push(`${file.name}: ${error.message}`)
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from("products")
          .getPublicUrl(filePath)
        uploadedUrls.push(publicUrl)
      }
    }

    return NextResponse.json({ 
      success: true, 
      urls: uploadedUrls,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Upload" }, { status: 500 })
  }
}