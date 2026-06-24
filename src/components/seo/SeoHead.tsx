//  src/components/seo/SeoHead.tsx

import Head from "next/head";

interface SeoHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  price?: number | string; // ← hinzufügen
  availability?: string;
}

export default function SeoHead({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags,
  price, // ← hinzufügen
  availability,
}: SeoHeadProps) {
  const siteTitle = "E-Shop";
  const fullTitle = `${title} | ${siteTitle}`;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eshop.com";
  const defaultImage = `${siteUrl}/og-image.jpg`;
  const imageUrl = image || defaultImage;
  const canonicalUrl =
    url ||
    `${siteUrl}${typeof window !== "undefined" ? window.location.pathname : ""}`;

  return (
    <Head>
      {/* Basis Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Keywords */}
      {tags && tags.length > 0 && (
        <meta name="keywords" content={tags.join(", ")} />
      )}

      {/* Author */}
      {author && <meta name="author" content={author} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="de_DE" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@eshop" />
      <meta name="twitter:creator" content="@eshop" />

      {/* Article specific */}
      {type === "article" && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
          {tags &&
            tags.map((tag) => (
              <meta key={tag} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Product specific */}
      {type === "product" && (
        <>
          {price && (
            <meta property="product:price:amount" content={String(price)} />
          )}
          <meta property="product:price:currency" content="EUR" />
          {availability && (
            <meta property="product:availability" content={availability} />
          )}
        </>
      )}
    </Head>
  );
}
