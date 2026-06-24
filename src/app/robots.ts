//  src/app/robots.ts

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eshop.com"
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/dashboard/",
        "/checkout/",
        "/success/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}