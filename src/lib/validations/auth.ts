//  src/lib/validations/auth.ts

import { z } from "zod";

// Login Schema - OHNE confirmPassword!
export const loginSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email ist erforderlich")
      .email("Bitte gib eine gültige Email-Adresse ein"),
    password: z
      .string()
      .min(1, "Passwort ist erforderlich")
      .min(6, "Passwort muss mindestens 6 Zeichen lang sein")
      .regex(/[A-Z]/, "Passwort muss mindestens einen Großbuchstaben enthalten")
      .regex(/[0-9]/, "Passwort muss mindestens eine Zahl enthalten"),
  });
  //   confirmPassword: z.string(),
  // })

  // .refine((data) => data.password === data.confirmPassword, {
  //   message: "Passwörter stimmen nicht überein",
  //   path: ["confirmPassword"],
  // });

  // Register Schema - MIT confirmPassword
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name muss mindestens 2 Zeichen lang sein")
      .max(50, "Name darf maximal 50 Zeichen lang sein"),
    email: z
      .string()
      .min(1, "Email ist erforderlich")
      .email("Bitte gib eine gültige Email-Adresse ein"),
    password: z
      .string()
      .min(6, "Passwort muss mindestens 6 Zeichen lang sein")
      .regex(/[A-Z]/, "Passwort muss mindestens einen Großbuchstaben enthalten")
      .regex(/[0-9]/, "Passwort muss mindestens eine Zahl enthalten"),
    confirmPassword: z.string().min(1, "Bitte bestätige dein Passwort"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
