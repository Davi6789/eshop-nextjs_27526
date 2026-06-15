//  src/lib/validations/checkout.ts

import { z } from "zod"

export const checkoutSchema = z.object({
  // Kundendaten
  email: z.string()
    .min(1, "Email ist erforderlich")
    .email("Bitte gib eine gültige Email-Adresse ein"),
  
  firstName: z.string()
    .min(2, "Vorname muss mindestens 2 Zeichen lang sein")
    .max(50, "Vorname zu lang"),
  
  lastName: z.string()
    .min(2, "Nachname muss mindestens 2 Zeichen lang sein")
    .max(50, "Nachname zu lang"),
  
  phone: z.string()
    .optional(),
  
  // Lieferadresse
  street: z.string()
    .min(3, "Straße ist erforderlich"),
  
  houseNumber: z.string()
    .min(1, "Hausnummer ist erforderlich"),
  
  city: z.string()
    .min(2, "Stadt ist erforderlich"),
  
  zipCode: z.string()
    .min(4, "PLZ ist erforderlich")
    .max(10, "Ungültige PLZ"),
  
  country: z.string()
    .min(2, "Land ist erforderlich"),
  
  // Zahlungsmethode
  // paymentMethod: z.enum(["paypal", "bank_transfer", "credit_card"], {
  //   required_error: "Bitte wähle eine Zahlungsmethode",
  // }),
  paymentMethod: z.enum(["paypal", "bank_transfer", "credit_card"]),
  
  // Zusätzliche Optionen
  differentBillingAddress: z.boolean().default(false),
  
  // Rechnungsadresse (optional)
  billingStreet: z.string().optional(),
  billingHouseNumber: z.string().optional(),
  billingCity: z.string().optional(),
  billingZipCode: z.string().optional(),
  billingCountry: z.string().optional(),
  
  // Newsletter Option
  subscribeNewsletter: z.boolean().default(false),
  
  // AGB akzeptiert
  acceptTerms: z.boolean()
    .refine(val => val === true, "Du musst die AGB akzeptieren"),
}).refine((data) => {
  // Wenn unterschiedliche Rechnungsadresse, dann müssen Felder gefüllt sein
  if (data.differentBillingAddress) {
    return data.billingStreet && data.billingCity && data.billingZipCode
  }
  return true
}, {
  message: "Bitte fülle alle Felder der Rechnungsadresse aus",
  path: ["differentBillingAddress"]
})

export type CheckoutInput = z.infer<typeof checkoutSchema>