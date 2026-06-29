//  src/hooks/usePerformance.ts 

import { useEffect } from 'react'

export function usePerformanceMonitoring(componentName: string) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const startTime = performance.now()
      
      return () => {
        const endTime = performance.now()
        const duration = endTime - startTime
        
        // Berichte lange Renderzeiten
        if (duration > 100) {
          console.warn(`${componentName} rendered in ${duration.toFixed(2)}ms`)
        }
      }
    }
  }, [componentName])
}