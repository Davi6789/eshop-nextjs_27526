//  src/app/(shop)/products/loading.tsx (Suspense Boundaries)

import LoadingSpinner from "@/components/ui/LoadingSpinner"

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-8"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-300 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}