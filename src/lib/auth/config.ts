// src/lib/auth/config.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Falls Zod Probleme macht, holen wir uns die Daten sicherheitshalber direkt
          const email = credentials?.email as string;
          const password = credentials?.password as string;

          if (!email || !password) {
            console.error("Email oder Passwort fehlen im Request");
            return null;
          }

          // User aus Supabase finden
          const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email.trim()) // trim() entfernt unabsichtliche Leerzeichen
            .single();

          if (error || !user) {
            console.error("User nicht gefunden in Supabase:", error);
            return null;
          }

          if (!user.password_hash) {
            console.error("Benutzer hat kein Passwort gesetzt");
            return null;
          }
          // 👑 HIER EINTRAGEN: Wir erzeugen einen garantiert funktionierenden Hash für Admin123!
          //const neuerTestHash = await bcrypt.hash("Admin123!", 10);
          //console.log("➡️ KOPIERE DIESEN FRISCHEN HASH:", neuerTestHash);

          // 🟢 FIX: Da bcryptjs manchmal Probleme mit dem Prefix $2a$ hat,
          // bereinigen wir den Hash vor dem Vergleich, falls nötig.
          const cleanHash = user.password_hash.replace(/^\$2a\$/, "$2b$");

          // Passwort vergleichen mit bcryptjs
          const isValid = await bcrypt.compare(password, cleanHash);

          if (!isValid) {
            console.error("Passwort ungültig für:", email);
            return null;
          }

          // 🟢 FIX: ID explizit als String zurückgeben! NextAuth v5 crasht sonst intern.
          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
