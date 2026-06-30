# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> should navigate to register page
- Location: e2e/auth.spec.ts:25:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /register/
Received string:  "http://localhost:3000/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    12 × unexpected value "http://localhost:3000/login"

```

```yaml
- navigation:
  - link "🛍️ E-Shop":
    - /url: /
  - link "Produkte":
    - /url: /products
  - button "Dark Mode umschalten": ☀️
  - link "❤️":
    - /url: /dashboard/wishlist
  - button "🛒"
- main:
  - heading "Willkommen zurück" [level=2]
  - paragraph: Melde dich mit deinen Zugangsdaten an
  - text: E-Mail-Adresse
  - textbox "deine@email.de"
  - text: Passwort
  - textbox "Passwort":
    - /placeholder: "********"
  - button
  - checkbox "Angemeldet bleiben"
  - text: Angemeldet bleiben
  - link "Passwort vergessen?":
    - /url: /forgot-password
  - button "Anmelden"
  - text: Oder
  - button "Mit Google anmelden":
    - img
    - text: Mit Google anmelden
  - button "Mit GitHub anmelden":
    - img
    - text: Mit GitHub anmelden
  - paragraph:
    - text: Noch kein Konto?
    - link "Jetzt registrieren":
      - /url: /register
- contentinfo:
  - heading "Über E-Shop" [level=3]
  - paragraph: Ihr zuverlässiger Online-Shop für hochwertige Produkte. Wir bieten Ihnen beste Qualität zu fairen Preisen mit schnellem Versand und exzellentem Kundenservice.
  - heading "Quick Links" [level=3]
  - list:
    - listitem:
      - link "Alle Produkte":
        - /url: /products
    - listitem:
      - link "Angebote":
        - /url: /products?filter=discount
    - listitem:
      - link "Meine Bestellungen":
        - /url: /dashboard/orders
    - listitem:
      - link "Wunschliste":
        - /url: /dashboard/wishlist
  - heading "Information" [level=3]
  - list:
    - listitem:
      - link "Über uns":
        - /url: /about
    - listitem:
      - link "Kontakt":
        - /url: /contact
    - listitem:
      - link "Versandinformationen":
        - /url: /shipping
    - listitem:
      - link "Rückgaberecht":
        - /url: /returns
    - listitem:
      - link "FAQ":
        - /url: /faq
  - heading "Rechtliches" [level=3]
  - list:
    - listitem:
      - link "AGB":
        - /url: /terms
    - listitem:
      - link "Datenschutz":
        - /url: /privacy
    - listitem:
      - link "Impressum":
        - /url: /imprint
    - listitem:
      - link "Cookie-Richtlinien":
        - /url: /cookies
  - link "Facebook":
    - /url: https://facebook.com
    - img
  - link "Instagram":
    - /url: https://instagram.com
    - img
  - link "Twitter":
    - /url: https://twitter.com
    - img
  - link "Email":
    - /url: mailto:info@eshop.com
    - img
  - paragraph: Kostenloser Versand ab 50€ | 30 Tage Rückgaberecht
  - paragraph: © 2026 E-Shop. Alle Rechte vorbehalten.
  - text: 🔒 SSL-verschlüsselt 💳 Sichere Zahlung 🚚 Schneller Versand
- alert
```