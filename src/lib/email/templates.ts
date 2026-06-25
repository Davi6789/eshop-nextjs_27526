// src/lib/email/templates.ts

// Layout Template
export const emailLayout = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
    }
    .content {
      padding: 30px 20px;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 8px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🛍️ E-Shop</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} E-Shop - Alle Rechte vorbehalten.</p>
      <p>Diese Email wurde automatisch versendet, bitte nicht darauf antworten.</p>
    </div>
  </div>
</body>
</html>
`

// Willkommens-Email
export const welcomeEmail = (name: string) => ({
  subject: 'Willkommen bei E-Shop! 🎉',
  html: emailLayout(`
    <h2>Hallo ${name},</h2>
    <p>Herzlich willkommen bei E-Shop! Wir freuen uns, dass du dich für unseren Shop entschieden hast.</p>
    <p>Mit deinem neuen Konto kannst du:</p>
    <ul>
      <li>📦 Deine Bestellungen verfolgen</li>
      <li>❤️ Produkte auf deine Wunschliste setzen</li>
      <li>⭐ Bewertungen schreiben</li>
      <li>🎟️ Exklusive Gutscheine erhalten</li>
    </ul>
    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" class="button">Jetzt einkaufen →</a>
    </div>
    <p>Bei Fragen stehen wir dir jederzeit gerne zur Verfügung.</p>
    <p>Viele Grüße,<br>Dein E-Shop Team</p>
  `, 'Willkommen bei E-Shop')
})

// Bestellbestätigung
// export const orderConfirmationEmail = (order: any, items: any[]) => {
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('de-DE', {
//       style: 'currency',
//       currency: 'EUR'
//     }).format(price)
//   }

//   const itemsHtml = items.map(item => `
//     <tr>
//       <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.product_name}</td>
//       <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
//       <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
//     </tr>
//   `).join('')

//   return {
//     subject: `Deine Bestellung #${order.order_number} ist bei uns eingegangen ✅`,
//     html: emailLayout(`
//       <h2>Hallo ${order.users?.name || 'Kunde'},</h2>
//       <p>Vielen Dank für deine Bestellung! Wir haben sie erhalten und werden sie schnellstmöglich bearbeiten.</p>
      
//       <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
//         <p><strong>Bestellnummer:</strong> #${order.order_number}</p>
//         <p><strong>Bestelldatum:</strong> ${new Date(order.created_at).toLocaleDateString('de-DE')}</p>
//         <p><strong>Zahlungsmethode:</strong> ${order.payment_method === 'paypal' ? 'PayPal' : 'Banküberweisung'}</p>
//       </div>
      
//       <h3>Bestellte Artikel</h3>
//       <table style="width: 100%; border-collapse: collapse;">
//         <thead>
//           <tr style="background-color: #f3f4f6;">
//             <th style="padding: 10px; text-align: left;">Artikel</th>
//             <th style="padding: 10px; text-align: center;">Anzahl</th>
//             <th style="padding: 10px; text-align: right;">Gesamt</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${itemsHtml}
//         </tbody>
//         <tfoot>
//           <tr style="border-top: 2px solid #e5e7eb;">
//             <td colspan="2" style="padding: 10px; text-align: right;"><strong>Gesamtbetrag:</strong></td>
//             <td style="padding: 10px; text-align: right;"><strong>${formatPrice(order.total_amount)}</strong></td>
//           </tr>
//         </tfoot>
//       </table>
      
//       <div style="text-align: center;">
//         <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${order.id}" class="button">Bestellung verfolgen →</a>
//       </div>
      
