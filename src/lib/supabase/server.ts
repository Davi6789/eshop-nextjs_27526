// src/lib/supabase/server.ts

import { createClient } from "@supabase/supabase-js"

// Server-seitiger Supabase Client
// Dieser wird für Server Components und API Routes verwendet
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Alternative: Wenn du SSR (Server-Side Rendering) mit Session brauchst
export async function getSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}