//   src/lib/email/send-email.ts  (Ausschnitt mit QR-Code Generierung)

import { Resend } from "resend";
//import { SEPAQRGenerator } from "sepa-qr-code"; // Für SEPA QR-Code
import { InvoicePDF } from "../pdf/invoice";
import QRCode from 'qrcode'


const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOrderConfirmationParams {
  order: any;
  orderItems: any[];
  customer: any;
  discountAmount?: number;
  appliedCoupon?: string | null;
  //pdfBuffer?: Buffer;
}

// export async function sendOrderConfirmationEmail({
//   order,
//   orderItems,
//   customer
// }: SendOrderConfirmationParams) {

// Hilfsfunktionen
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// SEPA QR-Code als Base64 generieren
async function generatePaymentQRCode(order: any): Promise<string | null> {
  try {
    // Deine Bankverbindung (aus env)
    // const generator = new SEPAQRGenerator();

    // const qrCodeData = {
    //   name: process.env.COMPANY_NAME || "E-Shop",
    //   iban: process.env.COMPANY_IBAN || "", // Deine IBAN
    //   bic: process.env.COMPANY_BIC || undefined,
    //   amount: order.total_amount.toFixed(2),
    //   currency: "EUR",
    //   remittanceInfo: `Bestellung ${order.order_number}`, // Verwendungszweck
    // };
// SEPA QR-Code Daten (nach EPC Standard)
    const sepaData = [
      'BCD',           // Service Tag
      '002',           // Version
      '1',             // Character set (1 = UTF-8)
      'SCT',           // SEPA Credit Transfer
      process.env.COMPANY_BIC || 'COBADEFFXXX',  // BIC
      process.env.COMPANY_NAME || 'E-Shop GmbH', // Empfänger
      process.env.COMPANY_IBAN || 'DE89370400440532013000', // IBAN
      `EUR${order.total_amount.toFixed(2)}`,     // Betrag
      'CHK',           // Purpose (not used)
      '',              // Remittance info type
      `Bestellung ${order.order_number}`,        // Verwendungszweck
      ''               // End of message
    ].join('\n')

    // QR-Code als Base64 generieren
    const qrBuffer = await QRCode.toBuffer(sepaData, { type: 'png', width: 300 })
       return `data:image/png;base64,${qrBuffer.toString('base64')}`
    //const qrBase64 = await generator.generateQRCode(qrCodeData, "base64");
    //return qrBase64;
  } catch (error) {
    console.error("QR-Code Generierung fehlgeschlagen:", error);
    return null;
  }
}


// Tracking QR-Code generieren
async function generateTrackingQRCode(order: any): Promise<string | null> {
  try {
    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tracking/${order.order_number}`
    const qrBuffer = await QRCode.toBuffer(trackingUrl, { type: 'png', width: 300 })
    return `data:image/png;base64,${qrBuffer.toString('base64')}`
  } catch (error) {
    console.error('Tracking QR-Code Fehler:', error)
    return null
  }
}


// In der sendOrderConfirmationEmail Funktion:
export async function sendOrderConfirmationEmail({
  order,
  orderItems,
  customer,
  discountAmount = 0,
  appliedCoupon = null,
}: SendOrderConfirmationParams) {
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // QR-Code generieren (optional, falls fehlschlägt gibt es trotzdem Email)
  const sepaQrCode = await generatePaymentQRCode(order)
  const trackingQrCode = await generateTrackingQRCode(order)
  
  // PDF mit QR-Codes generieren
  const pdfStream = await InvoicePDF({ 
    order, 
    orderItems, 
    customer, 
    sepaQrCode,      // ← SEPA QR-Code
    trackingQrCode   // ← Tracking QR-Code
  })
  

  // Email HTML Template für die Email
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bestellbestätigung #${order.order_number}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #e5e7eb; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .content { padding: 30px 20px; }
        .order-info { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .order-number { font-size: 20px; font-weight: bold; color: #2563eb; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th { text-align: left; padding: 10px; background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb; }
        .items-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .total-row { font-weight: bold; border-top: 2px solid #e5e7eb; }
        .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }        .qr-info { text-align: center; margin: 20px 0; padding: 15px; background: #f0fdf4; border-radius: 8px; }
        .qr-code-img { max-width: 150px; margin: 10px auto; display: block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🛍️ E-Shop</div>
        </div>
        <div class="content">
          <h2>Vielen Dank für deine Bestellung, ${customer.name || customer.email}!</h2>
          <div class="order-info">
            <div class="order-number">Bestellung #${order.order_number}</div>
            <div>Bestelldatum: ${formatDate(order.created_at)}</div>
            <div>Zahlungsmethode: ${order.payment_method === "paypal" ? "PayPal" : "Banküberweisung"}</div>
          </div>
          
          <h3>Bestellübersicht</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Artikel</th>
                <th>Anzahl</th>
                <th>Gesamt</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems
                .map(
                  (item) => `
                <tr>
                  <td>${item.product_name}</td>
                  <td>${item.quantity}</td>
                  <td>${formatPrice(item.price * item.quantity)}</td>
                </tr>
              `,
                )
                .join("")}
              <tr class="total-row">
                <td colspan="2" style="text-align: right;"><strong>Gesamtbetrag:</strong></td>
                <td><strong>${formatPrice(order.total_amount)}</strong></td>
              </tr>
            </tbody>
          </table>
                <!-- QR-Code Info (nur anzeigen wenn QR-Code verfügbar) -->
      ${sepaQrCode ? `
      <div class="qr-info">
        <h3>📱 Schnell & sicher bezahlen</h3>
        <p>Scannen Sie den QR-Code mit Ihrer Banking-App, um die Überweisung zu starten.</p>
        <img src="${sepaQrCode}" alt="SEPA QR-Code" class="qr-code-img" />
        <p style="font-size: 12px; color: #666;">Verwendungszweck: <strong>Bestellung ${order.order_number}</strong></p>
      </div>
      ` : ''}

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${order.id}" class="button">
              Bestellung im Konto ansehen
            </a>
          </div>
          
          <p>Im Anhang findest du deine Rechnung als PDF.</p>
          <p>Bei Fragen stehen wir dir gerne zur Verfügung.</p>
          <p>Viele Grüße,<br>Dein E-Shop Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} E-Shop - Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // PDF Rechnung generieren (mit QR-Code)
  let pdfBuffer: Buffer | null = null;
// try {
//   const { InvoicePDF } = await import('../pdf/invoice');
//   const pdfStream = await InvoicePDF({ 
//     order, 
//     orderItems, 
//     customer, 
//     sepaQrCode
//   });
//   pdfBuffer = Buffer.from(await pdfStream.toBuffer());
// } catch (pdfError) {
//   console.error('PDF generation error:', pdfError);
// }

  // Email senden
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@resend.dev",
      to: customer.email,
      subject: `Deine Bestellung #${order.order_number} bei E-Shop`,
      html: html,
      //attachments: [
      //  {
      //    filename: `Rechnung_${order.order_number}.pdf`,
      //    content: pdfBuffer.toString("base64"),
      //  },
      //],
      attachments:[],
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
}