//       <p>Bei Fragen zu deiner Bestellung kannst du dich jederzeit an unseren Support wenden.</p>
//       <p>Viele Grüße,<br>Dein E-Shop Team</p>
//     `, `Bestellung #${order.order_number}`)
//   }
// }
// Order Confirmation Email Template (Kunde) - Version mit einem Objekt
export const orderConfirmationEmail = (order: any, orderItems: any[], customerName: string) => ({
  subject: `Deine Bestellung #${order.order_number} bei E-Shop`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bestellbestätigung</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f3f4f6; }
        .total { font-weight: bold; border-top: 2px solid #e5e7eb; }
        .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Vielen Dank für deine Bestellung!</h2>
        </div>
        <div class="content">
          <p>Hallo <strong>${customerName}</strong>,</p>
          <p>deine Bestellung <strong>#${order.order_number}</strong> wurde erfolgreich aufgegeben.</p>
          
          <h3>Bestellübersicht</h3>
          <table>
            <thead>
              <tr><th>Produkt</th><th>Menge</th><th>Preis</th><th>Gesamt</th></tr>
            </thead>
            <tbody>
              ${orderItems.map((item: any) => `
                <tr>
                  <td>${item.product_name}</td>
                  <td>${item.quantity}</td>
                  <td>€${item.price.toFixed(2)}</td>
                  <td>€${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total">
                <td colspan="3" style="text-align: right;"><strong>Gesamt:</strong></td>
                <td><strong>€${order.total_amount.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/orders/${order.id}" class="button">Bestellung ansehen</a>
          </div>
          
          <p>Bei Fragen stehen wir dir gerne zur Verfügung.</p>
          <p>Viele Grüße,<br>Dein E-Shop Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} E-Shop - Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </body>
    </html>
  `
});

// Versandbestätigung
export const shippingConfirmationEmail = (order: any, trackingNumber?: string, trackingUrl?: string) => ({
  subject: `Deine Bestellung #${order.order_number} wurde versendet! 🚚`,
  html: emailLayout(`
    <h2>Gute Nachrichten!</h2>
    <p>Deine Bestellung #${order.order_number} wurde versendet und ist auf dem Weg zu dir.</p>
    
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Lieferadresse:</strong> ${order.shipping_address}</p>
      ${trackingNumber ? `<p><strong>Sendungsnummer:</strong> ${trackingNumber}</p>` : ''}
    </div>
    
    ${trackingUrl ? `
      <div style="text-align: center;">
        <a href="${trackingUrl}" class="button">Sendung verfolgen →</a>
      </div>
    ` : ''}
    
    <p>Wir wünschen dir viel Freude mit deiner Bestellung!</p>
    <p>Viele Grüße,<br>Dein E-Shop Team</p>
  `, `Versandbestätigung #${order.order_number}`)
})

// Passwort Reset Email
export const passwordResetEmail = (name: string, resetLink: string) => ({
  subject: 'Passwort zurücksetzen 🔐',
  html: emailLayout(`
    <h2>Hallo ${name},</h2>
    <p>Wir haben eine Anfrage zum Zurücksetzen deines Passworts erhalten.</p>
    <p>Klicke auf den folgenden Button, um ein neues Passwort zu erstellen:</p>
    
    <div style="text-align: center;">
      <a href="${resetLink}" class="button">Passwort zurücksetzen →</a>
    </div>
    
    <p>Dieser Link ist 1 Stunde gültig.</p>
    <p>Wenn du kein neues Passwort anfordern hast, kannst du diese Email ignorieren.</p>
    <p>Viele Grüße,<br>Dein E-Shop Team</p>
  `, 'Passwort zurücksetzen')
})

// Bewertungs-Erinnerung
export const reviewReminderEmail = (name: string, productName: string, productSlug: string) => ({
  subject: `Wie gefällt dir ${productName}? ⭐`,
  html: emailLayout(`
    <h2>Hallo ${name},</h2>
    <p>Vor ein paar Tagen hast du ${productName} bei uns gekauft.</p>
    <p>Wir würden uns freuen, wenn du deine Erfahrungen mit anderen Kunden teilen könntest!</p>
    
    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/products/${productSlug}#reviews" class="button">Jetzt bewerten →</a>
    </div>
    
    <p>Deine Meinung hilft anderen Kunden bei ihrer Kaufentscheidung.</p>
    <p>Viele Grüße,<br>Dein E-Shop Team</p>
  `, 'Bewertung schreiben')
})

// Admin Benachrichtigung bei neuer Bestellung
export const adminNewOrderEmail = (order: any, customer: any) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  return {
    subject: `Neue Bestellung #${order.order_number} eingegangen! 📦`,
    html: emailLayout(`
      <h2>Neue Bestellung eingegangen!</h2>
      <p>Es wurde eine neue Bestellung aufgegeben.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Bestellnummer:</strong> #${order.order_number}</p>
        <p><strong>Kunde:</strong> ${customer.name || customer.email}</p>
        <p><strong>Betrag:</strong> ${formatPrice(order.total_amount)}</p>
        <p><strong>Zahlungsmethode:</strong> ${order.payment_method === 'paypal' ? 'PayPal' : 'Banküberweisung'}</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order.id}" class="button">Bestellung ansehen →</a>
      </div>
      
      <p>Bitte kümmere dich um die Bearbeitung.</p>
    `, `Neue Bestellung #${order.order_number}`)
  }
}