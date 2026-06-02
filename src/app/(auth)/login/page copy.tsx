//  src/app/(auth)/login/page.tsx

import { Metadata } from "next"
import LoginForm from "@/components/forms/LoginForm"

export const metadata: Metadata = {
  title: "Anmelden | E-Shop",
  description: "Melde dich in deinem Konto an",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  )
}