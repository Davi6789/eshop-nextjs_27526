// src/app/contact/page.tsx

import { Metadata } from "next"
import ContactContent from "./contact-content"

export const metadata: Metadata = {
  title: "Kontakt | E-Shop",
  description: "Kontaktiere uns - Wir sind gerne für dich da! Fragen zu Bestellungen, Produkten oder Feedback.",
}

export default function ContactPage() {
  return <ContactContent />
}