//  src/components/ui/LoadingSpinner.tsx (W1T7s4)

export default function LoadingSpinner() {
  return (

    <div className="flex justify-center items-center min-h-[200px]">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="animate-pulse absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-blue-600">🛒</span>
        </div>
      </div>
    </div>
  )
}