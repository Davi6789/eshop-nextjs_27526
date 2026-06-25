//   src/app/api/email/review-reminder/route.ts 

import { supabase } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email/email-service"
import { reviewReminderEmail } from "@/lib/email/templates"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { orderId } = await request.json()

  // Hole Bestellung mit Items
  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      users (name, email),
      order_items (product_name, products (slug))
    `)
    .eq("id", orderId)
    .single()

  if (order && order.order_items) {
    for (const item of order.order_items) {
      // Prüfen ob schon bewertet
      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("order_id", orderId)
        .eq("product_id", item.product_id)
        .single()

      if (!existingReview) {
        const email = reviewReminderEmail(
          order.users.name || "Kunde",
          item.product_name,
          item.products?.slug || ""
        )
        
        await sendEmail({
          to: order.users.email,
          subject: email.subject,
          html: email.html,
        })
      }
    }
  }

  return NextResponse.json({ success: true })
}