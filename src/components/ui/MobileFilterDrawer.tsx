 //  src/components/ui/MobileFilterDrawer.tsx

 "use client"

import { useState } from "react"

interface MobileFilterDrawerProps {
  children: React.ReactNode
  onApply: (filters: any) => void
}

export default function MobileFilterDrawer({ children, onApply }: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-20 right-4 z-30 bg-blue-600 text-white p-3 rounded-full shadow-lg active:scale-95 transition"
      >
        🔍 Filtern
      </button>

      {/* Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 rounded-t-2xl animate-slide-up">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filter</h3>
              <button onClick={() => setIsOpen(false)} className="p-2">✕</button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
            <div className="p-4 border-t flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg"
              >
                Schließen
              </button>
              <button
                onClick={() => {
                  onApply({})
                  setIsOpen(false)
                }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg"
              >
                Anwenden
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}