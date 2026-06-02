//  src/app/(auth)/register/page.tsx

import { Metadata } from "next"
import RegisterForm from "@/components/forms/RegisterForm"

export const metadata: Metadata = {
  title: "Registrieren | E-Shop",
  description: "Erstelle ein neues Konto",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  )
}