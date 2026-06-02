//  src/app/page.tsx

import { auth } from "@/lib/auth/config"

export default async function HomePage() {
  const session = await auth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Willkommen bei E-Shop
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Entdecke unsere hochwertigen Produkte zu besten Preisen
        </p>
        
        {session ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 inline-block">
            <p className="text-green-700 dark:text-green-300">
              🎉 Hallo {session.user?.name || session.user?.email}! Du bist eingeloggt.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 inline-block">
            <p className="text-blue-700 dark:text-blue-300">
              👋 Melde dich an, um deine persönliche Wunschliste zu erstellen!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}