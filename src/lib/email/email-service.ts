// src/lib/email/email-service.ts

import { Resend } from 'resend'

// // Prüfe ob API Key existiert
// if (!process.env.RESEND_API_KEY) {
//   console.error("❌ RESEND_API_KEY fehlt in .env.local!");
// }

// const resend = new Resend(process.env.RESEND_API_KEY || "missing_key");
//const resend = new Resend(process.env.RESEND_API_KEY)

// ✅ Prüfe ob der Key existiert, aber ohne Fehler
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn('⚠️ RESEND_API_KEY nicht in .env.local gefunden. Emails werden im Testmodus gesendet.');
}

// Wenn kein Key, verwende einen Dummy-Key für Tests
const resend = new Resend(apiKey || 're_dummy_key_for_tests');

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
  attachments?: Array<{
    filename: string
    content: string
  }>
}

export async function sendEmail({ to, subject, html, text, attachments }: EmailData) {
  // Wenn kein API Key, nur loggen
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "missing_key") {
    console.log("📧 [TEST] Email würde gesendet werden an:", to);
    console.log("   Betreff:", subject);
    return { success: true, data: { test: true } };
  }

 
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@resend.dev',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
      attachments,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}