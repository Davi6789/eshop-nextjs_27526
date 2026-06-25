// src/components/LazyComponents.tsx 

import dynamic from "next/dynamic"
import LoadingSpinner from "./ui/LoadingSpinner"

// Lazy Load schwere Komponenten
export const LazyProductGrid = dynamic(() => import("./ui/ProductGrid"), {
  loading: () => <LoadingSpinner />,
  ssr: true,
})

export const LazyCartDrawer = dynamic(() => import("./ui/CartDrawer"), {
  loading: () => null,
  ssr: false, // Drawer nicht auf Server rendern
})

export const LazyReviewForm = dynamic(() => import("./forms/ReviewForm"), {
  loading: () => <div className="h-32 animate-pulse bg-gray-200 rounded" />,
  ssr: false,
})

export const LazyRevenueChart = dynamic(() => import("./admin/RevenueChart"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200 rounded" />,
  ssr: false,
})

export const LazyProductForm = dynamic(() => import("./admin/ProductForm"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-200 rounded" />,
  ssr: false,
})