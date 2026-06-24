//  src/app/sitemap.ts

import { supabase } from "@/lib/supabase/server"

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eshop.com"

  // Statische Seiten
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]

  // Produktseiten
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")

  const productPages = (products || []).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Kategorieseiten (falls gewünscht)
  const { data: categories } = await supabase
    .from("products")
    .select("category")
    .not("category", "is", null)

  const uniqueCategories = [...new Set(categories?.map(c => c.category))]
  const categoryPages = uniqueCategories.map((category) => ({
    url: `${baseUrl}/products?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}