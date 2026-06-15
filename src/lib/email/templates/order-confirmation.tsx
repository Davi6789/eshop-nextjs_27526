// src/lib/email/templates/order-confirmation.tsx

interface OrderConfirmationEmailProps {
  orderNumber: string
  customerName: string
  orderDate: string
  items: any[]
  total: number
  orderId: string
}

export function getOrderConfirmationEmail({
  orderNumber,
  customerName,
  orderDate,
  items,
  total,
  orderId
}: OrderConfirmationEmailProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  return {
    subject: `Deine Bestellung #${orderNumber} bei E-Shop`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bestellbestätigung</title>
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
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .order-info {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .order-number {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .items-table th {
            text-align: left;
            padding: 10px;
            background-color: #f3f4f6;
            border-bottom: 2px solid #e5e7eb;
          }
          .items-table td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
          }
          .total-row {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #e5e7eb;
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
            <div class="greeting">
              Hallo ${customerName},
            </div>
            
            <p>Vielen Dank für deine Bestellung! Wir haben sie erhalten und werden sie schnellstmöglich bearbeiten.</p>
            
            <div class="order-info">
              <div class="order-number">Bestellung #${orderNumber}</div>
              <div>Bestelldatum: ${orderDate}</div>
            </div>
            
            <h3>Bestellte Artikel</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Artikel</th>
                  <th>Anzahl</th>
                  <th>Preis</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${formatPrice(item.price * item.quantity)}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="2" style="text-align: right;">Gesamtbetrag:</td>
                  <td>${formatPrice(total)}</td>
                </tr>
              </tbody>
            </table>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${orderId}" class="button">
                Bestellung ansehen
              </a>
            </div>
            
            <p>
              Bei Fragen zu deiner Bestellung kannst du dich jederzeit an unseren Support wenden.<br>
              Wir sind für dich da!
            </p>
            
            <p>Viele Grüße,<br>Dein E-Shop Team</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} E-Shop - Alle Rechte vorbehalten.</p>
            <p>Diese Email wurde automatisch versendet, bitte nicht darauf antworten.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hallo ${customerName},

      Vielen Dank für deine Bestellung #${orderNumber} vom ${orderDate}!

      Bestellte Artikel:
      ${items.map(item => `- ${item.name}: ${item.quantity} x ${formatPrice(item.price)}`).join('\n')}
      
      Gesamtbetrag: ${formatPrice(total)}

      Deine Bestellung findest du unter:
      ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${orderId}

      Viele Grüße,
      Dein E-Shop Team
    `
  }
}