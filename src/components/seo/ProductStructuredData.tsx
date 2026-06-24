//  src/components/seo/ProductStructuredData.tsx

"use client"

import Script from "next/script"

interface ProductStructuredDataProps {
  product: {
    id: string
    title: string
    description: string
    price: number
    current_price: number
    has_discount: boolean
    image_url: string | null
    images: string[] | null
    stock: number
    rating_avg: number
    rating_count: number
    category: string
    sku?: string
  }
  url: string
}

export default function ProductStructuredData({ product, url }: ProductStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.images?.[0] || product.image_url,
    "sku": product.sku || product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "E-Shop"
    },
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "EUR",
      "price": product.has_discount ? product.current_price : product.price,
      "priceValidUntil": product.has_discount ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] : undefined,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "E-Shop"
      }
    },
    ...(product.rating_count > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating_avg,
        "ratingCount": product.rating_count,
        "bestRating": "5",
        "worstRating": "1"
      }
    })
  }

  return (
    <Script
      id="product-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}