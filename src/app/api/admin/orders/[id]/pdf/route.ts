// src/app/api/admin/orders/[id]/pdf/route.ts

import { supabase } from "@/lib/supabase/server";
import { auth } from "@/lib/auth/config";
import { NextRequest, NextResponse } from "next/server";
import { InvoicePDF } from "@/lib/pdf/invoice";
import { renderToBuffer } from "@react-pdf/renderer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ← Promise next.js 15
) {
  const { id } = await params; // ← await

  const session = await auth();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Kein Admin-Zugriff" }, { status: 403 });
  }

  try {
    // Order Daten laden
    const { data: order } = await supabase
      .from("orders")
      .select(
        `
        *,
        users (name, email)
      `,
      )
      .eq("id", id)
      .single();

    if (!order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 },
      );
    }

    // Order Items laden
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    // PDF generieren
    const pdfElement = InvoicePDF({
      order,
      orderItems: orderItems || [],
      customer: order.users,
    });

    const pdfBuffer = await renderToBuffer(pdfElement);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      // ← Uint8Array wrappen
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Rechnung_${order.order_number}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Generieren der PDF" },
      { status: 500 },
    );
  }
}
