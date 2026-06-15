//   src/lib/pdf/invoice.tsx

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Fonts registrieren
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: "Inter",
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#f3f4f6",
    padding: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontWeight: "bold",
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  col1: { width: "40%" },
  col2: { width: "20%", textAlign: "right" },
  col3: { width: "20%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    padding: 8,
    marginTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#000",
  },

  // Neue Styles für QR-Codes
  qrContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  qrBox: {
    alignItems: "center",
    width: "48%",
  },
  qrImage: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  qrTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  qrText: {
    fontSize: 8,
    color: "#666",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },

  bankInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    fontSize: 8,
  },
});

interface InvoicePDFProps {
  order: any;
  orderItems: any[];
  customer: any;
  sepaQrCode?: string | null; // SEPA QR-Code als Base64
  trackingQrCode?: string | null; // Tracking QR-Code als Base64
}

export function InvoicePDF({
  order,
  orderItems,
  customer,
  sepaQrCode,
  trackingQrCode,
}: InvoicePDFProps) {
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = subtotal - order.total_amount;
  const shipping = 0; // kostenloser Versand

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} €`;
  };

  // Tracking URL für Sendungsverfolgung
  const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://eshop.com'}/tracking/${order.order_number}`

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>RECHNUNG</Text>
          <Text style={styles.subtitle}>E-Shop - Ihr Online Shop</Text>
          <Text style={styles.subtitle}>Musterstraße 123, 12345 Berlin</Text>
          <Text style={styles.subtitle}>
            Tel: 030 12345678 | info@eshop.com
          </Text>
        </View>

        {/* Rechnungsdetails */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Rechnungsnummer:</Text>
            <Text style={styles.value}>{order.order_number}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rechnungsdatum:</Text>
            <Text style={styles.value}>{formatDate(order.created_at)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Bestellstatus:</Text>
            <Text style={styles.value}>
              {order.status === "paid" ? "Bezahlt" : "Ausstehend"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Zahlungsmethode:</Text>
            <Text style={styles.value}>
              {order.payment_method === "paypal"
                ? "PayPal"
                : order.payment_method === "bank_transfer"
                  ? "Banküberweisung"
                  : "Kreditkarte"}
            </Text>
          </View>
        </View>

        {/* Kundeninformationen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KUNDENINFORMATIONEN</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {customer?.name || customer?.email}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{customer?.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lieferadresse:</Text>
            <Text style={styles.value}>{order.shipping_address}</Text>
          </View>
        </View>

        {/* Bestellte Artikel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BESTELLTE ARTIKEL</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Artikel</Text>
              <Text style={styles.col2}>Anzahl</Text>
              <Text style={styles.col3}>Einzelpreis</Text>
              <Text style={styles.col4}>Gesamt</Text>
            </View>
            {orderItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>{item.product_name}</Text>
                <Text style={styles.col2}>{item.quantity}</Text>
                <Text style={styles.col3}>{formatPrice(item.price)}</Text>
                <Text style={styles.col4}>
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bestellübersicht */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={[styles.label, { width: "80%", textAlign: "right" }]}>
              Zwischensumme:
            </Text>
            <Text style={[styles.value, { width: "20%", textAlign: "right" }]}>
              {formatPrice(subtotal)}
            </Text>
          </View>
          {discount > 0 && (
            <View style={styles.row}>
              <Text
                style={[styles.label, { width: "80%", textAlign: "right" }]}
              >
                Rabatt:
              </Text>
              <Text
                style={[
                  styles.value,
                  { width: "20%", textAlign: "right", color: "green" },
                ]}
              >
                -{formatPrice(discount)}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={[styles.label, { width: "80%", textAlign: "right" }]}>
              Versand:
            </Text>
            <Text style={[styles.value, { width: "20%", textAlign: "right" }]}>
              {formatPrice(shipping)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text
              style={[
                styles.label,
                {
                  width: "80%",
                  textAlign: "right",
                  fontSize: 12,
                  fontWeight: "bold",
                },
              ]}
            >
              Gesamtbetrag:
            </Text>
            <Text
              style={[
                styles.value,
                {
                  width: "20%",
                  textAlign: "right",
                  fontSize: 12,
                  fontWeight: "bold",
                },
              ]}
            >
              {formatPrice(order.total_amount)}
            </Text>
          </View>
        </View>
        {/* ✅ NEU: Zwei QR-Codes nebeneinander */}
        {(sepaQrCode || trackingQrCode) && (
          <View style={styles.qrContainer}>
            {/* SEPA QR-Code für Zahlung */}
            {sepaQrCode && (
              <View style={styles.qrBox}>
                <Image src={sepaQrCode} style={styles.qrImage} />
                <Text style={styles.qrTitle}>💳 SEPA-Überweisung</Text>
                <Text style={styles.qrText}>Scannen für schnelle Zahlung</Text>
                <Text style={styles.qrText}>Verwendungszweck: {order.order_number}</Text>
              </View>
            )}

            {/* Tracking QR-Code für Sendungsverfolgung */}
            {trackingQrCode && (
              <View style={styles.qrBox}>
                <Image src={trackingQrCode} style={styles.qrImage} />
                <Text style={styles.qrTitle}>📦 Sendungsverfolgung</Text>
                <Text style={styles.qrText}>Scannen für Live-Tracking</Text>
                <Text style={styles.qrText}>{trackingUrl}</Text>
              </View>
            )}
          </View>
        )}

        {/* Bankverbindung (nur bei Banküberweisung) */}
        {order.payment_method === 'bank_transfer' && (
          <View style={styles.bankInfo}>
            <Text>Bankverbindung:</Text>
            <Text>Empfänger: E-Shop GmbH</Text>
            <Text>IBAN: DE89 3704 0044 0532 0130 00</Text>
            <Text>BIC: COBADEFFXXX</Text>
            <Text>Verwendungszweck: {order.order_number}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Vielen Dank für Ihren Einkauf!</Text>
          <Text>
            Diese Rechnung wurde automatisch erstellt und ist ohne Unterschrift
            gültig.
          </Text>
          <Text>
            © {new Date().getFullYear()} E-Shop - Alle Rechte vorbehalten.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
